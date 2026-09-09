'use client';

import { useState, useEffect, useCallback, RefObject } from 'react';

export type FloatingPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type FloatingAlign = 'start' | 'center' | 'end';

export interface VirtualAnchor {
  x: number;
  y: number;
}

export interface UseFloatingPositionOptions {
  /** Anchor DOM element reference OR virtual coordinate { x, y } */
  anchor: RefObject<HTMLElement | null> | VirtualAnchor | null;
  /** Floating overlay DOM element reference */
  floating: RefObject<HTMLElement | null>;
  /** Whether the overlay is currently open/visible */
  open: boolean;
  /** Preferred placement */
  placement?: FloatingPlacement;
  /** Alignment along cross-axis */
  align?: FloatingAlign;
  /** Offset distance in pixels from the anchor */
  offset?: number;
  /** Minimum distance in pixels from viewport edges */
  viewportPadding?: number;
  /** Callback when calculated placement changes */
  onPlacementChange?: (placement: FloatingPlacement) => void;
}

export interface FloatingPositionResult {
  top: number;
  left: number;
  actualPlacement: FloatingPlacement;
  actualAlign: FloatingAlign;
  recompute: () => void;
}

/**
 * Shared hook for viewport-relative floating overlay positioning (Popover, Dropdown, ContextMenu).
 * Uses `position: fixed` coordinates to prevent ancestor transform/scroll offset drift bugs.
 * Detects viewport collisions and flips/clamps dynamically.
 */
export function useFloatingPosition({
  anchor,
  floating,
  open,
  placement = 'bottom',
  align = 'start',
  offset = 6,
  viewportPadding = 8,
  onPlacementChange,
}: UseFloatingPositionOptions): FloatingPositionResult {
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    actualPlacement: FloatingPlacement;
    actualAlign: FloatingAlign;
  }>({
    top: 0,
    left: 0,
    actualPlacement: placement === 'auto' ? 'bottom' : placement,
    actualAlign: align,
  });

  const calculatePosition = useCallback(() => {
    if (!open || !floating.current) return;

    let anchorRect: { top: number; bottom: number; left: number; right: number; width: number; height: number };

    if (anchor && 'current' in anchor) {
      if (!anchor.current) return;
      anchorRect = anchor.current.getBoundingClientRect();
    } else if (anchor && 'x' in anchor && 'y' in anchor) {
      // Virtual anchor (e.g. pointer click coordinate for ContextMenu)
      anchorRect = {
        top: anchor.y,
        bottom: anchor.y,
        left: anchor.x,
        right: anchor.x,
        width: 0,
        height: 0,
      };
    } else {
      return;
    }

    const floatingEl = floating.current;
    const floatingRect = floatingEl.getBoundingClientRect();
    const floatingWidth = floatingRect.width || floatingEl.offsetWidth || 180;
    const floatingHeight = floatingRect.height || floatingEl.offsetHeight || 120;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let effectivePlacement: 'top' | 'bottom' | 'left' | 'right' =
      placement === 'auto' ? (anchorRect.bottom + floatingHeight + offset > viewportHeight && anchorRect.top > floatingHeight ? 'top' : 'bottom') : placement;

    // Viewport collision check for main axis flip
    if (effectivePlacement === 'bottom' && anchorRect.bottom + offset + floatingHeight > viewportHeight - viewportPadding) {
      if (anchorRect.top - offset - floatingHeight >= viewportPadding) {
        effectivePlacement = 'top';
      }
    } else if (effectivePlacement === 'top' && anchorRect.top - offset - floatingHeight < viewportPadding) {
      if (anchorRect.bottom + offset + floatingHeight <= viewportHeight - viewportPadding) {
        effectivePlacement = 'bottom';
      }
    } else if (effectivePlacement === 'right' && anchorRect.right + offset + floatingWidth > viewportWidth - viewportPadding) {
      if (anchorRect.left - offset - floatingWidth >= viewportPadding) {
        effectivePlacement = 'left';
      }
    } else if (effectivePlacement === 'left' && anchorRect.left - offset - floatingWidth < viewportPadding) {
      if (anchorRect.right + offset + floatingWidth <= viewportWidth - viewportPadding) {
        effectivePlacement = 'right';
      }
    }

    let top = 0;
    let left = 0;

    // Calculate main axis & cross axis
    if (effectivePlacement === 'top' || effectivePlacement === 'bottom') {
      top = effectivePlacement === 'top' ? anchorRect.top - floatingHeight - offset : anchorRect.bottom + offset;

      if (align === 'start') {
        left = anchorRect.left;
      } else if (align === 'end') {
        left = anchorRect.right - floatingWidth;
      } else {
        // center
        left = anchorRect.left + anchorRect.width / 2 - floatingWidth / 2;
      }
    } else {
      // 'left' or 'right'
      left = effectivePlacement === 'left' ? anchorRect.left - floatingWidth - offset : anchorRect.right + offset;

      if (align === 'start') {
        top = anchorRect.top;
      } else if (align === 'end') {
        top = anchorRect.bottom - floatingHeight;
      } else {
        // center
        top = anchorRect.top + anchorRect.height / 2 - floatingHeight / 2;
      }
    }

    // Clamp cross axis to stay completely within viewport bounds
    if (left < viewportPadding) {
      left = viewportPadding;
    } else if (left + floatingWidth > viewportWidth - viewportPadding) {
      left = Math.max(viewportPadding, viewportWidth - viewportPadding - floatingWidth);
    }

    if (top < viewportPadding) {
      top = viewportPadding;
    } else if (top + floatingHeight > viewportHeight - viewportPadding) {
      top = Math.max(viewportPadding, viewportHeight - viewportPadding - floatingHeight);
    }

    setCoords({
      top: Math.round(top),
      left: Math.round(left),
      actualPlacement: effectivePlacement,
      actualAlign: align,
    });

    onPlacementChange?.(effectivePlacement);
  }, [anchor, floating, open, placement, align, offset, viewportPadding, onPlacementChange]);

  // Recalculate on open, scroll (including nested scroll containers), and window resize
  useEffect(() => {
    if (!open) return;

    calculatePosition();

    // Small delay to recalculate if DOM dimensions rendered asynchronously
    const frameId = requestAnimationFrame(() => {
      calculatePosition();
    });

    const handleScrollOrResize = () => {
      calculatePosition();
    };

    window.addEventListener('resize', handleScrollOrResize, { passive: true });
    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleScrollOrResize);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
    };
  }, [open, calculatePosition]);

  return {
    top: coords.top,
    left: coords.left,
    actualPlacement: coords.actualPlacement,
    actualAlign: coords.actualAlign,
    recompute: calculatePosition,
  };
}
