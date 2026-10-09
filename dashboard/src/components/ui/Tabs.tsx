'use client';
import React, { useEffect, useRef, forwardRef } from 'react';
import '@skyra-tech-platform/tabs';

export interface TabsProps extends React.HTMLAttributes<HTMLElement> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
  variant?: 'default' | 'line' | 'pill';
}

export const Tabs = forwardRef<HTMLElement, TabsProps>(
  ({ value, defaultValue, onValueChange, orientation, activationMode, variant, className, children, ...props }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const resolvedRef = (ref || internalRef) as React.MutableRefObject<HTMLElement>;

    useEffect(() => {
      const element = resolvedRef.current;
      if (!element) return;

      const handleTabsChange = (e: Event) => {
        const customEvent = e as CustomEvent;
        if (onValueChange && customEvent.detail?.value) {
          onValueChange(customEvent.detail.value);
        }
      };

      element.addEventListener('skyra-tabs-change', handleTabsChange);
      return () => {
        element.removeEventListener('skyra-tabs-change', handleTabsChange);
      };
    }, [onValueChange, resolvedRef]);

    return (
      <skyra-tabs
        ref={resolvedRef}
        value={value}
        default-value={defaultValue}
        orientation={orientation}
        activation-mode={activationMode}
        variant={variant === 'default' ? 'line' : variant}
        class={className}
        suppressHydrationWarning
        {...props}
      >
        {children}
      </skyra-tabs>
    );
  }
);
Tabs.displayName = 'Tabs';

export const TabsList = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { ariaLabel?: string }>(
  ({ children, ariaLabel, ...props }, ref) => (
    // React doesn't support slots implicitly on fragments, so we can just return children. 
    // Wait, skyra-tabs expects skyra-tab elements with slot="tab".
    // If TabsList is just a pass-through wrapper for legacy compatibility:
    <React.Fragment>
      {children}
    </React.Fragment>
  )
);
TabsList.displayName = 'TabsList';

export const TabsTrigger = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { value: string; disabled?: boolean }>(
  ({ value, disabled, children, ...props }, ref) => (
    <skyra-tab 
      ref={ref} 
      value={value} 
      disabled={disabled || undefined} 
      role="tab"
      slot="tab"
      suppressHydrationWarning
      {...props}
    >
      {children}
    </skyra-tab>
  )
);
TabsTrigger.displayName = 'TabsTrigger';

export const TabsContent = forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement> & { value: string }>(
  ({ value, children, ...props }, ref) => (
    <skyra-tab-panel 
      ref={ref} 
      value={value} 
      role="tabpanel"
      suppressHydrationWarning
      {...props}
    >
      {children}
    </skyra-tab-panel>
  )
);
TabsContent.displayName = 'TabsContent';
