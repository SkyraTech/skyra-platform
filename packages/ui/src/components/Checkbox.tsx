'use client';

import React, { useId, useEffect, useRef } from 'react';
import { Check, Minus } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  helper?: React.ReactNode;
  error?: string;
  indeterminate?: boolean;
}

/**
 * @skyra/ui Checkbox
 *
 * [B] PLATFORM EXTRACTION + [C] ENHANCEMENT
 * Supports checked, unchecked, indeterminate, disabled, focus-visible,
 * min 44x44px touch target, descriptions, and accessible ARIA states.
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      helper,
      error,
      indeterminate = false,
      disabled = false,
      required = false,
      id,
      className = '',
      style,
      checked,
      defaultChecked,
      onChange,
      ...rest
    },
    forwardedRef
  ) => {
    const uid = useId();
    const inputId = id ?? `skyra-checkbox-${uid}`;
    const descId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;

    const innerRef = useRef<HTMLInputElement>(null);

    // Sync indeterminate property on real DOM node
    useEffect(() => {
      const el = (forwardedRef && 'current' in forwardedRef && forwardedRef.current) || innerRef.current;
      if (el) {
        el.indeterminate = indeterminate;
      }
    }, [indeterminate, forwardedRef]);

    const isChecked = Boolean(checked ?? defaultChecked);
    const hasError = !!error;

    return (
      <div
        className={`skyra-checkbox-container ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          ...style }}
      >
        <label
          htmlFor={inputId}
          style={{
            display: 'inline-flex',
            alignItems: 'flex-start',
            gap: '0.625rem',
            cursor: disabled ? 'not-allowed' : 'pointer',
            userSelect: 'none',
            minHeight: '44px',
            padding: '4px 0',
            position: 'relative' }}
        >
          {/* Hidden native checkbox input */}
          <input
            ref={(node) => {
              (innerRef as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = node;
              if (typeof forwardedRef === 'function') {
                forwardedRef(node);
              } else if (forwardedRef) {
                (forwardedRef as React.MutableRefObject<HTMLInputElement | HTMLTextAreaElement | null>).current = node;
              }
            }}
            id={inputId}
            type="checkbox"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            required={required}
            onChange={onChange}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : description || helper ? descId : undefined}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '44px',
              height: '44px',
              top: 0,
              left: 0,
              margin: 0,
              cursor: disabled ? 'not-allowed' : 'pointer',
              zIndex: 1 }}
            {...rest}
          />

          {/* Custom Styled Box */}
          <span className="skyra-motion-transition-all"
            aria-hidden="true"
            style={{
              width: '18px',
              height: '18px',
              marginTop: '3px',
              borderRadius: 'var(--skyra-radius-sm, 4px)',
              border: hasError
                ? '1.5px solid var(--skyra-danger)'
                : isChecked || indeterminate
                ? '1.5px solid var(--skyra-primary)'
                : '1.5px solid var(--skyra-border)',
              background: disabled
                ? isChecked || indeterminate
                  ? 'var(--skyra-border)'
                  : 'var(--skyra-bg)'
                : isChecked || indeterminate
                ? 'var(--skyra-primary)'
                : 'var(--skyra-surface)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              
              boxShadow: 'none' }}
          >
            {indeterminate ? (
              <Minus size={12} strokeWidth={3} />
            ) : isChecked ? (
              <Check size={12} strokeWidth={3} />
            ) : null}
          </span>

          {/* Label + Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
                lineHeight: '1.4' }}
            >
              {label}
              {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
            </span>
            {(description || helper) && (
              <span
                id={descId}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--skyra-text-muted)',
                  lineHeight: '1.35' }}
              >
                {description || helper}
              </span>
            )}
          </div>
        </label>

        {/* Error message */}
        {hasError && (
          <span
            id={errorId}
            role="alert"
            style={{
              fontSize: '0.78rem',
              color: 'var(--skyra-danger)',
              marginLeft: '28px' }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
