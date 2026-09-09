'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Calendar, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';

export interface DateFieldProps {
  /** Selected ISO date string (YYYY-MM-DD) or Date object */
  value?: string | Date | null;
  /** Change handler returning ISO date string YYYY-MM-DD or null */
  onChange?: (date: string | null) => void;
  /** Minimum selectable ISO date */
  minDate?: string | Date;
  /** Maximum selectable ISO date */
  maxDate?: string | Date;
  /** Predicate to disable specific dates */
  disabledDate?: (date: Date) => boolean;
  /** Field label */
  label?: React.ReactNode;
  /** Helper text */
  helper?: React.ReactNode;
  /** Description text */
  description?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Placeholder */
  placeholder?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required flag */
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
 * @skyra/ui DateField
 *
 * Reusable accessible date picker with manual entry and calendar popover,
 * min/max constraints, dark mode, keyboard navigation, and ERP styling.
 */
export function DateField({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDate,
  label,
  helper,
  description,
  error,
  placeholder = 'YYYY-MM-DD',
  disabled = false,
  required = false,
  clearable = true,
  id,
  className = '',
}: DateFieldProps) {
  const uid = useId();
  const inputId = id ?? `skyra-date-${uid}`;
  const popoverId = `${inputId}-popover`;
  const errorId = `${inputId}-error`;
  const descId = `${inputId}-desc`;

  const selectedDate = parseDate(value);
  const minParsed = parseDate(minDate);
  const maxParsed = parseDate(maxDate);

  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState<Date>(selectedDate || new Date());
  const [inputValue, setInputValue] = useState<string>(selectedDate ? toISODateString(selectedDate) : '');

  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedDate) {
      setInputValue(toISODateString(selectedDate));
      setViewDate(selectedDate);
    } else {
      setInputValue('');
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setInputValue(raw);
    const parsed = parseDate(raw);
    if (parsed && raw.length === 10) {
      if (!isDateDisabled(parsed)) {
        onChange?.(toISODateString(parsed));
        setViewDate(parsed);
      }
    } else if (raw === '') {
      onChange?.(null);
    }
  };

  const isDateDisabled = (date: Date): boolean => {
    if (minParsed && toISODateString(date) < toISODateString(minParsed)) return true;
    if (maxParsed && toISODateString(date) > toISODateString(maxParsed)) return true;
    if (disabledDate && disabledDate(date)) return true;
    return false;
  };

  const handleSelectDay = (date: Date) => {
    if (isDateDisabled(date) || disabled) return;
    const iso = toISODateString(date);
    onChange?.(iso);
    setInputValue(iso);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    if (!isDateDisabled(today)) {
      handleSelectDay(today);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.(null);
    setInputValue('');
  };

  // Generate calendar days
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const calendarDays = [];

  // Previous month filler days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    calendarDays.push({ date, isCurrentMonth: true });
  }

  // Next month filler days (fill up to 35 or 42 cells)
  const remainingCells = (7 - (calendarDays.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const d = new Date(year, month + 1, i);
    calendarDays.push({ date: d, isCurrentMonth: false });
  }

  const todayStr = toISODateString(new Date());
  const selectedStr = selectedDate ? toISODateString(selectedDate) : null;
  const hasError = !!error;

  return (
    <div
      ref={containerRef}
      className={`skyra-date-field-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        position: 'relative',
        width: '100%',
        fontFamily: 'var(--skyra-font-body)',
      }}
    >
      {label && (
        <label
          htmlFor={inputId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
          }}
        >
          {label}
          {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      {/* Input row */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={inputId}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          disabled={disabled}
          onChange={handleInputChange}
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : description || helper ? descId : undefined}
          style={{
            width: '100%',
            height: '42px',
            padding: '0.65rem 4rem 0.65rem 0.875rem',
            background: disabled ? 'var(--skyra-border)' : 'var(--skyra-bg)',
            border: hasError ? '1.5px solid var(--skyra-danger)' : isOpen ? '1.5px solid var(--skyra-primary)' : '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
            fontSize: '0.875rem',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: isOpen ? 'var(--skyra-shadow-glow)' : 'none',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
        />

        {/* Action icons */}
        <div
          style={{
            position: 'absolute',
            right: '0.65rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {clearable && inputValue && !disabled && (
            <button
              type="button"
              aria-label="Clear date"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: 'var(--skyra-text-subtle)',
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          )}

          <button
            type="button"
            aria-label="Open calendar"
            disabled={disabled}
            onClick={() => setIsOpen((prev) => !prev)}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: disabled ? 'not-allowed' : 'pointer',
              color: isOpen ? 'var(--skyra-primary)' : 'var(--skyra-text-muted)',
              display: 'flex',
            }}
          >
            <Calendar size={16} />
          </button>
        </div>
      </div>

      {/* Calendar Popover */}
      {isOpen && (
        <div
          id={popoverId}
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label="Calendar date picker"
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
            width: '280px',
            animation: 'fadeInUp 0.15s ease',
          }}
        >
          {/* Header Month / Year Navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.75rem',
            }}
          >
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
                  color: 'var(--skyra-text)',
                }}
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
                  color: 'var(--skyra-text)',
                }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              textAlign: 'center',
              marginBottom: '0.35rem',
            }}
          >
            {DAY_NAMES.map((name) => (
              <span
                key={name}
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--skyra-text-subtle)',
                  padding: '2px 0',
                }}
              >
                {name}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div
            role="grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '2px',
            }}
          >
            {calendarDays.map(({ date, isCurrentMonth }) => {
              const iso = toISODateString(date);
              const isSelected = selectedStr === iso;
              const isToday = todayStr === iso;
              const isDis = isDateDisabled(date);

              return (
                <button
                  key={iso}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  disabled={isDis}
                  onClick={() => handleSelectDay(date)}
                  style={{
                    height: '32px',
                    width: '32px',
                    margin: '0 auto',
                    borderRadius: 'var(--skyra-radius-sm)',
                    border: isToday && !isSelected ? '1px solid var(--skyra-primary)' : 'none',
                    background: isSelected
                      ? 'var(--skyra-primary)'
                      : 'transparent',
                    color: isSelected
                      ? '#ffffff'
                      : isDis
                      ? 'var(--skyra-border)'
                      : isCurrentMonth
                      ? 'var(--skyra-text)'
                      : 'var(--skyra-text-subtle)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected || isToday ? 600 : 400,
                    cursor: isDis ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.1s ease',
                  }}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer Today Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '0.75rem',
              paddingTop: '0.5rem',
              borderTop: '1px solid var(--skyra-border)',
            }}
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
                padding: '2px 4px',
              }}
            >
              Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--skyra-text-muted)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                padding: '2px 4px',
              }}
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
            color: 'var(--skyra-danger)',
          }}
        >
          <AlertCircle size={12} />
          {error}
        </span>
      ) : (description || helper) ? (
        <span
          id={descId}
          style={{
            fontSize: '0.78rem',
            color: 'var(--skyra-text-muted)',
          }}
        >
          {description || helper}
        </span>
      ) : null}
    </div>
  );
}
