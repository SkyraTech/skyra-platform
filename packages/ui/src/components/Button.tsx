'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'orange' | 'outline' | 'ghost' | 'danger' | 'destructive' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Visual variant. [CONFIRMED from ERP: ui.css .btn-*] */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Show a loading spinner and disable the button */
  isLoading?: boolean;
  /** Loading state text shown to screen readers */
  loadingText?: string;
  /** Render as full-width block */
  fullWidth?: boolean;
  /** Icon-only button (square, no label) */
  iconOnly?: boolean;
  /** Left-side icon */
  leftIcon?: React.ReactNode;
  /** Right-side icon */
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * @skyra/ui Button
 *
 * [B] PLATFORM EXTRACTION from skyra-erp/src/styles/ui.css .btn-*
 *
 * Preserves ERP visual characteristics:
 *   - Primary: #0A58CA → hover #0847a8, shadow rgba(10,88,202,0.25), translateY(-1px) hover
 *   - Orange:  #FF6B00 → hover #e05e00, shadow rgba(255,107,0,0.25)
 *   - Outline: border var(--skyra-primary), hover primary-light bg
 *   - Ghost:   border var(--skyra-border), hover bg-color bg
 *
 * [C] PLATFORM ENHANCEMENTS vs ERP:
 *   - `danger` variant added for dialog confirm buttons (documented)
 *   - `isLoading` + spinner state (ERP uses custom implementations per form)
 *   - `leftIcon` / `rightIcon` slots
 *   - `iconOnly` square mode
 */
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
      ...rest
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading;

    const classes = [
      'skyra-btn',
      `skyra-btn--${variant === 'destructive' ? 'danger' : variant}`,
      `skyra-btn--${size}`,
      isLoading ? 'skyra-btn--loading' : '',
      fullWidth ? 'skyra-btn--full' : '',
      iconOnly ? 'skyra-btn--icon' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={isLoading}
        {...rest}
      >
        {isLoading && (
          <Loader2
            size={size === 'sm' ? 13 : size === 'lg' ? 17 : 15}
            className="skyra-spinner"
            aria-hidden="true"
            
          />
        )}
        {!isLoading && leftIcon && <span aria-hidden="true">{leftIcon}</span>}
        {isLoading && loadingText ? (
          <>
            <span className="sr-only">{loadingText}</span>
            <span aria-hidden="true">{children}</span>
          </>
        ) : (
          children
        )}
        {!isLoading && rightIcon && <span aria-hidden="true">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';
