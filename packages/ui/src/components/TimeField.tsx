'use client';

import React, { useState, useEffect, useId, useRef } from 'react';
import { Clock, X, AlertCircle, ChevronDown } from 'lucide-react';
import { Popover } from './Popover';

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

function TimeSelectDropdown({ value, options, onChange, ariaLabel, disabled }: { value: string, options: string[], onChange: (v: string) => void, ariaLabel: string, disabled?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && listRef.current) {
      const idx = options.indexOf(value);
      if (idx >= 0) {
        const el = listRef.current.children[idx] as HTMLElement;
        if (el) {
          el.scrollIntoView({ block: 'nearest' });
          el.focus();
        }
      }
    }
  }, [isOpen, value, options]);

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={disabled}
      ariaLabel={ariaLabel}
      placement="bottom"
      align="center"
      trigger={
        <button
          type="button"
          disabled={disabled}
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            fontSize: '0.875rem',
            color: 'var(--skyra-text)',
            fontFamily: 'inherit',
            fontWeight: 500,
            cursor: disabled ? 'not-allowed' : 'pointer',
            padding: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            borderRadius: 'var(--skyra-radius-sm)',
            transition: 'box-shadow 0.2s',
          }}
          onFocus={(e) => { if (!disabled) e.currentTarget.style.boxShadow = 'var(--skyra-focus-ring)'; }}
          onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
        >
          {value} <ChevronDown size={12} style={{ color: 'var(--skyra-text-muted)' }}/>
        </button>
      }
      content={
        <div
          ref={listRef}
          role="listbox"
          tabIndex={-1}
          style={{
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-lg)',
            maxHeight: '220px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            padding: '4px',
            minWidth: '60px',
            outline: 'none'
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault();
              if (document.activeElement?.nextElementSibling) {
                (document.activeElement.nextElementSibling as HTMLElement).focus();
              } else if (listRef.current?.firstElementChild) {
                (listRef.current.firstElementChild as HTMLElement).focus();
              }
            } else if (e.key === 'ArrowUp') {
              e.preventDefault();
              if (document.activeElement?.previousElementSibling) {
                (document.activeElement.previousElementSibling as HTMLElement).focus();
              } else if (listRef.current?.lastElementChild) {
                (listRef.current.lastElementChild as HTMLElement).focus();
              }
            }
          }}
        >
          {options.map((opt: string) => (
            <button
              key={opt}
              type="button"
              role="option"
              aria-selected={opt === value}
              onClick={() => { onChange(opt); setIsOpen(false); }}
              onKeyDown={(e) => {
                 if (e.key === 'Enter' || e.key === ' ') {
                   e.preventDefault();
                   onChange(opt);
                   setIsOpen(false);
                 }
              }}
              style={{
                padding: '6px 8px',
                background: opt === value ? 'var(--skyra-primary)' : 'transparent',
                color: opt === value ? '#ffffff' : 'var(--skyra-text)',
                border: 'none',
                borderRadius: 'var(--skyra-radius-sm)',
                textAlign: 'center',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: opt === value ? 600 : 400,
                outline: 'none'
              }}
              onFocus={(e) => {
                if (opt !== value) {
                  e.currentTarget.style.background = 'var(--skyra-bg)';
                }
              }}
              onBlur={(e) => {
                if (opt !== value) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
              onMouseEnter={(e) => {
                if (opt !== value) {
                  e.currentTarget.style.background = 'var(--skyra-bg)';
                }
              }}
              onMouseLeave={(e) => {
                if (opt !== value && document.activeElement !== e.currentTarget) {
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      }
    />
  );
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

  const handleHourChange = (next: string) => {
    setHours(next);
    updateTime(next, minutes, period);
  };

  const handleMinuteChange = (next: string) => {
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
        id={inputId}
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

        <TimeSelectDropdown
          value={hours}
          options={hourOptions}
          onChange={handleHourChange}
          ariaLabel="Hour"
          disabled={disabled}
        />

        <span style={{ color: 'var(--skyra-text-muted)', fontWeight: 600 }}>:</span>

        <TimeSelectDropdown
          value={minutes}
          options={minuteOptions}
          onChange={handleMinuteChange}
          ariaLabel="Minute"
          disabled={disabled}
        />

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
