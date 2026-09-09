'use client';

import React from 'react';

export type BadgeVariant = 'primary' | 'orange' | 'success' | 'danger' | 'warning' | 'neutral' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: React.ReactNode;
}

/**
 * @skyra/ui Badge — [B] Platform extraction from skyra-erp/src/styles/ui.css .badge-*
 * Generic status/category label. NOT invoice-specific.
 */
export function Badge({ variant = 'neutral', size = 'md', className = '', children, ...rest }: BadgeProps) {
  return (
    <span
      className={['skyra-badge', `skyra-badge--${variant}`, `skyra-badge--${size}`, className].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </span>
  );
}
