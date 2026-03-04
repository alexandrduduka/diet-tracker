export interface MacroNutrients {
  calories: number;
  protein: number; // grams
  fat: number;     // grams
  carbs: number;   // grams
}

export interface FoodItem {
  name: string;
  quantity: string; // e.g. "1 medium, ~118g"
  macros: MacroNutrients;
}

export interface MealEntry {
  id?: number;
  timestamp: Date;
  dayKey: string; // "2026-03-04" — primary query index
  rawInput: string;
  foods: FoodItem[];
  totalMacros: MacroNutrients;
  llmConfidence: 'high' | 'medium' | 'low' | 'manual';
  notes?: string;
}

export interface BodyMeasurement {
  id?: number;
  timestamp: Date;
  dayKey: string;
  weight?: number;     // kg
  waist?: number;      // cm
  chest?: number;      // cm
  hips?: number;       // cm
  arm?: number;        // cm (replaces leftArm/rightArm)
  thigh?: number;      // cm (replaces leftThigh/rightThigh)
  // Legacy fields kept for backward-compat with existing IndexedDB records
  leftArm?: number;
  rightArm?: number;
  leftThigh?: number;
  rightThigh?: number;
  notes?: string;
}

export interface MacroGoals {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export type AppLanguage = 'en' | 'ru' | 'cs' | 'de' | 'fr' | 'es' | 'uk';

export interface UserSettings {
  geminiApiKey: string;
  goals: MacroGoals;
  language: AppLanguage;
}

export type MeasurementKey = 'weight' | 'waist' | 'chest' | 'hips' | 'arm' | 'thigh';

export const MEASUREMENT_LABELS: Record<MeasurementKey, string> = {
  weight: 'Weight',
  waist: 'Waist',
  chest: 'Chest',
  hips: 'Hips',
  arm: 'Arm',
  thigh: 'Thigh',
};
