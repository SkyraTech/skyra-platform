'use client';

import React, {
  createContext,
  useContext,
  useState,
  useId,
  useCallback,
  ReactNode,
  forwardRef,
} from 'react';

/* ============================================================
   COLLAPSIBLE CONTEXT
   ============================================================ */

export interface CollapsibleContextValue {
  open: boolean;
  toggleOpen: () => void;
  disabled: boolean;
  triggerId: string;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsibleContext() {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error('Collapsible compound components must be used within a Collapsible container.');
  }
  return context;
}

/* ============================================================
   COLLAPSIBLE ROOT CONTAINER
   ============================================================ */

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

/**
 * @skyra/ui Collapsible
 *
 * Independent single expandable region primitive (e.g. Advanced Filters, Developer Details).
 * Distinct from Accordion (which coordinates collections of items).
 */
export function Collapsible({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  className = '',
  children,
}: CollapsibleProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(controlledOpen) : uncontrolledOpen;

  const baseId = useId();
  const triggerId = `${baseId}-trigger`;
  const contentId = `${baseId}-content`;

  const toggleOpen = useCallback(() => {
    if (disabled) return;
    const nextOpen = !isOpen;
    if (!isControlled) {
      setUncontrolledOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  }, [disabled, isOpen, isControlled, onOpenChange]);

  return (
    <CollapsibleContext.Provider
      value={{
        open: isOpen,
        toggleOpen,
        disabled,
        triggerId,
        contentId,
      }}
    >
      <div
        className={`skyra-collapsible ${isOpen ? 'skyra-collapsible--open' : 'skyra-collapsible--closed'} ${disabled ? 'skyra-collapsible--disabled' : ''} ${className}`}
        data-state={isOpen ? 'open' : 'closed'}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

/* ============================================================
   COLLAPSIBLE TRIGGER
   ============================================================ */

export interface CollapsibleTriggerProps {
  /** Additional CSS class */
  className?: string;
  /** Custom trigger content */
  children: ReactNode;
}

export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  ({ className = '', children }, ref) => {
    const { open, toggleOpen, disabled, triggerId, contentId } = useCollapsibleContext();

    const handleClick = () => {
      if (disabled) return;
      toggleOpen();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleOpen();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        id={triggerId}
        aria-expanded={open}
        aria-controls={contentId}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`skyra-collapsible-trigger ${open ? 'skyra-collapsible-trigger--open' : ''} ${className}`}
      >
        {children}
      </button>
    );
  }
);
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

/* ============================================================
   COLLAPSIBLE CONTENT
   ============================================================ */

export interface CollapsibleContentProps {
  /** Additional CSS class */
  className?: string;
  /** Expandable content */
  children: ReactNode;
}

export const CollapsibleContent = forwardRef<HTMLDivElement, CollapsibleContentProps>(
  ({ className = '', children }, ref) => {
    const { open, triggerId, contentId } = useCollapsibleContext();

    return (
      <div
        ref={ref}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!open}
        className={`skyra-collapsible-content ${open ? 'skyra-collapsible-content--open' : ''} ${className}`}
      >
        <div className="skyra-collapsible-content-inner">{children}</div>
      </div>
    );
  }
);
CollapsibleContent.displayName = 'CollapsibleContent';
