import type { UserSettings, MacroGoals } from '../types';

const STORAGE_KEY = 'dtk_settings';

const DEFAULT_SETTINGS: UserSettings = {
  geminiApiKey: '',
  goals: {
    calories: 2000,
    protein: 150,
    fat: 65,
    carbs: 250,
  },
  language: 'en',
  onboardingComplete: false,
};

export function getSettings(): UserSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings: Partial<UserSettings>): void {
  const current = getSettings();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, ...settings }));
}

export function saveGoals(goals: MacroGoals): void {
  const current = getSettings();
  saveSettings({ ...current, goals });
}

export function getGoals(): MacroGoals {
  return getSettings().goals;
}

export function getApiKey(): string {
  return getSettings().geminiApiKey;
}

// Migration: existing users have settings but no onboardingComplete key.
// Mark them as done so they don't see the onboarding flow.
export function migrateSettings(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return; // No settings at all — truly new user, onboarding will run
    const parsed = JSON.parse(raw);
    if (parsed.onboardingComplete === undefined) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...parsed, onboardingComplete: true }));
    }
  } catch {
    // Ignore errors — worst case existing user sees onboarding once
  }
}
