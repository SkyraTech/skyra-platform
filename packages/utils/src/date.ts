/**
 * @skyra/utils — date.ts
 *
 * Pure TypeScript date/time utilities.
 * Zero DOM / Zero React / Zero browser dependencies.
 */

export type DateInput = Date | string | number;

function toDate(input: DateInput): Date {
  if (input instanceof Date) return input;
  return new Date(input);
}

/**
 * Format a date as a locale-aware display string.
 *
 * @example
 *   formatDate('2024-01-15') // '15 Jan 2024'
 *   formatDate('2024-01-15', { format: 'long' }) // '15 January 2024'
 */
export function formatDate(
  input: DateInput,
  options?: {
    format?: 'short' | 'medium' | 'long' | 'numeric';
    locale?: string;
    includeTime?: boolean;
  }
): string {
  const date = toDate(input);
  if (isNaN(date.getTime())) return 'Invalid date';

  const { format = 'medium', locale = 'en-IN', includeTime = false } = options ?? {};

  const dateFormats: Record<string, Intl.DateTimeFormatOptions> = {
    short:   { day: '2-digit', month: 'short', year: 'numeric' },
    medium:  { day: 'numeric', month: 'short', year: 'numeric' },
    long:    { day: 'numeric', month: 'long', year: 'numeric' },
    numeric: { day: '2-digit', month: '2-digit', year: 'numeric' },
  };

  const fmtOptions: Intl.DateTimeFormatOptions = {
    ...(dateFormats[format] ?? dateFormats['medium']),
    ...(includeTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };

  return new Intl.DateTimeFormat(locale, fmtOptions).format(date);
}

/**
 * Return a relative time string (e.g. "3 days ago", "in 2 hours").
 */
export function formatRelativeTime(input: DateInput, locale = 'en'): string {
  const date = toDate(input);
  if (isNaN(date.getTime())) return 'Invalid date';

  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr  = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, 'second');
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
  if (Math.abs(diffHr)  < 24) return rtf.format(diffHr,  'hour');
  if (Math.abs(diffDay) < 30) return rtf.format(diffDay, 'day');
  if (Math.abs(diffDay) < 365) return rtf.format(Math.round(diffDay / 30), 'month');
  return rtf.format(Math.round(diffDay / 365), 'year');
}

/**
 * Return whether a date is in the past (before now).
 */
export function isPast(input: DateInput): boolean {
  return toDate(input).getTime() < Date.now();
}

/**
 * Return whether a date is today.
 */
export function isToday(input: DateInput): boolean {
  const date = toDate(input);
  const now = new Date();
  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

/**
 * Add days to a date and return a new Date.
 */
export function addDays(input: DateInput, days: number): Date {
  const date = toDate(input);
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Return the start of a day (midnight UTC).
 */
export function startOfDay(input: DateInput): Date {
  const date = toDate(input);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

/**
 * Format a date as ISO 8601 date string (YYYY-MM-DD).
 */
export function toISODate(input: DateInput): string {
  const date = toDate(input);
  if (isNaN(date.getTime())) return '';
  return date.toISOString().split('T')[0] ?? '';
}
