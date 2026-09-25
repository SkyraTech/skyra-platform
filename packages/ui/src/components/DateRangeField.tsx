'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}

export interface DateRangeFieldProps {
  /** Controlled value */
  value?: DateRangeValue;
  /** Change handler */
  onChange?: (value: DateRangeValue) => void;
  /** Minimum selectable date */
  minDate?: string | Date;
  /** Maximum selectable date */
  maxDate?: string | Date;
  /** Label */
  label?: React.ReactNode;
  /** Helper text */
  helper?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Disabled */
  disabled?: boolean;
  /** Required */
  required?: boolean;
  /** Clearable */
  clearable?: boolean;
  /** Custom ID */
  id?: string;
  /** Additional CSS class */
  className?: string;
}

function toISODateString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function parseDate(val?: string | Date | null): Date | null {
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
 * @skyra/ui DateRangeField
 *
 * Date range picker with start & end date inputs, range highlighting,
 * responsive mobile stacking, and ERP visual styling.
 */
export function DateRangeField({
  value = { startDate: null, endDate: null },
  onChange,
  minDate,
  maxDate,
  label,
  helper,
  description,
  error,
  disabled = false,
  required = false,
  clearable = true,
  id,
  className = '',
}: DateRangeFieldProps) {
  const uid = useId();
  const fieldId = id ?? `skyra-daterange-${uid}`;
  const errorId = `${fieldId}-error`;
  const descId = `${fieldId}-desc`;

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(
    parseDate(value.startDate) || new Date()
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const startIso = value.startDate;
  const endIso = value.endDate;
  const minParsed = parseDate(minDate);
  const maxParsed = parseDate(maxDate);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDateDisabled = (date: Date): boolean => {
    if (minParsed && toISODateString(date) < toISODateString(minParsed)) return true;
    if (maxParsed && toISODateString(date) > toISODateString(maxParsed)) return true;
    return false;
  };

  const handleDayClick = (date: Date) => {
    if (disabled || isDateDisabled(date)) return;
    const iso = toISODateString(date);

    if (!startIso || (startIso && endIso)) {
      // Start new selection
      onChange?.({ startDate: iso, endDate: null });
    } else {
      // Select end date
      if (iso < startIso) {
        onChange?.({ startDate: iso, endDate: startIso });
      } else {
        onChange?.({ startDate: startIso, endDate: iso });
      }
      setIsOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.({ startDate: null, endDate: null });
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  // Generate calendar days
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    calendarDays.push({ date, isCurrentMonth: true });
  }
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  const hasError = !!error;
  const hasValue = Boolean(startIso || endIso);

  return (
    <div
      ref={containerRef}
      className={`skyra-date-range-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        position: 'relative',
        width: '100%',
        fontFamily: 'var(--skyra-font-body)' }}
    >
      {label && (
        <label
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      {/* Dual Inputs Trigger Container */}
      <div
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '42px',
          padding: '0.45rem 0.75rem',
          background: disabled ? 'var(--skyra-border)' : 'var(--skyra-bg)',
          border: hasError ? '1.5px solid var(--skyra-danger)' : isOpen ? '1.5px solid var(--skyra-primary)' : '1px solid var(--skyra-border)',
          borderRadius: 'var(--skyra-radius-md)',
          boxShadow: isOpen ? 'var(--skyra-shadow-glow)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          boxSizing: 'border-box',
          gap: '0.5rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, fontSize: '0.875rem' }}>
          <span style={{ color: startIso ? 'var(--skyra-text)' : 'var(--skyra-text-subtle)', fontWeight: startIso ? 500 : 400 }}>
            {startIso ?? 'Start date'}
          </span>
          <span style={{ color: 'var(--skyra-text-muted)' }}>→</span>
          <span style={{ color: endIso ? 'var(--skyra-text)' : 'var(--skyra-text-subtle)', fontWeight: endIso ? 500 : 400 }}>
            {endIso ?? 'End date'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {clearable && hasValue && !disabled && (
            <button
              type="button"
              aria-label="Clear date range"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: 'var(--skyra-text-subtle)',
                display: 'flex' }}
            >
              <X size={14} />
            </button>
          )}
          <Calendar size={16} style={{ color: isOpen ? 'var(--skyra-primary)' : 'var(--skyra-text-muted)' }} />
        </div>
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="skyra-motion-fade-in-up"
          role="dialog"
          aria-label="Date range calendar picker"
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 250,
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-lg)',
            padding: '0.875rem',
            width: '280px' }}
        >
          {/* Month Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
              {MONTH_NAMES[month]} {year}
            </span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                type="button"
                aria-label="Previous month"
                onClick={handlePrevMonth}
                style={{
                  background: 'var(--skyra-bg)',
                  border: '1px solid var(--skyra-border)',
                  borderRadius: 'var(--skyra-radius-sm)',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  color: 'var(--skyra-text)' }}
              >
                <ChevronLeft size={14} />
              </button>
              <button
                type="button"
                aria-label="Next month"
                onClick={handleNextMonth}
                style={{
                  background: 'var(--skyra-bg)',
                  border: '1px solid var(--skyra-border)',
                  borderRadius: 'var(--skyra-radius-sm)',
                  padding: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  color: 'var(--skyra-text)' }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Days of Week */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '0.35rem' }}>
            {DAY_NAMES.map((name) => (
              <span key={name} style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--skyra-text-subtle)', padding: '2px 0' }}>
                {name}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div role="grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
            {calendarDays.map(({ date, isCurrentMonth }) => {
              const iso = toISODateString(date);
              const isStart = startIso === iso;
              const isEnd = endIso === iso;
              const isInRange = Boolean(startIso && endIso && iso > startIso && iso < endIso);
              const isDis = isDateDisabled(date);

              return (
                <button className="skyra-motion-transition-bg"
                  key={iso}
                  type="button"
                  role="gridcell"
                  disabled={isDis}
                  onClick={() => handleDayClick(date)}
                  style={{
                    height: '32px',
                    width: '32px',
                    margin: '0 auto',
                    borderRadius: isStart || isEnd ? 'var(--skyra-radius-sm)' : '0',
                    background: isStart || isEnd
                      ? 'var(--skyra-primary)'
                      : isInRange
                      ? 'var(--skyra-primary-light)'
                      : 'transparent',
                    color: isStart || isEnd
                      ? '#ffffff'
                      : isInRange
                      ? 'var(--skyra-primary)'
                      : isDis
                      ? 'var(--skyra-border)'
                      : isCurrentMonth
                      ? 'var(--skyra-text)'
                      : 'var(--skyra-text-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: isStart || isEnd ? 600 : 400,
                    cursor: isDis ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: 'none' }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Close Footer */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid var(--skyra-border)' }}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--skyra-text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                padding: '2px 4px' }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Error or Helper */}
      {hasError ? (
        <span
          id={errorId}
          role="alert"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.78rem',
            color: 'var(--skyra-danger)' }}
        >
          <AlertCircle size={12} />
          {error}
        </span>
      ) : (description || helper) ? (
        <span
          id={descId}
          style={{
            fontSize: '0.78rem',
            color: 'var(--skyra-text-muted)' }}
        >
          {description || helper}
        </span>
      ) : null}
    </div>
  );
}
