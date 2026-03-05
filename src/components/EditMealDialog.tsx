import { useState } from 'react';
import { db } from '../db';
import type { MealEntry } from '../types';
import type { Translations } from '../lib/i18n';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface EditMealDialogProps {
  meal: MealEntry;
  open: boolean;
  onClose: () => void;
  t: Translations;
}

export function EditMealDialog({ meal, open, onClose, t }: EditMealDialogProps) {
  const [rawInput, setRawInput] = useState(meal.rawInput);
  const [notes, setNotes] = useState(meal.notes ?? '');
  const [calories, setCalories] = useState(String(meal.totalMacros.calories));
  const [protein, setProtein] = useState(String(meal.totalMacros.protein));
  const [carbs, setCarbs] = useState(String(meal.totalMacros.carbs));
  const [fat, setFat] = useState(String(meal.totalMacros.fat));
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!meal.id || !rawInput.trim()) return;
    setSaving(true);
    await db.meals.update(meal.id, {
      rawInput: rawInput.trim(),
      notes: notes.trim() || undefined,
      totalMacros: {
        calories: Number(calories) || 0,
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      },
    });
    setSaving(false);
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t.editMeal}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <label className="text-xs text-[#9a9680]">{t.mealDescription}</label>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-[#3a3a2a] bg-[#2e2e22] px-3 py-2 text-sm text-[#f0ede4] placeholder:text-[#5a5a44] focus:outline-none focus:ring-2 focus:ring-[#7cb87a]/60 resize-none"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#9a9680]">{t.nutrients}</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-[#5a5a44] uppercase tracking-wide">{t.calories}</label>
                <Input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#7cb87a] uppercase tracking-wide">{t.protein} (g)</label>
                <Input
                  type="number"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#d4a24c] uppercase tracking-wide">{t.carbs} (g)</label>
                <Input
                  type="number"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-[#c17a5a] uppercase tracking-wide">{t.fat} (g)</label>
                <Input
                  type="number"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-[#9a9680]">{t.notes}</label>
            <Input value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t.optionalNotes} />
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1" onClick={onClose}>{t.cancel}</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving || !rawInput.trim()}>{t.save}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
