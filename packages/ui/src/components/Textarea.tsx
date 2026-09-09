'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
  wrapperClassName?: string;
}

/** @skyra/ui Textarea — [B] Platform extraction. See Input.tsx for token confirmations. */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { label, error, helper, required, id, className = '', wrapperClassName = '', ...rest },
    ref
  ) => {
    const uid = React.useId();
    const inputId = id ?? `skyra-textarea-${uid}`;
    const errorId = `${inputId}-error`;
    const hasError = !!error;

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
        <textarea
          ref={ref}
          id={inputId}
          className={`skyra-textarea ${hasError ? 'skyra-textarea--error' : ''} ${className}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          aria-required={required}
          {...rest}
        />
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

Textarea.displayName = 'Textarea';
