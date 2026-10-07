'use client';

import React, { useRef, useEffect } from 'react';
import '@skyra-tech-platform/date-time';

export interface TimeRangeValue {
  start: string;
  end: string;
}

export interface TimeRangeFieldProps {
  value?: TimeRangeValue;
  onChange?: (value: TimeRangeValue) => void;
  format?: '12h' | '24h';
  minuteStep?: number;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  id?: string;
  className?: string;
}

export function TimeRangeField({
  value,
  onChange,
  format = '12h',
  minuteStep = 5,
  label,
  helper,
  description,
  error,
  disabled = false,
  required = false,
  id,
  className = '',
}: TimeRangeFieldProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const custom = e as CustomEvent;
      const val = custom.detail.value || '';
      const parts = val.split(',');
      onChange?.({ start: parts[0] || '', end: parts[1] || '' });
    };

    el.addEventListener('skyra-change', handleChange);
    return () => el.removeEventListener('skyra-change', handleChange);
  }, [onChange]);

  const valString = `${value?.start || ''},${value?.end || ''}`;

  return (
    <skyra-tech-time-range-field
      ref={ref}
      id={id}
      class={className}
      value={valString === ',' ? undefined : valString}
      format={format}
      minute-step={minuteStep}
      label={label as string}
      helper-text={(helper || description) as string}
      error={error}
      disabled={disabled ? '' : undefined}
      required={required ? '' : undefined}
    />
  );
}
