'use client';

import React, { useRef, useEffect } from 'react';
import '@skyra-tech-platform/date-time';

export interface CalendarProps {
  mode?: 'single' | 'range' | 'week' | 'month' | 'year';
  value?: string | null;
  rangeValue?: [string | null, string | null];
  onChange?: (date: string) => void;
  onRangeChange?: (range: [string, string]) => void;
  minDate?: string | Date;
  maxDate?: string | Date;
  disabledDate?: (date: Date) => boolean;
  disableWeekends?: boolean;
  showToday?: boolean;
  className?: string;
}

import { toISODate, parseISODate } from '@skyra-tech-platform/date-time';
export { toISODate, parseISODate };

export function Calendar({
  mode = 'single',
  value,
  rangeValue = [null, null],
  onChange,
  onRangeChange,
  minDate,
  maxDate,
  disabledDate,
  disableWeekends = false,
  showToday = true,
  className = '',
}: CalendarProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (disabledDate) {
      (el as any).disabledDate = disabledDate;
    }

    const handleChange = (e: Event) => {
      const custom = e as CustomEvent;
      onChange?.(custom.detail.value);
    };

    const handleRangeChange = (e: Event) => {
      const custom = e as CustomEvent;
      onRangeChange?.(custom.detail.value);
    };

    el.addEventListener('skyra-change', handleChange);
    el.addEventListener('skyra-range-change', handleRangeChange);
    
    return () => {
      el.removeEventListener('skyra-change', handleChange);
      el.removeEventListener('skyra-range-change', handleRangeChange);
    };
  }, [onChange, onRangeChange, disabledDate]);

  const isoMin = minDate instanceof Date ? minDate.toISOString().split('T')[0] : minDate;
  const isoMax = maxDate instanceof Date ? maxDate.toISOString().split('T')[0] : maxDate;

  return (
    <skyra-tech-calendar
      ref={ref}
      class={className}
      mode={mode}
      value={value || undefined}
      range-start={rangeValue[0] || undefined}
      range-end={rangeValue[1] || undefined}
      min={isoMin || undefined}
      max={isoMax || undefined}
      disable-weekends={disableWeekends ? '' : undefined}
      show-today={showToday ? 'true' : 'false'}
    />
  );
}
