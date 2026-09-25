'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, AlertCircle } from 'lucide-react';

export interface MonthFieldProps {
  /** Selected month string (YYYY-MM) */
  value?: string | null;
  onChange?: (val: string | null) => void;
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

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * @skyra/ui MonthField
 *
 * Month + Year selector popup.
 */
export function MonthField({
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
  placeholder = 'Select month (YYYY-MM)',
  id,
  className = '',
}: MonthFieldProps) {
  const uid = useId();
  const fieldId = id ?? `skyra-month-${uid}`;
  const labelId = `${fieldId}-label`;
  const popoverId = `${fieldId}-popover`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const parsedYear = value ? parseInt(value.split('-')[0] || String(new Date().getFullYear()), 10) : new Date().getFullYear();
  const parsedMonth = value ? parseInt(value.split('-')[1] || '1', 10) - 1 : new Date().getMonth();

  const [viewYear, setViewYear] = useState<number>(parsedYear);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMonth = (mIdx: number) => {
    const mStr = String(mIdx + 1).padStart(2, '0');
    onChange?.(`${viewYear}-${mStr}`);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;
    onChange?.(null);
  };

  const displayString = value ? `${MONTHS[parsedMonth]} ${parsedYear}` : '';

  return (
    <div
      ref={containerRef}
      className={`skyra-month-field ${className}`}
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
              aria-label="Clear month"
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
              onClick={() => setViewYear((y) => y - 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', display: 'flex' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--skyra-text)' }}>{viewYear}</span>
            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', display: 'flex' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
            {MONTHS.map((name, idx) => {
              const isSelected = value === `${viewYear}-${String(idx + 1).padStart(2, '0')}`;
              return (
                <button className="skyra-motion-transition-all-fast"
                  key={name}
                  type="button"
                  onClick={() => handleSelectMonth(idx)}
                  style={{
                    padding: '0.5rem 0.25rem',
                    textAlign: 'center',
                    borderRadius: 'var(--skyra-radius-sm)',
                    border: 'none',
                    background: isSelected ? 'var(--skyra-primary)' : 'var(--skyra-bg)',
                    color: isSelected ? '#ffffff' : 'var(--skyra-text)',
                    fontSize: '0.8rem',
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer' }}
                >
                  {name}
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
