'use client';

import React, { useEffect, useRef } from 'react';
import '@skyra-tech-platform/radio';

export interface RadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  helper?: React.ReactNode;
  error?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-radio': any;
    }
  }
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  (
    {
      label,
      description,
      helper,
      error,
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

    // Handle React controlled paradigm
    useEffect(() => {
      const el = internalRef.current;
      if (el && checked !== undefined) {
        el.checked = checked;
      }
    }, [checked]);

    return (
      <skyra-tech-radio
        ref={(el: any) => {
          internalRef.current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as any).current = el;
        }}
        class={className || undefined}
        id={id}
        name={name}
        value={value}
        checked={checked ?? defaultChecked ? 'true' : undefined}
        label={typeof label === 'string' ? label : undefined}
        error={error}
        helper-text={typeof effectiveHelper === 'string' ? effectiveHelper : undefined}
        required={required ? 'true' : undefined}
        disabled={disabled ? true : undefined}
        {...rest}
      >
        {typeof label !== 'string' && label ? (
          <span slot="label">{label}</span>
        ) : null}
        
        {typeof effectiveHelper !== 'string' && effectiveHelper ? (
          <span slot="helper">{effectiveHelper}</span>
        ) : null}
      </skyra-tech-radio>
    );
  }
);

Radio.displayName = 'Radio';
