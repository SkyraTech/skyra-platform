'use client';

import React, { useEffect, useRef, useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helper?: React.ReactNode;
  error?: string;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  showCount?: boolean;
  wrapperClassName?: string;
}

/**
 * @skyra/ui Textarea
 *
 * [B] PLATFORM EXTRACTION + [C] ENHANCEMENT
 * Multi-line text input with auto-resize, minRows/maxRows bounds,
 * character counter, dark mode, and ERP styling.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      helper,
      error,
      required,
      minRows = 3,
      maxRows,
      autoResize = false,
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      id,
      className = '',
      wrapperClassName = '',
      disabled,
      rows = 3,
      ...rest
    },
    forwardedRef
  ) => {
    const uid = useId();
    const textareaId = id ?? `skyra-textarea-${uid}`;
    const errorId = `${textareaId}-error`;
    const helperId = `${textareaId}-helper`;
    const descId = `${textareaId}-desc`;
    const hasError = !!error;

    const innerRef = useRef<HTMLTextAreaElement>(null);

    const currentLength = typeof value === 'string' ? value.length : 0;

    // Handle auto-resize
    useEffect(() => {
      const el = (forwardedRef && 'current' in forwardedRef && forwardedRef.current) || innerRef.current;
      if (!el || !autoResize) return;

      el.style.height = 'auto';
      const lineHeight = 20;
      const minHeight = minRows * lineHeight + 20;
      const calculatedHeight = Math.max(el.scrollHeight, minHeight);

      if (maxRows) {
        const maxHeight = maxRows * lineHeight + 20;
        el.style.height = `${Math.min(calculatedHeight, maxHeight)}px`;
        el.style.overflowY = calculatedHeight > maxHeight ? 'auto' : 'hidden';
      } else {
        el.style.height = `${calculatedHeight}px`;
      }
    }, [value, autoResize, minRows, maxRows, forwardedRef]);

    const describedBy = [
      hasError ? errorId : '',
      description ? descId : '',
      helper && !hasError ? helperId : '',
    ]
      .filter(Boolean)
      .join(' ') || undefined;

    return (
      <div
        className={`skyra-field ${wrapperClassName}`}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.375rem',
          width: '100%',
          fontFamily: 'var(--skyra-font-body)',
        }}
      >
        {label && (
          <label
            htmlFor={textareaId}
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

        <textarea
          ref={(node) => {
            (innerRef as any).current = node;
            if (typeof forwardedRef === 'function') {
              forwardedRef(node);
            } else if (forwardedRef) {
              (forwardedRef as any).current = node;
            }
          }}
          id={textareaId}
          rows={rows}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          disabled={disabled}
          maxLength={maxLength}
          aria-invalid={hasError}
          aria-describedby={describedBy}
          aria-required={required}
          className={`skyra-textarea ${hasError ? 'skyra-input--error' : ''} ${className}`}
          style={{
            width: '100%',
            padding: '0.65rem 0.875rem',
            background: disabled ? 'var(--skyra-border)' : 'var(--skyra-bg)',
            border: hasError ? '1.5px solid var(--skyra-danger)' : '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            outline: 'none',
            boxSizing: 'border-box',
            resize: autoResize ? 'none' : 'vertical',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          {...rest}
        />

        {/* Footer: Error / Helper and Character Count */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
          <div>
            {hasError && (
              <span
                id={errorId}
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
            {(description || helper) && !hasError && (
              <span
                id={helper ? helperId : descId}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--skyra-text-muted)',
                }}
              >
                {description || helper}
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

Textarea.displayName = 'Textarea';
