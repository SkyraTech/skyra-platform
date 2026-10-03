'use client';

import React, { useEffect, useRef } from 'react';
import { SkyraTechTextarea } from '@skyra-tech-platform/textarea';
import '@skyra-tech-platform/textarea';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helper?: React.ReactNode;
  helperText?: React.ReactNode;
  status?: 'default' | 'success' | 'warning' | 'error';
  error?: string;
  required?: boolean;
  minRows?: number;
  maxRows?: number;
  autoResize?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  showCount?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-textarea': any;
    }
  }
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      description,
      helper,
      helperText,
      status = 'default',
      error,
      required,
      minRows = 3,
      maxRows,
      autoResize = false,
      resize = 'vertical',
      showCount = false,
      maxLength,
      value,
      defaultValue,
      onChange,
      id,
      className = '',
      disabled,
      readOnly,
      rows = 3,
      name,
      placeholder,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<any>(null);
    const effectiveHelper = helperText ?? helper ?? description;
    const effectiveStatus = error ? 'error' : status;

    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const handleChange = (e: Event) => {
        if (onChange) {
          const synthEvent = Object.create(e);
          synthEvent.target = el;
          synthEvent.currentTarget = el;
          onChange(synthEvent as any);
        }
      };

      const handleInput = (e: Event) => {
        if (rest.onInput) {
          const synthEvent = Object.create(e);
          synthEvent.target = el;
          synthEvent.currentTarget = el;
          rest.onInput(synthEvent as any);
        }
      };

      el.addEventListener('change', handleChange);
      el.addEventListener('input', handleInput);

      return () => {
        el.removeEventListener('change', handleChange);
        el.removeEventListener('input', handleInput);
      };
    }, [onChange, rest.onInput]);

    return (
      <skyra-tech-textarea
        ref={(el: any) => {
          internalRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as any).current = el;
        }}
        class={className || undefined}
        id={id}
        value={value ?? defaultValue}
        label={typeof label === 'string' ? label : undefined}
        error={error}
        helper-text={typeof effectiveHelper === 'string' ? effectiveHelper : undefined}
        status={effectiveStatus}
        required={required ? 'true' : undefined}
        invalid={error ? '' : undefined}
        show-count={showCount ? 'true' : undefined}
        auto-resize={autoResize ? 'true' : undefined}
        resize={resize}
        min-rows={minRows}
        max-rows={maxRows}
        disabled={disabled ? true : undefined}
        readonly={readOnly ? true : undefined}
        maxlength={maxLength}
        rows={rows}
        placeholder={placeholder}
        name={name}
        {...rest}
      >
        {typeof label !== 'string' && label ? (
          <span slot="label">{label}</span>
        ) : null}
        
        {typeof effectiveHelper !== 'string' && effectiveHelper ? (
          <span slot="helper">{effectiveHelper}</span>
        ) : null}
      </skyra-tech-textarea>
    );
  }
);

Textarea.displayName = 'Textarea';
