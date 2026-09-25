'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Clock, X, AlertCircle } from 'lucide-react';

export interface TimeRangeValue {
  startTime: string; // "09:00" or "09:00 AM"
  endTime: string;   // "17:00" or "05:00 PM"
}

export interface TimeRangeFieldProps {
  value?: [string, string] | TimeRangeValue | null;
  onChange?: (range: [string, string] | null) => void;
  format?: '12h' | '24h';
  minuteStep?: number;
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
 * @skyra/ui TimeRangeField
 *
 * Unified start time to end time range selector [ 09:00 AM → 05:00 PM ]
 * with 12h/24h support, minute stepping, clearable, and dark mode.
 */
export function TimeRangeField({
  value,
  onChange,
  format = '12h',
  minuteStep = 5,
  label,
  helper,
  helperText,
  description,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  clearable = true,
  placeholder = 'Select time range',
  id,
  className = '',
}: TimeRangeFieldProps) {
  const uid = useId();
  const fieldId = id ?? `skyra-timerange-${uid}`;
  const labelId = `${fieldId}-label`;
  const popoverId = `${fieldId}-popover`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startVal = Array.isArray(value) ? value[0] : value?.startTime ?? '';
  const endVal = Array.isArray(value) ? value[1] : value?.endTime ?? '';

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

  const handleQuickSelect = (start: string, end: string) => {
    onChange?.([start, end]);
    setIsOpen(false);
  };

  const displayString = startVal && endVal ? `${startVal} → ${endVal}` : startVal ? `${startVal} → ...` : '';

  const quickPresets = [
    { label: 'Morning (09:00 - 12:00)', start: '09:00', end: '12:00' },
    { label: 'Afternoon (13:00 - 17:00)', start: '13:00', end: '17:00' },
    { label: 'Full Day (09:00 - 17:00)', start: '09:00', end: '17:00' },
    { label: 'Night Shift (18:00 - 22:00)', start: '18:00', end: '22:00' },
  ];

  return (
    <div
      ref={containerRef}
      className={`skyra-timerange-field ${className}`}
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
          id={labelId}
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
        aria-labelledby={label ? labelId : undefined}
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
          <Clock size={16} style={{ color: 'var(--skyra-text-muted)', flexShrink: 0 }} />
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
              aria-label="Clear time range"
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

      {/* Popover */}
      {isOpen && (
        <div className="skyra-motion-fade-in-up"
          id={popoverId}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '100%',
            minWidth: '260px',
            maxWidth: '320px',
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-lg)',
            zIndex: 200,
            padding: '0.75rem' }}
        >
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--skyra-text-subtle)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Quick Range Presets
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {quickPresets.map((preset) => (
              <button className="skyra-motion-transition-bg"
                key={preset.label}
                type="button"
                onClick={() => handleQuickSelect(preset.start, preset.end)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--skyra-radius-sm)',
                  border: 'none',
                  background: 'var(--skyra-bg)',
                  color: 'var(--skyra-text)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between' }}
              >
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
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
