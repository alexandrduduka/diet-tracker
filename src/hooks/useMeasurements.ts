import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getLast30DayKeys } from '../lib/date';

export function useLast30DaysMeasurements() {
  return useLiveQuery(async () => {
    const keys = getLast30DayKeys();
    return db.measurements
      .where('dayKey')
      .anyOf(keys)
      .sortBy('timestamp');
  }, []);
}

export function useAllMeasurements() {
  return useLiveQuery(
    () => db.measurements.orderBy('timestamp').reverse().limit(50).toArray(),
    []
  );
}

export function useMeasurementsForDayKeys(dayKeys: string[]) {
  return useLiveQuery(
    () => db.measurements.where('dayKey').anyOf(dayKeys).sortBy('timestamp'),
    [dayKeys.join(',')]
  );
}
