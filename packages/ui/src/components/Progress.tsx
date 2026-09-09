'use client';

import React from 'react';

export interface ProgressProps {
  /** Current progress value (0 to 100). If undefined, renders indeterminate mode */
  value?: number;
  /** Maximum value (default 100) */
  max?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color tone */
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  /** Optional label or percentage display */
  showLabel?: boolean;
  /** Custom label node or string */
  label?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
  style?: React.CSSProperties;
}

const HEIGHT_MAP = {
  sm: '4px',
  md: '8px',
  lg: '12px',
};

const COLOR_MAP = {
  primary: 'var(--skyra-primary)',
  success: 'var(--skyra-success)',
  warning: 'var(--skyra-warning)',
  danger: 'var(--skyra-danger)',
};

/**
 * @skyra/ui Progress
 *
 * Linear progress bar with percentage, indeterminate animation, size variants,
 * accessible role="progressbar", and dark mode tokens.
 */
export function Progress({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  className = '',
  style,
}: ProgressProps) {
  const isIndeterminate = value === undefined;
  const clampedValue = Math.min(Math.max(value ?? 0, 0), max);
  const percent = Math.round((clampedValue / max) * 100);
  const barColor = COLOR_MAP[variant];
  const barHeight = HEIGHT_MAP[size];

  return (
    <div
      className={`skyra-progress-container ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.375rem',
        width: '100%',
        fontFamily: 'var(--skyra-font-body)',
        ...style,
      }}
    >
      {(label || showLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
          {label && <span style={{ fontWeight: 500, color: 'var(--skyra-text)' }}>{label}</span>}
          {showLabel && (
            <span style={{ fontWeight: 600, color: 'var(--skyra-text-muted)', marginLeft: 'auto' }}>
              {isIndeterminate ? 'Loading...' : `${percent}%`}
            </span>
          )}
        </div>
      )}

      {/* Progress Track */}
      <div
        role="progressbar"
        aria-valuenow={isIndeterminate ? undefined : percent}
        aria-valuemin={0}
        aria-valuemax={100}
        style={{
          width: '100%',
          height: barHeight,
          background: 'var(--skyra-border)',
          borderRadius: 'var(--skyra-radius-full)',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Progress Fill */}
        <div
          style={{
            height: '100%',
            background: barColor,
            borderRadius: 'var(--skyra-radius-full)',
            width: isIndeterminate ? '40%' : `${percent}%`,
            transition: isIndeterminate ? 'none' : 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            animation: isIndeterminate ? 'indeterminateProgress 1.4s infinite ease-in-out' : 'none',
          }}
        />
      </div>
    </div>
  );
}
