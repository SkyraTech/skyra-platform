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

export type TabsOrientation = 'horizontal' | 'vertical';
export type TabsActivationMode = 'automatic' | 'manual';
export type TabsVariant = 'default' | 'line' | 'pill';

export interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
  orientation: TabsOrientation;
  activationMode: TabsActivationMode;
  variant: TabsVariant;
  baseId: string;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs container.');
  }
  return context;
}

/* ============================================================
   TABS ROOT CONTAINER
   ============================================================ */

export interface TabsProps {
  /** Controlled active tab value */
  value?: string;
  /** Uncontrolled initial active tab value */
  defaultValue?: string;
  /** Callback fired when the active tab value changes */
  onValueChange?: (value: string) => void;
  /** Visual layout orientation */
  orientation?: TabsOrientation;
  /** Keyboard tab selection behavior */
  activationMode?: TabsActivationMode;
  /** Visual styling variant */
  variant?: TabsVariant;
  /** Additional CSS class */
  className?: string;
  /** Children (TabsList, TabsContent) */
  children: ReactNode;
}

/**
 * @skyra/ui Tabs
 *
 * Production-ready WAI-ARIA tabbed interface supporting horizontal/vertical layouts,
 * automatic/manual keyboard activation, line/pill styling, and responsive scroll containment.
 */
export function Tabs({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  orientation = 'horizontal',
  activationMode = 'automatic',
  variant = 'default',
  className = '',
  children,
}: TabsProps) {
  const isControlled = controlledValue !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue);
  const activeValue = isControlled ? controlledValue : uncontrolledValue;
  const baseId = useId();

  const handleValueChange = useCallback(
    (nextValue: string) => {
      if (!isControlled) {
        setUncontrolledValue(nextValue);
      }
      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider
      value={{
        value: activeValue,
        onValueChange: handleValueChange,
        orientation,
        activationMode,
        variant,
        baseId,
      }}
    >
      <div
        className={`skyra-tabs skyra-tabs--${orientation} skyra-tabs--${variant} ${className}`}
        data-orientation={orientation}
      >
        {children}
      </div>
    </TabsContext.Provider>
  );
}

/* ============================================================
   TABS LIST
   ============================================================ */

export interface TabsListProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
}

export const TabsList = forwardRef<HTMLDivElement, TabsListProps>(
  ({ children, className = '', ariaLabel }, ref) => {
    const { orientation, activationMode, onValueChange } = useTabsContext();
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      const isHorizontal = orientation === 'horizontal';
      const target = e.target as HTMLElement;
      if (!target || target.getAttribute('role') !== 'tab') return;

      const container = listRef.current;
      if (!container) return;

      const getTabs = () =>
        Array.from(
          container.querySelectorAll<HTMLButtonElement>(
            'button[role="tab"]:not([disabled]):not([aria-disabled="true"])'
          )
        );

      const tabs = getTabs();
      if (!tabs.length) return;

      const currentIndex = tabs.indexOf(target as HTMLButtonElement);
      let nextIndex = -1;

      if ((isHorizontal && e.key === 'ArrowRight') || (!isHorizontal && e.key === 'ArrowDown')) {
        e.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      } else if ((isHorizontal && e.key === 'ArrowLeft') || (!isHorizontal && e.key === 'ArrowUp')) {
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else if (e.key === 'Home') {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === 'End') {
        e.preventDefault();
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== -1) {
        const nextTab = tabs[nextIndex];
        if (nextTab) {
          nextTab.focus();
          if (activationMode === 'automatic') {
            const tabValue = nextTab.getAttribute('data-value');
            if (tabValue) {
              onValueChange(tabValue);
            }
          }
        }
      }
    };

    return (
      <div
        ref={(node) => {
          (listRef as any).current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) (ref as any).current = node;
        }}
        role="tablist"
        aria-orientation={orientation}
        aria-label={ariaLabel}
        className={`skyra-tabs-list ${className}`}
        onKeyDown={handleKeyDown}
      >
        {children}
      </div>
    );
  }
);
TabsList.displayName = 'TabsList';

/* ============================================================
   TABS TRIGGER
   ============================================================ */

export interface TabsTriggerProps {
  /** Unique value corresponding to a TabsContent panel */
  value: string;
  /** Whether the tab is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Tab label, icon, badge */
  children: ReactNode;
}

export const TabsTrigger = forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ value: tabValue, disabled = false, className = '', children }, ref) => {
    const { value: activeValue, onValueChange, orientation, baseId } = useTabsContext();
    const isSelected = activeValue === tabValue;
    const tabId = `${baseId}-tab-${tabValue}`;
    const panelId = `${baseId}-panel-${tabValue}`;

    const handleClick = () => {
      if (disabled) return;
      onValueChange(tabValue);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onValueChange(tabValue);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        role="tab"
        id={tabId}
        data-value={tabValue}
        aria-selected={isSelected}
        aria-controls={panelId}
        aria-disabled={disabled}
        tabIndex={isSelected ? 0 : -1}
        disabled={disabled}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`skyra-tabs-trigger ${isSelected ? 'skyra-tabs-trigger--active' : ''} ${className}`}
      >
        {children}
      </button>
    );
  }
);
TabsTrigger.displayName = 'TabsTrigger';

/* ============================================================
   TABS CONTENT
   ============================================================ */

export interface TabsContentProps {
  /** Value matching the corresponding TabsTrigger */
  value: string;
  /** Whether to unmount content when not active */
  lazy?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Rich panel content */
  children: ReactNode;
}

export const TabsContent = forwardRef<HTMLDivElement, TabsContentProps>(
  ({ value: panelValue, lazy = false, className = '', children }, ref) => {
    const { value: activeValue, baseId } = useTabsContext();
    const isSelected = activeValue === panelValue;
    const tabId = `${baseId}-tab-${panelValue}`;
    const panelId = `${baseId}-panel-${panelValue}`;

    if (lazy && !isSelected) {
      return null;
    }

    return (
      <div
        ref={ref}
        role="tabpanel"
        id={panelId}
        aria-labelledby={tabId}
        tabIndex={0}
        hidden={!isSelected}
        className={`skyra-tabs-content ${isSelected ? 'skyra-tabs-content--active' : ''} ${className}`}
      >
        {children}
      </div>
    );
  }
);
TabsContent.displayName = 'TabsContent';
