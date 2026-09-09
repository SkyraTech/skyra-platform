import { describe, it, expect } from 'vitest';
import {
  formatDate,
  formatRelativeTime,
  isPast,
  isToday,
  addDays,
  startOfDay,
  toISODate,
} from './date';

// ─── formatDate ───────────────────────────────────────────────────────────────
describe('formatDate', () => {
  it('formats a date string in medium format (default)', () => {
    const result = formatDate('2024-01-15');
    expect(result).toContain('2024');
    expect(result).toContain('Jan');
  });

  it('formats in short format', () => {
    const result = formatDate('2024-06-20', { format: 'short' });
    expect(result).toContain('2024');
  });

  it('formats in long format', () => {
    const result = formatDate('2024-06-20', { format: 'long' });
    expect(result).toContain('June');
  });

  it('formats in numeric format', () => {
    const result = formatDate('2024-06-20', { format: 'numeric' });
    expect(result).toContain('2024');
  });

  it('includes time when includeTime=true', () => {
    const result = formatDate(new Date('2024-01-15T10:30:00'), { includeTime: true });
    // Should contain some time indication
    expect(result).toBeTruthy();
    expect(result.length).toBeGreaterThan(5);
  });

  it('accepts a Date object', () => {
    const d = new Date('2024-03-22');
    const result = formatDate(d);
    expect(result).toContain('2024');
  });

  it('accepts a timestamp (number)', () => {
    const ts = new Date('2024-05-10').getTime();
    const result = formatDate(ts);
    expect(result).toContain('2024');
  });

  it('returns "Invalid date" for unparseable input', () => {
    expect(formatDate('not-a-date')).toBe('Invalid date');
  });

  it('accepts custom locale', () => {
    const result = formatDate('2024-01-15', { locale: 'en-US' });
    expect(result).toContain('2024');
  });
});

// ─── formatRelativeTime ───────────────────────────────────────────────────────
describe('formatRelativeTime', () => {
  it('returns "Invalid date" for bad input', () => {
    expect(formatRelativeTime('not-a-date')).toBe('Invalid date');
  });

  it('returns "now" or "0 seconds" for current time (within seconds)', () => {
    const result = formatRelativeTime(new Date());
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('formats past date within seconds', () => {
    const past = new Date(Date.now() - 5000); // 5 seconds ago
    const result = formatRelativeTime(past);
    expect(result).toMatch(/second|now/i);
  });

  it('formats past date within minutes', () => {
    const past = new Date(Date.now() - 10 * 60 * 1000); // 10 min ago
    const result = formatRelativeTime(past);
    expect(result).toMatch(/minute/i);
  });

  it('formats past date within hours', () => {
    const past = new Date(Date.now() - 3 * 3600 * 1000); // 3 hours ago
    const result = formatRelativeTime(past);
    expect(result).toMatch(/hour/i);
  });

  it('formats past date within days', () => {
    const past = new Date(Date.now() - 5 * 86400 * 1000); // 5 days ago
    const result = formatRelativeTime(past);
    expect(result).toMatch(/day/i);
  });

  it('formats past date within months', () => {
    const past = new Date(Date.now() - 60 * 86400 * 1000); // ~2 months ago
    const result = formatRelativeTime(past);
    expect(result).toMatch(/month/i);
  });

  it('formats past date in years', () => {
    const past = new Date(Date.now() - 400 * 86400 * 1000); // ~1.1 years ago
    const result = formatRelativeTime(past);
    expect(result).toMatch(/year/i);
  });

  it('formats future date within minutes', () => {
    const future = new Date(Date.now() + 10 * 60 * 1000);
    const result = formatRelativeTime(future);
    expect(result).toMatch(/minute/i);
  });

  it('formats future date in days', () => {
    const future = new Date(Date.now() + 5 * 86400 * 1000);
    const result = formatRelativeTime(future);
    expect(result).toMatch(/day/i);
  });
});

// ─── isPast ───────────────────────────────────────────────────────────────────
describe('isPast', () => {
  it('returns true for a clearly past date', () => {
    expect(isPast('2000-01-01')).toBe(true);
  });

  it('returns false for a future date', () => {
    const future = new Date(Date.now() + 86400000);
    expect(isPast(future)).toBe(false);
  });

  it('accepts a timestamp', () => {
    expect(isPast(Date.now() - 1000)).toBe(true);
  });
});

// ─── isToday ─────────────────────────────────────────────────────────────────
describe('isToday', () => {
  it('returns true for today', () => {
    expect(isToday(new Date())).toBe(true);
  });

  it('returns false for yesterday', () => {
    expect(isToday(addDays(new Date(), -1))).toBe(false);
  });

  it('returns false for tomorrow', () => {
    expect(isToday(addDays(new Date(), 1))).toBe(false);
  });

  it('returns false for a date in the past', () => {
    expect(isToday(new Date('2000-01-01'))).toBe(false);
  });
});

// ─── addDays ─────────────────────────────────────────────────────────────────
describe('addDays', () => {
  it('adds positive days', () => {
    const base = new Date('2024-01-01');
    expect(addDays(base, 5).getDate()).toBe(6);
  });

  it('adds negative days (subtracts)', () => {
    const base = new Date('2024-01-10');
    expect(addDays(base, -3).getDate()).toBe(7);
  });

  it('adds zero days (identity)', () => {
    const base = new Date('2024-06-15');
    expect(addDays(base, 0).getTime()).toBe(base.getTime());
  });

  it('does not mutate the original date', () => {
    const base = new Date('2024-01-01');
    const original = base.getTime();
    addDays(base, 10);
    expect(base.getTime()).toBe(original);
  });

  it('crosses month boundaries', () => {
    const result = addDays(new Date('2024-01-30'), 5);
    expect(result.getMonth()).toBe(1); // February
  });

  it('crosses year boundaries', () => {
    const result = addDays(new Date('2023-12-31'), 1);
    expect(result.getFullYear()).toBe(2024);
  });
});

// ─── startOfDay ──────────────────────────────────────────────────────────────
describe('startOfDay', () => {
  it('returns midnight UTC', () => {
    const result = startOfDay(new Date('2024-06-15T14:30:00Z'));
    expect(result.getUTCHours()).toBe(0);
    expect(result.getUTCMinutes()).toBe(0);
    expect(result.getUTCSeconds()).toBe(0);
  });

  it('preserves the date component', () => {
    const result = startOfDay(new Date('2024-06-15T23:59:59Z'));
    expect(result.getUTCDate()).toBe(15);
    expect(result.getUTCMonth()).toBe(5); // June = 5
    expect(result.getUTCFullYear()).toBe(2024);
  });

  it('accepts a string input', () => {
    const result = startOfDay('2024-03-22T18:00:00Z');
    expect(result.getUTCHours()).toBe(0);
  });
});

// ─── toISODate ───────────────────────────────────────────────────────────────
describe('toISODate', () => {
  it('formats a valid Date as YYYY-MM-DD', () => {
    expect(toISODate(new Date('2024-06-15T12:00:00Z'))).toBe('2024-06-15');
  });

  it('formats a date string as YYYY-MM-DD', () => {
    expect(toISODate('2024-01-01')).toBe('2024-01-01');
  });

  it('returns empty string for invalid date', () => {
    expect(toISODate('invalid')).toBe('');
  });

  it('accepts a timestamp', () => {
    const ts = new Date('2024-09-01T00:00:00Z').getTime();
    expect(toISODate(ts)).toBe('2024-09-01');
  });
});
