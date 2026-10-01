'use client';

import React, { useRef, useEffect } from 'react';
import '@skyra-tech-platform/date-time';

export interface DateRangeValue {
  startDate: string | null;
  endDate: string | null;
}

export interface DateRangeFieldProps {
  value?: DateRangeValue;
  onChange?: (value: DateRangeValue) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
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

export function DateRangeField({
  value,
  onChange,
  minDate,
  maxDate,
  label,
  helper,
  description,
  error,
  disabled,
  required,
  clearable,
  id,
  className = '',
}: DateRangeFieldProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const custom = e as CustomEvent;
      onChange?.(custom.detail.value);
    };

    el.addEventListener('skyra-change', handleChange);
    return () => el.removeEventListener('skyra-change', handleChange);
  }, [onChange]);

  const isoMin = minDate instanceof Date ? minDate.toISOString().split('T')[0] : minDate;
  const isoMax = maxDate instanceof Date ? maxDate.toISOString().split('T')[0] : maxDate;

  return (
    <skyra-tech-date-range-field
      ref={ref}
      id={id}
      class={className}
      start-value={value?.startDate || undefined}
      end-value={value?.endDate || undefined}
      min={isoMin || undefined}
      max={isoMax || undefined}
      label={label as string}
      helper-text={(helper || description) as string}
      error={error}
      disabled={disabled ? '' : undefined}
      required={required ? '' : undefined}
      clearable={clearable === false ? 'false' : undefined}
    />
  );
}
