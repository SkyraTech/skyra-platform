'use client';

import React from 'react';

export interface CircularProgressProps {
  /** Value between 0 and 100. If omitted, renders indeterminate mode */
  value?: number;
  /** Size in pixels (default 40) */
  size?: number;
  /** Stroke thickness in pixels (default 4) */
  strokeWidth?: number;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  /** Show centered percentage text */
  showValue?: boolean;
  /** Additional CSS class */
  className?: string;
}

const COLOR_MAP = {
  primary: 'var(--skyra-primary)',
  success: 'var(--skyra-success)',
  warning: 'var(--skyra-warning)',
  danger: 'var(--skyra-danger)',
};

/**
 * @skyra/ui CircularProgress
 *
 * SVG circular progress indicator with percentage, indeterminate spinner,
 * and accessible role="progressbar".
 */
export function CircularProgress({
  value,
  size = 40,
  strokeWidth = 4,
  variant = 'primary',
  showValue = false,
  className = '',
}: CircularProgressProps) {
  const isIndeterminate = value === undefined;
  const clamped = Math.min(Math.max(value ?? 0, 0), 100);
  const color = COLOR_MAP[variant];

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={isIndeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`skyra-circular-progress ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${size}px`,
        height: `${size}px` }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: isIndeterminate ? 'none' : 'rotate(-90deg)',
          }}
      >
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--skyra-border)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress Arc */}
        <circle
          className={!isIndeterminate ? 'skyra-circular-progress-arc' : undefined}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={isIndeterminate ? circumference * 0.75 : strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
        />
      </svg>

      {/* Value Label inside circle */}
      {!isIndeterminate && showValue && (
        <span
          style={{
            position: 'absolute',
            fontSize: `${Math.max(10, Math.floor(size * 0.26))}px`,
            fontWeight: 700,
            color: 'var(--skyra-text)',
            fontFamily: 'var(--skyra-font-body)' }}
        >
          {clamped}%
        </span>
      )}
    </div>
  );
}
