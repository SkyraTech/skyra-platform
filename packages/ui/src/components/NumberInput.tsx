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
  showSteppers?: boolean;
  onChange?: (value: number | undefined) => void;
}

/**
 * @skyra/ui NumberInput
 *
 * Number input with increment/decrement steppers, min/max bounds,
 * and keyboard controls.
 */
export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      defaultValue,
      min,
      max,
      step = 1,
      showSteppers = true,
      onChange,
      disabled,
      ...props
    },
    ref
  ) => {
    const numValue = typeof value === 'number' ? value : value !== undefined ? parseFloat(value as string) : undefined;

    const handleStep = (delta: number) => {
      if (disabled) return;
      const current = numValue ?? 0;
      let next = current + delta;
      if (min !== undefined && next < min) next = min;
      if (max !== undefined && next > max) next = max;
      onChange?.(next);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const valStr = e.target.value;
      if (valStr === '') {
        onChange?.(undefined);
      } else {
        const parsed = parseFloat(valStr);
        if (!isNaN(parsed)) {
          onChange?.(parsed);
        }
      }
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
        onChange={handleChange as any}
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
                  alignItems: 'center',
                }}
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
                  alignItems: 'center',
                }}
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
