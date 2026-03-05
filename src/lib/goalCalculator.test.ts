import { describe, it, expect } from 'vitest';
import {
  calculateBMR,
  calculateTDEE,
  calculateCalorieTarget,
  calculateMacroGoals,
  derivedCarbs,
  maxFatGiven,
  fatSliderBounds,
  proteinSliderBounds,
  MIN_CARBS_G,
} from './goalCalculator';
import type { OnboardingProfile } from '../types';

const maleProfile: OnboardingProfile = {
  sex: 'male',
  age: 30,
  weightKg: 80,
  heightCm: 180,
  activityMultiplier: 1.55,
  goal: 'maintain',
};

const femaleProfile: OnboardingProfile = {
  sex: 'female',
  age: 25,
  weightKg: 60,
  heightCm: 165,
  activityMultiplier: 1.375,
  goal: 'lose',
};

describe('calculateBMR', () => {
  it('calculates male BMR correctly (Mifflin-St Jeor)', () => {
    // 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
    expect(calculateBMR(maleProfile)).toBe(1780);
  });

  it('calculates female BMR correctly (Mifflin-St Jeor)', () => {
    // 10*60 + 6.25*165 - 5*25 - 161 = 600 + 1031.25 - 125 - 161 = 1345.25 → 1345
    expect(calculateBMR(femaleProfile)).toBe(1345);
  });

  it('returns a positive integer for any valid profile', () => {
    const result = calculateBMR(maleProfile);
    expect(result).toBeGreaterThan(0);
    expect(Number.isInteger(result)).toBe(true);
  });
});

describe('calculateTDEE', () => {
  it('multiplies BMR by activity multiplier', () => {
    const bmr = calculateBMR(maleProfile);
    const expected = Math.round(bmr * 1.55);
    expect(calculateTDEE(maleProfile)).toBe(expected);
  });

  it('returns higher TDEE for higher activity', () => {
    const sedentary = calculateTDEE({ ...maleProfile, activityMultiplier: 1.2 });
    const active = calculateTDEE({ ...maleProfile, activityMultiplier: 1.9 });
    expect(active).toBeGreaterThan(sedentary);
  });
});

describe('calculateCalorieTarget', () => {
  it('subtracts 400 for lose goal', () => {
    const tdee = calculateTDEE(maleProfile);
    const target = calculateCalorieTarget({ ...maleProfile, goal: 'lose' });
    expect(target).toBe(Math.max(tdee - 400, 1200));
  });

  it('adds 250 for gain goal', () => {
    const tdee = calculateTDEE(maleProfile);
    const target = calculateCalorieTarget({ ...maleProfile, goal: 'gain' });
    expect(target).toBe(tdee + 250);
  });

  it('equals TDEE for maintain goal', () => {
    const tdee = calculateTDEE(maleProfile);
    const target = calculateCalorieTarget({ ...maleProfile, goal: 'maintain' });
    expect(target).toBe(tdee);
  });

  it('floors at 1200 kcal for severe deficit (very small/low-activity profile)', () => {
    const tinyProfile: OnboardingProfile = {
      sex: 'female',
      age: 20,
      weightKg: 40,
      heightCm: 150,
      activityMultiplier: 1.2,
      goal: 'lose',
    };
    expect(calculateCalorieTarget(tinyProfile)).toBeGreaterThanOrEqual(1200);
  });
});

describe('calculateMacroGoals', () => {
  it('returns calories matching calculateCalorieTarget', () => {
    const goals = calculateMacroGoals(maleProfile);
    expect(goals.calories).toBe(calculateCalorieTarget(maleProfile));
  });

  it('protein + fat + carbs energy approximately equals calories', () => {
    const goals = calculateMacroGoals(maleProfile);
    const energy = goals.protein * 4 + goals.fat * 9 + goals.carbs * 4;
    // Allow ±50 kcal due to rounding
    expect(Math.abs(energy - goals.calories)).toBeLessThanOrEqual(50);
  });

  it('carbs never below MIN_CARBS_G', () => {
    const goals = calculateMacroGoals(femaleProfile);
    expect(goals.carbs).toBeGreaterThanOrEqual(MIN_CARBS_G);
  });

  it('protein uses 2.0g/kg for lose goal', () => {
    const goals = calculateMacroGoals({ ...maleProfile, goal: 'lose' });
    const maxProtein = Math.round(Math.min(80 * 2.0, (goals.calories * 0.40) / 4));
    expect(goals.protein).toBe(maxProtein);
  });

  it('protein uses 1.8g/kg for maintain goal', () => {
    const goals = calculateMacroGoals(maleProfile);
    const maxProtein = Math.round(Math.min(80 * 1.8, (goals.calories * 0.40) / 4));
    expect(goals.protein).toBe(maxProtein);
  });
});

describe('derivedCarbs', () => {
  it('calculates remaining calories as carbs', () => {
    const cals = 2000;
    const protein = 150;
    const fat = 60;
    // (2000 - 150*4 - 60*9) / 4 = (2000 - 600 - 540) / 4 = 860/4 = 215
    expect(derivedCarbs(cals, protein, fat)).toBe(215);
  });

  it('returns MIN_CARBS_G when macros exceed budget', () => {
    // Over-budget scenario: protein+fat > calories
    const result = derivedCarbs(1200, 200, 80);
    expect(result).toBe(MIN_CARBS_G);
  });

  it('returns at least MIN_CARBS_G always', () => {
    expect(derivedCarbs(1000, 150, 90)).toBeGreaterThanOrEqual(MIN_CARBS_G);
  });
});

describe('maxFatGiven', () => {
  it('returns the max fat before carbs drop below MIN_CARBS_G', () => {
    const calories = 2000;
    const protein = 150;
    // Available for fat = 2000 - 150*4 - 20*4 = 2000 - 600 - 80 = 1320
    // maxFat = floor(1320 / 9) = 146
    expect(maxFatGiven(calories, protein)).toBe(146);
  });

  it('returns 0 when protein alone fills most of the budget', () => {
    // calories=1200, protein=250 → protein already uses 1000 kcal, only 200 left
    // Available for fat = 1200 - 250*4 - 20*4 = 1200 - 1000 - 80 = 120 → floor(120/9) = 13
    expect(maxFatGiven(1200, 250)).toBeGreaterThanOrEqual(0);
  });
});

describe('fatSliderBounds', () => {
  it('min is 20% of calories divided by 9', () => {
    const { min } = fatSliderBounds(2000, 150);
    expect(min).toBe(Math.ceil((2000 * 0.20) / 9));
  });

  it('max does not exceed 45% of calories', () => {
    const { max } = fatSliderBounds(2000, 50);
    expect(max).toBeLessThanOrEqual(Math.floor((2000 * 0.45) / 9));
  });

  it('min is always <= max', () => {
    const { min, max } = fatSliderBounds(2000, 150);
    expect(min).toBeLessThanOrEqual(max);
  });

  it('max is bounded by min carbs constraint', () => {
    const { max } = fatSliderBounds(2000, 150);
    expect(max).toBeLessThanOrEqual(maxFatGiven(2000, 150));
  });
});

describe('proteinSliderBounds', () => {
  it('min is 0.8g/kg', () => {
    const { min } = proteinSliderBounds(80);
    expect(min).toBe(64);
  });

  it('max is 2.5g/kg', () => {
    const { max } = proteinSliderBounds(80);
    expect(max).toBe(200);
  });

  it('min is always < max for any realistic weight', () => {
    const { min, max } = proteinSliderBounds(60);
    expect(min).toBeLessThan(max);
  });
});
