'use client';

import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import '@skyra-tech-platform/input';

export interface PasswordInputProps extends Omit<React.ComponentProps<'skyra-tech-input'>, 'type' | 'rightAdornment' | 'suffix'> {
  /** Allow toggling password visibility */
  showToggle?: boolean;
}

/**
 * @skyra-tech-platform/input PasswordInput
 *
 * Specialized password input with show/hide password toggle button.
 */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ showToggle = true, ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <skyra-tech-input
        ref={ref}
        type={isVisible ? 'text' : 'password'}
        {...props}
      >
        {showToggle && (
          <button
            slot="right-icon"
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
              alignItems: 'center'
            }}
          >
            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </skyra-tech-input>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
