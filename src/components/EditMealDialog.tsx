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
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!meal.id || !rawInput.trim()) return;
    setSaving(true);
    await db.meals.update(meal.id, {
      rawInput: rawInput.trim(),
      notes: notes.trim() || undefined,
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
