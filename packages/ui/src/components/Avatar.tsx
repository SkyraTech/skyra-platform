'use client';

import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Image source URL */
  src?: string | null;
  /** Image alt text */
  alt?: string;
  /** Fallback text shown when image is absent or errors (initials or icon) */
  fallback?: React.ReactNode;
  /** Size preset */
  size?: AvatarSize;
  /** Shape — circle (default) or square */
  shape?: AvatarShape;
}

const sizeStyles: Record<AvatarSize, React.CSSProperties> = {
  xs: { width: '24px', height: '24px', fontSize: '0.625rem' },
  sm: { width: '32px', height: '32px', fontSize: '0.75rem' },
  md: { width: '40px', height: '40px', fontSize: '0.875rem' },
  lg: { width: '48px', height: '48px', fontSize: '1rem' },
  xl: { width: '64px', height: '64px', fontSize: '1.25rem' },
};

/**
 * @skyra/ui Avatar
 *
 * [C] PLATFORM ORIGINAL — generic reusable avatar primitive.
 *
 * Displays a user image with a graceful text/icon fallback.
 * Supports xs/sm/md/lg/xl sizes and circle/square shapes.
 *
 * Usage:
 *   <Avatar src={user.avatarUrl} fallback={user.initials} size="md" />
 */
export function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  shape = 'circle',
  className = '',
  style,
  ...rest
}: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const showFallback = !src || imgError;

  const borderRadius = shape === 'circle'
    ? '50%'
    : 'var(--skyra-radius-md)';

  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    userSelect: 'none',
    borderRadius,
    background: showFallback ? 'var(--skyra-primary-light)' : 'transparent',
    color: 'var(--skyra-primary)',
    fontWeight: 600,
    fontFamily: 'var(--skyra-font-body)',
    border: '1px solid var(--skyra-border)',
    ...sizeStyles[size],
    ...style,
  };

  return (
    <div
      className={['skyra-avatar', className].filter(Boolean).join(' ')}
      style={baseStyle}
      role="img"
      aria-label={alt}
      {...rest}
    >
      {!showFallback && (
        <img
          src={src!}
          alt={alt}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block' }}
        />
      )}
      {showFallback && (
        <span aria-hidden="true">
          {fallback ?? alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
