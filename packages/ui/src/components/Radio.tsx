'use client';

import React, { useId } from 'react';

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: React.ReactNode;
  description?: React.ReactNode;
  helper?: React.ReactNode;
  error?: string;
}

/**
 * @skyra/ui Radio
 *
 * Reusable accessible radio input primitive with ERP visual fidelity,
 * custom styled indicator dot, minimum 44x44px touch area, and descriptions.
 */
export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      helper,
      error,
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
    ref
  ) => {
    const uid = useId();
    const inputId = id ?? `skyra-radio-${uid}`;
    const descId = `${inputId}-desc`;
    const errorId = `${inputId}-error`;

    const isChecked = Boolean(checked ?? defaultChecked);
    const hasError = !!error;

    return (
      <div
        className={`skyra-radio-container ${className}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.25rem',
          ...style,
        }}
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
            position: 'relative',
          }}
        >
          {/* Native Radio Input */}
          <input
            ref={ref}
            id={inputId}
            type="radio"
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
              zIndex: 1,
            }}
            {...rest}
          />

          {/* Custom Styled Radio Circle */}
          <span
            aria-hidden="true"
            style={{
              width: '18px',
              height: '18px',
              marginTop: '3px',
              borderRadius: '50%',
              border: hasError
                ? '1.5px solid var(--skyra-danger)'
                : isChecked
                ? '1.5px solid var(--skyra-primary)'
                : '1.5px solid var(--skyra-border)',
              background: disabled ? 'var(--skyra-bg)' : 'var(--skyra-surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'all 0.15s ease',
            }}
          >
            {isChecked && (
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-primary)',
                  transition: 'transform 0.15s ease',
                }}
              />
            )}
          </span>

          {/* Label & Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
                lineHeight: '1.4',
              }}
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
                  lineHeight: '1.35',
                }}
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
              marginLeft: '28px',
            }}
          >
            {error}
          </span>
        )}
      </div>
    );
  }
);
Radio.displayName = 'Radio';
