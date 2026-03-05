import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { db } from '../db';
import { getTodayKey } from '../lib/date';
import { trackMeasurementLogged } from '../lib/analytics';
import { useLast30DaysMeasurements, useAllMeasurements } from '../hooks/useMeasurements';
import { MeasurementChart } from '../components/MeasurementChart';
import type { MeasurementKey } from '../types';
import { MEASUREMENT_LABELS } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { useLang } from '../store/langContext';
import type { Translations } from '../lib/i18n';

const METRICS: MeasurementKey[] = ['weight', 'waist', 'chest', 'hips', 'arm', 'thigh'];

function LogDrawer({ onClose, t }: { onClose: () => void; t: Translations }) {
  const [fields, setFields] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  function set(key: string, val: string) {
    setFields((f) => ({ ...f, [key]: val }));
  }

  async function handleSave() {
    const hasAny = Object.values(fields).some((v) => v.trim() !== '');
    if (!hasAny) return;
    trackMeasurementLogged();
    setSaving(true);
    await db.measurements.add({
      timestamp: new Date(),
      dayKey: getTodayKey(),
      weight: fields.weight ? Number(fields.weight) : undefined,
      waist: fields.waist ? Number(fields.waist) : undefined,
      chest: fields.chest ? Number(fields.chest) : undefined,
      hips: fields.hips ? Number(fields.hips) : undefined,
      arm: fields.arm ? Number(fields.arm) : undefined,
      thigh: fields.thigh ? Number(fields.thigh) : undefined,
      notes: fields.notes || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#242419] rounded-t-3xl border-t border-[#3a3a2a] px-4 pt-4 pb-8 safe-bottom max-h-[90vh] overflow-y-auto no-scrollbar w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-[#f0ede4]">{t.logMeasurements}</h2>
          <button onClick={onClose} className="text-[#9a9680] hover:text-[#f0ede4]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3">
          {METRICS.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <label className="text-sm text-[#9a9680] w-24 shrink-0">{MEASUREMENT_LABELS[key]}</label>
              <Input
                type="number"
                placeholder={key === 'weight' ? 'kg' : 'cm'}
                value={fields[key] ?? ''}
                onChange={(e) => set(key, e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
          <div className="flex items-center gap-3">
            <label className="text-sm text-[#9a9680] w-24 shrink-0">{t.notes}</label>
            <Input
              placeholder={t.optionalNotes}
              value={fields.notes ?? ''}
              onChange={(e) => set('notes', e.target.value)}
              className="flex-1"
            />
          </div>
        </div>

        <Button onClick={handleSave} disabled={saving} className="w-full mt-5">
          {saving ? t.saving : t.save}
        </Button>
      </div>
    </div>
  );
}

export function Measurements() {
  const { t } = useLang();
  const [selectedMetric, setSelectedMetric] = useState<MeasurementKey>('weight');
  const [showDrawer, setShowDrawer] = useState(false);
  const chartData = useLast30DaysMeasurements();
  const allMeasurements = useAllMeasurements();

  return (
    <div className="flex flex-col min-h-full pb-24">
      {showDrawer && <LogDrawer onClose={() => setShowDrawer(false)} t={t} />}

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-[#f0ede4]">{t.measurements}</h1>
        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#7cb87a] text-[#18180f] text-sm font-semibold active:bg-[#6aa368] hover:bg-[#8fce8d]"
        >
          <Plus className="w-4 h-4" /> {t.navLog}
        </button>
      </div>

      {/* Metric selector */}
      <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-1">
        {METRICS.map((m) => (
          <button
            key={m}
            onClick={() => setSelectedMetric(m)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selectedMetric === m
                ? 'bg-[#7cb87a] text-[#18180f]'
                : 'bg-[#2e2e22] text-[#9a9680] hover:text-[#c8c4b0]'
            }`}
          >
            {MEASUREMENT_LABELS[m]}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="mx-4 mt-4 p-4 rounded-2xl bg-[#242419] border border-[#3a3a2a]">
        <p className="text-xs font-medium text-[#9a9680] uppercase tracking-wide mb-3">
          {MEASUREMENT_LABELS[selectedMetric]} — {t.last30Days}
        </p>
        {chartData ? (
          <MeasurementChart measurements={chartData} metric={selectedMetric} />
        ) : (
          <div className="h-48 bg-[#2e2e22] animate-pulse rounded-xl" />
        )}
      </div>

      {/* Recent entries */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide mb-3">{t.recentLogs}</h2>
        {!allMeasurements ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-2xl bg-[#2e2e22] animate-pulse" />)}
          </div>
        ) : allMeasurements.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-[#5a5a44] text-sm">{t.noMeasurementsYet}</p>
            <button
              onClick={() => setShowDrawer(true)}
              className="mt-2 text-[#7cb87a] text-sm hover:text-[#8fce8d]"
            >
              {t.logFirstMeasurement}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {allMeasurements.map((m) => (
              <div key={m.id} className="rounded-2xl border border-[#3a3a2a] bg-[#242419] px-4 py-3">
                <p className="text-xs text-[#5a5a44] mb-1.5">{format(new Date(m.timestamp), 'EEEE, MMM d · h:mm a')}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {m.weight != null && <span className="text-[#c8c4b0]">{t.weight}: <span className="font-medium text-[#7cb87a]">{m.weight} kg</span></span>}
                  {m.waist != null && <span className="text-[#c8c4b0]">{t.waist}: {m.waist}cm</span>}
                  {m.chest != null && <span className="text-[#c8c4b0]">{t.chest}: {m.chest}cm</span>}
                  {m.hips != null && <span className="text-[#c8c4b0]">{t.hips}: {m.hips}cm</span>}
                  {(m.arm ?? m.leftArm) != null && <span className="text-[#c8c4b0]">{t.arm}: {m.arm ?? m.leftArm}cm</span>}
                  {m.rightArm != null && m.arm == null && m.leftArm == null && <span className="text-[#c8c4b0]">{t.arm}: {m.rightArm}cm</span>}
                  {(m.thigh ?? m.leftThigh) != null && <span className="text-[#c8c4b0]">{t.thigh}: {m.thigh ?? m.leftThigh}cm</span>}
                  {m.rightThigh != null && m.thigh == null && m.leftThigh == null && <span className="text-[#c8c4b0]">{t.thigh}: {m.rightThigh}cm</span>}
                </div>
                {m.notes && <p className="mt-1.5 text-xs text-[#9a9680] italic">{m.notes}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
