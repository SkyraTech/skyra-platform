'use client';

import React from 'react';
import { Spinner } from './Spinner';
import { AlertCircle, Inbox } from 'lucide-react';

export interface DataLoaderProps<T> {
  /** Loading flag */
  loading?: boolean;
  /** Error message or Error object */
  error?: string | Error | null;
  /** Data payload */
  data?: T | null;
  /** Custom check for empty data. Defaults to (d === null || d === undefined || (Array.isArray(d) && d.length === 0)) */
  isEmpty?: (data: T | null | undefined) => boolean;
  /** Custom loading renderer or element */
  loadingFallback?: React.ReactNode;
  /** Custom error renderer */
  errorFallback?: React.ReactNode | ((err: string | Error) => React.ReactNode);
  /** Custom empty state renderer */
  emptyFallback?: React.ReactNode;
  /** Success children render function or element */
  children: ((data: T) => React.ReactNode) | React.ReactNode;
  /** Additional wrapper CSS class */
  className?: string;
}

/**
 * @skyra/ui DataLoader
 *
 * Reusable presentation state orchestrator handling Loading, Error, Empty,
 * and Success data rendering without internal data fetching.
 */
export function DataLoader<T>({
  loading = false,
  error = null,
  data,
  isEmpty,
  loadingFallback,
  errorFallback,
  emptyFallback,
  children,
  className = '',
}: DataLoaderProps<T>) {
  // 1. Loading State
  if (loading) {
    if (loadingFallback) return <>{loadingFallback}</>;
    return (
      <div
        className={`skyra-data-loader-loading ${className}`}
        style={{
          padding: '2.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          color: 'var(--skyra-text-muted)',
          fontFamily: 'var(--skyra-font-body)' }}
      >
        <Spinner size="lg" />
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Loading data...</span>
      </div>
    );
  }

  // 2. Error State
  if (error) {
    if (typeof errorFallback === 'function') {
      return <>{errorFallback(error)}</>;
    }
    if (errorFallback) return <>{errorFallback}</>;

    const errorMsg = typeof error === 'string' ? error : error.message || 'An error occurred while loading data';
    return (
      <div
        role="alert"
        className={`skyra-data-loader-error ${className}`}
        style={{
          padding: '1.5rem',
          background: 'var(--skyra-surface)',
          border: '1px solid var(--skyra-danger)',
          borderRadius: 'var(--skyra-radius-md)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'var(--skyra-danger)',
          fontFamily: 'var(--skyra-font-body)' }}
      >
        <AlertCircle size={20} style={{ flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>Failed to load data</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{errorMsg}</div>
        </div>
      </div>
    );
  }

  // 3. Empty State
  const isDataEmpty = isEmpty
    ? isEmpty(data)
    : data === null || data === undefined || (Array.isArray(data) && data.length === 0);

  if (isDataEmpty) {
    if (emptyFallback) return <>{emptyFallback}</>;
    return (
      <div
        className={`skyra-data-loader-empty ${className}`}
        style={{
          padding: '2.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          color: 'var(--skyra-text-subtle)',
          fontFamily: 'var(--skyra-font-body)',
          textAlign: 'center' }}
      >
        <Inbox size={32} style={{ color: 'var(--skyra-text-muted)' }} />
        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--skyra-text)' }}>No records found</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>There is no data available to display at this time.</div>
      </div>
    );
  }

  // 4. Success State
  if (typeof children === 'function') {
    return <>{(children as (d: T) => React.ReactNode)(data as T)}</>;
  }

  return <>{children}</>;
}
