import { format, startOfWeek, endOfWeek, eachDayOfInterval, subWeeks, addWeeks, subDays, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export const getTodayKey = (): string => format(new Date(), 'yyyy-MM-dd');
export const getDateKey = (date: Date): string => format(date, 'yyyy-MM-dd');

export function getWeekKeys(weekOffset: number = 0): string[] {
  const base = weekOffset === 0 ? new Date() : weekOffset < 0 ? subWeeks(new Date(), Math.abs(weekOffset)) : addWeeks(new Date(), weekOffset);
  const start = startOfWeek(base, { weekStartsOn: 1 });
  const end = endOfWeek(base, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map(getDateKey);
}

export function getWeekLabel(weekOffset: number = 0): string {
  const base = weekOffset === 0 ? new Date() : weekOffset < 0 ? subWeeks(new Date(), Math.abs(weekOffset)) : addWeeks(new Date(), weekOffset);
  const start = startOfWeek(base, { weekStartsOn: 1 });
  const end = endOfWeek(base, { weekStartsOn: 1 });
  if (weekOffset === 0) return 'This week';
  if (weekOffset === -1) return 'Last week';
  return `${format(start, 'MMM d')} – ${format(end, 'MMM d')}`;
}

export function formatDayLabel(dayKey: string): string {
  const date = new Date(dayKey + 'T00:00:00');
  return format(date, 'EEEE, MMM d');
}

export function formatShortDay(dayKey: string): string {
  const date = new Date(dayKey + 'T00:00:00');
  return format(date, 'EEE');
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function getLast30DayKeys(): string[] {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(getDateKey(d));
  }
  return days;
}

export function getLastNDayKeys(n: number): string[] {
  const today = new Date();
  return Array.from({ length: n }, (_, i) => {
    const d = subDays(today, n - 1 - i);
    return format(d, 'yyyy-MM-dd');
  });
}

export function getLast12MonthBuckets(): { label: string; startKey: string; endKey: string }[] {
  const today = new Date();
  return Array.from({ length: 12 }, (_, i) => {
    const d = subMonths(startOfMonth(today), 11 - i);
    return {
      label: format(d, 'MMM'),
      startKey: format(startOfMonth(d), 'yyyy-MM-dd'),
      endKey: format(endOfMonth(d), 'yyyy-MM-dd'),
    };
  });
}
