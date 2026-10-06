'use client';

import React, { useRef, useEffect } from 'react';
import '@skyra-tech-platform/date-time';

export interface TimeFieldProps {
  value?: string;
  onChange?: (time: string) => void;
  format?: '12h' | '24h';
  minuteStep?: number;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  id?: string;
  className?: string;
}

export function TimeField({
  value = '',
  onChange,
  format = '12h',
  minuteStep = 5,
  label,
  helper,
  description,
  error,
  disabled = false,
  required = false,
  clearable = true,
  id,
  className = '',
}: TimeFieldProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const custom = e as CustomEvent;
      onChange?.(custom.detail.value || '');
    };

    el.addEventListener('skyra-change', handleChange);
    return () => el.removeEventListener('skyra-change', handleChange);
  }, [onChange]);

  return (
    <skyra-tech-time-field
      ref={ref}
      id={id}
      class={className}
      value={value}
      format={format}
      minute-step={minuteStep}
      label={label as string}
      helper-text={(helper || description) as string}
      error={error}
      disabled={disabled ? '' : undefined}
      required={required ? '' : undefined}
      clearable={clearable === false ? 'false' : undefined}
    />
  );
}
