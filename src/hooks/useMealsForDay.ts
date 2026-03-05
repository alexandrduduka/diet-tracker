import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';

export function useMealsForDay(dayKey: string) {
  return useLiveQuery(
    () => db.meals.where('dayKey').equals(dayKey).sortBy('timestamp'),
    [dayKey]
  );
}
