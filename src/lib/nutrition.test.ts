import { describe, it, expect } from 'vitest';
import {
  sumMacros,
  addMacros,
  zeroMacros,
  percentOfGoal,
  remainingMacro,
  recalculateCalories,
  validateAndFixCalories,
  roundMacros,
} from './nutrition';
import type { FoodItem } from '../types';

const food = (calories: number, protein: number, fat: number, carbs: number): FoodItem => ({
  name: 'test',
  quantity: '1 serving',
  macros: { calories, protein, fat, carbs },
});

describe('sumMacros', () => {
  it('sums an empty array to zero', () => {
    expect(sumMacros([])).toEqual(zeroMacros());
  });

  it('sums a single food', () => {
    expect(sumMacros([food(200, 10, 5, 30)])).toEqual({ calories: 200, protein: 10, fat: 5, carbs: 30 });
  });

  it('sums multiple foods', () => {
    const result = sumMacros([food(200, 10, 5, 30), food(100, 20, 2, 8)]);
    expect(result).toEqual({ calories: 300, protein: 30, fat: 7, carbs: 38 });
  });
});

describe('addMacros', () => {
  it('adds two macro objects', () => {
    const a = { calories: 100, protein: 10, fat: 5, carbs: 20 };
    const b = { calories: 200, protein: 15, fat: 3, carbs: 10 };
    expect(addMacros(a, b)).toEqual({ calories: 300, protein: 25, fat: 8, carbs: 30 });
  });
});

describe('zeroMacros', () => {
  it('returns all zeros', () => {
    expect(zeroMacros()).toEqual({ calories: 0, protein: 0, fat: 0, carbs: 0 });
  });
});

describe('percentOfGoal', () => {
  it('returns 0 when goal is 0', () => {
    expect(percentOfGoal(100, 0)).toBe(0);
  });

  it('returns correct percentage', () => {
    expect(percentOfGoal(50, 200)).toBe(25);
  });

  it('caps at 100 when over goal', () => {
    expect(percentOfGoal(300, 200)).toBe(100);
  });

  it('returns 100 at exactly goal', () => {
    expect(percentOfGoal(200, 200)).toBe(100);
  });
});

describe('remainingMacro', () => {
  it('returns remaining amount', () => {
    expect(remainingMacro(50, 200)).toBe(150);
  });

  it('returns 0 when consumed exceeds goal', () => {
    expect(remainingMacro(250, 200)).toBe(0);
  });

  it('returns 0 when consumed equals goal', () => {
    expect(remainingMacro(200, 200)).toBe(0);
  });
});

describe('recalculateCalories', () => {
  it('calculates calories from macros (4-9-4 rule)', () => {
    // 10g protein * 4 + 20g carbs * 4 + 5g fat * 9 = 40 + 80 + 45 = 165
    expect(recalculateCalories({ calories: 0, protein: 10, fat: 5, carbs: 20 })).toBe(165);
  });

  it('rounds to nearest integer', () => {
    // 1g protein * 4 + 1g carbs * 4 + 1g fat * 9 = 17
    expect(recalculateCalories({ calories: 0, protein: 1, fat: 1, carbs: 1 })).toBe(17);
  });
});

describe('validateAndFixCalories', () => {
  it('keeps calories if within 10% of calculated', () => {
    // Calculated: 10*4 + 20*4 + 5*9 = 165; stated 170 is within 10%
    const macros = { calories: 170, protein: 10, fat: 5, carbs: 20 };
    expect(validateAndFixCalories(macros).calories).toBe(170);
  });

  it('fixes calories if off by more than 10%', () => {
    // Calculated: 10*4 + 20*4 + 5*9 = 165; stated 300 is >10% off
    const macros = { calories: 300, protein: 10, fat: 5, carbs: 20 };
    expect(validateAndFixCalories(macros).calories).toBe(165);
  });

  it('does not modify other macro values', () => {
    const macros = { calories: 300, protein: 10, fat: 5, carbs: 20 };
    const result = validateAndFixCalories(macros);
    expect(result.protein).toBe(10);
    expect(result.fat).toBe(5);
    expect(result.carbs).toBe(20);
  });

  it('skips fix when stated calories is 0', () => {
    const macros = { calories: 0, protein: 10, fat: 5, carbs: 20 };
    expect(validateAndFixCalories(macros).calories).toBe(0);
  });
});

describe('roundMacros', () => {
  it('rounds calories to integer', () => {
    const result = roundMacros({ calories: 154.7, protein: 10, fat: 5, carbs: 20 });
    expect(result.calories).toBe(155);
  });

  it('rounds protein/fat/carbs to 1 decimal place', () => {
    const result = roundMacros({ calories: 100, protein: 10.45, fat: 5.123, carbs: 20.789 });
    expect(result.protein).toBe(10.5);
    expect(result.fat).toBe(5.1);
    expect(result.carbs).toBe(20.8);
  });
});
