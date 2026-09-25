'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';

export interface YearFieldProps {
  /** Selected year as number or string */
  value?: number | string | null;
  onChange?: (year: number | null) => void;
  /** Minimum selectable year */
  minYear?: number;
  /** Maximum selectable year */
  maxYear?: number;
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
 * @skyra/ui YearField
 *
 * Year selector popup with decade navigation.
 */
export function YearField({
  value,
  onChange,
  minYear,
  maxYear,
  label,
  helper,
  helperText,
  description,
  error,
  disabled = false,
  readOnly = false,
  required = false,
  clearable = true,
  placeholder = 'Select year (YYYY)',
  id,
  className = '',
}: YearFieldProps) {
  const uid = useId();
  const fieldId = id ?? `skyra-year-${uid}`;
  const labelId = `${fieldId}-label`;
  const popoverId = `${fieldId}-popover`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedYear = typeof value === 'number' ? value : value ? parseInt(String(value), 10) : new Date().getFullYear();
  const [decadeStart, setDecadeStart] = useState<number>(Math.floor(parsedYear / 10) * 10);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectYear = (yr: number) => {
    onChange?.(yr);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;
    onChange?.(null);
  };

  const years = Array.from({ length: 12 }, (_, i) => decadeStart - 1 + i);

  return (
    <div
      ref={containerRef}
      className={`skyra-year-field ${className}`}
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
          <CalendarIcon size={16} style={{ color: 'var(--skyra-text-muted)', flexShrink: 0 }} />
          <span
            style={{
              fontSize: '0.875rem',
              color: value ? 'var(--skyra-text)' : 'var(--skyra-text-subtle)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap' }}
          >
            {value ? String(value) : placeholder}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>
          {clearable && value && !disabled && !readOnly && (
            <button
              type="button"
              aria-label="Clear year"
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

      {/* Popover Grid */}
      {isOpen && (
        <div className="skyra-motion-fade-in-up"
          id={popoverId}
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            width: '260px',
            background: 'var(--skyra-surface)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-lg)',
            zIndex: 200,
            padding: '0.75rem' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setDecadeStart((d) => d - 10)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', display: 'flex' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
              {decadeStart} - {decadeStart + 9}
            </span>
            <button
              type="button"
              onClick={() => setDecadeStart((d) => d + 10)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', display: 'flex' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {years.map((yr) => {
              const isSelected = parsedYear === yr && !!value;
              const isOutDecade = yr < decadeStart || yr > decadeStart + 9;
              return (
                <button className="skyra-motion-transition-all-fast"
                  key={yr}
                  type="button"
                  onClick={() => handleSelectYear(yr)}
                  style={{
                    padding: '0.5rem 0.25rem',
                    textAlign: 'center',
                    borderRadius: 'var(--skyra-radius-sm)',
                    border: 'none',
                    background: isSelected ? 'var(--skyra-primary)' : 'var(--skyra-bg)',
                    color: isSelected ? '#ffffff' : isOutDecade ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer' }}
                >
                  {yr}
                </button>
              );
            })}
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
