import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { db } from '../db';
import type { MealEntry } from '../types';
import { formatTime } from '../lib/date';

interface MealCardProps {
  meal: MealEntry;
  animationDelay?: number;
}

const CONFIDENCE_COLOR = {
  high: 'text-[#7cb87a]',
  medium: 'text-[#d4a24c]',
  low: 'text-[#c17a5a]',
  manual: 'text-[#9a9680]',
};

export function MealCard({ meal, animationDelay = 0 }: MealCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function handleDelete() {
    if (!meal.id) return;
    setDeleting(true);
    setTimeout(() => db.meals.delete(meal.id!), 280);
  }

  return (
    <div
      className={`rounded-2xl border border-[#3a3a2a] bg-[#242419] overflow-hidden card-hover animate-fade-in-up ${deleting ? 'animate-collapse' : ''}`}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      <button
        className="w-full flex items-center justify-between p-4 text-left active:bg-[#2e2e22]"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-[#f0ede4] truncate">{meal.rawInput}</p>
          <p className="text-xs text-[#5a5a44] mt-0.5">{formatTime(new Date(meal.timestamp))}</p>
        </div>
        <div className="flex items-center gap-3 ml-3 shrink-0">
          <span className="text-sm font-semibold text-[#d4a24c]">{meal.totalMacros.calories} kcal</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-[#9a9680]" /> : <ChevronDown className="w-4 h-4 text-[#9a9680]" />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-[#3a3a2a]">
          {/* Food items */}
          <div className="space-y-2 pt-3">
            {meal.foods.map((food, i) => (
              <div key={i} className="flex justify-between items-start text-sm">
                <div className="flex-1">
                  <p className="text-[#c8c4b0]">{food.name}</p>
                  <p className="text-xs text-[#5a5a44]">{food.quantity}</p>
                </div>
                <div className="text-right text-xs text-[#9a9680] shrink-0 ml-3">
                  <p>{food.macros.calories} kcal</p>
                  <p>P:{food.macros.protein}g F:{food.macros.fat}g C:{food.macros.carbs}g</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals row */}
          <div className="flex justify-between text-xs text-[#9a9680] border-t border-[#3a3a2a] pt-2">
            <div className="flex gap-3">
              <span>P: <span className="text-[#c8c4b0]">{meal.totalMacros.protein}g</span></span>
              <span>F: <span className="text-[#c8c4b0]">{meal.totalMacros.fat}g</span></span>
              <span>C: <span className="text-[#c8c4b0]">{meal.totalMacros.carbs}g</span></span>
            </div>
            <span className={CONFIDENCE_COLOR[meal.llmConfidence]}>
              {meal.llmConfidence === 'manual' ? 'manual' : `${meal.llmConfidence} confidence`}
            </span>
          </div>

          {meal.notes && (
            <p className="text-xs text-[#9a9680] italic">{meal.notes}</p>
          )}

          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-1.5 text-xs text-[#c17a5a] hover:text-[#e09070] disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete meal
          </button>
        </div>
      )}
    </div>
  );
}
