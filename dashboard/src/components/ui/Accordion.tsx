'use client';

import React, { forwardRef, useEffect, useRef, ReactNode } from 'react';
import '@skyra-tech-platform/accordion';

/* ============================================================
   ACCORDION ROOT CONTAINER
   ============================================================ */

export interface AccordionSingleProps {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
  className?: string;
  children: ReactNode;
}

export interface AccordionMultipleProps {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  collapsible?: never;
  className?: string;
  children: ReactNode;
}

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

export const Accordion = forwardRef<HTMLElement, AccordionProps>(
  ({ type, value, defaultValue, onValueChange, collapsible, className, children, ...props }, ref) => {
    const internalRef = useRef<HTMLElement>(null);
    const resolvedRef = (ref || internalRef) as React.MutableRefObject<HTMLElement>;

    useEffect(() => {
      const element = resolvedRef.current;
      if (!element) return;

      const handleChange = (e: Event) => {
        const customEvent = e as CustomEvent;
        const val = customEvent.detail?.value;
        if (onValueChange) {
          if (type === 'single') {
            (onValueChange as (val: string) => void)(val);
          } else {
            const arr = val ? val.split(',') : [];
            (onValueChange as (val: string[]) => void)(arr);
          }
        }
      };

      element.addEventListener('skyra-accordion-change', handleChange);
      return () => {
        element.removeEventListener('skyra-accordion-change', handleChange);
      };
    }, [onValueChange, type, resolvedRef]);

    const serializedValue = Array.isArray(value) ? value.join(',') : value;
    const serializedDefaultValue = Array.isArray(defaultValue) ? defaultValue.join(',') : defaultValue;

    return (
      <skyra-accordion
        ref={resolvedRef}
        type={type}
        value={serializedValue}
        default-value={serializedDefaultValue}
        collapsible={collapsible || undefined}
        class={className}
        suppressHydrationWarning
        {...props}
      >
        {children}
      </skyra-accordion>
    );
  }
);
Accordion.displayName = 'Accordion';

/* ============================================================
   ACCORDION ITEM
   ============================================================ */

export interface AccordionItemProps {
  value: string;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export const AccordionItem = forwardRef<HTMLElement, AccordionItemProps>(
  ({ value, disabled, className, children, ...props }, ref) => {
    return (
      <skyra-accordion-item
        ref={ref}
        value={value}
        disabled={disabled || undefined}
        class={className}
        suppressHydrationWarning
        {...props}
      >
        {children}
      </skyra-accordion-item>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

/* ============================================================
   ACCORDION TRIGGER
   ============================================================ */

export interface AccordionTriggerProps {
  className?: string;
  icon?: ReactNode; // Note: Custom icons in slot="trigger" wouldn't easily override the Shadow DOM chevron unless we specifically exposed an "icon" slot. We'll render it next to the text.
  children: ReactNode;
}

export const AccordionTrigger = forwardRef<HTMLDivElement, AccordionTriggerProps>(
  ({ className, icon, children, ...props }, ref) => {
    return (
      <div slot="trigger" ref={ref} className={className} suppressHydrationWarning {...props}>
        {children}
        {icon && <span style={{ marginLeft: '8px' }}>{icon}</span>}
      </div>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

/* ============================================================
   ACCORDION CONTENT
   ============================================================ */

export interface AccordionContentProps {
  className?: string;
  children: ReactNode;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={className} suppressHydrationWarning {...props}>
        {children}
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';
