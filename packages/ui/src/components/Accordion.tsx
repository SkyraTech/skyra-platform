'use client';

import React, {
  createContext,
  useContext,
  useState,
  useId,
  useRef,
  useCallback,
  ReactNode,
  forwardRef,
} from 'react';
import { ChevronDown } from 'lucide-react';

/* ============================================================
   ACCORDION CONTEXT
   ============================================================ */

export type AccordionType = 'single' | 'multiple';

export interface AccordionContextValue {
  type: AccordionType;
  isItemExpanded: (itemValue: string) => boolean;
  toggleItem: (itemValue: string) => void;
  baseId: string;
}

const AccordionContext = createContext<AccordionContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error('Accordion compound components must be used within an Accordion container.');
  }
  return context;
}

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

/**
 * @skyra/ui Accordion
 *
 * Coordinated expandable multi-section container supporting single and multiple
 * expand modes, collapsible toggling, full keyboard navigation (Arrows, Home, End),
 * smooth CSS animation, and dark mode.
 */
export function Accordion(props: AccordionProps) {
  const { type, className = '', children } = props;
  const baseId = useId();

  // Single mode state
  const isSingleControlled = type === 'single' && props.value !== undefined;
  const [uncontrolledSingle, setUncontrolledSingle] = useState<string>(
    type === 'single' ? (props.defaultValue ?? '') : ''
  );
  const currentSingle = isSingleControlled ? (props.value ?? '') : uncontrolledSingle;

  // Multiple mode state
  const isMultipleControlled = type === 'multiple' && props.value !== undefined;
  const [uncontrolledMultiple, setUncontrolledMultiple] = useState<string[]>(
    type === 'multiple' ? (props.defaultValue ?? []) : []
  );
  const currentMultiple = isMultipleControlled ? (props.value ?? []) : uncontrolledMultiple;

  const isItemExpanded = useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        return currentSingle === itemValue;
      }
      return currentMultiple.includes(itemValue);
    },
    [type, currentSingle, currentMultiple]
  );

  const toggleItem = useCallback(
    (itemValue: string) => {
      if (type === 'single') {
        const singleProps = props as AccordionSingleProps;
        const isCurrent = currentSingle === itemValue;
        let nextValue = isCurrent ? (singleProps.collapsible ? '' : itemValue) : itemValue;

        if (!isSingleControlled) {
          setUncontrolledSingle(nextValue);
        }
        singleProps.onValueChange?.(nextValue);
      } else {
        const multipleProps = props as AccordionMultipleProps;
        const exists = currentMultiple.includes(itemValue);
        const nextList = exists
          ? currentMultiple.filter((v) => v !== itemValue)
          : [...currentMultiple, itemValue];

        if (!isMultipleControlled) {
          setUncontrolledMultiple(nextList);
        }
        multipleProps.onValueChange?.(nextList);
      }
    },
    [type, props, currentSingle, currentMultiple, isSingleControlled, isMultipleControlled]
  );

  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (!target || !target.classList.contains('skyra-accordion-trigger-btn')) return;

    const container = containerRef.current;
    if (!container) return;

    const getTriggers = () =>
      Array.from(
        container.querySelectorAll<HTMLButtonElement>(
          'button.skyra-accordion-trigger-btn:not([disabled]):not([aria-disabled="true"])'
        )
      );

    const triggers = getTriggers();
    if (!triggers.length) return;

    const currentIndex = triggers.indexOf(target as HTMLButtonElement);
    let nextIndex = -1;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      nextIndex = currentIndex < triggers.length - 1 ? currentIndex + 1 : 0;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      nextIndex = currentIndex > 0 ? currentIndex - 1 : triggers.length - 1;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = triggers.length - 1;
    }

    if (nextIndex !== -1) {
      triggers[nextIndex]?.focus();
    }
  };

  return (
    <AccordionContext.Provider
      value={{
        type,
        isItemExpanded,
        toggleItem,
        baseId,
      }}
    >
      <div
        ref={containerRef}
        className={`skyra-accordion skyra-accordion--${type} ${className}`}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

/* ============================================================
   ACCORDION ITEM
   ============================================================ */

export interface AccordionItemContextValue {
  value: string;
  disabled: boolean;
  isExpanded: boolean;
  triggerId: string;
  contentId: string;
}

const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) {
    throw new Error('AccordionItem subcomponents must be used within an AccordionItem.');
  }
  return context;
}

export interface AccordionItemProps {
  /** Unique value identifying this item */
  value: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Header trigger & Content panel */
  children: ReactNode;
}

export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value: itemValue, disabled = false, className = '', children }, ref) => {
    const { isItemExpanded, baseId } = useAccordionContext();
    const isExpanded = isItemExpanded(itemValue);
    const triggerId = `${baseId}-trigger-${itemValue}`;
    const contentId = `${baseId}-content-${itemValue}`;

    return (
      <AccordionItemContext.Provider
        value={{
          value: itemValue,
          disabled,
          isExpanded,
          triggerId,
          contentId,
        }}
      >
        <div
          ref={ref}
          className={`skyra-accordion-item ${isExpanded ? 'skyra-accordion-item--expanded' : ''} ${disabled ? 'skyra-accordion-item--disabled' : ''} ${className}`}
          data-state={isExpanded ? 'open' : 'closed'}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = 'AccordionItem';

/* ============================================================
   ACCORDION TRIGGER
   ============================================================ */

export interface AccordionTriggerProps {
  /** Additional CSS class */
  className?: string;
  /** Custom trailing icon or indicator */
  icon?: ReactNode;
  /** Trigger content */
  children: ReactNode;
}

export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ className = '', icon, children }, ref) => {
    const { toggleItem } = useAccordionContext();
    const { value: itemValue, disabled, isExpanded, triggerId, contentId } = useAccordionItemContext();

    const handleClick = () => {
      if (disabled) return;
      toggleItem(itemValue);
    };

    return (
      <h3 className="skyra-accordion-header">
        <button
          ref={ref}
          type="button"
          id={triggerId}
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={handleClick}
          className={`skyra-accordion-trigger skyra-accordion-trigger-btn ${isExpanded ? 'skyra-accordion-trigger--expanded' : ''} ${className}`}
        >
          <span className="skyra-accordion-trigger-text">{children}</span>
          <span className={`skyra-accordion-icon ${isExpanded ? 'skyra-accordion-icon--expanded' : ''}`}>
            {icon || <ChevronDown size={18} strokeWidth={2} />}
          </span>
        </button>
      </h3>
    );
  }
);
AccordionTrigger.displayName = 'AccordionTrigger';

/* ============================================================
   ACCORDION CONTENT
   ============================================================ */

export interface AccordionContentProps {
  /** Additional CSS class */
  className?: string;
  /** Arbitrary ReactNode body */
  children: ReactNode;
}

export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ className = '', children }, ref) => {
    const { isExpanded, triggerId, contentId } = useAccordionItemContext();

    return (
      <div
        ref={ref}
        role="region"
        id={contentId}
        aria-labelledby={triggerId}
        hidden={!isExpanded}
        className={`skyra-accordion-content ${isExpanded ? 'skyra-accordion-content--expanded' : ''} ${className}`}
      >
        <div className="skyra-accordion-content-inner">{children}</div>
      </div>
    );
  }
);
AccordionContent.displayName = 'AccordionContent';
