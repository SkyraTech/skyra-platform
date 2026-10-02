'use client';

import React, { useEffect, useRef } from 'react';
import '@skyra-tech-platform/input';

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'> {
  label?: React.ReactNode;
  error?: string;
  helper?: React.ReactNode;
  helperText?: React.ReactNode;
  description?: React.ReactNode;
  status?: 'default' | 'success' | 'warning' | 'error';
  required?: boolean;
  leftAdornment?: React.ReactNode;
  prefix?: React.ReactNode;
  leadingIcon?: React.ReactNode;
  rightAdornment?: React.ReactNode;
  suffix?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  loading?: boolean;
  clearable?: boolean;
  onClear?: () => void;
  showCount?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-input': any;
    }
  }
}

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
      onInput,
      id,
      className = '',
      disabled,
      readOnly,
      type,
      placeholder,
      name,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<any>(null);
    const effectiveHelper = helperText ?? helper ?? description;
    const effectiveStatus = error ? 'error' : status;

    const left = prefix ?? leadingIcon ?? leftAdornment;
    const right = suffix ?? trailingIcon ?? rightAdornment;

    // React 18/19 custom element DOM bridging
    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const handleClear = () => {
        onClear?.();
      };
      
      const handleChange = (e: Event) => {
        if (onChange) {
          // Synthetic event mapping
          const synthEvent = Object.create(e);
          Object.defineProperty(synthEvent, 'target', { value: el, enumerable: true });
          Object.defineProperty(synthEvent, 'currentTarget', { value: el, enumerable: true });
          onChange(synthEvent as any);
        }
      };

      const handleInput = (e: Event) => {
        if (onInput) {
          const synthEvent = Object.create(e);
          Object.defineProperty(synthEvent, 'target', { value: el, enumerable: true });
          Object.defineProperty(synthEvent, 'currentTarget', { value: el, enumerable: true });
          onInput(synthEvent as any);
        }
      };

      el.addEventListener('clear', handleClear);
      el.addEventListener('change', handleChange);
      el.addEventListener('input', handleInput);

      return () => {
        el.removeEventListener('clear', handleClear);
        el.removeEventListener('change', handleChange);
        el.removeEventListener('input', handleInput);
      };
    }, [onClear, onChange, onInput]);

    return (
      <skyra-tech-input
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
        loading={loading ? 'true' : undefined}
        clearable={clearable ? 'true' : undefined}
        show-count={showCount ? 'true' : undefined}
        disabled={disabled ? true : undefined}
        readonly={readOnly ? true : undefined}
        maxlength={maxLength}
        type={type}
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

        {left ? <span slot="left-icon">{left}</span> : null}
        {right ? <span slot="right-icon">{right}</span> : null}
      </skyra-tech-input>
    );
  }
);

Input.displayName = 'Input';
