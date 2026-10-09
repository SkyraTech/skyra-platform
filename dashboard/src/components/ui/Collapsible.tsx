'use client';

import React, { forwardRef, useEffect, useRef, ReactNode } from 'react';
import '@skyra-tech-platform/collapsible';

export interface CollapsibleProps {
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Whether the collapsible is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Collapsible trigger & content children */
  children: ReactNode;
}

export const Collapsible = forwardRef<HTMLElement, CollapsibleProps>(
  ({ open, defaultOpen, onOpenChange, disabled, className, children, ...props }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const resolvedRef = (ref || internalRef) as React.MutableRefObject<HTMLElement>;
    const isControlled = open !== undefined;

    useEffect(() => {
      const element = resolvedRef.current;
      if (!element) return;

      const handleChange = (e: Event) => {
        const customEvent = e as CustomEvent;
        const newOpen = customEvent.detail?.open;
        if (onOpenChange) {
          onOpenChange(newOpen);
        }
        // React 19 handles controlled state strictly. 
        // If controlled and state should not change, we must revert the DOM state.
        if (isControlled && open !== newOpen) {
          if (open) {
            element.setAttribute('open', '');
          } else {
            element.removeAttribute('open');
          }
        }
      };

      element.addEventListener('skyra-collapsible-change', handleChange);
      return () => {
        element.removeEventListener('skyra-collapsible-change', handleChange);
      };
    }, [onOpenChange, isControlled, open, resolvedRef]);

    return (
      <skyra-collapsible
        ref={resolvedRef}
        open={open !== undefined ? (open ? true : undefined) : (defaultOpen ? true : undefined)}
        disabled={disabled || undefined}
        class={className}
        suppressHydrationWarning
        {...props}
      >
        {children}
      </skyra-collapsible>
    );
  }
);
Collapsible.displayName = 'Collapsible';

export interface CollapsibleTriggerProps {
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Custom trigger content */
  children: ReactNode;
}

export const CollapsibleTrigger = forwardRef<HTMLDivElement, CollapsibleTriggerProps>(
  ({ className = '', style, children, ...props }, ref) => {
    return (
      <div slot="trigger" ref={ref} className={className} style={style} suppressHydrationWarning {...props}>
        {children}
      </div>
    );
  }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

export interface CollapsibleContentProps {
  /** Additional CSS class */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Expandable content */
  children: ReactNode;
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className = '', style, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} style={style} suppressHydrationWarning {...props}>
        {children}
      </div>
    );
  }
);
CollapsibleContent.displayName = 'CollapsibleContent';
