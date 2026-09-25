'use client';

import React, { useId } from 'react';
import { Checkbox } from './Checkbox';

export interface CheckboxGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface CheckboxGroupProps {
  /** Selected values */
  value: string[];
  /** Change handler with updated values array */
  onChange: (value: string[]) => void;
  /** Available options */
  options: CheckboxGroupOption[];
  /** Layout orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Group label */
  label?: string;
  /** Helper text / description */
  description?: string;
  /** Error message */
  error?: string;
  /** Required group flag */
  required?: boolean;
  /** Disabled entire group */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui CheckboxGroup
 *
 * Multi-option checkbox group with vertical/horizontal layout,
 * accessibility group role, descriptions, and error states.
 */
export function CheckboxGroup({
  value = [],
  onChange,
  options = [],
  orientation = 'vertical',
  label,
  description,
  error,
  required = false,
  disabled = false,
  className = '',
}: CheckboxGroupProps) {
  const uid = useId();
  const labelId = `skyra-cbg-label-${uid}`;
  const descId = `skyra-cbg-desc-${uid}`;
  const errorId = `skyra-cbg-error-${uid}`;

  const handleToggle = (optVal: string, isChecked: boolean) => {
    if (isChecked) {
      onChange([...value, optVal]);
    } else {
      onChange(value.filter((v) => v !== optVal));
    }
  };

  return (
    <fieldset
      role="group"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={error ? errorId : description ? descId : undefined}
      className={`skyra-checkbox-group ${className}`}
      style={{
        border: 'none',
        margin: 0,
        padding: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
        fontFamily: 'var(--skyra-font-body)' }}
    >
      {label && (
        <legend
          id={labelId}
          style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
            marginBottom: '0.25rem' }}
        >
          {label}
          {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
        </legend>
      )}

      {description && (
        <span
          id={descId}
          style={{
            fontSize: '0.78rem',
            color: 'var(--skyra-text-muted)',
            marginBottom: '0.25rem' }}
        >
          {description}
        </span>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: orientation === 'horizontal' ? 'row' : 'column',
          flexWrap: orientation === 'horizontal' ? 'wrap' : 'nowrap',
          gap: orientation === 'horizontal' ? '1rem' : '0.25rem' }}
      >
        {options.map((opt) => {
          const isChecked = value.includes(opt.value);
          const isOptionDisabled = disabled || opt.disabled;

          return (
            <Checkbox
              key={opt.value}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              checked={isChecked}
              disabled={isOptionDisabled}
              onChange={(e) => handleToggle(opt.value, e.target.checked)}
            />
          );
        })}
      </div>

      {error && (
        <span
          id={errorId}
          role="alert"
          style={{
            fontSize: '0.78rem',
            color: 'var(--skyra-danger)',
            marginTop: '0.25rem' }}
        >
          {error}
        </span>
      )}
    </fieldset>
  );
}
