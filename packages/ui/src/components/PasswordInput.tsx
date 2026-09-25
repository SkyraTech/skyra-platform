'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface PasswordInputProps extends Omit<InputProps, 'type' | 'rightAdornment' | 'suffix'> {
  /** Allow toggling password visibility */
  showToggle?: boolean;
}

/**
 * @skyra/ui PasswordInput
 *
 * Specialized password input with show/hide password toggle button.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <Input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        rightAdornment={
          showToggle ? (
            <button
              type="button"
              aria-label={isVisible ? 'Hide password' : 'Show password'}
              onClick={() => setIsVisible((prev) => !prev)}
              style={{
                background: 'none',
                border: 'none',
                padding: '2px',
                cursor: 'pointer',
                color: 'var(--skyra-text-muted)',
                display: 'flex',
                alignItems: 'center' }}
            >
              {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          ) : undefined
        }
        {...props}
      />
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
