import { useState } from 'react';
import { Eye, EyeOff, ExternalLink, Check } from 'lucide-react';
import { getSettings, saveSettings } from '../store/settings';
import { db } from '../db';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLang } from '../store/langContext';
import { LANGUAGE_LABELS } from '../lib/i18n';
import type { AppLanguage } from '../types';

type GoalKey = 'calories' | 'protein' | 'carbs' | 'fat';

const LANGUAGES: AppLanguage[] = ['en', 'ru', 'cs', 'de', 'fr', 'es', 'uk'];

export function Settings() {
  const { t, lang, setLang } = useLang();
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
    saveSettings({ ...settings, goals, language: lang });
    window.dispatchEvent(new Event('dtk:settings-changed'));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleLangChange(l: AppLanguage) {
    setLang(l);
    // Immediately persist language choice
    saveSettings({ language: l });
    window.dispatchEvent(new Event('dtk:settings-changed'));
  }

  async function handleExport() {
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
    await db.meals.clear();
    await db.measurements.clear();
    setShowClearDialog(false);
  }

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 border-b border-[#3a3a2a]">
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
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs text-[#7cb87a] hover:text-[#8fce8d]"
          >
            {t.getKeyAt} <ExternalLink className="w-3 h-3" />
          </a>
          <p className="text-xs text-[#5a5a44]">{t.keyStoredLocally}</p>
        </section>

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
            {t.clearAllDataDesc}
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowClearDialog(false)} className="flex-1">{t.cancel}</Button>
            <Button variant="destructive" onClick={handleClearAll} className="flex-1">{t.deleteEverything}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
