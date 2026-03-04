import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getTodayKey } from '../lib/date';

export function useTodayMeals() {
  return useLiveQuery(
    () => db.meals.where('dayKey').equals(getTodayKey()).sortBy('timestamp'),
    []
  );
}
