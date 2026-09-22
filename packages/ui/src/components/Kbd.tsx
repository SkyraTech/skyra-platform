'use client';

import React, { forwardRef, useEffect, useState } from 'react';
import { formatShortcut } from '@skyra/utils';

export type KbdSize = 'xs' | 'sm' | 'md';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Shortcut string to automatically format (e.g. 'mod+k', 'ctrl+shift+p') */
  shortcut?: string;
  /** Explicit platform override for formatting */
  platform?: 'mac' | 'windows' | 'linux';
  /** Visual size */
  size?: KbdSize;
  /** Children override (if shortcut is not provided) */
  children?: React.ReactNode;
  className?: string;
}

/**
 * Kbd — Semantic keyboard badge component.
 * Renders standardized keyboard shortcuts conforming to Skyra design tokens.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  (
    {
      shortcut,
      platform: explicitPlatform,
      size = 'sm',
      children,
      className = '',
      style,
      ...rest
    },
    ref
  ) => {
    const [detectedPlatform, setDetectedPlatform] = useState<'mac' | 'windows' | 'linux'>('windows');

    useEffect(() => {
      if (typeof navigator !== 'undefined') {
        const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
        setDetectedPlatform(isMac ? 'mac' : 'windows');
      }
    }, []);

    const effectivePlatform = explicitPlatform ?? detectedPlatform;

    const formatted = shortcut ? formatShortcut(shortcut, effectivePlatform) : null;
    const keys = formatted ? (effectivePlatform === 'mac' ? formatted.split(' ') : formatted.split('+')) : null;

    if (keys && keys.length > 0) {
      return (
        <span
          className={['skyra-kbd-group', `skyra-kbd-group--${size}`, className].filter(Boolean).join(' ')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', ...style }}
        >
          {keys.map((k: string, i: number) => (
            <kbd
              key={`${k}-${i}`}
              ref={i === 0 ? ref : undefined}
              className={`skyra-kbd skyra-kbd--${size}`}
              {...rest}
            >
              {k}
            </kbd>
          ))}
        </span>
      );
    }

    return (
      <kbd
        ref={ref}
        className={['skyra-kbd', `skyra-kbd--${size}`, className].filter(Boolean).join(' ')}
        style={style}
        {...rest}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = 'Kbd';
