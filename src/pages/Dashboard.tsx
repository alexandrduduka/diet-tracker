import { useMemo, useState, useRef } from 'react';
import { format, subDays } from 'date-fns';
import { Plus, Settings, Ruler, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useMealsForDay } from '../hooks/useMealsForDay';
import { useGoals } from '../hooks/useGoals';
import { useAllMeasurements } from '../hooks/useMeasurements';
import { addMacros, zeroMacros } from '../lib/nutrition';
import { getDateKey } from '../lib/date';
import { MacroRing } from '../components/MacroRing';
import { MacroBar } from '../components/MacroBar';
import { MealCard } from '../components/MealCard';
import { OfflineBanner } from '../components/OfflineBanner';
import { useLang } from '../store/langContext';
import { Hotspot } from '../components/Hotspot';
import { PwaInstallBanner } from '../components/PwaInstallBanner';

export function Dashboard() {
  const { t } = useLang();
  const goals = useGoals();
  const navigate = useNavigate();
  const allMeasurements = useAllMeasurements();
  const [nudgeDismissed, setNudgeDismissed] = useState(() =>
    sessionStorage.getItem('dtk_body_nudge_dismissed') === '1'
  );
  const [dayOffset, setDayOffset] = useState(0); // 0 = today, -1 = yesterday, etc.

  const selectedDate = subDays(new Date(), -dayOffset);
  const dayKey = getDateKey(selectedDate);
  const isToday = dayOffset === 0;

  const meals = useMealsForDay(dayKey);

  // Touch swipe tracking
  const touchStartX = useRef<number | null>(null);

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(delta) < 60) return;
    if (delta < 0) {
      // swipe left = go further back
      setDayOffset((o) => o - 1);
    } else {
      // swipe right = go forward (but not past today)
      setDayOffset((o) => Math.min(o + 1, 0));
    }
  }

  const totals = useMemo(() => {
    if (!meals?.length) return zeroMacros();
    return meals.reduce((acc, meal) => addMacros(acc, meal.totalMacros), zeroMacros());
  }, [meals]);

  const showBodyNudge = useMemo(() => {
    if (!isToday || nudgeDismissed || allMeasurements === undefined) return false;
    if (allMeasurements.length === 0) return true;
    const latest = allMeasurements[0];
    const diffDays = (Date.now() - new Date(latest.timestamp).getTime()) / (1000 * 86400);
    return diffDays > 14;
  }, [allMeasurements, nudgeDismissed, isToday]);

  function dismissNudge() {
    sessionStorage.setItem('dtk_body_nudge_dismissed', '1');
    setNudgeDismissed(true);
  }

  const dateLabel = isToday
    ? format(new Date(), 'EEEE, MMMM d')
    : format(selectedDate, 'EEEE, MMMM d');

  return (
    <div
      className="flex flex-col min-h-full pb-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <OfflineBanner />

      {/* PWA install nudge */}
      <PwaInstallBanner />

      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-12 pb-4">
        <div className="flex-1 min-w-0">
          {/* Date navigation row */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setDayOffset((o) => o - 1)}
              aria-label="Previous day"
              className="p-1 rounded-lg text-[#5a5a44] hover:text-[#9a9680] hover:bg-[#2e2e22] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-[#f0ede4]">
                  {isToday ? t.today : format(selectedDate, 'MMMM d')}
                </h1>
                {!isToday && (
                  <button
                    onClick={() => setDayOffset(0)}
                    className="text-xs text-[#7cb87a] hover:text-[#8fce8d] font-medium px-2 py-0.5 rounded-full bg-[#7cb87a]/10 hover:bg-[#7cb87a]/20 transition-colors"
                  >
                    {t.today}
                  </button>
                )}
              </div>
              <p className="text-sm text-[#9a9680]">{dateLabel}</p>
            </div>
            <button
              onClick={() => setDayOffset((o) => Math.min(o + 1, 0))}
              aria-label="Next day"
              disabled={isToday}
              className="p-1 rounded-lg text-[#5a5a44] hover:text-[#9a9680] hover:bg-[#2e2e22] transition-colors disabled:opacity-30 disabled:cursor-default"
            >
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate('/settings')}
          aria-label="Open settings"
          className="w-10 h-10 rounded-full bg-[#2e2e22] flex items-center justify-center text-[#9a9680] hover:text-[#f0ede4] hover:bg-[#3a3a2a] ml-2 shrink-0"
        >
          <Settings className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Body nudge banner */}
      {showBodyNudge && (
        <div className="mx-4 mb-3 flex items-center gap-3 bg-[#2a2a1a] border border-[#4a4a28] rounded-xl px-4 py-3">
          <Ruler className="w-4 h-4 text-[#d4a24c] shrink-0" aria-hidden="true" />
          <p className="flex-1 text-xs text-[#c8c4b0]">{t.bodyNudgeText}</p>
          <NavLink to="/measurements" className="text-xs text-[#d4a24c] font-medium shrink-0 hover:text-[#e8b85e]">{t.bodyNudgeAction}</NavLink>
          <button onClick={dismissNudge} className="text-[#5a5a44] hover:text-[#9a9680] ml-1" aria-label="Dismiss">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {/* Calorie ring */}
      <div className="flex justify-center py-2">
        <MacroRing
          value={totals.calories}
          goal={goals.calories}
          label={t.calories}
          unit="kcal"
          size={180}
          strokeWidth={16}
          color="#d4a24c"
        />
      </div>

      {/* Macro bars */}
      <div className="px-4 mt-4 space-y-3">
        <MacroBar label={t.protein} value={totals.protein} goal={goals.protein} color="#7cb87a" animationDelay={80} />
        <MacroBar label={t.carbs} value={totals.carbs} goal={goals.carbs} color="#d4a24c" animationDelay={160} />
        <MacroBar label={t.fat} value={totals.fat} goal={goals.fat} color="#c17a5a" animationDelay={240} />
      </div>

      {/* Meals section */}
      <div className="px-4 mt-6">
        <h2 className="text-xs font-semibold text-[#9a9680] uppercase tracking-wide mb-3">
          {t.mealsToday} {meals?.length ? `(${meals.length})` : ''}
        </h2>

        {!meals ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 rounded-2xl bg-[#2e2e22] animate-pulse" />
            ))}
          </div>
        ) : meals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#5a5a44] text-sm">{t.noMealsYet}</p>
            {isToday && (
              <button
                onClick={() => navigate('/chat')}
                className="mt-3 text-[#7cb87a] text-sm font-medium hover:text-[#8fce8d]"
              >
                {t.logFirstMeal}
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {meals.map((meal, i) => (
              <MealCard key={meal.id} meal={meal} animationDelay={i * 60} />
            ))}
          </div>
        )}
      </div>

      {/* FAB — only shown for today */}
      {isToday && (
        <div className="sticky bottom-24 flex justify-end pr-4 mt-4">
          <Hotspot storageKey="dtk_hotspot_fab" label={t.hotspotFabLabel} tooltipSide="top" delay={800}>
            <button
              onClick={() => navigate('/chat')}
              aria-label="Log a meal"
              className="w-14 h-14 rounded-full bg-[#7cb87a] shadow-lg shadow-[#7cb87a]/30 flex items-center justify-center active:scale-95 transition-transform hover:bg-[#8fce8d] relative"
            >
              {meals?.length === 0 && (
                <span className="absolute inset-0 rounded-full bg-[#7cb87a]/40 animate-ping" />
              )}
              <Plus className="w-6 h-6 text-[#18180f] relative z-10" aria-hidden="true" />
            </button>
          </Hotspot>
        </div>
      )}
    </div>
  );
}
