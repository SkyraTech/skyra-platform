'use client';

import React from 'react';
import { Spinner } from './Spinner';

export interface OverlayLoaderProps {
  /** Active loading state */
  loading?: boolean;
  /** Optional message */
  message?: string;
  /** Children content underneath overlay */
  children?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui OverlayLoader
 *
 * Container-level loading overlay with semi-transparent backdrop.
 */
export function OverlayLoader({
  loading = true,
  message,
  children,
  className = '',
}: OverlayLoaderProps) {
  return (
    <div className={`skyra-overlay-loader-wrapper ${className}`} style={{ position: 'relative', width: '100%' }}>
      {children}
      {loading && (
        <div
          role="status"
          aria-label={message || 'Loading'}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            zIndex: 50,
            borderRadius: 'inherit',
            color: '#ffffff',
            fontFamily: 'var(--skyra-font-body)' }}
        >
          <Spinner size="lg" color="#ffffff" />
          {message && <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{message}</span>}
        </div>
      )}
    </div>
  );
}
