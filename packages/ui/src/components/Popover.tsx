'use client';

import React, { useState, useRef, useEffect, useId, useCallback } from 'react';
import { useFloatingPosition, FloatingPlacement, FloatingAlign } from '../hooks/useFloatingPosition';

export interface PopoverProps {
  /** Trigger element that toggles the popover */
  trigger: React.ReactNode;
  /** Rich ReactNode content rendered inside the popover */
  content: React.ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Preferred placement relative to trigger */
  placement?: FloatingPlacement;
  /** Cross-axis alignment */
  align?: FloatingAlign;
  /** Distance from trigger in pixels */
  offset?: number;
  /** Minimum distance from viewport edge in pixels */
  viewportPadding?: number;
  /** Whether clicking outside dismisses the popover */
  closeOnOutsideClick?: boolean;
  /** Whether pressing Escape dismisses the popover */
  closeOnEscape?: boolean;
  /** Whether the popover trigger is disabled */
  disabled?: boolean;
  /** Custom width for the popover panel */
  width?: string | number;
  /** Custom max-width for the popover panel */
  maxWidth?: string | number;
  /** Custom min-width for the popover panel */
  minWidth?: string | number;
  /** Additional CSS class for outer trigger container */
  className?: string;
  /** Additional CSS class for floating content panel */
  contentClassName?: string;
  /** Whether to restore focus to trigger upon dismissal */
  restoreFocus?: boolean;
  /** Accessible label for the popover panel */
  ariaLabel?: string;
}

/**
 * @skyra/ui Popover
 *
 * Reusable anchored rich content overlay with collision detection,
 * viewport boundary protection, focus restoration, keyboard dismissal,
 * and dark mode support.
 */
export function Popover({
  trigger,
  content,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  align = 'start',
  offset = 6,
  viewportPadding = 8,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  disabled = false,
  width,
  maxWidth = 'min(90vw, 360px)',
  minWidth = 200,
  className = '',
  contentClassName = '',
  restoreFocus = true,
  ariaLabel,
}: PopoverProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(controlledOpen) : uncontrolledOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const floatingRef = useRef<HTMLDivElement>(null);
  const popoverId = useId();

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (disabled) return;
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
    },
    [disabled, isControlled, onOpenChange]
  );

  const toggleOpen = () => {
    if (disabled) return;
    handleOpenChange(!isOpen);
  };

  const { top, left, actualPlacement } = useFloatingPosition({
    anchor: triggerRef,
    floating: floatingRef,
    open: isOpen,
    placement,
    align,
    offset,
    viewportPadding,
  });

  // Handle outside click
  useEffect(() => {
    if (!isOpen || !closeOnOutsideClick) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (
        triggerRef.current?.contains(target) ||
        floatingRef.current?.contains(target)
      ) {
        return;
      }
      handleOpenChange(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, closeOnOutsideClick, handleOpenChange]);

  // Handle Escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleOpenChange(false);
        if (restoreFocus) {
          const triggerEl = triggerRef.current?.querySelector<HTMLElement>('button, [tabindex="0"], input, a') || triggerRef.current;
          triggerEl?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, handleOpenChange, restoreFocus]);

  return (
    <>
      <div
        ref={triggerRef}
        className={`skyra-popover-trigger-wrapper ${className}`}
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? popoverId : undefined}
        style={{ display: 'inline-block' }}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          ref={floatingRef}
          id={popoverId}
          role="dialog"
          aria-label={ariaLabel}
          aria-modal={false}
          className={`skyra-popover-content skyra-popover--${actualPlacement} ${contentClassName}`}
          style={{
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 'var(--skyra-z-popover, 1000)',
            width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
            minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth }}
          tabIndex={-1}
        >
          {content}
        </div>
      )}
    </>
  );
}
