'use client';

import React, { useId } from 'react';
import { Check, X, Moon, Sun, Loader2 } from 'lucide-react';

export type SwitchVariant = 'default' | 'compact' | 'labeled' | 'icon' | 'outline';
export type SwitchSize = 'sm' | 'md' | 'lg';

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
  /** ReadOnly state */
  readOnly?: boolean;
  /** Loading state with spinner in thumb */
  loading?: boolean;
  /** Required state */
  required?: boolean;
  /** Visual variant */
  variant?: SwitchVariant;
  /** Size variant */
  size?: SwitchSize;
  /** Custom ID */
  id?: string;
  /** Name for form submissions */
  name?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui Switch
 *
 * Highly configurable accessible toggle switch supporting 5 design variants
 * (default, compact, labeled, icon, outline), 3 sizes (sm, md, lg), loading spinner,
 * and dark mode tokens.
 */
export function Switch({
  checked = false,
  defaultChecked,
  onChange,
  label,
  description,
  error,
  disabled = false,
  readOnly = false,
  loading = false,
  required = false,
  variant = 'default',
  size = 'md',
  id,
  name,
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
    if (disabled || readOnly || loading) return;
    const next = !currentChecked;
    if (!isControlled) {
      setInternalChecked(next);
    }
    onChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled || readOnly || loading) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleToggle();
    }
  };

  // Dimensions based on size and variant
  const isCompact = variant === 'compact';
  const dimensions = {
    sm: {
      trackW: isCompact ? '28px' : '34px',
      trackH: isCompact ? '16px' : '18px',
      thumbS: isCompact ? '12px' : '14px',
      translate: isCompact ? '12px' : '16px',
    },
    md: {
      trackW: isCompact ? '34px' : '44px',
      trackH: isCompact ? '18px' : '24px',
      thumbS: isCompact ? '14px' : '18px',
      translate: isCompact ? '16px' : '20px',
    },
    lg: {
      trackW: isCompact ? '42px' : '54px',
      trackH: isCompact ? '22px' : '28px',
      thumbS: isCompact ? '18px' : '22px',
      translate: isCompact ? '20px' : '26px',
    },
  }[size];

  const trackBackground = disabled
    ? 'var(--skyra-border)'
    : variant === 'outline'
    ? 'transparent'
    : currentChecked
    ? 'var(--skyra-primary)'
    : 'var(--skyra-border)';

  const trackBorder =
    variant === 'outline'
      ? currentChecked
        ? '2px solid var(--skyra-primary)'
        : '2px solid var(--skyra-border)'
      : 'none';

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
          minHeight: '38px',
          padding: '2px 0',
          cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
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
            background: trackBackground,
            border: trackBorder,
            padding: '2px',
            cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'pointer',
            transition: 'background-color 0.2s ease, border-color 0.2s ease',
            outline: 'none',
            flexShrink: 0,
            marginTop: '2px',
            display: 'inline-flex',
            alignItems: 'center',
            boxSizing: 'border-box',
          }}
        >
          {/* Labeled Variant ON/OFF Text in Track */}
          {variant === 'labeled' && (
            <span
              style={{
                position: 'absolute',
                left: currentChecked ? '6px' : 'auto',
                right: currentChecked ? 'auto' : '6px',
                fontSize: size === 'sm' ? '0.6rem' : '0.7rem',
                fontWeight: 700,
                color: currentChecked ? '#ffffff' : 'var(--skyra-text-muted)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {currentChecked ? 'ON' : 'OFF'}
            </span>
          )}

          {/* Sliding Thumb */}
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: dimensions.thumbS,
              height: dimensions.thumbS,
              borderRadius: '50%',
              background: variant === 'outline' && currentChecked ? 'var(--skyra-primary)' : '#ffffff',
              boxShadow: 'var(--skyra-shadow-sm)',
              transform: currentChecked ? `translateX(${dimensions.translate})` : 'translateX(0)',
              transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.2s ease',
              flexShrink: 0,
            }}
          >
            {loading ? (
              <Loader2 size={10} className="skyra-spin" style={{ animation: 'spin 1s linear infinite', color: 'var(--skyra-primary)' }} />
            ) : variant === 'icon' ? (
              currentChecked ? (
                <Check size={10} color="var(--skyra-primary)" strokeWidth={3} />
              ) : (
                <X size={10} color="var(--skyra-text-muted)" strokeWidth={3} />
              )
            ) : null}
          </span>
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
            marginLeft: dimensions.trackW,
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}
