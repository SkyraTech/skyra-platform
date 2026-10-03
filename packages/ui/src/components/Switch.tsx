'use client';

import React, { useEffect, useRef } from 'react';
import { defineSkyraTechSwitch } from '@skyra-tech-platform/switch';

// Ensure the web component is registered when this module is loaded on the client
if (typeof window !== 'undefined') {
  defineSkyraTechSwitch();
}

export type SwitchVariant = 'default' | 'compact' | 'labeled' | 'icon' | 'outline';
export type SwitchSize = 'sm' | 'md' | 'lg';

export interface SwitchProps {
  /** Checked state (controlled) */
  checked?: boolean;
  /** Default checked state */
  defaultChecked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Label text or node */
  label?: React.ReactNode;
  /** Helper text / description */
  description?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** ReadOnly state */
  readOnly?: boolean;
  /** Loading state with spinner in thumb */
  loading?: boolean;
  /** Required state */
  required?: boolean;
  /** Visual variant */
  variant?: SwitchVariant;
  /** Size variant */
  size?: SwitchSize;
  /** Custom ID */
  id?: string;
  /** Name for form submissions */
  name?: string;
  /** Additional CSS class */
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-switch': any;
    }
  }
}

export const Switch = React.forwardRef<HTMLElement, SwitchProps>((
  {
    checked,
    defaultChecked,
    onChange,
    label,
    description,
    error,
    disabled = false,
    readOnly = false,
    loading = false,
    required = false,
    variant = 'default',
    size = 'md',
    id,
    name,
    className = '',
  },
  ref
) => {
  const internalRef = useRef<any>(null);

  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      if (onChange) {
        onChange(el.checked);
      }
    };

    el.addEventListener('change', handleChange);
    return () => el.removeEventListener('change', handleChange);
  }, [onChange]);

  // Handle controlled checked state updates
  useEffect(() => {
    const el = internalRef.current;
    if (el && checked !== undefined) {
      el.checked = checked;
    }
  }, [checked]);

  return (
    <skyra-tech-switch
      ref={(el: any) => {
        internalRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) (ref as any).current = el;
      }}
      class={className || undefined}
      id={id}
      name={name}
      checked={checked ?? defaultChecked ? 'true' : undefined}
      disabled={disabled ? 'true' : undefined}
      readonly={readOnly ? 'true' : undefined}
      required={required ? 'true' : undefined}
      loading={loading ? 'true' : undefined}
      variant={variant}
      size={size}
      label={typeof label === 'string' ? label : undefined}
      helper-text={typeof description === 'string' ? description : undefined}
      error={error}
      invalid={error ? '' : undefined}
    >
      {typeof label !== 'string' && label ? <span slot="label">{label}</span> : null}
      {typeof description !== 'string' && description ? <span slot="helper">{description}</span> : null}
    </skyra-tech-switch>
  );
});

Switch.displayName = 'Switch';
