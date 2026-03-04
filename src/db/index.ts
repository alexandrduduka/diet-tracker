import Dexie, { type Table } from 'dexie';
import type { MealEntry, BodyMeasurement } from '../types';

export class DietTrackerDB extends Dexie {
  meals!: Table<MealEntry>;
  measurements!: Table<BodyMeasurement>;

  constructor() {
    super('DietTrackerDB');
    this.version(1).stores({
      meals: '++id, dayKey, timestamp',
      measurements: '++id, dayKey, timestamp',
    });
  }
}

export const db = new DietTrackerDB();
