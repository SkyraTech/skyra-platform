'use client';

import React from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps {
  size?: SpinnerSize;
  color?: string;
  label?: string;
  className?: string;
}

/** @skyra/ui Spinner — [B] confirmed from ERP .spinner, 0.7s linear, border-top currentColor */
export function Spinner({ size = 'md', color, label = 'Loading...', className = '' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={`skyra-spinner skyra-spinner--${size} ${className}`}
      style={color ? { borderTopColor: color } : undefined}
    />
  );
}
