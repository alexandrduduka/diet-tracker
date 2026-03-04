import type { MacroNutrients, FoodItem } from '../types';

export function sumMacros(foods: FoodItem[]): MacroNutrients {
  return foods.reduce(
    (acc, food) => ({
      calories: acc.calories + food.macros.calories,
      protein: acc.protein + food.macros.protein,
      fat: acc.fat + food.macros.fat,
      carbs: acc.carbs + food.macros.carbs,
    }),
    { calories: 0, protein: 0, fat: 0, carbs: 0 }
  );
}

export function addMacros(a: MacroNutrients, b: MacroNutrients): MacroNutrients {
  return {
    calories: a.calories + b.calories,
    protein: a.protein + b.protein,
    fat: a.fat + b.fat,
    carbs: a.carbs + b.carbs,
  };
}

export function zeroMacros(): MacroNutrients {
  return { calories: 0, protein: 0, fat: 0, carbs: 0 };
}

export function percentOfGoal(consumed: number, goal: number): number {
  if (goal <= 0) return 0;
  return Math.min((consumed / goal) * 100, 100);
}

export function remainingMacro(consumed: number, goal: number): number {
  return Math.max(goal - consumed, 0);
}

// Verify calorie consistency: recalculate from macros if LLM value is off by >10%
export function recalculateCalories(macros: MacroNutrients): number {
  return Math.round(macros.protein * 4 + macros.carbs * 4 + macros.fat * 9);
}

export function validateAndFixCalories(macros: MacroNutrients): MacroNutrients {
  const calculated = recalculateCalories(macros);
  const diff = Math.abs(macros.calories - calculated);
  const threshold = macros.calories * 0.1;
  if (diff > threshold && macros.calories > 0) {
    return { ...macros, calories: calculated };
  }
  return macros;
}

export function roundMacros(macros: MacroNutrients): MacroNutrients {
  return {
    calories: Math.round(macros.calories),
    protein: Math.round(macros.protein * 10) / 10,
    fat: Math.round(macros.fat * 10) / 10,
    carbs: Math.round(macros.carbs * 10) / 10,
  };
}
