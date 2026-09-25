'use client';

import React, { useState, useEffect, useId } from 'react';
import { Clock, X, AlertCircle } from 'lucide-react';

export interface TimeFieldProps {
  /** Time string (e.g., "14:30" for 24h, or "02:30 PM" for 12h) */
  value?: string;
  /** Change handler */
  onChange?: (time: string) => void;
  /** Time format: 12-hour with AM/PM or 24-hour military */
  format?: '12h' | '24h';
  /** Minute step (e.g. 1, 5, 10, 15, 30) */
  minuteStep?: number;
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

/**
 * @skyra/ui TimeField
 *
 * Time input supporting 12-hour and 24-hour formats, AM/PM toggle,
 * keyboard controls, and ERP styling.
 */
export function TimeField({
  value = '',
  onChange,
  format = '12h',
  minuteStep = 5,
  label,
  helper,
  description,
  error,
  disabled = false,
  required = false,
  clearable = true,
  id,
  className = '',
}: TimeFieldProps) {
  const uid = useId();
  const inputId = id ?? `skyra-time-${uid}`;
  const errorId = `${inputId}-error`;
  const descId = `${inputId}-desc`;

  const [hours, setHours] = useState('12');
  const [minutes, setMinutes] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (!value) return;
    if (format === '12h') {
      const parts = value.trim().split(' ');
      if (parts[0]) {
        const [h, m] = parts[0].split(':');
        if (h) setHours(h.padStart(2, '0'));
        if (m) setMinutes(m.padStart(2, '0'));
      }
      if (parts[1] === 'AM' || parts[1] === 'PM') {
        setPeriod(parts[1]);
      }
    } else {
      const [h, m] = value.split(':');
      if (h) setHours(h.padStart(2, '0'));
      if (m) setMinutes(m.padStart(2, '0'));
    }
  }, [value, format]);

  const updateTime = (newH: string, newM: string, newP: 'AM' | 'PM') => {
    let result = '';
    if (format === '12h') {
      result = `${newH.padStart(2, '0')}:${newM.padStart(2, '0')} ${newP}`;
    } else {
      result = `${newH.padStart(2, '0')}:${newM.padStart(2, '0')}`;
    }
    onChange?.(result);
  };

  const handleHourChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setHours(next);
    updateTime(next, minutes, period);
  };

  const handleMinuteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value;
    setMinutes(next);
    updateTime(hours, next, period);
  };

  const handlePeriodChange = (nextP: 'AM' | 'PM') => {
    if (disabled) return;
    setPeriod(nextP);
    updateTime(hours, minutes, nextP);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange?.('');
  };

  const maxHours = format === '12h' ? 12 : 23;
  const minHours = format === '12h' ? 1 : 0;
  const hourOptions = [];
  for (let h = minHours; h <= maxHours; h++) {
    const str = String(h).padStart(2, '0');
    hourOptions.push(str);
  }

  const minuteOptions = [];
  const step = Math.max(1, Math.min(60, minuteStep));
  for (let m = 0; m < 60; m += step) {
    const str = String(m).padStart(2, '0');
    minuteOptions.push(str);
  }

  const hasError = !!error;

  return (
    <div
      className={`skyra-time-field-container ${className}`}
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
          htmlFor={inputId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)' }}
        >
          {label}
          {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
        </label>
      )}

      {/* Selects Container */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.375rem',
          height: '42px',
          padding: '0.45rem 0.75rem',
          background: disabled ? 'var(--skyra-border)' : 'var(--skyra-bg)',
          border: hasError ? '1.5px solid var(--skyra-danger)' : '1px solid var(--skyra-border)',
          borderRadius: 'var(--skyra-radius-md)',
          boxSizing: 'border-box' }}
      >
        <Clock size={16} style={{ color: 'var(--skyra-text-muted)', flexShrink: 0 }} />

        {/* Hours Select */}
        <select
          id={inputId}
          value={hours}
          disabled={disabled}
          onChange={handleHourChange}
          aria-label="Hour"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.875rem',
            color: 'var(--skyra-text)',
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          {hourOptions.map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <span style={{ color: 'var(--skyra-text-muted)', fontWeight: 600 }}>:</span>

        {/* Minutes Select */}
        <select
          value={minutes}
          disabled={disabled}
          onChange={handleMinuteChange}
          aria-label="Minute"
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.875rem',
            color: 'var(--skyra-text)',
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
          {minuteOptions.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* AM / PM Toggle in 12h mode */}
        {format === '12h' && (
          <div
            style={{
              display: 'flex',
              marginLeft: 'auto',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-sm)',
              overflow: 'hidden',
              background: 'var(--skyra-surface)' }}
          >
            <button
              type="button"
              disabled={disabled}
              onClick={() => handlePeriodChange('AM')}
              style={{
                border: 'none',
                padding: '2px 6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: period === 'AM' ? 'var(--skyra-primary)' : 'transparent',
                color: period === 'AM' ? '#ffffff' : 'var(--skyra-text-muted)' }}
            >
              AM
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => handlePeriodChange('PM')}
              style={{
                border: 'none',
                padding: '2px 6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                cursor: disabled ? 'not-allowed' : 'pointer',
                background: period === 'PM' ? 'var(--skyra-primary)' : 'transparent',
                color: period === 'PM' ? '#ffffff' : 'var(--skyra-text-muted)' }}
            >
              PM
            </button>
          </div>
        )}

        {clearable && value && !disabled && (
          <button
            type="button"
            aria-label="Clear time"
            onClick={handleClear}
            style={{
              background: 'none',
              border: 'none',
              padding: '2px',
              cursor: 'pointer',
              color: 'var(--skyra-text-subtle)',
              display: 'flex',
              marginLeft: format === '24h' ? 'auto' : undefined }}
          >
            <X size={14} />
          </button>
        )}
      </div>

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
