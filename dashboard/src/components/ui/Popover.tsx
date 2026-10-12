'use client';

import React, { useRef, useEffect } from 'react';
import '@skyra-tech-platform/popover';
import type { PopoverPlacement, PopoverAlign, SkyraPopoverElement } from '@skyra-tech-platform/popover';

export type FloatingPlacement = PopoverPlacement;
export type FloatingAlign = PopoverAlign;

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
  placement?: PopoverPlacement;
  /** Cross-axis alignment */
  align?: PopoverAlign;
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
 * Popover React Adapter
 *
 * Thin framework adapter delegating directly to the canonical
 * `@skyra-tech-platform/popover` (`<skyra-popover>`) Custom Element.
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
  const popoverRef = useRef<SkyraPopoverElement>(null);
  const isControlled = controlledOpen !== undefined;

  // Initialize uncontrolled defaultOpen
  useEffect(() => {
    const el = popoverRef.current;
    if (el && !isControlled && defaultOpen) {
      el.open = true;
    }
  }, [defaultOpen, isControlled]);

  // Synchronize controlled open state
  useEffect(() => {
    const el = popoverRef.current;
    if (el && isControlled) {
      el.open = Boolean(controlledOpen);
    }
  }, [controlledOpen, isControlled]);

  // Synchronize dynamic properties directly to element
  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;
    el.placement = placement;
    el.align = align;
    el.offset = offset;
    el.viewportPadding = viewportPadding;
    el.closeOnOutsideClick = closeOnOutsideClick;
    el.closeOnEscape = closeOnEscape;
    el.disabled = disabled;
    el.restoreFocus = restoreFocus;
    if (width !== undefined) el.panelWidth = width;
    if (maxWidth !== undefined) el.panelMaxWidth = maxWidth;
    if (minWidth !== undefined) el.panelMinWidth = minWidth;
    if (ariaLabel) el.ariaLabel = ariaLabel;
  }, [
    placement,
    align,
    offset,
    viewportPadding,
    closeOnOutsideClick,
    closeOnEscape,
    disabled,
    restoreFocus,
    width,
    maxWidth,
    minWidth,
    ariaLabel,
  ]);

  // Subscribe to canonical custom element events
  useEffect(() => {
    const el = popoverRef.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ open: boolean }>;
      onOpenChange?.(customEvt.detail.open);
    };

    el.addEventListener('skyra-popover-change', handleChange);
    return () => {
      el.removeEventListener('skyra-popover-change', handleChange);
    };
  }, [onOpenChange]);

  return (
    <skyra-popover
      ref={popoverRef}
      placement={placement}
      align={align}
      offset={offset}
      viewport-padding={viewportPadding}
      close-on-outside-click={closeOnOutsideClick ? undefined : 'false'}
      close-on-escape={closeOnEscape ? undefined : 'false'}
      disabled={disabled || undefined}
      restore-focus={restoreFocus ? undefined : 'false'}
      panel-width={width}
      panel-max-width={maxWidth}
      panel-min-width={minWidth}
      aria-label={ariaLabel}
    >
      <div slot="trigger" className={`skyra-popover-trigger-wrapper ${className}`}>
        {trigger}
      </div>
      <div className={`skyra-popover-content ${contentClassName}`}>{content}</div>
    </skyra-popover>
  );
}
