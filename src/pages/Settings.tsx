import { useState } from 'react';
import { Eye, EyeOff, ExternalLink, Check, HelpCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSettings, saveSettings } from '../store/settings';
import { trackApiKeySaved, trackGoalsUpdated, trackLanguageChanged, trackDataExported } from '../lib/analytics';
import { calculateMacroGoals } from '../lib/goalCalculator';
import { db } from '../db';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLang } from '../store/langContext';
import { LANGUAGE_LABELS } from '../lib/i18n';
import type { AppLanguage, OnboardingProfile } from '../types';
import type { Translations } from '../lib/i18n';

function ApiKeyExplainerModal({ t, onClose }: { t: Translations; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-[#242419] rounded-t-3xl sm:rounded-2xl border-t sm:border border-[#3a3a2a] px-5 pt-5 pb-8 sm:pb-6 max-w-md w-full mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#f0ede4]">{t.apiKeyExplainTitle}</h2>
          <button onClick={onClose} className="text-[#9a9680] hover:text-[#f0ede4] p-1">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-[#c8c4b0] mb-4 leading-relaxed">{t.apiKeyExplainBody}</p>
        <div className="space-y-3 mb-5">
          {([t.apiKeyExplainStep1, t.apiKeyExplainStep2, t.apiKeyExplainStep3] as string[]).map((step, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="w-6 h-6 rounded-full bg-[#7cb87a]/20 border border-[#7cb87a]/40 text-[#7cb87a] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <p className="text-sm text-[#9a9680] leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        <a
          href="https://aistudio.google.com/app/apikey"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#7cb87a] text-[#18180f] font-medium text-sm hover:bg-[#8fce8d] active:bg-[#6aa368] mb-3"
        >
          {t.apiKeyOpenStudio} <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <button onClick={onClose} className="w-full py-2 text-sm text-[#9a9680] hover:text-[#f0ede4]">
          {t.apiKeyExplainGotIt}
        </button>
      </div>
    </div>
  );
}

type GoalKey = 'calories' | 'protein' | 'carbs' | 'fat';

const LANGUAGES: AppLanguage[] = ['en', 'ru', 'cs', 'de', 'fr', 'es', 'uk'];

export function Settings() {
  const { t, lang, setLang } = useLang();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(getSettings);
  const [goalStrings, setGoalStrings] = useState<Record<GoalKey, string>>(() => {
    const g = getSettings().goals;
    return {
      calories: String(g.calories),
      protein: String(g.protein),
      carbs: String(g.carbs),
      fat: String(g.fat),
    };
  });
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [showApiKeyExplainer, setShowApiKeyExplainer] = useState(false);

  // Body profile state
  const [profileDraft, setProfileDraft] = useState<OnboardingProfile | undefined>(
    () => getSettings().onboardingProfile
  );
  const [savedWeight, setSavedWeight] = useState<number | undefined>(
    () => getSettings().onboardingProfile?.weightKg
  );
  const [showRecalcBanner, setShowRecalcBanner] = useState(false);
  const [recalcDone, setRecalcDone] = useState(false);

  const GOAL_FIELDS: { key: GoalKey; label: string; unit: string }[] = [
    { key: 'calories', label: t.calories, unit: 'kcal' },
    { key: 'protein', label: t.protein, unit: 'g' },
    { key: 'carbs', label: t.carbs, unit: 'g' },
    { key: 'fat', label: t.fat, unit: 'g' },
  ];

  function handleSave() {
    const goals = {
      calories: Number(goalStrings.calories) || 0,
      protein: Number(goalStrings.protein) || 0,
      carbs: Number(goalStrings.carbs) || 0,
      fat: Number(goalStrings.fat) || 0,
    };
    if (settings.geminiApiKey) trackApiKeySaved();
    trackGoalsUpdated();
    saveSettings({ ...settings, goals, language: lang, onboardingProfile: profileDraft });
    window.dispatchEvent(new Event('dtk:settings-changed'));

    // Check if weight changed significantly
    if (profileDraft && savedWeight !== undefined) {
      const weightDiff = Math.abs(profileDraft.weightKg - savedWeight);
      if (weightDiff >= 2) {
        setShowRecalcBanner(true);
        setRecalcDone(false);
      }
    }
    setSavedWeight(profileDraft?.weightKg);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleRecalcMacros() {
    if (!profileDraft) return;
    const newGoals = calculateMacroGoals(profileDraft);
    setGoalStrings({
      calories: String(newGoals.calories),
      protein: String(newGoals.protein),
      carbs: String(newGoals.carbs),
      fat: String(newGoals.fat),
    });
    saveSettings({ onboardingProfile: profileDraft, goals: newGoals });
    window.dispatchEvent(new Event('dtk:settings-changed'));
    setShowRecalcBanner(false);
    setRecalcDone(true);
    setTimeout(() => setRecalcDone(false), 3000);
  }

  function handleLangChange(l: AppLanguage) {
    trackLanguageChanged(l);
    setLang(l);
    // Immediately persist language choice
    saveSettings({ language: l });
    window.dispatchEvent(new Event('dtk:settings-changed'));
  }

  async function handleExport() {
    trackDataExported();
    const meals = await db.meals.toArray();
    const measurements = await db.measurements.toArray();
    const blob = new Blob([JSON.stringify({ meals, measurements, exportedAt: new Date().toISOString() }, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diet-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleClearAll() {
    const timestamp = Date.now();
    // Archive settings by renaming the key (not deleting)
    const settingsRaw = localStorage.getItem('dtk_settings');
    if (settingsRaw) {
      localStorage.setItem(`dtk_archive_${timestamp}_settings`, settingsRaw);
      localStorage.removeItem('dtk_settings');
    }
    // Archive chat history
    const chatRaw = localStorage.getItem('dtk_chat_history');
    if (chatRaw) {
      localStorage.setItem(`dtk_archive_${timestamp}_chat_history`, chatRaw);
      localStorage.removeItem('dtk_chat_history');
    }
    // Clear meals and measurements from IndexedDB
    await db.meals.clear();
    await db.measurements.clear();
    setShowClearDialog(false);
    // Navigate to onboarding since settings are cleared
    navigate('/onboarding');
  }

  return (
    <div className="flex flex-col min-h-full pb-24">
      {showApiKeyExplainer && <ApiKeyExplainerModal t={t} onClose={() => setShowApiKeyExplainer(false)} />}
      {/* Header */}
      <div className="px-4 pt-12 pb-4 border-b border-[#3a3a2a] flex items-center gap-3">
        <button onClick={() => navigate('/')} className="text-[#9a9680] hover:text-[#f0ede4] p-1">
          ←
        </button>
        <h1 className="text-xl font-bold text-[#f0ede4]">{t.settings}</h1>
      </div>

      <div className="px-4 py-6 space-y-8">
        {/* Language */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">{t.language}</h2>
          <div className="flex flex-wrap gap-2">
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
        </section>

        {/* API Key */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">{t.geminiApiKey}</h2>
          <div className="relative">
            <Input
              type={showKey ? 'text' : 'password'}
              placeholder={t.pasteApiKey}
              value={settings.geminiApiKey}
              onChange={(e) => setSettings((s) => ({ ...s, geminiApiKey: e.target.value }))}
              className="pr-10"
            />
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9680] hover:text-[#c8c4b0]"
              onClick={() => setShowKey((v) => !v)}
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center justify-between">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#7cb87a] hover:text-[#8fce8d]"
            >
              {t.getKeyAt} <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={() => setShowApiKeyExplainer(true)}
              className="inline-flex items-center gap-1 text-xs text-[#9a9680] hover:text-[#c8c4b0]"
            >
              <HelpCircle className="w-3 h-3" />
              {t.apiKeyWhatIsThis}
            </button>
          </div>
          <p className="text-xs text-[#5a5a44]">{t.keyStoredLocally}</p>
        </section>

        {/* Body Profile */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">{t.bodyProfile}</h2>
          {profileDraft ? (
            <div className="space-y-3">
              {/* Weight & Height */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#9a9680]">{t.onboardingWeight}</label>
                  <div className="relative">
                    <Input
                      type="number"
                      inputMode="decimal"
                      value={profileDraft.weightKg}
                      onChange={(e) => setProfileDraft((p) => p ? { ...p, weightKg: Number(e.target.value) || 0 } : p)}
                      className="pr-8"
                      min={30}
                      max={300}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5a5a44] pointer-events-none">kg</span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-[#9a9680]">{t.onboardingHeight}</label>
                  <div className="relative">
                    <Input
                      type="number"
                      inputMode="numeric"
                      value={profileDraft.heightCm}
                      onChange={(e) => setProfileDraft((p) => p ? { ...p, heightCm: Number(e.target.value) || 0 } : p)}
                      className="pr-8"
                      min={100}
                      max={250}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5a5a44] pointer-events-none">cm</span>
                  </div>
                </div>
              </div>
              {/* Age */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#c8c4b0] w-32 shrink-0">{t.onboardingAge}</label>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={profileDraft.age}
                    onChange={(e) => setProfileDraft((p) => p ? { ...p, age: Number(e.target.value) || 0 } : p)}
                    className="pr-10"
                    min={10}
                    max={99}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5a5a44] pointer-events-none">yrs</span>
                </div>
              </div>
              {/* Sex */}
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#c8c4b0] w-32 shrink-0">{t.onboardingBodyStatsTitle.split(' ')[0]}</label>
                <div className="flex gap-2 flex-1">
                  {(['male', 'female'] as const).map((sex) => (
                    <button
                      key={sex}
                      onClick={() => setProfileDraft((p) => p ? { ...p, sex } : p)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        profileDraft.sex === sex
                          ? 'bg-[#7cb87a] text-[#18180f]'
                          : 'bg-[#2e2e22] text-[#9a9680] hover:text-[#c8c4b0]'
                      }`}
                    >
                      {sex === 'male' ? t.onboardingMale : t.onboardingFemale}
                    </button>
                  ))}
                </div>
              </div>
              {/* Activity */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#9a9680]">{t.onboardingActivityTitle}</label>
                <div className="space-y-1">
                  {([
                    { value: 1.2, label: t.onboardingActivitySedentary },
                    { value: 1.375, label: t.onboardingActivityLight },
                    { value: 1.55, label: t.onboardingActivityModerate },
                    { value: 1.725, label: t.onboardingActivityActive },
                    { value: 1.9, label: t.onboardingActivityVeryActive },
                  ] as { value: OnboardingProfile['activityMultiplier']; label: string }[]).map(({ value, label }) => (
                    <button
                      key={value}
                      onClick={() => setProfileDraft((p) => p ? { ...p, activityMultiplier: value } : p)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        profileDraft.activityMultiplier === value
                          ? 'bg-[#7cb87a]/20 text-[#7cb87a] border border-[#7cb87a]/40'
                          : 'bg-[#2e2e22] text-[#9a9680] hover:text-[#c8c4b0]'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Goal */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#9a9680]">{t.onboardingGoalTitle}</label>
                <div className="flex gap-2">
                  {(['lose', 'maintain', 'gain'] as const).map((goal) => (
                    <button
                      key={goal}
                      onClick={() => setProfileDraft((p) => p ? { ...p, goal } : p)}
                      className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                        profileDraft.goal === goal
                          ? 'bg-[#7cb87a] text-[#18180f]'
                          : 'bg-[#2e2e22] text-[#9a9680] hover:text-[#c8c4b0]'
                      }`}
                    >
                      {goal === 'lose' ? t.onboardingGoalLose : goal === 'maintain' ? t.onboardingGoalMaintain : t.onboardingGoalGain}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-2 text-center space-y-2">
              <p className="text-xs text-[#5a5a44]">{t.profileNotSet}</p>
              <button
                onClick={() => navigate('/onboarding')}
                className="text-sm text-[#7cb87a] hover:text-[#8fce8d] font-medium"
              >
                {t.profileNotSetLink} →
              </button>
            </div>
          )}
        </section>

        {/* Macro recalc banner */}
        {showRecalcBanner && profileDraft && (
          <div className="flex items-center gap-3 bg-[#2a2a1a] border border-[#4a4a28] rounded-xl px-4 py-3">
            <p className="flex-1 text-xs text-[#c8c4b0]">{t.recalcMacrosBanner}</p>
            <button
              onClick={handleRecalcMacros}
              className="text-xs font-medium text-[#7cb87a] hover:text-[#8fce8d] shrink-0"
            >
              {t.recalcMacrosBtn}
            </button>
            <button onClick={() => setShowRecalcBanner(false)} className="text-[#5a5a44] hover:text-[#9a9680] ml-1" aria-label="Dismiss">
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        )}
        {recalcDone && (
          <p className="text-xs text-center text-[#7cb87a]">{t.recalcMacrosDone}</p>
        )}

        {/* Macro Goals */}
        <section className="space-y-4">
          <h2 className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">{t.dailyGoals}</h2>
          <div className="space-y-3">
            {GOAL_FIELDS.map(({ key, label, unit }) => (
              <div key={key} className="flex items-center gap-3">
                <label className="text-sm text-[#c8c4b0] w-32 shrink-0">{label}</label>
                <div className="relative flex-1">
                  <Input
                    type="number"
                    inputMode="numeric"
                    value={goalStrings[key]}
                    onChange={(e) =>
                      setGoalStrings((s) => ({ ...s, [key]: e.target.value }))
                    }
                    onBlur={(e) => {
                      if (e.target.value === '') setGoalStrings((s) => ({ ...s, [key]: '0' }));
                    }}
                    className="pr-14"
                    min={0}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#5a5a44] pointer-events-none">{unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Save button */}
        <Button onClick={handleSave} className="w-full">
          {saved ? t.saved : t.saveSettings}
        </Button>

        {/* Data management */}
        <section className="space-y-3 pt-4 border-t border-[#3a3a2a]">
          <h2 className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide">{t.data}</h2>
          <Button variant="outline" onClick={handleExport} className="w-full">
            {t.exportJson}
          </Button>
          <Button variant="destructive" onClick={() => setShowClearDialog(true)} className="w-full">
            {t.clearAllData}
          </Button>
        </section>
      </div>

      {/* Clear confirmation dialog */}
      <Dialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.clearAllDataConfirm}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-[#9a9680] mb-5">
            {t.clearAllDataArchiveDesc}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowClearDialog(false)} className="flex-1">{t.cancel}</Button>
            <Button variant="destructive" onClick={handleClearAll} className="flex-1">{t.archiveEverything}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
