'use client';

import React, { useId } from 'react';
import { Radio } from './Radio';

export interface RadioGroupOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps {
  /** Selected value */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Available options */
  options: RadioGroupOption[];
  /** Name attribute for grouped radios */
  name?: string;
  /** Orientation */
  orientation?: 'vertical' | 'horizontal';
  /** Group label */
  label?: string;
  /** Helper text */
  description?: string;
  /** Error message */
  error?: string;
  /** Required flag */
  required?: boolean;
  /** Disabled flag */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui RadioGroup
 *
 * Accessible radio group with roving focus / native keyboard semantics,
 * horizontal/vertical layouts, descriptions, and error states.
 */
export function RadioGroup({
  value,
  onChange,
  options = [],
  name,
  orientation = 'vertical',
  label,
  description,
  error,
  required = false,
  disabled = false,
  className = '',
}: RadioGroupProps) {
  const uid = useId();
  const groupName = name ?? `skyra-radiogroup-${uid}`;
  const labelId = `skyra-rg-label-${uid}`;
  const descId = `skyra-rg-desc-${uid}`;
  const errorId = `skyra-rg-error-${uid}`;

  return (
    <fieldset
      role="radiogroup"
      aria-labelledby={label ? labelId : undefined}
      aria-describedby={error ? errorId : description ? descId : undefined}
      className={`skyra-radio-group ${className}`}
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
          gap: orientation === 'horizontal' ? '1.25rem' : '0.25rem' }}
      >
        {options.map((opt) => {
          const isChecked = value === opt.value;
          const isOptionDisabled = disabled || opt.disabled;

          return (
            <Radio
              key={opt.value}
              name={groupName}
              value={opt.value}
              label={opt.label}
              description={opt.description}
              checked={isChecked}
              disabled={isOptionDisabled}
              onChange={() => onChange(opt.value)}
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
