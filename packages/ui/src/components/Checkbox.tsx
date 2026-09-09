'use client';

import React, { useId } from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label: string;
  error?: string;
  helper?: string;
}

/** @skyra/ui Checkbox — [B] confirmed from ERP DynamicForm.module.css .checkbox */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helper, id, className = '', ...rest }, ref) => {
    const uid = useId();
    const inputId = id ?? `skyra-checkbox-${uid}`;
    const errorId = `${inputId}-error`;
    const hasError = !!error;

    return (
      <div className="skyra-field">
        <label className="skyra-checkbox-row" htmlFor={inputId}>
          <input
            ref={ref}
            id={inputId}
            type="checkbox"
            className={`skyra-checkbox ${className}`}
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError}
            {...rest}
          />
          <span className="skyra-checkbox-label">{label}</span>
        </label>
        {hasError && (
          <span id={errorId} className="skyra-error-msg" role="alert">
            {error}
          </span>
        )}
        {helper && !hasError && <span className="skyra-helper-msg">{helper}</span>}
      </div>
    );
  }
);
Checkbox.displayName = 'Checkbox';
