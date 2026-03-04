import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { format } from 'date-fns';
import { getLastNDayKeys, getLast12MonthBuckets } from '../lib/date';

export interface DailyNutritionPoint {
  dayKey: string;
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MonthlyNutritionPoint {
  label: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export function useDailyNutritionHistory(days: number = 30): DailyNutritionPoint[] | undefined {
  return useLiveQuery(async () => {
    const dayKeys = getLastNDayKeys(days);
    const meals = await db.meals.where('dayKey').anyOf(dayKeys).toArray();

    const byDay: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {};
    for (const key of dayKeys) {
      byDay[key] = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    }
    for (const meal of meals) {
      const b = byDay[meal.dayKey];
      if (b) {
        b.calories += meal.totalMacros.calories;
        b.protein += meal.totalMacros.protein;
        b.carbs += meal.totalMacros.carbs;
        b.fat += meal.totalMacros.fat;
      }
    }

    return dayKeys.map((key) => ({
      dayKey: key,
      label: format(new Date(key + 'T00:00:00'), 'MMM d'),
      ...byDay[key],
    }));
  }, [days]);
}

export function useMonthlyNutritionHistory(): MonthlyNutritionPoint[] | undefined {
  return useLiveQuery(async () => {
    const buckets = getLast12MonthBuckets();
    const allKeys = buckets.flatMap((b) => {
      // collect all day keys in the month range
      const keys: string[] = [];
      const start = new Date(b.startKey + 'T00:00:00');
      const end = new Date(b.endKey + 'T00:00:00');
      const d = new Date(start);
      while (d <= end) {
        keys.push(format(d, 'yyyy-MM-dd'));
        d.setDate(d.getDate() + 1);
      }
      return keys;
    });

    const meals = await db.meals.where('dayKey').anyOf(allKeys).toArray();

    // Group meals by month bucket
    const bucketTotals: Record<string, { calories: number; protein: number; carbs: number; fat: number; days: Set<string> }> = {};
    for (const b of buckets) {
      bucketTotals[b.label] = { calories: 0, protein: 0, carbs: 0, fat: 0, days: new Set() };
    }

    for (const meal of meals) {
      for (const b of buckets) {
        if (meal.dayKey >= b.startKey && meal.dayKey <= b.endKey) {
          bucketTotals[b.label].calories += meal.totalMacros.calories;
          bucketTotals[b.label].protein += meal.totalMacros.protein;
          bucketTotals[b.label].carbs += meal.totalMacros.carbs;
          bucketTotals[b.label].fat += meal.totalMacros.fat;
          bucketTotals[b.label].days.add(meal.dayKey);
          break;
        }
      }
    }

    return buckets.map((b) => {
      const t = bucketTotals[b.label];
      const daysWithData = t.days.size || 1;
      return {
        label: b.label,
        calories: Math.round(t.calories / daysWithData),
        protein: Math.round(t.protein / daysWithData),
        carbs: Math.round(t.carbs / daysWithData),
        fat: Math.round(t.fat / daysWithData),
      };
    });
  }, []);
}
