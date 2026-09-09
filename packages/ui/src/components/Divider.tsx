'use client';

import React from 'react';

export interface DividerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

/** @skyra/ui Divider — [B] confirmed from ERP .divider */
export function Divider({ size = 'md', label, className = '' }: DividerProps) {
  if (label) {
    return (
      <div
        className={`skyra-divider-label skyra-divider--${size} ${className}`}
        role="separator"
        aria-label={label}
      >
        {label}
      </div>
    );
  }
  return (
    <hr
      className={`skyra-divider skyra-divider--${size} ${className}`}
      role="separator"
      aria-hidden="true"
    />
  );
}
