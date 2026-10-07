'use client';

import React, { useRef, useEffect } from 'react';
import '@skyra-tech-platform/date-time';

export interface DateFieldProps {
  value?: string | Date | null;
  onChange?: (date: string | null) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
  disabledDate?: (date: Date) => boolean;
  label?: React.ReactNode;
  helper?: React.ReactNode;
  description?: React.ReactNode;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  clearable?: boolean;
  format?: string;
  id?: string;
  className?: string;
}

export function DateField({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDate,
  label,
  helper,
  description,
  error,
  placeholder,
  disabled,
  required,
  clearable,
  id,
  className = '',
}: DateFieldProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabledDate) {
      (el as SkyraTechDateFieldElement).disabledDate = disabledDate;
    }

    const handleChange = (e: Event) => {
      const custom = e as CustomEvent;
      onChange?.(custom.detail.value || null);
    };

    el.addEventListener('skyra-change', handleChange);
    return () => el.removeEventListener('skyra-change', handleChange);
  }, [onChange, disabledDate]);

  const isoValue = value instanceof Date ? value.toISOString().split('T')[0] : value;
  const isoMin = minDate instanceof Date ? minDate.toISOString().split('T')[0] : minDate;
  const isoMax = maxDate instanceof Date ? maxDate.toISOString().split('T')[0] : maxDate;

  return (
    <skyra-tech-date-field
      ref={ref}
      id={id}
      class={className}
      value={isoValue || undefined}
      min={isoMin || undefined}
      max={isoMax || undefined}
      label={label as string}
      helper-text={(helper || description) as string}
      error={error}
      placeholder={placeholder}
      disabled={disabled ? '' : undefined}
      required={required ? '' : undefined}
      clearable={clearable === false ? 'false' : undefined}
    />
  );
}
