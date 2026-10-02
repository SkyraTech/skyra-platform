'use client';

import React, { useEffect, useRef } from 'react';
import '@skyra-tech-platform/checkbox';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helper?: React.ReactNode;
  error?: string;
  indeterminate?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-checkbox': any;
    }
  }
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      description,
      helper,
      error,
      indeterminate = false,
      disabled = false,
      required = false,
      id,
      className = '',
      checked,
      defaultChecked,
      onChange,
      name,
      value,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<any>(null);
    const effectiveHelper = helper ?? description;

    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;

      const handleChange = (e: Event) => {
        if (onChange) {
          const synthEvent = Object.create(e);
          synthEvent.target = el;
          synthEvent.currentTarget = el;
          
          // Shim for React expecting event.target.checked
          Object.defineProperty(synthEvent.target, 'checked', {
            get: () => el.checked,
            configurable: true
          });
          
          onChange(synthEvent as any);
        }
      };

      el.addEventListener('change', handleChange);

      return () => {
        el.removeEventListener('change', handleChange);
      };
    }, [onChange]);

    // Handle React controlled/uncontrolled paradigm
    // For Checkbox, we must actively sync indeterminate via JS property since it's not a true DOM attribute natively,
    // although our web component maps it to an attribute, doing both is safe.
    useEffect(() => {
      const el = internalRef.current;
      if (el) {
        el.indeterminate = indeterminate;
        if (checked !== undefined) {
          el.checked = checked;
        }
      }
    }, [indeterminate, checked]);

    return (
      <skyra-tech-checkbox
        ref={(el: any) => {
          internalRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as any).current = el;
        }}
        class={className || undefined}
        id={id}
        name={name}
        value={value}
        checked={checked ?? defaultChecked ? '' : undefined}
        indeterminate={indeterminate ? '' : undefined}
        label={typeof label === 'string' ? label : undefined}
        error={error}
        helper-text={typeof effectiveHelper === 'string' ? effectiveHelper : undefined}
        required={required ? '' : undefined}
        disabled={disabled ? true : undefined}
        {...rest}
      >
        {typeof label !== 'string' && label ? (
          <span slot="label">{label}</span>
        ) : null}
        
        {typeof effectiveHelper !== 'string' && effectiveHelper ? (
          <span slot="helper">{effectiveHelper}</span>
        ) : null}
      </skyra-tech-checkbox>
    );
  }
);

Checkbox.displayName = 'Checkbox';
