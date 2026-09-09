'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface NativeSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
  wrapperClassName?: string;
}

/** @skyra/ui NativeSelect — native <select> with ERP styling */
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  (
    {
      label,
      error,
      helper,
      required,
      options,
      placeholder,
      id,
      className = '',
      wrapperClassName = '',
      ...rest
    },
    ref
  ) => {
    const uid = React.useId();
    const selectId = id ?? `skyra-select-${uid}`;
    const errorId = `${selectId}-error`;
    const hasError = !!error;

    return (
      <div className={`skyra-field ${wrapperClassName}`}>
        {label && (
          <label
            htmlFor={selectId}
            className={`skyra-label ${required ? 'skyra-label--required' : ''}`}
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`skyra-select ${hasError ? 'skyra-select--error' : ''} ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>
        {hasError && (
          <span id={errorId} className="skyra-error-msg" role="alert">
            <AlertCircle size={12} aria-hidden="true" />
            {error}
          </span>
        )}
        {helper && !hasError && (
          <span className="skyra-helper-msg">{helper}</span>
        )}
      </div>
    );
  }
);

NativeSelect.displayName = 'NativeSelect';
