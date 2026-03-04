import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getWeekKeys, getWeekLabel, formatDayLabel, formatShortDay, getTodayKey } from '../lib/date';
import { addMacros, zeroMacros } from '../lib/nutrition';
import { useGoals } from '../hooks/useGoals';
import { useLang } from '../store/langContext';
import type { MealEntry, MacroNutrients } from '../types';
import type { Translations } from '../lib/i18n';

function DaySummary({ dayKey, meals, goals, t }: { dayKey: string; meals: MealEntry[]; goals: MacroNutrients; t: Translations }) {
  const [expanded, setExpanded] = useState(false);
  const isToday = dayKey === getTodayKey();

  const totals = useMemo(
    () => meals.reduce((acc, m) => addMacros(acc, m.totalMacros), zeroMacros()),
    [meals]
  );

  if (meals.length === 0) {
    return (
      <div className="rounded-2xl border border-[#3a3a2a] bg-[#242419] px-4 py-3 flex justify-between items-center opacity-40">
        <div>
          <p className="text-sm font-medium text-[#9a9680]">{formatDayLabel(dayKey)}{isToday ? ` (${t.today})` : ''}</p>
        </div>
        <p className="text-xs text-[#5a5a44]">{t.noDataLabel}</p>
      </div>
    );
  }

  const caloriesPct = goals.calories > 0 ? Math.round((totals.calories / goals.calories) * 100) : 0;

  return (
    <div className="rounded-2xl border border-[#3a3a2a] bg-[#242419] overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left active:bg-[#2e2e22]"
        onClick={() => setExpanded((e) => !e)}
      >
        <div>
          <p className="text-sm font-semibold text-[#c8c4b0]">
            {formatDayLabel(dayKey)}{isToday ? <span className="ml-2 text-xs text-[#7cb87a] font-normal">{t.today}</span> : ''}
          </p>
          <p className="text-xs text-[#5a5a44] mt-0.5">{meals.length} {meals.length !== 1 ? t.meals : t.meal}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#d4a24c]">{totals.calories} kcal</p>
            <p className="text-xs text-[#5a5a44]">{caloriesPct}{t.ofGoal}</p>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-[#9a9680]" /> : <ChevronDown className="w-4 h-4 text-[#9a9680]" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#3a3a2a] pt-3 space-y-2">
          <div className="flex gap-4 text-sm mb-3">
            <span className="text-[#9a9680]">P: <span className="text-[#7cb87a] font-medium">{totals.protein}g</span></span>
            <span className="text-[#9a9680]">C: <span className="text-[#d4a24c] font-medium">{totals.carbs}g</span></span>
            <span className="text-[#9a9680]">F: <span className="text-[#c17a5a] font-medium">{totals.fat}g</span></span>
          </div>
          {meals.map((meal, i) => (
            <div key={i} className="flex justify-between items-center text-sm py-1.5 border-b border-[#3a3a2a] last:border-0">
              <p className="text-[#c8c4b0] truncate flex-1">{meal.rawInput}</p>
              <span className="text-[#9a9680] shrink-0 ml-3">{meal.totalMacros.calories} kcal</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WeekSparkline({ dayKeys, mealsByDay, calorieGoal }: {
  dayKeys: string[];
  mealsByDay: Record<string, MealEntry[]>;
  calorieGoal: number;
}) {
  const values = dayKeys.map((k) => {
    const meals = mealsByDay[k] ?? [];
    return meals.reduce((s, m) => s + m.totalMacros.calories, 0);
  });
  const maxVal = Math.max(calorieGoal, ...values, 1);

  return (
    <div className="flex items-end gap-1 h-16 px-1">
      {dayKeys.map((k, i) => {
        const val = values[i];
        const pct = (val / maxVal) * 100;
        const isToday = k === getTodayKey();
        const isGoalMet = calorieGoal > 0 && val >= calorieGoal * 0.8 && val <= calorieGoal * 1.1;
        return (
          <div key={k} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: '48px' }}>
              <div
                className={`w-full rounded-t transition-all ${isToday ? 'ring-1 ring-[#d4a24c]/60' : ''}`}
                style={{
                  height: `${Math.max(pct, val > 0 ? 8 : 0)}%`,
                  backgroundColor: val === 0 ? '#2e2e22' : isGoalMet ? '#7cb87a' : '#d4a24c',
                }}
              />
            </div>
            <span className="text-[10px] text-[#5a5a44]">{formatShortDay(k)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function History() {
  const { t } = useLang();
  const [weekOffset, setWeekOffset] = useState(0);
  const goals = useGoals();
  const weekKeys = useMemo(() => getWeekKeys(weekOffset), [weekOffset]);

  const meals = useLiveQuery(
    () => db.meals.where('dayKey').anyOf(weekKeys).toArray(),
    [weekKeys]
  );

  const mealsByDay = useMemo(() => {
    const map: Record<string, MealEntry[]> = {};
    weekKeys.forEach((k) => { map[k] = []; });
    meals?.forEach((m) => { map[m.dayKey]?.push(m); });
    return map;
  }, [meals, weekKeys]);

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-[#f0ede4]">{t.history}</h1>
      </div>

      {/* Week selector */}
      <div className="flex items-center justify-between px-4 mb-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="w-9 h-9 rounded-full bg-[#2e2e22] flex items-center justify-center text-[#9a9680] hover:text-[#f0ede4]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-[#c8c4b0]">{getWeekLabel(weekOffset)}</span>
        <button
          onClick={() => setWeekOffset((w) => Math.min(w + 1, 0))}
          disabled={weekOffset >= 0}
          className="w-9 h-9 rounded-full bg-[#2e2e22] flex items-center justify-center text-[#9a9680] hover:text-[#f0ede4] disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Sparkline */}
      <div className="mx-4 mb-4 p-4 rounded-2xl bg-[#242419] border border-[#3a3a2a]">
        {meals ? (
          <WeekSparkline dayKeys={weekKeys} mealsByDay={mealsByDay} calorieGoal={goals.calories} />
        ) : (
          <div className="h-16 bg-[#2e2e22] animate-pulse rounded" />
        )}
      </div>

      {/* Day summaries */}
      <div className="px-4 space-y-3">
        {weekKeys
          .slice()
          .reverse()
          .map((dayKey) => (
            <DaySummary
              key={dayKey}
              dayKey={dayKey}
              meals={mealsByDay[dayKey] ?? []}
              goals={goals}
              t={t}
            />
          ))}
      </div>
    </div>
  );
}
