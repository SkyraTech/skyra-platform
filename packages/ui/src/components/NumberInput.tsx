'use client';

import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface NumberInputProps extends Omit<InputProps, 'type' | 'onChange'> {
  value?: number | string;
  defaultValue?: number | string;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  showSteppers?: boolean;
  onChange?: (value: number | undefined) => void;
}

/**
 * @skyra/ui NumberInput
 *
 * Number input with increment/decrement steppers, min/max bounds,
 * precision rounding, and keyboard controls.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      defaultValue,
      min,
      max,
      step = 1,
      precision,
      showSteppers = true,
      onChange,
      onKeyDown,
      disabled,
      ...props
    },
    ref
  ) => {
    const numValue = typeof value === 'number' ? value : value !== undefined && value !== '' ? parseFloat(value as string) : undefined;

    const roundToPrecision = (val: number): number => {
      if (precision === undefined) return val;
      const factor = Math.pow(10, precision);
      return Math.round(val * factor) / factor;
    };

    const handleStep = (delta: number) => {
      if (disabled) return;
      const current = numValue ?? 0;
      let next = current + delta;
      if (min !== undefined && next < min) next = min;
      if (max !== undefined && next > max) next = max;
      onChange?.(roundToPrecision(next));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valStr = e.target.value;
      if (valStr === '') {
        onChange?.(undefined);
      } else {
        const parsed = parseFloat(valStr);
        if (!isNaN(parsed)) {
          onChange?.(precision !== undefined ? roundToPrecision(parsed) : parsed);
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleStep(step);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleStep(-step);
      }
      onKeyDown?.(e);
    };

    return (
      <Input
        ref={ref}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value ?? ''}
        defaultValue={defaultValue}
        disabled={disabled}
        onChange={handleChange as unknown as React.ChangeEventHandler<HTMLInputElement>}
        onKeyDown={handleKeyDown}
        rightAdornment={
          showSteppers ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
              <button
                type="button"
                aria-label="Decrease value"
                disabled={disabled || (min !== undefined && numValue !== undefined && numValue <= min)}
                onClick={() => handleStep(-step)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  color: 'var(--skyra-text-muted)',
                  display: 'flex',
                  alignItems: 'center' }}
              >
                <Minus size={14} />
              </button>
              <button
                type="button"
                aria-label="Increase value"
                disabled={disabled || (max !== undefined && numValue !== undefined && numValue >= max)}
                onClick={() => handleStep(step)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '2px',
                  cursor: 'pointer',
                  color: 'var(--skyra-text-muted)',
                  display: 'flex',
                  alignItems: 'center' }}
              >
                <Plus size={14} />
              </button>
            </div>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

NumberInput.displayName = 'NumberInput';
