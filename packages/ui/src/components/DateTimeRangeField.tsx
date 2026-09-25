'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Calendar as CalendarIcon, Clock, X, AlertCircle } from 'lucide-react';
import { Calendar } from './Calendar';

export interface DateTimeRangeFieldProps {
  value?: [string, string] | null;
  onChange?: (range: [string, string] | null) => void;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  clearable?: boolean;
  placeholder?: string;
  id?: string;
  className?: string;
}

/**
 * @skyra/ui DateTimeRangeField
 *
 * Unified date and time range picker from start datetime to end datetime.
 */
export function DateTimeRangeField({
  value,
  onChange,
  label,
  helper,
  helperText,
  description,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  clearable = true,
  placeholder = 'Select start and end datetime',
  id,
  className = '',
}: DateTimeRangeFieldProps) {
  const uid = useId();
  const fieldId = id ?? `skyra-datetimerange-${uid}`;
  const popoverId = `${fieldId}-popover`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startVal = value?.[0] ?? '';
  const endVal = value?.[1] ?? '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;
    onChange?.(null);
  };

  const displayString = startVal && endVal ? `${startVal} → ${endVal}` : startVal ? `${startVal} → ...` : '';

  return (
    <div
      ref={containerRef}
      className={`skyra-datetimerange-field ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: '100%',
        position: 'relative',
        fontFamily: 'var(--skyra-font-body)' }}
    >
      {label && (
        <label
          htmlFor={fieldId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 500,
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px' }}
        >
          {label}
          {required && <span style={{ color: 'var(--skyra-danger)' }}>*</span>}
        </label>
      )}

      {/* Input Trigger */}
      <div
        id={fieldId}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => !disabled && !readOnly && setIsOpen((p) => !p)}
        onKeyDown={(e) => {
          if (!disabled && !readOnly && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            setIsOpen((p) => !p);
          }
        }}
        style={{
          width: '100%',
          height: '42px',
          padding: '0.45rem 0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
          background: disabled ? 'var(--skyra-border)' : readOnly ? 'var(--skyra-surface)' : 'var(--skyra-bg)',
          border: error ? '1.5px solid var(--skyra-danger)' : isOpen ? '1.5px solid var(--skyra-primary)' : '1px solid var(--skyra-border)',
          borderRadius: 'var(--skyra-radius-md)',
          boxShadow: isOpen ? 'var(--skyra-shadow-glow)' : 'none',
          cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
          outline: 'none',
          boxSizing: 'border-box' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, overflow: 'hidden' }}>
          <CalendarIcon size={16} style={{ color: 'var(--skyra-text-muted)', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '0.875rem',
              color: displayString ? 'var(--skyra-text)' : 'var(--skyra-text-subtle)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' }}
          >
            {displayString || placeholder}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          {clearable && displayString && !disabled && !readOnly && (
            <button
              type="button"
              aria-label="Clear datetime range"
              onClick={handleClear}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: 'var(--skyra-text-subtle)',
                display: 'flex',
                alignItems: 'center' }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div className="skyra-motion-fade-in-up"
          id={popoverId}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            zIndex: 200,
            boxShadow: 'var(--skyra-shadow-lg)',
            borderRadius: 'var(--skyra-radius-md)' }}
        >
          <Calendar
            mode="range"
            rangeValue={[startVal.split(' ')[0] || null, endVal.split(' ')[0] || null]}
            onRangeChange={([d1, d2]) => {
              const fullStart = `${d1} 09:00 AM`;
              const fullEnd = `${d2} 06:00 PM`;
              onChange?.([fullStart, fullEnd]);
              setIsOpen(false);
            }}
          />
        </div>
      )}

      {/* Error or Helper */}
      {error ? (
        <span id={errorId} role="alert" style={{ fontSize: '0.78rem', color: 'var(--skyra-danger)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <AlertCircle size={12} />
          {error}
        </span>
      ) : (helperText ?? helper ?? description) ? (
        <span id={helperId} style={{ fontSize: '0.78rem', color: 'var(--skyra-text-muted)' }}>
          {helperText ?? helper ?? description}
        </span>
      ) : null}
    </div>
  );
}
