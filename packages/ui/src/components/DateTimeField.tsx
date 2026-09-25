'use client';

import React from 'react';
import { DateField } from './DateField';
import { TimeField } from './TimeField';

export interface DateTimeValue {
  date: string | null;
  time: string;
}

export interface DateTimeFieldProps {
  /** Value object with date (YYYY-MM-DD) and time */
  value?: DateTimeValue;
  /** Change handler */
  onChange?: (value: DateTimeValue) => void;
  /** Min selectable date */
  minDate?: string | Date;
  /** Max selectable date */
  maxDate?: string | Date;
  /** Label for combined field */
  label?: React.ReactNode;
  /** Helper text */
  helper?: React.ReactNode;
  /** Description */
  description?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Time format (12h or 24h) */
  timeFormat?: '12h' | '24h';
  /** Disabled */
  disabled?: boolean;
  /** Required */
  required?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui DateTimeField
 *
 * Responsive composition of DateField and TimeField.
 */
export function DateTimeField({
  value = { date: null, time: '' },
  onChange,
  minDate,
  maxDate,
  label,
  helper,
  description,
  error,
  timeFormat = '12h',
  disabled = false,
  required = false,
  className = '',
}: DateTimeFieldProps) {
  const handleDateChange = (d: string | null) => {
    onChange?.({ date: d, time: value.time });
  };

  const handleTimeChange = (t: string) => {
    onChange?.({ date: value.date, time: t });
  };

  return (
    <div
      className={`skyra-datetime-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: '100%',
        fontFamily: 'var(--skyra-font-body)' }}
    >
      {label && (
        <span
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
        </span>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '0.75rem',
          alignItems: 'flex-start' }}
      >
        <DateField
          value={value.date}
          minDate={minDate}
          maxDate={maxDate}
          disabled={disabled}
          onChange={handleDateChange}
          placeholder="Select date..."
        />
        <TimeField
          value={value.time}
          format={timeFormat}
          disabled={disabled}
          onChange={handleTimeChange}
        />
      </div>

      {error ? (
        <span
          role="alert"
          style={{
            fontSize: '0.78rem',
            color: 'var(--skyra-danger)' }}
        >
          {error}
        </span>
      ) : (description || helper) ? (
        <span
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
