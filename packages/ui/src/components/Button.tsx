'use client';

import React, { useEffect, useRef } from 'react';
import { SkyraTechButton } from '@skyra-tech-platform/button';
import '@skyra-tech-platform/button';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        variant?: string;
        size?: string;
        loading?: string;
        'loading-text'?: string;
        'full-width'?: string;
        'icon-only'?: string;
        disabled?: string;
        type?: string;
        class?: string;
      };
    }
  }
}

export type ButtonVariant = 'primary' | 'orange' | 'outline' | 'ghost' | 'danger' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  iconOnly?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      fullWidth = false,
      iconOnly = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      type = 'button',
      onClick,
      ...rest
    },
    ref
  ) => {
    const internalRef = useRef<any>(null);

    // Sync refs
    useEffect(() => {
      if (typeof ref === 'function') {
        ref(internalRef.current);
      } else if (ref) {
        (ref as any).current = internalRef.current;
      }
    }, [ref]);

    // Attach click handler natively since React's synthetic events sometimes have trouble with Custom Elements
    useEffect(() => {
      const el = internalRef.current;
      if (!el || !onClick) return;
      
      const clickHandler = (e: any) => {
        // If the custom element is disabled, standard DOM usually stops clicks, but we can ensure it here
        if (!el.disabled && !el.hasAttribute('loading')) {
          onClick(e);
        }
      };

      el.addEventListener('click', clickHandler);
      return () => {
        el.removeEventListener('click', clickHandler);
      };
    }, [onClick]);

    return (
      <skyra-tech-button
        ref={internalRef}
        class={className || undefined}
        variant={variant === 'destructive' ? 'danger' : variant}
        size={size}
        loading={isLoading ? 'true' : undefined}
        loading-text={loadingText}
        full-width={fullWidth ? 'true' : undefined}
        icon-only={iconOnly ? 'true' : undefined}
        disabled={disabled || isLoading ? 'true' : undefined}
        type={type}
        {...rest}
      >
        {leftIcon && <span slot="left-icon" aria-hidden="true">{leftIcon}</span>}
        {children}
        {rightIcon && <span slot="right-icon" aria-hidden="true">{rightIcon}</span>}
      </skyra-tech-button>
    );
  }
);

Button.displayName = 'Button';
