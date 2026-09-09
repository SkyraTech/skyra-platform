'use client';

import React, { useState, useRef, useEffect, useId } from 'react';

export type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';

export interface TooltipProps {
  /** Text or rich ReactNode content to render inside tooltip */
  content: React.ReactNode;
  /** Trigger element */
  children: React.ReactElement;
  /** Placement direction */
  placement?: TooltipPlacement;
  /** Delay before showing in ms */
  showDelay?: number;
  /** Delay before hiding in ms */
  hideDelay?: number;
  /** Max width of tooltip box */
  maxWidth?: string | number;
  /** Disabled tooltip */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui Tooltip
 *
 * Rich accessible tooltip supporting text, badges, tables, and formatted ReactNode content,
 * collision-aware positioning, keyboard focus, Escape dismissal, and dark mode.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  showDelay = 150,
  hideDelay = 100,
  maxWidth = 280,
  disabled = false,
  className = '',
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number; actualPlacement: string }>({
    top: 0,
    left: 0,
    actualPlacement: placement,
  });

  const triggerRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const showTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipId = useId();

  const calculatePosition = () => {
    if (!triggerRef.current) return;
    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;
    const tooltipWidth = tooltipEl ? tooltipEl.offsetWidth : 160;
    const tooltipHeight = tooltipEl ? tooltipEl.offsetHeight : 36;
    const margin = 8;

    let targetTop = 0;
    let targetLeft = 0;
    let effectivePlacement = placement;

    if (placement === 'auto') {
      effectivePlacement = triggerRect.top < 80 ? 'bottom' : 'top';
    }

    switch (effectivePlacement) {
      case 'top':
        targetTop = triggerRect.top - tooltipHeight - margin;
        targetLeft = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        targetTop = triggerRect.bottom + margin;
        targetLeft = triggerRect.left + triggerRect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        targetTop = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        targetLeft = triggerRect.left - tooltipWidth - margin;
        break;
      case 'right':
        targetTop = triggerRect.top + triggerRect.height / 2 - tooltipHeight / 2;
        targetLeft = triggerRect.right + margin;
        break;
    }

    // Viewport collision bounds check
    const padding = 8;
    if (targetLeft < padding) targetLeft = padding;
    if (targetLeft + tooltipWidth > window.innerWidth - padding) {
      targetLeft = window.innerWidth - padding - tooltipWidth;
    }
    if (targetTop < padding) {
      targetTop = triggerRect.bottom + margin;
      effectivePlacement = 'bottom';
    }

    setCoords({
      top: targetTop + window.scrollY,
      left: targetLeft + window.scrollX,
      actualPlacement: effectivePlacement,
    });
  };

  const handleMouseEnter = () => {
    if (disabled || !content) return;
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
    showTimeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);
  };

  const handleMouseLeave = () => {
    if (showTimeoutRef.current) clearTimeout(showTimeoutRef.current);
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, hideDelay);
  };

  const handleFocus = () => {
    if (disabled || !content) return;
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isVisible) {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      window.addEventListener('resize', calculatePosition);
      window.addEventListener('scroll', calculatePosition, true);
      return () => {
        window.removeEventListener('resize', calculatePosition);
        window.removeEventListener('scroll', calculatePosition, true);
      };
    }
  }, [isVisible]);

  const child = React.Children.only(children) as React.ReactElement<React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<HTMLElement> }>;
  const childProps = child.props;

  const clonedChild = React.cloneElement(child, {
    ref: triggerRef,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      handleMouseEnter();
      childProps.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      handleMouseLeave();
      childProps.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      handleFocus();
      childProps.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      handleBlur();
      childProps.onBlur?.(e);
    },
    onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
      handleKeyDown(e);
      childProps.onKeyDown?.(e);
    },
    'aria-describedby': isVisible ? tooltipId : undefined,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <>
      {clonedChild}
      {isVisible && !disabled && (
        <div
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={`skyra-tooltip ${className}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'absolute',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            background: 'var(--skyra-surface)',
            color: 'var(--skyra-text)',
            border: '1px solid var(--skyra-border)',
            borderRadius: 'var(--skyra-radius-md)',
            boxShadow: 'var(--skyra-shadow-lg)',
            padding: '0.5rem 0.75rem',
            fontSize: '0.8rem',
            lineHeight: '1.4',
            zIndex: 9999,
            pointerEvents: 'auto',
            fontFamily: 'var(--skyra-font-body)',
            animation: 'fadeIn 0.12s ease',
          }}
        >
          {content}
        </div>
      )}
    </>
  );
}
