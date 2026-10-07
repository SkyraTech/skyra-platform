'use client';

import React, { useState, useRef, useEffect, useId } from 'react';
import {  Calendar as CalendarIcon, X, AlertCircle  } from 'lucide-react';
import { useFloatingPosition } from './useFloatingPosition';
import { Calendar } from './Calendar';

export interface WeekFieldProps {
  /** Selected week as [startDate, endDate] or string representation */
  value?: [string, string] | string | null;
  onChange?: (weekRange: [string, string] | null) => void;
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
 * @skyra/ui WeekField
 *
 * Full week picker component selecting Monday through Sunday range.
 */
export function WeekField({
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
  placeholder = 'Select week',
  id,
  className = '',
}: WeekFieldProps) {
  const uid = useId();
  const fieldId = id ?? `skyra-week-${uid}`;
  const popoverId = `${fieldId}-popover`;
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerWrapperRef = useRef<HTMLDivElement>(null);

  const { top, left, actualPlacement } = useFloatingPosition({
    anchor: triggerWrapperRef,
    floating: popoverRef,
    open: isOpen,
    placement: 'bottom',
    align: 'start',
    viewportPadding: 16
  });

  const startVal = Array.isArray(value) ? value[0] : typeof value === 'string' ? value.split(' to ')[0] : '';
  const endVal = Array.isArray(value) ? value[1] : typeof value === 'string' ? value.split(' to ')[1] : '';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerWrapperRef.current?.contains(target) ||
        popoverRef.current?.contains(target)
      ) {
        return;
      }
      if (containerRef.current && !containerRef.current.contains(target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled || readOnly) return;
    onChange?.(null);
  };

  const displayString = startVal && endVal ? `${startVal} → ${endVal}` : '';

  return (
    <div
      ref={containerRef}
      className={`skyra-week-field ${className}`}
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
      <div ref={triggerWrapperRef} style={{ width: '100%', position: 'relative' }}>
      <button
        type="button"
        id={fieldId}
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
          boxSizing: 'border-box',
          textAlign: 'left',
          fontFamily: 'inherit',
          color: 'inherit' }}
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
            <span
              aria-hidden="true"
              onClick={(e) => { e.stopPropagation(); handleClear(e); }}
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
            </span>
          )}
        </div>
      </button>
      </div>

      {/* Popover Calendar */}
      {isOpen && (
        <div className={`skyra-motion-fade-in-up skyra-popover--${actualPlacement}`}
          id={popoverId}
          ref={popoverRef}
          style={{
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 'var(--skyra-z-popover, 1000)',
            boxShadow: 'var(--skyra-shadow-lg)',
            borderRadius: 'var(--skyra-radius-md)' }}
        >
          <Calendar
            mode="week"
            rangeValue={[startVal || null, endVal || null]}
            onRangeChange={([s, e]) => {
              onChange?.([s, e]);
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
