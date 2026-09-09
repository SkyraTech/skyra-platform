'use client';

import React, { useId } from 'react';

export interface SwitchProps {
  /** Checked state (controlled) */
  checked?: boolean;
  /** Default checked state */
  defaultChecked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Label text or node */
  label?: React.ReactNode;
  /** Helper text / description */
  description?: React.ReactNode;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Required state */
  required?: boolean;
  /** Custom ID */
  id?: string;
  /** Name for form submissions */
  name?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui Switch
 *
 * Accessible toggle switch with smooth sliding thumb, dark mode tokens,
 * labels, descriptions, and error states.
 */
export function Switch({
  checked = false,
  defaultChecked,
  onChange,
  label,
  description,
  error,
  disabled = false,
  required = false,
  id,
  name,
  size = 'md',
  className = '',
}: SwitchProps) {
  const uid = useId();
  const switchId = id ?? `skyra-switch-${uid}`;
  const labelId = `${switchId}-label`;
  const descId = `${switchId}-desc`;
  const errorId = `${switchId}-error`;

  const [internalChecked, setInternalChecked] = React.useState(defaultChecked ?? checked);
  const isControlled = typeof checked === 'boolean' && defaultChecked === undefined;
  const currentChecked = isControlled ? checked : internalChecked;

  const handleToggle = () => {
    if (disabled) return;
    const next = !currentChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Dimensions based on size
  const dimensions = {
    sm: { trackW: '32px', trackH: '18px', thumbS: '14px', translate: '14px' },
    md: { trackW: '40px', trackH: '22px', thumbS: '18px', translate: '18px' },
    lg: { trackW: '48px', trackH: '26px', thumbS: '22px', translate: '22px' },
  }[size];

  return (
    <div
      className={`skyra-switch-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        fontFamily: 'var(--skyra-font-body)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          minHeight: '44px',
          padding: '4px 0',
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
        onClick={handleToggle}
      >
        {/* Toggle Track */}
        <button
          id={switchId}
          type="button"
          role="switch"
          name={name}
          aria-checked={currentChecked}
          aria-labelledby={label ? labelId : undefined}
          aria-describedby={error ? errorId : description ? descId : undefined}
          aria-disabled={disabled}
          aria-required={required}
          disabled={disabled}
          onKeyDown={handleKeyDown}
          style={{
            position: 'relative',
            width: dimensions.trackW,
            height: dimensions.trackH,
            borderRadius: 'var(--skyra-radius-full)',
            background: disabled
              ? 'var(--skyra-border)'
              : currentChecked
              ? 'var(--skyra-primary)'
              : 'var(--skyra-border)',
            border: 'none',
            padding: '2px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s ease',
            outline: 'none',
            flexShrink: 0,
            marginTop: '2px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
        >
          {/* Sliding Thumb */}
          <span
            style={{
              display: 'block',
              width: dimensions.thumbS,
              height: dimensions.thumbS,
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: 'var(--skyra-shadow-sm)',
              transform: currentChecked ? `translateX(${dimensions.translate})` : 'translateX(0)',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          />
        </button>

        {/* Label and Description */}
        {(label || description) && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {label && (
              <span
                id={labelId}
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: disabled ? 'var(--skyra-text-subtle)' : 'var(--skyra-text)',
                  lineHeight: '1.4',
                }}
              >
                {label}
                {required && <span style={{ color: 'var(--skyra-danger)', marginLeft: '4px' }}>*</span>}
              </span>
            )}
            {description && (
              <span
                id={descId}
                style={{
                  fontSize: '0.78rem',
                  color: 'var(--skyra-text-muted)',
                  lineHeight: '1.35',
                }}
              >
                {description}
              </span>
            )}
          </div>
        )}
      </div>

      {error && (
        <span
          id={errorId}
          role="alert"
          style={{
            fontSize: '0.78rem',
            color: 'var(--skyra-danger)',
            marginLeft: '48px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
