'use client';

import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  flat?: boolean;
  children: React.ReactNode;
}

/** @skyra/ui Card — confirmed: radius-xl, shadow-sm, surface bg */
export function Card({ size = 'md', flat = false, className = '', children, ...rest }: CardProps) {
  return (
    <div
      className={[
        'skyra-card',
        size === 'sm' ? 'skyra-card--sm' : size === 'lg' ? 'skyra-card--lg' : '',
        flat ? 'skyra-card--flat' : '',
        className,
      ].filter(Boolean).join(' ')}
      {...rest}
    >
      {children}
    </div>
  );
}
