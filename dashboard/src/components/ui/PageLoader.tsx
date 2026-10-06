'use client';

import React from 'react';
import { Spinner } from './Spinner';

export interface PageLoaderProps {
  /** Loading message */
  message?: string;
  /** Subtitle or detail message */
  description?: string;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui PageLoader
 *
 * Full-page branded loading screen with Skyra Spinner and status message.
 */
export function PageLoader({
  message = 'Loading application...',
  description,
  className = '',
}: PageLoaderProps) {
  return (
    <div
      role="status"
      aria-label={message}
      className={`skyra-page-loader ${className}`}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--skyra-bg)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        gap: '1rem',
        fontFamily: 'var(--skyra-font-body)' }}
    >
      <Spinner size="xl" />
      <div style={{ textAlign: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-display)' }}>
          {message}
        </h3>
        {description && (
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
