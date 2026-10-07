'use client';

import React, { useRef, useEffect } from 'react';
import '@skyra-tech-platform/date-time';

export interface DateTimeValue {
  date: string | null;
  time: string;
}

export interface DateTimeFieldProps {
  value?: DateTimeValue;
  onChange?: (value: DateTimeValue) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  timeFormat?: '12h' | '24h';
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

export function DateTimeField({
  value = { date: null, time: '' },
  onChange,
  minDate,
  maxDate,
  label,
  helper,
  description,
  error,
  timeFormat = '12h',
  disabled = false,
  required = false,
  className = '',
}: DateTimeFieldProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const custom = e as CustomEvent;
      const v = custom.detail.value;
      const parts = v ? v.split('T') : [];
      onChange?.({ date: parts[0] || null, time: parts[1] || '' });
    };

    el.addEventListener('skyra-change', handleChange);
    return () => el.removeEventListener('skyra-change', handleChange);
  }, [onChange]);

  const isoMin = minDate instanceof Date ? minDate.toISOString().split('T')[0] : minDate;
  const isoMax = maxDate instanceof Date ? maxDate.toISOString().split('T')[0] : maxDate;
  const valString = value.date ? (value.time ? `${value.date}T${value.time}` : value.date) : '';

  return (
    <skyra-tech-date-time-field
      ref={ref}
      class={className}
      value={valString || undefined}
      min={isoMin || undefined}
      max={isoMax || undefined}
      label={label as string}
      helper-text={(helper || description) as string}
      error={error}
      time-format={timeFormat}
      disabled={disabled ? '' : undefined}
      required={required ? '' : undefined}
    />
  );
}
