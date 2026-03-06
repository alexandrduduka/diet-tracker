import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Pencil } from 'lucide-react';
import { db } from '../db';
import type { MealEntry } from '../types';
import { formatTime } from '../lib/date';
import { fmt } from '../lib/nutrition';
import { useLang } from '../store/langContext';
import { EditMealDialog } from './EditMealDialog';
import { Button } from './ui/button';

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
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  function handleDeleteConfirmed() {
    if (!meal.id) return;
    setShowDeleteConfirm(false);
    setDeleting(true);
    setTimeout(() => db.meals.delete(meal.id!), 280);
  }

  return (
    <>
      <div
        className={`group relative rounded-2xl border border-[#3a3a2a] bg-[#242419] overflow-hidden card-hover animate-fade-in-up ${deleting ? 'animate-collapse' : ''}`}
        style={{ animationDelay: `${animationDelay}ms` }}
        onContextMenu={(e) => e.preventDefault()}
      >
        <button
          className="w-full flex items-center justify-between p-4 text-left active:bg-[#2e2e22]"
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#f0ede4] truncate">{meal.rawInput}</p>
            <p className="text-xs text-[#5a5a44] mt-0.5">{formatTime(new Date(meal.timestamp))}</p>
          </div>
          <div className="flex items-center gap-2 ml-3 shrink-0">
            <span className="text-sm font-semibold text-[#d4a24c]">{fmt(meal.totalMacros.calories, true)} kcal</span>

            {/* Edit/Delete — always visible */}
            <div
              className="flex items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setEditOpen(true)}
                className="p-1.5 rounded-lg text-[#9a9680] hover:text-[#f0ede4] hover:bg-[#3a3a2a] active:bg-[#3a3a2a]"
                aria-label="Edit meal"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-1.5 rounded-lg text-[#9a9680] hover:text-[#c17a5a] hover:bg-[#3a3a2a] active:bg-[#3a3a2a]"
                aria-label="Delete meal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

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
                    <p>{fmt(food.macros.calories, true)} kcal</p>
                    <p>P:{fmt(food.macros.protein)}g F:{fmt(food.macros.fat)}g C:{fmt(food.macros.carbs)}g</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals row */}
            <div className="flex justify-between text-xs text-[#9a9680] border-t border-[#3a3a2a] pt-2">
              <div className="flex gap-3">
                <span>P: <span className="text-[#c8c4b0]">{fmt(meal.totalMacros.protein)}g</span></span>
                <span>F: <span className="text-[#c8c4b0]">{fmt(meal.totalMacros.fat)}g</span></span>
                <span>C: <span className="text-[#c8c4b0]">{fmt(meal.totalMacros.carbs)}g</span></span>
              </div>
              <span className={CONFIDENCE_COLOR[meal.llmConfidence]}>
                {meal.llmConfidence === 'manual' ? 'manual' : `${meal.llmConfidence} confidence`}
              </span>
            </div>

            {meal.notes && (
              <p className="text-xs text-[#9a9680] italic">{meal.notes}</p>
            )}
          </div>
        )}

        <EditMealDialog meal={meal} open={editOpen} onClose={() => setEditOpen(false)} t={t} />
      </div>

      {/* Delete confirmation dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center px-6">
          <div className="bg-[#2e2e22] border border-[#3a3a2a] rounded-2xl p-5 w-full max-w-sm space-y-4">
            <p className="text-[#f0ede4] font-medium">{t.deleteMealConfirm}</p>
            <p className="text-sm text-[#9a9680] truncate">{meal.rawInput}</p>
            <div className="flex gap-3">
              <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                {t.cancel}
              </Button>
              <Button size="sm" onClick={handleDeleteConfirmed} className="flex-1 bg-[#c17a5a] hover:bg-[#d4895e] border-[#c17a5a]">
                {t.delete}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
