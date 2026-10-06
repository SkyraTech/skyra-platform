'use client';

import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface PhoneInputFieldProps {
  label?: string;
  countryCode?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

/**
 * @skyra/ui PhoneInputField
 *
 * [B] PLATFORM EXTRACTION — generalized from ERP phone input patterns.
 * Provides a country-code prefix input alongside the phone number field.
 * Uses adapter pattern: parent controls value and onChange.
 */
export function PhoneInputField({
  label,
  countryCode = '+91',
  value,
  onChange,
  error,
  helper,
  required,
  placeholder = 'Enter phone number',
  disabled,
  id,
}: PhoneInputFieldProps) {
  const uid = useId();
  const inputId = id ?? `skyra-phone-${uid}`;
  const errorId = `${inputId}-error`;
  const hasError = !!error;

  return (
    <div className="skyra-field">
      {label && (
        <label
          htmlFor={inputId}
          className={`skyra-label ${required ? 'skyra-label--required' : ''}`}
        >
          {label}
        </label>
      )}
      <div className={`skyra-phone-input ${hasError ? 'skyra-phone-input--error' : ''}`}>
        <span className="skyra-phone-prefix" aria-hidden="true">
          {countryCode}
        </span>
        <input
          id={inputId}
          type="tel"
          className="skyra-phone-number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required}
          autoComplete="tel"
        />
      </div>
      {hasError && (
        <span id={errorId} className="skyra-error-msg" role="alert">
          <AlertCircle size={12} aria-hidden="true" />
          {error}
        </span>
      )}
      {helper && !hasError && <span className="skyra-helper-msg">{helper}</span>}
    </div>
  );
}
