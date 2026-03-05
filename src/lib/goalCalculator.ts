import type { MacroGoals, OnboardingProfile } from '../types';

export const MIN_CARBS_G = 20; // Absolute minimum carbs for brain function

/** Mifflin-St Jeor BMR formula */
export function calculateBMR(p: OnboardingProfile): number {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  return Math.round(p.sex === 'male' ? base + 5 : base - 161);
}

/** Total Daily Energy Expenditure */
export function calculateTDEE(p: OnboardingProfile): number {
  return Math.round(calculateBMR(p) * p.activityMultiplier);
}

/** Calorie target adjusted for goal, floored at 1200 kcal */
export function calculateCalorieTarget(p: OnboardingProfile): number {
  const tdee = calculateTDEE(p);
  if (p.goal === 'lose') return Math.max(tdee - 400, 1200);
  if (p.goal === 'gain') return tdee + 250;
  return tdee;
}

/** Full macro goal calculation from profile */
export function calculateMacroGoals(p: OnboardingProfile): MacroGoals {
  const calories = calculateCalorieTarget(p);
  // Protein: 2.0g/kg when losing/gaining, 1.8g/kg when maintaining — capped at 40% of calories
  const proteinMultiplier = p.goal === 'maintain' ? 1.8 : 2.0;
  const protein = Math.round(Math.min(p.weightKg * proteinMultiplier, (calories * 0.40) / 4));
  // Fat: 28% of calories
  const fat = Math.round((calories * 0.28) / 9);
  // Carbs: remainder, minimum MIN_CARBS_G
  const carbs = Math.max(Math.round((calories - protein * 4 - fat * 9) / 4), MIN_CARBS_G);
  return { calories, protein, fat, carbs };
}

/** Derive carbs from remaining calories after protein and fat — used by sliders */
export function derivedCarbs(calories: number, protein: number, fat: number): number {
  return Math.max(Math.round((calories - protein * 4 - fat * 9) / 4), MIN_CARBS_G);
}

/** Maximum fat (g) before carbs would drop below MIN_CARBS_G */
export function maxFatGiven(calories: number, protein: number): number {
  const availableForFat = calories - protein * 4 - MIN_CARBS_G * 4;
  return Math.max(Math.floor(availableForFat / 9), 0);
}

/** Fat slider bounds: min=20% of calories, max=45% or limited by min carbs */
export function fatSliderBounds(
  calories: number,
  protein: number,
): { min: number; max: number } {
  const minFat = Math.ceil((calories * 0.20) / 9);
  const maxByPct = Math.floor((calories * 0.45) / 9);
  const maxByCarbs = maxFatGiven(calories, protein);
  return { min: minFat, max: Math.min(maxByPct, maxByCarbs) };
}

/** Protein slider bounds: 0.8–2.5g per kg body weight */
export function proteinSliderBounds(weightKg: number): { min: number; max: number } {
  return {
    min: Math.round(weightKg * 0.8),
    max: Math.round(weightKg * 2.5),
  };
}
