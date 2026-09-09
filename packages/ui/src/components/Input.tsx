'use client';

import React from 'react';
import { AlertCircle, Loader2, X } from 'lucide-react';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  /** Label text shown above the input */
  label?: React.ReactNode;
  /** Error message — sets error state and shows message */
  error?: string;
  /** Helper text shown below the input */
  helper?: React.ReactNode;
  /** Helper text alias */
  helperText?: React.ReactNode;
  /** Description text shown below the input (alias for helper) */
  description?: React.ReactNode;
  /** Status variant for borders/accents */
  status?: 'default' | 'success' | 'warning' | 'error';
  /** Show required asterisk */
  required?: boolean;
  /** Left adornment or prefix */
  leftAdornment?: React.ReactNode;
  prefix?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  /** Right adornment or suffix */
  rightAdornment?: React.ReactNode;
  suffix?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  /** Loading state with inline spinner */
  loading?: boolean;
  /** Allow clearing input value */
  clearable?: boolean;
  /** Clear callback */
  onClear?: () => void;
  /** Show character count when maxLength is set */
  showCount?: boolean;
  /** Wrapper className */
  wrapperClassName?: string;
}

/**
 * @skyra/ui Input
 *
 * [B] PLATFORM EXTRACTION + [C] ENHANCEMENT
 * Comprehensive input primitive with prefixes, suffixes, clear button,
 * loading spinner, character counter, status states (success, warning, error),
 * dark mode, and ERP styling.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helper,
      helperText,
      description,
      status = 'default',
      required,
      leftAdornment,
      prefix,
      leadingIcon,
      rightAdornment,
      suffix,
      trailingIcon,
      loading = false,
      clearable = false,
      onClear,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      id,
      className = '',
      wrapperClassName = '',
      disabled,
      readOnly,
      ...rest
    },
    ref
  ) => {
    const uid = React.useId();
    const inputId = id ?? `skyra-input-${uid}`;
    const effectiveHelper = helperText ?? helper ?? description;
    const errorId = `${inputId}-error`;
    const helperId = `${inputId}-helper`;
    const effectiveStatus = error ? 'error' : status;
    const hasError = effectiveStatus === 'error';

    const left = prefix ?? leadingIcon ?? leftAdornment;
    const right = suffix ?? trailingIcon ?? rightAdornment;

    const currentLength = typeof value === 'string' ? value.length : 0;

    const describedBy = [
      hasError ? errorId : '',
      helper && !hasError ? helperId : '',
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    const inputClasses = [
      'skyra-input',
      hasError ? 'skyra-input--error' : '',
      left ? 'skyra-input--has-left' : '',
      right || loading || clearable ? 'skyra-input--has-right' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={`skyra-field ${wrapperClassName}`} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', width: '100%', fontFamily: 'var(--skyra-font-body)' }}>
        {label && (
          <label
            htmlFor={inputId}
            className={`skyra-label ${required ? 'skyra-label--required' : ''}`}
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
            }}
          >
            {label}
            {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
          </label>
        )}

        <div style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
          {left && (
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
                pointerEvents: 'none',
                zIndex: 1,
              }}
            >
              {left}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={inputClasses}
            value={value}
            defaultValue={defaultValue}
            onChange={onChange}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={maxLength}
            aria-invalid={hasError}
            aria-describedby={describedBy}
            aria-required={required}
            style={{
              width: '100%',
              height: '42px',
              padding: '0.65rem 0.875rem',
              paddingLeft: left ? '2.35rem' : '0.875rem',
              paddingRight: right || loading || clearable ? '2.5rem' : '0.875rem',
              background: disabled
                ? 'var(--skyra-border)'
                : readOnly
                ? 'var(--skyra-surface)'
                : 'var(--skyra-bg)',
              border: hasError
                ? '1.5px solid var(--skyra-danger)'
                : effectiveStatus === 'success'
                ? '1.5px solid var(--skyra-success)'
                : effectiveStatus === 'warning'
                ? '1.5px solid var(--skyra-warning)'
                : '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-md)',
              color: disabled
                ? 'var(--skyra-text-subtle)'
                : readOnly
                ? 'var(--skyra-text-muted)'
                : 'var(--skyra-text)',
              fontSize: '0.875rem',
              outline: 'none',
              boxSizing: 'border-box',
              cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
              transition: 'border-color 0.15s, box-shadow 0.15s',
            }}
            {...rest}
          />

          {/* Right Area: Spinner / Clear / Right Adornment */}
          <div
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--skyra-text-muted)',
              zIndex: 1,
            }}
          >
            {clearable && value && !disabled && (
              <button
                type="button"
                aria-label="Clear input"
                onClick={onClear}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  color: 'var(--skyra-text-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={14} />
              </button>
            )}

            {loading && (
              <Loader2
                size={16}
                className="skyra-spin"
                style={{ animation: 'spin 1s linear infinite', color: 'var(--skyra-primary)' }}
                aria-label="Loading"
              />
            )}

            {!loading && right && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {right}
              </div>
            )}
          </div>
        </div>

        {/* Footer: Error / Helper and Character Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div>
            {hasError && (
              <span
                id={errorId}
                className="skyra-error-msg"
                role="alert"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.78rem',
                  color: 'var(--skyra-danger)',
                }}
              >
                <AlertCircle size={12} aria-hidden="true" />
                {error}
              </span>
            )}
            {effectiveHelper && !hasError && (
              <span
                id={helperId}
                className="skyra-helper-msg"
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--skyra-text-muted)',
                }}
              >
                {effectiveHelper}
              </span>
            )}
          </div>

          {showCount && maxLength && (
            <span
              style={{
                fontSize: '0.75rem',
                color: currentLength >= maxLength ? 'var(--skyra-danger)' : 'var(--skyra-text-subtle)',
                marginLeft: 'auto',
                flexShrink: 0,
              }}
            >
              {currentLength} / {maxLength}
            </span>
          )}
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
