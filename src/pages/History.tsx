import { useState, useMemo, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Pencil, Trash2 } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { getWeekKeys, getWeekLabel, formatDayLabel, formatShortDay, getTodayKey } from '../lib/date';
import { addMacros, zeroMacros, fmt } from '../lib/nutrition';
import { useGoals } from '../hooks/useGoals';
import { useLang } from '../store/langContext';
import type { MealEntry, MacroNutrients } from '../types';
import type { Translations } from '../lib/i18n';
import { EditMealDialog } from '../components/EditMealDialog';

function HistoryMealRow({ meal, t }: { meal: MealEntry; t: Translations }) {
  const [showActions, setShowActions] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleDelete() {
    if (!meal.id) return;
    setDeleting(true);
    setTimeout(() => db.meals.delete(meal.id!), 280);
  }
  function handlePointerDown() {
    longPressTimer.current = setTimeout(() => setShowActions(true), 300);
  }
  function handlePointerUp() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
  }
  function handlePointerLeave() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    setShowActions(false);
  }

  return (
    <>
      <div
        className={`group relative flex justify-between items-center text-sm py-1.5 border-b border-[#3a3a2a] last:border-0 ${deleting ? 'animate-collapse' : ''}`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e) => e.preventDefault()}
      >
        <p className="text-[#c8c4b0] truncate flex-1">{meal.rawInput}</p>
        <div className="flex items-center gap-1 ml-3 shrink-0">
          <div
            className={`flex items-center gap-0.5 transition-opacity duration-150 opacity-0 group-hover:opacity-100 ${showActions ? '!opacity-100' : ''}`}
          >
            <button
              onClick={() => setEditOpen(true)}
              className="p-1 rounded text-[#9a9680] hover:text-[#f0ede4]"
              aria-label="Edit meal"
            >
              <Pencil className="w-3 h-3" />
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded text-[#9a9680] hover:text-[#c17a5a]"
              aria-label="Delete meal"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
          <span className="text-[#9a9680] text-xs">{fmt(meal.totalMacros.calories, true)} kcal</span>
        </div>
      </div>
      <EditMealDialog meal={meal} open={editOpen} onClose={() => setEditOpen(false)} t={t} />
    </>
  );
}

function DaySummary({ dayKey, meals, goals, t, animationDelay = 0 }: { dayKey: string; meals: MealEntry[]; goals: MacroNutrients; t: Translations; animationDelay?: number }) {
  const [expanded, setExpanded] = useState(false);
  const isToday = dayKey === getTodayKey();

  const totals = useMemo(
    () => meals.reduce((acc, m) => addMacros(acc, m.totalMacros), zeroMacros()),
    [meals]
  );

  if (meals.length === 0) {
    return (
      <div
        className="rounded-2xl border border-[#3a3a2a] bg-[#242419] px-4 py-3 flex justify-between items-center opacity-40 animate-fade-in-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div>
          <p className="text-sm font-medium text-[#9a9680]">{formatDayLabel(dayKey)}{isToday ? ` (${t.today})` : ''}</p>
        </div>
        <p className="text-xs text-[#5a5a44]">{t.noDataLabel}</p>
      </div>
    );
  }

  const caloriesPct = goals.calories > 0 ? Math.round((totals.calories / goals.calories) * 100) : 0;

  return (
    <div
      className="rounded-2xl border border-[#3a3a2a] bg-[#242419] overflow-hidden animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-left active:bg-[#2e2e22]"
        onClick={() => setExpanded((e) => !e)}
      >
        <div>
          <p className="text-sm font-semibold text-[#c8c4b0]">
            {formatDayLabel(dayKey)}{isToday ? <span className="ml-2 text-xs text-[#7cb87a] font-normal">{t.today}</span> : ''}
          </p>
          <p className="text-xs text-[#5a5a44] mt-0.5">{meals.length} {meals.length !== 1 ? t.meals : t.meal}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-[#d4a24c]">{fmt(totals.calories, true)} kcal</p>
            <p className="text-xs text-[#5a5a44]">{caloriesPct}{t.ofGoal}</p>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-[#9a9680]" /> : <ChevronDown className="w-4 h-4 text-[#9a9680]" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 border-t border-[#3a3a2a] pt-3 space-y-2">
          <div className="flex gap-4 text-sm mb-3">
            <span className="text-[#9a9680]">P: <span className="text-[#7cb87a] font-medium">{fmt(totals.protein)}g</span></span>
            <span className="text-[#9a9680]">C: <span className="text-[#d4a24c] font-medium">{fmt(totals.carbs)}g</span></span>
            <span className="text-[#9a9680]">F: <span className="text-[#c17a5a] font-medium">{fmt(totals.fat)}g</span></span>
          </div>
          {meals.map((meal) => (
            <HistoryMealRow key={meal.id ?? meal.rawInput} meal={meal} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function WeekSparkline({ dayKeys, mealsByDay, calorieGoal }: {
  dayKeys: string[];
  mealsByDay: Record<string, MealEntry[]>;
  calorieGoal: number;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(t); }, []);

  const values = dayKeys.map((k) => {
    const meals = mealsByDay[k] ?? [];
    return meals.reduce((s, m) => s + m.totalMacros.calories, 0);
  });
  const maxVal = Math.max(calorieGoal, ...values, 1);

  return (
    <div className="flex items-end gap-1 h-16 px-1">
      {dayKeys.map((k, i) => {
        const val = values[i];
        const pct = (val / maxVal) * 100;
        const isToday = k === getTodayKey();
        const isGoalMet = calorieGoal > 0 && val >= calorieGoal * 0.8 && val <= calorieGoal * 1.1;
        return (
          <div key={k} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-end" style={{ height: '48px' }}>
              <div
                className={`w-full rounded-t ${isToday ? 'ring-1 ring-[#d4a24c]/60' : ''} ${isGoalMet && val > 0 ? 'glow-green' : ''}`}
                style={{
                  height: mounted ? `${Math.max(pct, val > 0 ? 8 : 0)}%` : '0%',
                  backgroundColor: val === 0 ? '#2e2e22' : isGoalMet ? '#7cb87a' : '#d4a24c',
                  transition: `height 0.5s cubic-bezier(0.4, 0, 0.2, 1) ${i * 40}ms`,
                }}
              />
            </div>
            <span className="text-[10px] text-[#5a5a44]">{formatShortDay(k)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function HistoryContent() {
  const { t } = useLang();
  const [weekOffset, setWeekOffset] = useState(0);
  const goals = useGoals();
  const weekKeys = useMemo(() => getWeekKeys(weekOffset), [weekOffset]);

  const meals = useLiveQuery(
    () => db.meals.where('dayKey').anyOf(weekKeys).toArray(),
    [weekKeys]
  );

  const mealsByDay = useMemo(() => {
    const map: Record<string, MealEntry[]> = {};
    weekKeys.forEach((k) => { map[k] = []; });
    meals?.forEach((m) => { map[m.dayKey]?.push(m); });
    return map;
  }, [meals, weekKeys]);

  return (
    <div className="flex flex-col pb-4">
      {/* Week selector */}
      <div className="flex items-center justify-between px-4 mb-4">
        <button
          onClick={() => setWeekOffset((w) => w - 1)}
          className="w-9 h-9 rounded-full bg-[#2e2e22] flex items-center justify-center text-[#9a9680] hover:text-[#f0ede4]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-sm font-medium text-[#c8c4b0]">{getWeekLabel(weekOffset)}</span>
        <button
          onClick={() => setWeekOffset((w) => Math.min(w + 1, 0))}
          disabled={weekOffset >= 0}
          className="w-9 h-9 rounded-full bg-[#2e2e22] flex items-center justify-center text-[#9a9680] hover:text-[#f0ede4] disabled:opacity-30"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Sparkline */}
      <div className="mx-4 mb-4 p-4 rounded-2xl bg-[#242419] border border-[#3a3a2a]">
        {meals ? (
          <WeekSparkline dayKeys={weekKeys} mealsByDay={mealsByDay} calorieGoal={goals.calories} />
        ) : (
          <div className="h-16 bg-[#2e2e22] animate-pulse rounded" />
        )}
      </div>

      {/* Day summaries */}
      <div className="px-4 space-y-3">
        {weekKeys
          .slice()
          .reverse()
          .map((dayKey, i) => (
            <DaySummary
              key={dayKey}
              dayKey={dayKey}
              meals={mealsByDay[dayKey] ?? []}
              goals={goals}
              t={t}
              animationDelay={i * 60}
            />
          ))}
      </div>
    </div>
  );
}

export function History() {
  const { t } = useLang();
  return (
    <div className="flex flex-col min-h-full pb-24">
      {/* Header */}
      <div className="px-4 pt-12 pb-4">
        <h1 className="text-xl font-bold text-[#f0ede4]">{t.history}</h1>
      </div>
      <HistoryContent />
    </div>
  );
}
