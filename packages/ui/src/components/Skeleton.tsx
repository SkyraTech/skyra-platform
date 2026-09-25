'use client';

import React from 'react';

export interface SkeletonProps {
  /** Width in pixels or CSS units (e.g. '100%', '200px') */
  width?: string | number;
  /** Height in pixels or CSS units (e.g. '20px', 40) */
  height?: string | number;
  /** Radius variant */
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Animation: shimmer, pulse, or none */
  animation?: 'shimmer' | 'pulse' | 'none';
  /** Additional CSS class */
  className?: string;
  style?: React.CSSProperties;
}

const RADIUS_MAP = {
  none: '0',
  sm: 'var(--skyra-radius-sm)',
  md: 'var(--skyra-radius-md)',
  lg: 'var(--skyra-radius-lg)',
  full: '9999px',
};

/**
 * @skyra/ui Skeleton Primitive
 */
export function Skeleton({
  width = '100%',
  height = '1rem',
  radius = 'md',
  animation = 'pulse',
  className = '',
  style,
}: SkeletonProps) {
  const w = typeof width === 'number' ? `${width}px` : width;
  const h = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      aria-hidden="true"
      className={ `skyra-skeleton ${className}`}
      style={{
        width: w,
        height: h,
        borderRadius: RADIUS_MAP[radius],
        background: 'var(--skyra-border)',
        
        flexShrink: 0,
        ...style }}
    />
  );
}

/**
 * SkeletonText — Multi-line paragraph skeleton
 */
export function SkeletonText({
  lines = 3,
  gap = '0.5rem',
  className = '',
}: {
  lines?: number;
  gap?: string;
  className?: string;
}) {
  return (
    <div className={`skyra-skeleton-text ${className}`} style={{ display: 'flex', flexDirection: 'column', gap, width: '100%' }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 && lines > 1 ? '60%' : '100%'}
          radius="sm"
        />
      ))}
    </div>
  );
}

/**
 * SkeletonAvatar — Circular avatar skeleton
 */
export function SkeletonAvatar({
  size = 40,
  className = '',
}: {
  size?: number;
  className?: string;
}) {
  return <Skeleton width={size} height={size} radius="full" className={className} />;
}

/**
 * SkeletonCard — Standard card skeleton layout
 */
export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`skyra-skeleton-card ${className}`}
      style={{
        padding: '1.25rem',
        background: 'var(--skyra-surface)',
        border: '1px solid var(--skyra-border)',
        borderRadius: 'var(--skyra-radius-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <SkeletonAvatar size={40} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', flex: 1 }}>
          <Skeleton width="50%" height="0.9rem" radius="sm" />
          <Skeleton width="30%" height="0.75rem" radius="sm" />
        </div>
      </div>
      <SkeletonText lines={2} />
      <Skeleton width="100%" height="36px" radius="md" />
    </div>
  );
}

/**
 * SkeletonTable — Tabular skeleton rows
 */
export function SkeletonTable({
  rows = 4,
  columns = 4,
  className = '',
}: {
  rows?: number;
  columns?: number;
  className?: string;
}) {
  return (
    <div
      className={`skyra-skeleton-table ${className}`}
      style={{
        width: '100%',
        border: '1px solid var(--skyra-border)',
        borderRadius: 'var(--skyra-radius-md)',
        overflow: 'hidden',
        background: 'var(--skyra-surface)' }}
    >
      {/* Table Header */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          padding: '0.75rem 1rem',
          background: 'var(--skyra-bg)',
          borderBottom: '1px solid var(--skyra-border)',
          gap: '1rem' }}
      >
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} height="14px" width="70%" radius="sm" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div
          key={rIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            padding: '0.85rem 1rem',
            borderBottom: rIdx === rows - 1 ? 'none' : '1px solid var(--skyra-border)',
            gap: '1rem' }}
        >
          {Array.from({ length: columns }).map((_, cIdx) => (
            <Skeleton key={cIdx} height="12px" width={cIdx === 0 ? '85%' : '60%'} radius="sm" />
          ))}
        </div>
      ))}
    </div>
  );
}
