import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import {
  getTodayKey,
  getDateKey,
  getWeekKeys,
  getLast30DayKeys,
  getLastNDayKeys,
  getLast12MonthBuckets,
  formatDayLabel,
  formatShortDay,
} from './date';

// Pin date to a known Wednesday for deterministic tests
const FIXED_DATE = new Date('2026-03-04T12:00:00');

beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(FIXED_DATE);
});

afterAll(() => {
  vi.useRealTimers();
});

describe('getTodayKey', () => {
  it('returns today as yyyy-MM-dd', () => {
    expect(getTodayKey()).toBe('2026-03-04');
  });
});

describe('getDateKey', () => {
  it('formats a Date to yyyy-MM-dd', () => {
    expect(getDateKey(new Date('2025-12-31T00:00:00'))).toBe('2025-12-31');
  });
});

describe('getWeekKeys', () => {
  it('returns 7 keys for offset 0', () => {
    expect(getWeekKeys(0)).toHaveLength(7);
  });

  it('week starts on Monday', () => {
    const keys = getWeekKeys(0);
    // 2026-03-04 is Wednesday; week should start 2026-03-02 (Mon)
    expect(keys[0]).toBe('2026-03-02');
  });

  it('week ends on Sunday', () => {
    const keys = getWeekKeys(0);
    expect(keys[6]).toBe('2026-03-08');
  });

  it('offset -1 gives previous week', () => {
    const keys = getWeekKeys(-1);
    expect(keys[0]).toBe('2026-02-23');
    expect(keys[6]).toBe('2026-03-01');
  });
});

describe('getLast30DayKeys', () => {
  it('returns exactly 30 keys', () => {
    expect(getLast30DayKeys()).toHaveLength(30);
  });

  it('last key is today', () => {
    const keys = getLast30DayKeys();
    expect(keys[keys.length - 1]).toBe('2026-03-04');
  });

  it('first key is 29 days ago', () => {
    const keys = getLast30DayKeys();
    expect(keys[0]).toBe('2026-02-03');
  });
});

describe('getLastNDayKeys', () => {
  it('returns N keys', () => {
    expect(getLastNDayKeys(7)).toHaveLength(7);
    expect(getLastNDayKeys(1)).toHaveLength(1);
  });

  it('last key is today', () => {
    const keys = getLastNDayKeys(5);
    expect(keys[keys.length - 1]).toBe('2026-03-04');
  });

  it('keys are in ascending order', () => {
    const keys = getLastNDayKeys(5);
    for (let i = 1; i < keys.length; i++) {
      expect(keys[i] > keys[i - 1]).toBe(true);
    }
  });
});

describe('getLast12MonthBuckets', () => {
  it('returns exactly 12 buckets', () => {
    expect(getLast12MonthBuckets()).toHaveLength(12);
  });

  it('last bucket is current month', () => {
    const buckets = getLast12MonthBuckets();
    const last = buckets[buckets.length - 1];
    expect(last.startKey).toBe('2026-03-01');
    expect(last.endKey).toBe('2026-03-31');
    expect(last.label).toBe('Mar');
  });

  it('first bucket is 11 months ago', () => {
    const buckets = getLast12MonthBuckets();
    const first = buckets[0];
    expect(first.startKey).toBe('2025-04-01');
    expect(first.label).toBe('Apr');
  });

  it('each bucket has label, startKey, endKey', () => {
    getLast12MonthBuckets().forEach((b) => {
      expect(b).toHaveProperty('label');
      expect(b).toHaveProperty('startKey');
      expect(b).toHaveProperty('endKey');
    });
  });
});

describe('formatDayLabel', () => {
  it('formats a day key to a readable label', () => {
    // 2026-03-04 is a Wednesday
    expect(formatDayLabel('2026-03-04')).toBe('Wednesday, Mar 4');
  });
});

describe('formatShortDay', () => {
  it('returns 3-letter day abbreviation', () => {
    expect(formatShortDay('2026-03-04')).toBe('Wed');
  });
});
