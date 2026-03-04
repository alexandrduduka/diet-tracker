import { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
} from 'recharts';
import { useDailyNutritionHistory, useMonthlyNutritionHistory } from '../hooks/useNutritionHistory';
import { useMeasurementsForDayKeys } from '../hooks/useMeasurements';
import { useGoals } from '../hooks/useGoals';
import { getLastNDayKeys, getLast12MonthBuckets } from '../lib/date';
import { format } from 'date-fns';
import type { MeasurementKey } from '../types';
import { MEASUREMENT_LABELS } from '../types';
import { useLang } from '../store/langContext';

type Tab = 'nutrition' | 'body';
type Period = 'daily' | 'monthly';

const METRICS: MeasurementKey[] = ['weight', 'waist', 'chest', 'hips', 'leftArm', 'rightArm', 'leftThigh', 'rightThigh'];

const CHART_STYLES = {
  grid: { strokeDasharray: '3 3', stroke: '#3a3a2a' },
  axis: { fill: '#9a9680', fontSize: 11 },
  tooltip: {
    contentStyle: {
      backgroundColor: '#242419',
      border: '1px solid #3a3a2a',
      borderRadius: '12px',
      padding: '8px 12px',
      fontSize: '12px',
    },
    labelStyle: { color: '#c8c4b0', fontWeight: 600, marginBottom: 4 },
    itemStyle: { color: '#9a9680' },
    cursor: { stroke: '#3a3a2a', strokeWidth: 1 },
  },
};

// Dummy data for placeholder charts
const DUMMY_CALORIES = Array.from({ length: 14 }, (_, i) => ({
  label: i % 3 === 0 ? `d${i + 1}` : '',
  calories: Math.round(1400 + Math.sin(i * 0.8) * 400 + Math.random() * 200),
}));

const DUMMY_MACROS = Array.from({ length: 14 }, (_, i) => ({
  label: i % 3 === 0 ? `d${i + 1}` : '',
  protein: Math.round(90 + Math.sin(i * 0.6) * 30),
  carbs: Math.round(180 + Math.cos(i * 0.7) * 50),
  fat: Math.round(55 + Math.sin(i * 0.9) * 20),
}));

const DUMMY_BODY = Array.from({ length: 14 }, (_, i) => ({
  label: i % 3 === 0 ? `d${i + 1}` : '',
  value: Math.round((72 + Math.sin(i * 0.4) * 1.5) * 10) / 10,
}));

function ChartPlaceholder({ height = 160, title, sub }: { height?: number; title: string; sub: string }) {
  return (
    <div className="relative" style={{ height }}>
      {/* Ghost chart rendered at low opacity */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={DUMMY_CALORIES} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="placeholderGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4a24c" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#d4a24c" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...CHART_STYLES.grid} />
            <XAxis dataKey="label" tick={CHART_STYLES.axis} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_STYLES.axis} axisLine={false} tickLine={false} width={40} />
            <Area type="monotone" dataKey="calories" stroke="#d4a24c" strokeWidth={2} fill="url(#placeholderGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-[#c8c4b0]">{title}</p>
        <p className="text-xs text-[#5a5a44] mt-1 text-center px-4">{sub}</p>
      </div>
    </div>
  );
}

function BodyChartPlaceholder({ height = 180, title, sub }: { height?: number; title: string; sub: string }) {
  return (
    <div className="relative" style={{ height }}>
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <ResponsiveContainer width="100%" height={height}>
          <AreaChart data={DUMMY_BODY} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="placeholderBodyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7cb87a" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7cb87a" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid {...CHART_STYLES.grid} />
            <XAxis dataKey="label" tick={CHART_STYLES.axis} axisLine={false} tickLine={false} />
            <YAxis tick={CHART_STYLES.axis} axisLine={false} tickLine={false} width={40} domain={['auto', 'auto']} />
            <Area type="monotone" dataKey="value" stroke="#7cb87a" strokeWidth={2} fill="url(#placeholderBodyGrad)" dot={{ fill: '#7cb87a', r: 3, strokeWidth: 0 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-[#c8c4b0]">{title}</p>
        <p className="text-xs text-[#5a5a44] mt-1 text-center px-4">{sub}</p>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mx-4 rounded-2xl bg-[#242419] border border-[#3a3a2a] overflow-hidden">
      <p className="px-4 pt-4 pb-3 text-xs font-semibold text-[#9a9680] uppercase tracking-wide border-b border-[#3a3a2a]">
        {title}
      </p>
      <div className="p-4">{children}</div>
    </div>
  );
}

// ─── Nutrition charts ────────────────────────────────────────────────────────

function CaloriesChart({
  data,
  goal,
  xKey,
  placeholder,
  placeholderSub,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  goal: number;
  xKey: string;
  placeholder: string;
  placeholderSub: string;
}) {
  const pointsWithData = data.filter((d) => (d.calories as number) > 0);
  if (pointsWithData.length < 2) {
    return <ChartPlaceholder title={placeholder} sub={placeholderSub} />;
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="calGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d4a24c" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#d4a24c" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_STYLES.grid} />
        <XAxis dataKey={xKey} tick={CHART_STYLES.axis} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={CHART_STYLES.axis} axisLine={false} tickLine={false} width={40} />
        <Tooltip {...CHART_STYLES.tooltip} formatter={(v: number | undefined) => [`${v ?? 0} kcal`, 'Calories']} />
        {goal > 0 && (
          <ReferenceLine
            y={goal}
            stroke="#d4a24c"
            strokeDasharray="4 4"
            strokeOpacity={0.5}
            label={{ value: 'Goal', fill: '#9a9680', fontSize: 10, position: 'insideTopRight' }}
          />
        )}
        <Area
          type="monotone"
          dataKey="calories"
          stroke="#d4a24c"
          strokeWidth={2}
          fill="url(#calGrad)"
          dot={false}
          activeDot={{ r: 4, fill: '#d4a24c', strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function MacrosChart({
  data,
  xKey,
  placeholder,
  placeholderSub,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any[];
  xKey: string;
  placeholder: string;
  placeholderSub: string;
}) {
  const pointsWithData = data.filter((d) => (d.protein as number) > 0 || (d.carbs as number) > 0 || (d.fat as number) > 0);
  if (pointsWithData.length < 2) {
    return (
      <div className="relative" style={{ height: 160 }}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={DUMMY_MACROS} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid {...CHART_STYLES.grid} />
              <XAxis dataKey="label" tick={CHART_STYLES.axis} axisLine={false} tickLine={false} />
              <YAxis tick={CHART_STYLES.axis} axisLine={false} tickLine={false} width={40} />
              <Line type="monotone" dataKey="protein" stroke="#7cb87a" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="carbs" stroke="#d4a24c" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="fat" stroke="#c17a5a" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-sm font-medium text-[#c8c4b0]">{placeholder}</p>
          <p className="text-xs text-[#5a5a44] mt-1 text-center px-4">{placeholderSub}</p>
        </div>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <CartesianGrid {...CHART_STYLES.grid} />
        <XAxis dataKey={xKey} tick={CHART_STYLES.axis} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis tick={CHART_STYLES.axis} axisLine={false} tickLine={false} width={40} />
        <Tooltip
          {...CHART_STYLES.tooltip}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: any, name: any) => [`${v ?? 0}g`, String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
        />
        <Legend
          wrapperStyle={{ paddingTop: 8 }}
          formatter={(value) => (
            <span style={{ color: '#9a9680', fontSize: 11 }}>
              {value.charAt(0).toUpperCase() + value.slice(1)}
            </span>
          )}
        />
        <Line type="monotone" dataKey="protein" stroke="#7cb87a" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="carbs" stroke="#d4a24c" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
        <Line type="monotone" dataKey="fat" stroke="#c17a5a" strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function NutritionDaily({ goals, t }: { goals: { calories: number }; t: ReturnType<typeof useLang>['t'] }) {
  const data = useDailyNutritionHistory(30);

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="h-40 rounded-xl bg-[#2e2e22] animate-pulse" />
        <div className="h-40 rounded-xl bg-[#2e2e22] animate-pulse" />
      </div>
    );
  }

  // Show only every Nth label on X axis for readability
  const chartData = data.map((d, i) => ({
    ...d,
    label: i % 5 === 0 || i === data.length - 1 ? d.label : '',
  }));

  return (
    <div className="space-y-4">
      <SectionCard title={t.caloriesLast30}>
        <CaloriesChart data={chartData} goal={goals.calories} xKey="label" placeholder={t.chartPlaceholder} placeholderSub={t.chartPlaceholderSub} />
      </SectionCard>
      <SectionCard title={t.macrosLast30}>
        <MacrosChart data={chartData} xKey="label" placeholder={t.chartPlaceholder} placeholderSub={t.chartPlaceholderSub} />
      </SectionCard>
    </div>
  );
}

function NutritionMonthly({ goals, t }: { goals: { calories: number }; t: ReturnType<typeof useLang>['t'] }) {
  const data = useMonthlyNutritionHistory();

  if (!data) {
    return (
      <div className="space-y-4">
        <div className="h-40 rounded-xl bg-[#2e2e22] animate-pulse" />
        <div className="h-40 rounded-xl bg-[#2e2e22] animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SectionCard title={t.avgCalories12m}>
        <CaloriesChart data={data} goal={goals.calories} xKey="label" placeholder={t.chartPlaceholder} placeholderSub={t.chartPlaceholderSub} />
      </SectionCard>
      <SectionCard title={t.avgMacros12m}>
        <MacrosChart data={data} xKey="label" placeholder={t.chartPlaceholder} placeholderSub={t.chartPlaceholderSub} />
      </SectionCard>
    </div>
  );
}

// ─── Body charts ─────────────────────────────────────────────────────────────

function BodyMetricChart({
  data,
  metric,
  color,
  placeholder,
  placeholderSub,
}: {
  data: { label: string; value: number | null }[];
  metric: MeasurementKey;
  color: string;
  placeholder: string;
  placeholderSub: string;
}) {
  const pointsWithData = data.filter((d) => d.value !== null && d.value > 0);
  if (pointsWithData.length < 2) {
    return <BodyChartPlaceholder height={180} title={placeholder} sub={placeholderSub} />;
  }

  const unit = metric === 'weight' ? 'kg' : 'cm';
  const gradId = `bodyGrad-${metric}`;

  return (
    <ResponsiveContainer width="100%" height={180}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid {...CHART_STYLES.grid} />
        <XAxis dataKey="label" tick={CHART_STYLES.axis} axisLine={false} tickLine={false} interval="preserveStartEnd" />
        <YAxis
          tick={CHART_STYLES.axis}
          axisLine={false}
          tickLine={false}
          width={40}
          domain={['auto', 'auto']}
        />
        <Tooltip
          {...CHART_STYLES.tooltip}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          formatter={(v: any) => v != null ? [`${v} ${unit}`, MEASUREMENT_LABELS[metric]] : ['—', MEASUREMENT_LABELS[metric]]}
        />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          fill={`url(#${gradId})`}
          dot={{ fill: color, r: 3, strokeWidth: 0 }}
          activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
          connectNulls={true}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function BodyDaily({ metric, t }: { metric: MeasurementKey; t: ReturnType<typeof useLang>['t'] }) {
  const dayKeys = useMemo(() => getLastNDayKeys(30), []);
  const measurements = useMeasurementsForDayKeys(dayKeys);

  const chartData = useMemo(() => {
    if (!measurements) return null;
    // For each day, take the latest measurement
    const byDay: Record<string, number | null> = {};
    for (const key of dayKeys) byDay[key] = null;
    for (const m of measurements) {
      const val = m[metric];
      if (val != null) byDay[m.dayKey] = val;
    }
    return dayKeys.map((key, i) => ({
      label: i % 5 === 0 || i === dayKeys.length - 1 ? format(new Date(key + 'T00:00:00'), 'MMM d') : '',
      value: byDay[key],
    }));
  }, [measurements, dayKeys, metric]);

  if (!chartData) return <div className="h-48 rounded-xl bg-[#2e2e22] animate-pulse mx-4" />;

  return (
    <SectionCard title={`${MEASUREMENT_LABELS[metric]} — ${t.last30Days}`}>
      <BodyMetricChart data={chartData} metric={metric} color="#7cb87a" placeholder={t.chartPlaceholder} placeholderSub={t.chartPlaceholderSub} />
    </SectionCard>
  );
}

function BodyMonthly({ metric, t }: { metric: MeasurementKey; t: ReturnType<typeof useLang>['t'] }) {
  const buckets = useMemo(() => getLast12MonthBuckets(), []);
  const allDayKeys = useMemo(
    () =>
      buckets.flatMap((b) => {
        const keys: string[] = [];
        const start = new Date(b.startKey + 'T00:00:00');
        const end = new Date(b.endKey + 'T00:00:00');
        const d = new Date(start);
        while (d <= end) {
          keys.push(format(d, 'yyyy-MM-dd'));
          d.setDate(d.getDate() + 1);
        }
        return keys;
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const measurements = useMeasurementsForDayKeys(allDayKeys);

  const chartData = useMemo(() => {
    if (!measurements) return null;
    return buckets.map((b) => {
      const monthMeasurements = measurements.filter(
        (m) => m.dayKey >= b.startKey && m.dayKey <= b.endKey
      );
      const values = monthMeasurements.map((m) => m[metric]).filter((v): v is number => v != null);
      const avg = values.length > 0 ? Math.round((values.reduce((s, v) => s + v, 0) / values.length) * 10) / 10 : null;
      return { label: b.label, value: avg };
    });
  }, [measurements, buckets, metric]);

  if (!chartData) return <div className="h-48 rounded-xl bg-[#2e2e22] animate-pulse mx-4" />;

  return (
    <SectionCard title={`${MEASUREMENT_LABELS[metric]} avg — ${t.last12Months}`}>
      <BodyMetricChart data={chartData} metric={metric} color="#7cb87a" placeholder={t.chartPlaceholder} placeholderSub={t.chartPlaceholderSub} />
    </SectionCard>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export function Analytics() {
  const { t } = useLang();
  const [tab, setTab] = useState<Tab>('nutrition');
  const [period, setPeriod] = useState<Period>('daily');
  const [bodyMetric, setBodyMetric] = useState<MeasurementKey>('weight');
  const goals = useGoals();

  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4 border-b border-[#3a3a2a]">
        <h1 className="text-xl font-bold text-[#f0ede4]">{t.analytics}</h1>
      </div>

      {/* Tab selector */}
      <div className="flex gap-2 px-4 pt-4 pb-2">
        {(['nutrition', 'body'] as Tab[]).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === tabKey
                ? 'bg-[#7cb87a] text-[#18180f]'
                : 'bg-[#2e2e22] text-[#9a9680] hover:text-[#c8c4b0]'
            }`}
          >
            {tabKey === 'nutrition' ? t.nutrition : t.body}
          </button>
        ))}
      </div>

      {/* Period toggle */}
      <div className="flex gap-2 px-4 pb-4">
        {(['daily', 'monthly'] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
              period === p
                ? 'bg-[#3a3a2a] text-[#f0ede4]'
                : 'text-[#5a5a44] hover:text-[#9a9680]'
            }`}
          >
            {p === 'daily' ? t.daily30d : t.monthly12m}
          </button>
        ))}
      </div>

      {/* Body metric selector (only when on body tab) */}
      {tab === 'body' && (
        <div className="flex gap-2 px-4 overflow-x-auto no-scrollbar pb-3">
          {METRICS.map((m) => (
            <button
              key={m}
              onClick={() => setBodyMetric(m)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                bodyMetric === m
                  ? 'bg-[#7cb87a] text-[#18180f]'
                  : 'bg-[#2e2e22] text-[#9a9680] hover:text-[#c8c4b0]'
              }`}
            >
              {MEASUREMENT_LABELS[m]}
            </button>
          ))}
        </div>
      )}

      {/* Charts */}
      <div className="space-y-4">
        {tab === 'nutrition' && period === 'daily' && <NutritionDaily goals={goals} t={t} />}
        {tab === 'nutrition' && period === 'monthly' && <NutritionMonthly goals={goals} t={t} />}
        {tab === 'body' && period === 'daily' && <BodyDaily metric={bodyMetric} t={t} />}
        {tab === 'body' && period === 'monthly' && <BodyMonthly metric={bodyMetric} t={t} />}
      </div>
    </div>
  );
}
