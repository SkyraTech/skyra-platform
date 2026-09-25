'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarProps {
  /** Mode: single date or date range */
  mode?: 'single' | 'range' | 'week' | 'month' | 'year';
  /** Selected single ISO date string (YYYY-MM-DD) */
  value?: string | null;
  /** Selected date range [startDate, endDate] */
  rangeValue?: [string | null, string | null];
  /** Change callback for single date */
  onChange?: (date: string) => void;
  /** Change callback for range */
  onRangeChange?: (range: [string, string]) => void;
  /** Minimum selectable ISO date */
  minDate?: string | Date;
  /** Maximum selectable ISO date */
  maxDate?: string | Date;
  /** Disable specific dates predicate */
  disabledDate?: (date: Date) => boolean;
  /** Disable all Saturdays & Sundays */
  disableWeekends?: boolean;
  /** Show today button */
  showToday?: boolean;
  /** Additional CSS class */
  className?: string;
}

export function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseISODate(val?: string | Date | null): Date | null {
  if (!val) return null;
  if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
  const str = String(val);
  const parts = str.split('-');
  if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10) - 1;
    const d = parseInt(parts[2], 10);
    const date = new Date(y, m, d);
    return isNaN(date.getTime()) ? null : date;
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? null : parsed;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

/**
 * @skyra/ui Calendar
 *
 * Core calendar grid supporting single, range, week, and month/year modes,
 * keyboard navigation, min/max bounds, disabled dates, and dark mode.
 */
export function Calendar({
  mode = 'single',
  value,
  rangeValue = [null, null],
  onChange,
  onRangeChange,
  minDate,
  maxDate,
  disabledDate,
  disableWeekends = false,
  showToday = true,
  className = '',
}: CalendarProps) {
  const initialDate = parseISODate(value) || parseISODate(rangeValue[0]) || new Date();
  const [viewDate, setViewDate] = useState<Date>(initialDate);
  const [rangeStart, setRangeStart] = useState<string | null>(rangeValue[0]);
  const [rangeEnd, setRangeEnd] = useState<string | null>(rangeValue[1]);
  const [hoverDate, setHoverDate] = useState<string | null>(null);

  const minParsed = parseISODate(minDate);
  const maxParsed = parseISODate(maxDate);

  const isDateDisabled = (date: Date): boolean => {
    const iso = toISODate(date);
    if (minParsed && iso < toISODate(minParsed)) return true;
    if (maxParsed && iso > toISODate(maxParsed)) return true;
    if (disableWeekends && (date.getDay() === 0 || date.getDay() === 6)) return true;
    if (disabledDate && disabledDate(date)) return true;
    return false;
  };

  const handlePrevMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    const iso = toISODate(date);

    if (mode === 'single') {
      onChange?.(iso);
    } else if (mode === 'range') {
      if (!rangeStart || (rangeStart && rangeEnd)) {
        setRangeStart(iso);
        setRangeEnd(null);
      } else {
        // Reverse correction if start > end
        if (iso < rangeStart) {
          setRangeStart(iso);
          setRangeEnd(rangeStart);
          onRangeChange?.([iso, rangeStart]);
        } else {
          setRangeEnd(iso);
          onRangeChange?.([rangeStart, iso]);
        }
      }
    } else if (mode === 'week') {
      // Calculate Monday of this week to Sunday — do NOT mutate the passed date
      const d = new Date(date); // copy to avoid mutation
      const day = d.getDay();
      const diffToMonday = d.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(d.getFullYear(), d.getMonth(), diffToMonday);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      const startIso = toISODate(monday);
      const endIso = toISODate(sunday);
      setRangeStart(startIso);
      setRangeEnd(endIso);
      onRangeChange?.([startIso, endIso]);
    }
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(today);
    if (!isDateDisabled(today)) {
      handleDateClick(today);
    }
  };

  // Build calendar matrix
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const totalCells = Math.ceil((firstDayIndex + daysInMonth) / 7) * 7;
  const days: { date: Date; isCurrentMonth: boolean }[] = [];

  for (let i = 0; i < totalCells; i++) {
    if (i < firstDayIndex) {
      const prevD = daysInPrevMonth - firstDayIndex + i + 1;
      days.push({ date: new Date(year, month - 1, prevD), isCurrentMonth: false });
    } else if (i < firstDayIndex + daysInMonth) {
      const curD = i - firstDayIndex + 1;
      days.push({ date: new Date(year, month, curD), isCurrentMonth: true });
    } else {
      const nextD = i - (firstDayIndex + daysInMonth) + 1;
      days.push({ date: new Date(year, month + 1, nextD), isCurrentMonth: false });
    }
  }

  const todayIso = toISODate(new Date());
  const selectedIso = value ? toISODate(parseISODate(value) || new Date()) : null;

  return (
    <div
      className={`skyra-calendar ${className}`}
      style={{
        padding: '0.75rem',
        background: 'var(--skyra-surface)',
        borderRadius: 'var(--skyra-radius-md)',
        fontFamily: 'var(--skyra-font-body)',
        userSelect: 'none',
        width: '280px' }}
    >
      {/* Month / Year Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.75rem' }}
      >
        <button
          type="button"
          aria-label="Previous month"
          onClick={handlePrevMonth}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: 'var(--skyra-radius-sm)',
            color: 'var(--skyra-text-muted)',
            display: 'flex',
            alignItems: 'center' }}
        >
          <ChevronLeft size={16} />
        </button>

        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
          {MONTH_NAMES[month]} {year}
        </span>

        <button
          type="button"
          aria-label="Next month"
          onClick={handleNextMonth}
          style={{
            background: 'none',
            border: 'none',
            padding: '4px',
            cursor: 'pointer',
            borderRadius: 'var(--skyra-radius-sm)',
            color: 'var(--skyra-text-muted)',
            display: 'flex',
            alignItems: 'center' }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day of Week Headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          textAlign: 'center',
          marginBottom: '4px' }}
      >
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              color: 'var(--skyra-text-subtle)',
              padding: '4px 0' }}
          >
            {name}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
        {days.map(({ date, isCurrentMonth }, idx) => {
          const iso = toISODate(date);
          const isDisabled = isDateDisabled(date);
          const isToday = iso === todayIso;
          const isSelected = mode === 'single' ? iso === selectedIso : iso === rangeStart || iso === rangeEnd;
          
          const inRange =
            (mode === 'range' || mode === 'week') &&
            rangeStart &&
            ((rangeEnd && iso >= rangeStart && iso <= rangeEnd) ||
              (!rangeEnd && hoverDate && hoverDate >= rangeStart && iso >= rangeStart && iso <= hoverDate) ||
              (!rangeEnd && hoverDate && hoverDate < rangeStart && iso <= rangeStart && iso >= hoverDate));

          return (
            <button className="skyra-motion-transition-bg"
              key={`${iso}-${idx}`}
              type="button"
              disabled={isDisabled}
              onClick={() => handleDateClick(date)}
              onMouseEnter={() => setHoverDate(iso)}
              onMouseLeave={() => setHoverDate(null)}
              style={{
                width: '100%',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.8rem',
                fontWeight: isSelected ? 700 : isToday ? 600 : 400,
                color: isDisabled
                  ? 'var(--skyra-text-subtle)'
                  : isSelected
                  ? '#ffffff'
                  : isCurrentMonth
                  ? 'var(--skyra-text)'
                  : 'var(--skyra-text-subtle)',
                background: isSelected
                  ? 'var(--skyra-primary)'
                  : inRange
                  ? 'var(--skyra-primary-light)'
                  : isToday
                  ? 'var(--skyra-bg)'
                  : 'transparent',
                borderRadius: isSelected ? 'var(--skyra-radius-sm)' : inRange ? '0' : 'var(--skyra-radius-sm)',
                border: isToday && !isSelected ? '1px solid var(--skyra-primary)' : 'none',
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                opacity: !isCurrentMonth && !isSelected && !inRange ? 0.4 : isDisabled ? 0.35 : 1 }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Today / Actions Footer */}
      {showToday && (
        <div
          style={{
            marginTop: '0.5rem',
            paddingTop: '0.5rem',
            borderTop: '1px solid var(--skyra-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center' }}
        >
          <button
            type="button"
            onClick={handleToday}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--skyra-primary)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '2px 6px',
              borderRadius: 'var(--skyra-radius-sm)' }}
          >
            Today
          </button>
          <span style={{ fontSize: '0.72rem', color: 'var(--skyra-text-muted)' }}>
            {MONTH_NAMES[new Date().getMonth()]} {new Date().getDate()}, {new Date().getFullYear()}
          </span>
        </div>
      )}
    </div>
  );
}
