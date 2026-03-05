import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { useLang } from '../store/langContext';
import { saveSettings } from '../store/settings';
import { trackOnboardingCompleted } from '../lib/analytics';
import { db } from '../db';
import { getTodayKey } from '../lib/date';
import { LANGUAGE_LABELS } from '../lib/i18n';
import {
  calculateCalorieTarget,
  calculateTDEE,
  calculateMacroGoals,
  derivedCarbs,
  fatSliderBounds,
  proteinSliderBounds,
  MIN_CARBS_G,
} from '../lib/goalCalculator';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import type { AppLanguage, OnboardingProfile } from '../types';

const LANGUAGES: AppLanguage[] = ['en', 'ru', 'uk', 'cs', 'de', 'fr', 'es'];
const TOTAL_STEPS = 6;

export function Onboarding() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [validationError, setValidationError] = useState('');

  // Profile state
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [heightCm, setHeightCm] = useState('');
  const [activityMultiplier, setActivityMultiplier] = useState<OnboardingProfile['activityMultiplier']>(1.375);
  const [goal, setGoal] = useState<'lose' | 'maintain' | 'gain'>('maintain');

  // Macro slider state
  const [protein, setProtein] = useState(150);
  const [fat, setFat] = useState(65);

  function buildProfile(): OnboardingProfile {
    return {
      sex,
      age: Number(age),
      weightKg: Number(weightKg),
      heightCm: Number(heightCm),
      activityMultiplier,
      goal,
    };
  }

  function validateBodyStats(): string {
    const a = Number(age);
    const w = Number(weightKg);
    const h = Number(heightCm);
    if (!age || a < 10 || a > 99) return t.onboardingValidationAge;
    if (!weightKg || w < 30 || w > 300) return t.onboardingValidationWeight;
    if (!heightCm || h < 100 || h > 250) return t.onboardingValidationHeight;
    return '';
  }

  function advanceToResults() {
    const profile = buildProfile();
    const computed = calculateMacroGoals(profile);
    setProtein(computed.protein);
    setFat(computed.fat);
    setStep(4);
  }

  async function handleFinish() {
    const profile = buildProfile();
    const calories = calculateCalorieTarget(profile);
    const carbs = derivedCarbs(calories, protein, fat);
    trackOnboardingCompleted();
    saveSettings({
      goals: { calories, protein, fat, carbs },
      onboardingComplete: true,
      onboardingProfile: profile,
    });
    window.dispatchEvent(new Event('dtk:settings-changed'));
    // Save onboarding weight as first Body log entry
    if (profile.weightKg > 0) {
      await db.measurements.add({
        timestamp: new Date(),
        dayKey: getTodayKey(),
        weight: profile.weightKg,
      });
    }
    navigate('/', { replace: true });
  }

  function handleSkip() {
    saveSettings({ onboardingComplete: true });
    window.dispatchEvent(new Event('dtk:settings-changed'));
    navigate('/', { replace: true });
  }

  function handleLangChange(l: AppLanguage) {
    setLang(l);
    saveSettings({ language: l });
    window.dispatchEvent(new Event('dtk:settings-changed'));
  }

  function handleNext() {
    setValidationError('');
    if (step === 2) {
      const err = validateBodyStats();
      if (err) {
        setValidationError(err);
        return;
      }
      setStep(3);
    } else if (step === 3) {
      advanceToResults();
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleBack() {
    setValidationError('');
    setStep((s) => s - 1);
  }

  // Derived values for step 4
  const profile = buildProfile();
  const calories = step >= 4 ? calculateCalorieTarget(profile) : 2000;
  const tdee = step >= 4 ? calculateTDEE(profile) : 2000;
  const carbs = derivedCarbs(calories, protein, fat);
  const pBounds = proteinSliderBounds(Number(weightKg) || 70);
  const fBounds = fatSliderBounds(calories, protein);

  function handleProteinChange(v: number) {
    const maxP = Math.floor((calories - fat * 9 - MIN_CARBS_G * 4) / 4);
    setProtein(Math.max(pBounds.min, Math.min(v, Math.min(pBounds.max, maxP))));
  }

  function handleFatChange(v: number) {
    setFat(Math.max(fBounds.min, Math.min(v, fBounds.max)));
  }

  const proteinPct = Math.round((protein * 4 * 100) / calories);
  const fatPct = Math.round((fat * 9 * 100) / calories);
  const carbsPct = Math.round((carbs * 4 * 100) / calories);

  // Macro insight logic
  const weightKgNum = Number(weightKg) || 70;
  function getMacroInsight(): { text: string; type: 'warn' | 'info' | 'good' } {
    const proteinPerKg = protein / weightKgNum;
    if (proteinPerKg < 1.2) return { text: t.macroInsightLowProtein, type: 'warn' };
    if (fatPct < 20) return { text: t.macroInsightLowFat, type: 'warn' };
    if (carbs < 80) return { text: t.macroInsightLowCarbs, type: 'info' };
    if (fatPct > 40) return { text: t.macroInsightHighFat, type: 'info' };
    if (proteinPerKg >= 2.0) return { text: t.macroInsightHighProtein, type: 'good' };
    return { text: t.macroInsightBalanced, type: 'good' };
  }
  const macroInsight = step === 4 ? getMacroInsight() : null;

  // Progress dots
  const ProgressDots = () => (
    <div className="flex justify-center gap-2 mb-6">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === step ? 'w-6 bg-[#7cb87a]' : i < step ? 'w-3 bg-[#7cb87a]/50' : 'w-3 bg-[#3a3a2a]'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#18180f] text-[#f0ede4] flex flex-col">
      <div className="flex-1 overflow-y-auto px-5 pt-10 pb-32 max-w-md mx-auto w-full">
        <ProgressDots />

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="flex flex-col items-center text-center gap-6">
            <img src="/icons/icon-192x192.png" alt="Diet Tracker" className="w-20 h-20 rounded-2xl" />
            <div>
              <h1 className="text-2xl font-bold text-[#f0ede4] mb-3">{t.onboardingWelcomeTitle}</h1>
              <p className="text-[#9a9680] text-sm leading-relaxed">{t.onboardingWelcomeSubtitle}</p>
            </div>

            {/* Language picker */}
            <div className="w-full">
              <p className="text-xs font-semibold text-[#5a5a44] uppercase tracking-wide mb-2">{t.language}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLangChange(l)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                      lang === l
                        ? 'bg-[#7cb87a] text-[#18180f]'
                        : 'bg-[#2e2e22] text-[#9a9680] hover:text-[#c8c4b0]'
                    }`}
                  >
                    {lang === l && <Check className="w-3 h-3" />}
                    {LANGUAGE_LABELS[l]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 1 — Nutrition Primer */}
        {step === 1 && (
          <div className="space-y-5">
            <div className="mb-2">
              <h1 className="text-xl font-bold text-[#f0ede4] mb-1">{t.onboardingNutritionTitle}</h1>
              <p className="text-sm text-[#9a9680]">{t.onboardingNutritionSubtitle}</p>
            </div>

            {/* Macro cards */}
            {[
              { emoji: '🥚', name: t.protein, kcal: '4', color: '#7cb87a', desc: t.onboardingProteinDesc, ex: '150g = 600 kcal' },
              { emoji: '🥑', name: t.fat, kcal: '9', color: '#c17a5a', desc: t.onboardingFatDesc, ex: '60g = 540 kcal' },
              { emoji: '🌾', name: t.carbs, kcal: '4', color: '#d4a24c', desc: t.onboardingCarbsDesc, ex: '200g = 800 kcal' },
            ].map((m) => (
              <div key={m.name} className="rounded-2xl border border-[#3a3a2a] bg-[#242419] p-4">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{m.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: m.color }}>{m.name}</p>
                    <p className="text-xs text-[#5a5a44]">{m.kcal} kcal / g</p>
                  </div>
                  <span className="text-xs text-[#5a5a44]">{m.ex}</span>
                </div>
                <p className="text-sm text-[#9a9680]">{m.desc}</p>
              </div>
            ))}

            {/* Sample macro split visual */}
            <div className="rounded-2xl border border-[#3a3a2a] bg-[#242419] p-4">
              <p className="text-xs text-[#5a5a44] mb-3">Sample balanced split (30 / 28 / 42%)</p>
              <div className="flex h-4 rounded-full overflow-hidden mb-2">
                <div className="bg-[#7cb87a]" style={{ width: '30%' }} />
                <div className="bg-[#c17a5a]" style={{ width: '28%' }} />
                <div className="bg-[#d4a24c]" style={{ width: '42%' }} />
              </div>
              <div className="flex gap-4 text-xs text-[#9a9680]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7cb87a] inline-block" />{t.protein}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#c17a5a] inline-block" />{t.fat}</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#d4a24c] inline-block" />{t.carbs}</span>
              </div>
            </div>

            <a
              href="/#/articles"
              className="block text-center text-[#7cb87a] text-sm hover:underline"
            >
              {t.onboardingReadFullGuide}
            </a>
          </div>
        )}

        {/* Step 2 — Body Stats */}
        {step === 2 && (
          <div className="space-y-5">
            <h1 className="text-xl font-bold text-[#f0ede4] mb-1">{t.onboardingBodyStatsTitle}</h1>

            {/* Sex toggle */}
            <div className="flex gap-2">
              {(['male', 'female'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSex(s)}
                  className={`flex-1 h-12 rounded-xl text-sm font-semibold transition-colors ${
                    sex === s
                      ? 'bg-[#7cb87a] text-[#18180f]'
                      : 'bg-[#2e2e22] border border-[#3a3a2a] text-[#9a9680] hover:text-[#c8c4b0]'
                  }`}
                >
                  {s === 'male' ? t.onboardingMale : t.onboardingFemale}
                </button>
              ))}
            </div>

            {/* Age */}
            <div className="space-y-1">
              <label className="text-xs text-[#9a9680]">{t.onboardingAge}</label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="30"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min={10}
                max={99}
              />
            </div>

            {/* Weight */}
            <div className="space-y-1">
              <label className="text-xs text-[#9a9680]">{t.onboardingWeight}</label>
              <Input
                type="number"
                inputMode="decimal"
                placeholder="75"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                min={30}
                max={300}
              />
              <p className="text-xs text-[#5a5a44]">{t.onboardingWeightHint}</p>
            </div>

            {/* Height */}
            <div className="space-y-1">
              <label className="text-xs text-[#9a9680]">{t.onboardingHeight}</label>
              <Input
                type="number"
                inputMode="numeric"
                placeholder="175"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                min={100}
                max={250}
              />
              <p className="text-xs text-[#5a5a44]">{t.onboardingHeightHint}</p>
            </div>

            {validationError && (
              <p className="text-sm text-[#e09070]">{validationError}</p>
            )}
          </div>
        )}

        {/* Step 3 — Activity & Goal */}
        {step === 3 && (
          <div className="space-y-6">
            {/* Activity */}
            <div className="space-y-3">
              <h1 className="text-xl font-bold text-[#f0ede4]">{t.onboardingActivityTitle}</h1>
              {([
                { value: 1.2 as const, label: t.onboardingActivitySedentary, desc: t.onboardingActivitySedentaryDesc },
                { value: 1.375 as const, label: t.onboardingActivityLight, desc: t.onboardingActivityLightDesc },
                { value: 1.55 as const, label: t.onboardingActivityModerate, desc: t.onboardingActivityModerateDesc },
                { value: 1.725 as const, label: t.onboardingActivityActive, desc: t.onboardingActivityActiveDesc },
                { value: 1.9 as const, label: t.onboardingActivityVeryActive, desc: t.onboardingActivityVeryActiveDesc },
              ]).map((a) => (
                <button
                  key={a.value}
                  onClick={() => setActivityMultiplier(a.value)}
                  className={`w-full text-left p-4 rounded-xl border transition-colors ${
                    activityMultiplier === a.value
                      ? 'border-[#7cb87a] bg-[#7cb87a]/10 text-[#f0ede4]'
                      : 'border-[#3a3a2a] bg-[#242419] text-[#9a9680] hover:border-[#5a5a44]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">{a.label}</span>
                    {activityMultiplier === a.value && <Check className="w-4 h-4 text-[#7cb87a]" />}
                  </div>
                  <p className="text-xs mt-0.5 text-[#5a5a44]">{a.desc}</p>
                </button>
              ))}
            </div>

            {/* Goal */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-[#f0ede4]">{t.onboardingGoalTitle}</h2>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { value: 'lose' as const, label: t.onboardingGoalLose, desc: t.onboardingGoalLoseDesc },
                  { value: 'maintain' as const, label: t.onboardingGoalMaintain, desc: t.onboardingGoalMaintainDesc },
                  { value: 'gain' as const, label: t.onboardingGoalGain, desc: t.onboardingGoalGainDesc },
                ]).map((g) => (
                  <button
                    key={g.value}
                    onClick={() => setGoal(g.value)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      goal === g.value
                        ? 'border-[#7cb87a] bg-[#7cb87a]/10'
                        : 'border-[#3a3a2a] bg-[#242419] hover:border-[#5a5a44]'
                    }`}
                  >
                    <p className={`font-semibold text-xs ${goal === g.value ? 'text-[#7cb87a]' : 'text-[#c8c4b0]'}`}>
                      {g.label}
                    </p>
                    <p className="text-xs text-[#5a5a44] mt-1 leading-tight">{g.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 — Results + Sliders */}
        {step === 4 && (
          <div className="space-y-5">
            <h1 className="text-xl font-bold text-[#f0ede4]">{t.onboardingResultsTitle}</h1>

            {/* Calorie target card */}
            <div className="rounded-2xl border border-[#3a3a2a] bg-[#242419] p-5 text-center">
              <p className="text-xs text-[#9a9680] mb-1">kcal / day</p>
              <p className="text-5xl font-bold text-[#d4a24c] mb-2">{calories}</p>
              <p className="text-xs text-[#5a5a44]">{t.onboardingTdeeLabel} {tdee} kcal</p>
            </div>

            {/* Macro split bar */}
            <div>
              <div className="flex h-3 rounded-full overflow-hidden mb-2">
                <div className="bg-[#7cb87a] transition-all" style={{ width: `${proteinPct}%` }} />
                <div className="bg-[#c17a5a] transition-all" style={{ width: `${fatPct}%` }} />
                <div className="bg-[#d4a24c] transition-all" style={{ width: `${carbsPct}%` }} />
              </div>
              <div className="flex gap-4 text-xs text-[#9a9680]">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7cb87a] inline-block" />{t.protein} {proteinPct}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#c17a5a] inline-block" />{t.fat} {fatPct}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#d4a24c] inline-block" />{t.carbs} {carbsPct}%</span>
              </div>
            </div>

            <p className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">{t.onboardingAdjustMacros}</p>

            {/* Protein slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#7cb87a]">{t.protein}</span>
                <span className="text-sm text-[#f0ede4]">{protein}g <span className="text-[#5a5a44] text-xs">({protein * 4} kcal)</span></span>
              </div>
              <input
                type="range"
                min={pBounds.min}
                max={pBounds.max}
                value={protein}
                onChange={(e) => handleProteinChange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#3a3a2a] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#7cb87a] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#7cb87a] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #7cb87a ${((protein - pBounds.min) / (pBounds.max - pBounds.min)) * 100}%, #3a3a2a ${((protein - pBounds.min) / (pBounds.max - pBounds.min)) * 100}%)`,
                }}
              />
            </div>

            {/* Fat slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-[#c17a5a]">{t.fat}</span>
                <span className="text-sm text-[#f0ede4]">{fat}g <span className="text-[#5a5a44] text-xs">({Math.round(fat * 9)} kcal)</span></span>
              </div>
              <input
                type="range"
                min={fBounds.min}
                max={Math.max(fBounds.max, fBounds.min + 1)}
                value={fat}
                onChange={(e) => handleFatChange(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[#3a3a2a] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c17a5a] [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#c17a5a] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #c17a5a ${((fat - fBounds.min) / (Math.max(fBounds.max, fBounds.min + 1) - fBounds.min)) * 100}%, #3a3a2a ${((fat - fBounds.min) / (Math.max(fBounds.max, fBounds.min + 1) - fBounds.min)) * 100}%)`,
                }}
              />
            </div>

            {/* Carbs — derived */}
            <div className="rounded-xl border border-[#3a3a2a] bg-[#2e2e22]/50 p-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#9a9680]">{t.onboardingCarbsDerived}</span>
                <span className="text-sm text-[#f0ede4]">{carbs}g <span className="text-[#5a5a44] text-xs">({carbs * 4} kcal)</span></span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#3a3a2a]">
                <div
                  className="h-2 rounded-full bg-[#d4a24c] transition-all"
                  style={{ width: `${Math.min(carbsPct, 100)}%` }}
                />
              </div>
            </div>

            {carbs < MIN_CARBS_G * 2 && (
              <p className="text-xs text-[#e09070] bg-[#3a2a1a] border border-[#5a3a20] rounded-xl px-3 py-2">
                {t.onboardingLowCarbsWarning}
              </p>
            )}

            {macroInsight && (
              <div className={`rounded-xl px-3 py-2.5 text-xs leading-relaxed border ${
                macroInsight.type === 'warn'
                  ? 'bg-[#3a2a1a] border-[#5a3a20] text-[#e09070]'
                  : macroInsight.type === 'info'
                  ? 'bg-[#2a2a1a] border-[#4a4a28] text-[#c8c4b0]'
                  : 'bg-[#1a2a1a] border-[#2a4a2a] text-[#8fce8d]'
              }`}>
                {macroInsight.text}
              </div>
            )}
          </div>
        )}

        {/* Step 5 — Done */}
        {step === 5 && (
          <div className="space-y-5">
            {/* Hero */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#7cb87a]/20 border border-[#7cb87a]/40 flex items-center justify-center shrink-0">
                <Check className="w-8 h-8 text-[#7cb87a]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#f0ede4]">{t.onboardingDoneTitle}</h1>
                <p className="text-sm text-[#9a9680] mt-0.5">{t.onboardingDoneSummary}</p>
              </div>
            </div>

            {/* Calorie goal hero */}
            <div className="rounded-2xl border border-[#3a3a2a] bg-[#242419] p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">Daily target</p>
                <p className="text-3xl font-bold text-[#d4a24c]">{calories} <span className="text-base font-normal text-[#9a9680]">kcal</span></p>
              </div>

              {/* Macro split bar */}
              <div className="flex h-3 rounded-full overflow-hidden mb-2">
                <div className="bg-[#7cb87a] transition-all" style={{ width: `${proteinPct}%` }} />
                <div className="bg-[#c17a5a] transition-all" style={{ width: `${fatPct}%` }} />
                <div className="bg-[#d4a24c] transition-all" style={{ width: `${carbsPct}%` }} />
              </div>
              <div className="flex gap-4 text-xs text-[#9a9680] mb-4">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7cb87a] inline-block" />{t.protein} {proteinPct}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#c17a5a] inline-block" />{t.fat} {fatPct}%</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#d4a24c] inline-block" />{t.carbs} {carbsPct}%</span>
              </div>

              {/* Macro values */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t.protein, value: `${protein}g`, color: '#7cb87a' },
                  { label: t.fat, value: `${fat}g`, color: '#c17a5a' },
                  { label: t.carbs, value: `${carbs}g`, color: '#d4a24c' },
                ].map((m) => (
                  <div key={m.label} className="bg-[#2e2e22] rounded-xl p-3 text-center">
                    <p className="text-xs text-[#5a5a44] mb-1">{m.label}</p>
                    <p className="text-lg font-bold" style={{ color: m.color }}>{m.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Encouragement note */}
            <div className="rounded-xl bg-[#1a2a1a] border border-[#2a4a2a] px-4 py-3">
              <p className="text-sm text-[#8fce8d] leading-relaxed">
                Consistency beats perfection. Log what you eat — even rough estimates — and you'll gain real insight into your nutrition within a week.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#18180f]/95 backdrop-blur-sm border-t border-[#3a3a2a] px-5 py-4">
        <div className="max-w-md mx-auto flex gap-3">
          {step === 0 && (
            <>
              <Button variant="outline" className="flex-1 h-12" onClick={handleSkip}>
                {t.onboardingSkip}
              </Button>
              <Button className="flex-1 h-12" onClick={handleNext}>
                {t.onboardingGetStarted}
              </Button>
            </>
          )}
          {step >= 1 && step <= 3 && (
            <>
              <Button variant="outline" className="h-12 px-4" onClick={handleBack}>
                {t.onboardingBack}
              </Button>
              <Button className="flex-1 h-12" onClick={handleNext}>
                {t.onboardingNext}
              </Button>
            </>
          )}
          {step === 4 && (
            <>
              <Button variant="outline" className="h-12 px-4" onClick={handleBack}>
                {t.onboardingBack}
              </Button>
              <Button className="flex-1 h-12" onClick={() => setStep(5)}>
                {t.onboardingNext}
              </Button>
            </>
          )}
          {step === 5 && (
            <Button className="flex-1 h-12" onClick={handleFinish}>
              {t.onboardingStartTracking}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
