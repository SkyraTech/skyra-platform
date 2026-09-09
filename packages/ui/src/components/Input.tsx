'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text shown above the input */
  label?: string;
  /** Error message — sets error state and shows message */
  error?: string;
  /** Helper text shown below the input */
  helper?: string;
  /** Show required asterisk */
  required?: boolean;
  /** Left adornment (icon or text) */
  leftAdornment?: React.ReactNode;
  /** Right adornment (icon or text) */
  rightAdornment?: React.ReactNode;
  /** Wrapper className */
  wrapperClassName?: string;
}

/**
 * @skyra/ui Input
 *
 * [B] PLATFORM EXTRACTION from skyra-erp/src/styles/ui.css .form-input
 *
 * Confirmed ERP values:
 *   - padding: 0.65rem 0.875rem
 *   - background: var(--bg-color) / var(--skyra-bg)
 *   - border: 1px solid var(--border-color)
 *   - border-radius: var(--radius-md) = 10px
 *   - focus: border var(--primary), box-shadow: 0 0 0 3px rgba(10,88,202,0.12)
 *   - error: border var(--danger), box-shadow: 0 0 0 3px rgba(239,68,68,0.10)
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      required,
      leftAdornment,
      rightAdornment,
      id,
      className = '',
      wrapperClassName = '',
      ...rest
    },
    ref
  ) => {
    const uid = React.useId();
    const inputId = id ?? `skyra-input-${uid}`;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const hasError = !!error;

    const describedBy = [
      hasError ? errorId : '',
      helper && !hasError ? helperId : '',
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    const inputClasses = [
      'skyra-input',
      hasError ? 'skyra-input--error' : '',
      leftAdornment ? 'skyra-input--has-left' : '',
      rightAdornment ? 'skyra-input--has-right' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`skyra-field ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className={`skyra-label ${required ? 'skyra-label--required' : ''}`}
          >
            {label}
          </label>
        )}
        <div style={{ position: 'relative' }}>
          {leftAdornment && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--skyra-text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {leftAdornment}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={required}
            style={{
              paddingLeft: leftAdornment ? '2.25rem' : undefined,
              paddingRight: rightAdornment ? '2.25rem' : undefined,
            }}
            {...rest}
          />
          {rightAdornment && (
            <span
              aria-hidden="true"
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--skyra-text-muted)',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {rightAdornment}
            </span>
          )}
        </div>
        {hasError && (
          <span id={errorId} className="skyra-error-msg" role="alert">
            <AlertCircle size={12} aria-hidden="true" />
            {error}
          </span>
        )}
        {helper && !hasError && (
          <span id={helperId} className="skyra-helper-msg">
            {helper}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
