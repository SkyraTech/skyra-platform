'use client';

import React from 'react';

export type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  label?: string;
  showLabel?: boolean;
  inline?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const SIZE_MAP: Record<SpinnerSize, number> = {
  xs: 12,
  sm: 16,
  md: 22,
  lg: 32,
  xl: 44,
};

const BORDER_MAP: Record<SpinnerSize, number> = {
  xs: 1.5,
  sm: 2,
  md: 2.5,
  lg: 3,
  xl: 4,
};

/**
 * @skyra/ui Spinner
 *
 * Skyra branded spinner with smooth rotation, dark mode tokens,
 * size matrix (xs–xl), and accessible status semantics.
 */
export function Spinner({
  size = 'md',
  color = 'var(--skyra-primary)',
  label = 'Loading...',
  showLabel = false,
  inline = true,
  className = '',
  style,
}: SpinnerProps) {
  const pixelSize = SIZE_MAP[size];
  const borderWidth = BORDER_MAP[size];

  return (
    <span
      role="status"
      aria-label={label}
      className={`skyra-spinner-wrapper skyra-spinner--${size} ${className}`}
      style={{
        display: inline ? 'inline-flex' : 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        ...style,
      }}
    >
      <span
        style={{
          width: `${pixelSize}px`,
          height: `${pixelSize}px`,
          borderRadius: '50%',
          borderWidth: `${borderWidth}px`,
          borderStyle: 'solid',
          borderColor: 'var(--skyra-border)',
          borderTopColor: color,
          display: 'inline-block',
          boxSizing: 'border-box',
          animation: 'spin 0.75s linear infinite',
          flexShrink: 0,
        }}
      />
      {showLabel && (
        <span style={{ fontSize: size === 'xs' || size === 'sm' ? '0.78rem' : '0.875rem', color: 'var(--skyra-text-muted)', fontWeight: 500 }}>
          {label}
        </span>
      )}
    </span>
  );
}
