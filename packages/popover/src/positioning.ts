export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right' | 'auto';
export type PopoverAlign = 'start' | 'center' | 'end';

export interface RectLike {
  top: number;
  bottom: number;
  left: number;
  right: number;
  width: number;
  height: number;
}

export interface ComputePositionOptions {
  anchorRect: RectLike;
  floatingRect: { width: number; height: number };
  placement?: PopoverPlacement;
  align?: PopoverAlign;
  offset?: number;
  viewportPadding?: number;
  viewportWidth?: number;
  viewportHeight?: number;
}

export interface PositionResult {
  top: number;
  left: number;
  actualPlacement: 'top' | 'bottom' | 'left' | 'right';
  actualAlign: PopoverAlign;
}

/**
 * Pure, framework-agnostic mathematical positioning engine for popover overlays.
 * Calculates viewport-relative fixed coordinates with automatic collision detection,
 * flipping, and cross-axis clamping.
 */
export function computePopoverPosition({
  anchorRect,
  floatingRect,
  placement = 'bottom',
  align = 'start',
  offset = 6,
  viewportPadding = 8,
  viewportWidth = typeof window !== 'undefined' ? (document.documentElement.clientWidth || window.innerWidth) : 1024,
  viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 768,
}: ComputePositionOptions): PositionResult {
  const floatingWidth = floatingRect.width || 180;
  const floatingHeight = floatingRect.height || 120;

  let effectivePlacement: 'top' | 'bottom' | 'left' | 'right' =
    placement === 'auto'
      ? anchorRect.bottom + floatingHeight + offset > viewportHeight - viewportPadding &&
        anchorRect.top - offset - floatingHeight >= viewportPadding
        ? 'top'
        : 'bottom'
      : placement;

  // Viewport collision checks for main axis flipping
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

  // Main axis & cross axis calculations
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

  // Clamp cross axis to guarantee the overlay remains completely within viewport bounds
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

  return {
    top: Math.round(top),
    left: Math.round(left),
    actualPlacement: effectivePlacement,
    actualAlign: align,
  };
}
