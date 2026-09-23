'use client';

import React, { useState, useRef, useEffect, useId, useCallback, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useFloatingPosition, FloatingPlacement, FloatingAlign } from '../hooks/useFloatingPosition';
import {
  MenuContext,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  CheckboxMenuItem,
  RadioMenuItem,
} from './MenuPrimitives';

export interface DropdownMenuItemConfig {
  id?: string;
  type?: 'item' | 'separator' | 'group' | 'checkbox' | 'radio';
  label?: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  checked?: boolean;
  onClick?: () => void;
  onCheckedChange?: (checked: boolean) => void;
  items?: DropdownMenuItemConfig[];
}

export interface DropdownMenuProps {
  /** Trigger button or element that toggles the menu */
  trigger: ReactNode;
  /** Declarative list of menu items */
  items?: DropdownMenuItemConfig[];
  /** Compositional child menu primitives (MenuItem, MenuGroup, MenuSeparator, etc.) */
  children?: ReactNode;
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Preferred placement */
  placement?: FloatingPlacement;
  /** Alignment along cross axis */
  align?: FloatingAlign;
  /** Offset distance from trigger */
  offset?: number;
  /** Viewport edge padding */
  viewportPadding?: number;
  /** Whether the dropdown trigger is disabled */
  disabled?: boolean;
  /** Custom width for dropdown container */
  width?: string | number;
  /** Custom min-width for dropdown container */
  minWidth?: string | number;
  /** Custom max-width for dropdown container */
  maxWidth?: string | number;
  /** Whether selecting an item dismisses the menu */
  closeOnSelect?: boolean;
  /** Whether clicking outside dismisses the menu */
  closeOnOutsideClick?: boolean;
  /** Whether pressing Escape dismisses the menu */
  closeOnEscape?: boolean;
  /** Additional CSS class for outer container */
  className?: string;
  /** Additional CSS class for floating menu panel */
  contentClassName?: string;
  /** Accessible label for the menu */
  ariaLabel?: string;
}

/**
 * @skyra/ui DropdownMenu
 *
 * Action menu triggered by a button with full keyboard navigation (ArrowUp/Down, Home/End, Enter, Escape),
 * viewport collision flipping, focus restoration, groups, icons, destructive states, and checkable items.
 */
export function DropdownMenu({
  trigger,
  items,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom',
  align = 'start',
  offset = 6,
  viewportPadding = 8,
  disabled = false,
  width,
  minWidth = 180,
  maxWidth = 'min(90vw, 320px)',
  closeOnSelect = true,
  closeOnOutsideClick = true,
  closeOnEscape = true,
  className = '',
  contentClassName = '',
  ariaLabel = 'Actions menu',
}: DropdownMenuProps) {
  const isControlled = controlledOpen !== undefined;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = isControlled ? Boolean(controlledOpen) : uncontrolledOpen;

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

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

  const closeMenu = useCallback(() => {
    handleOpenChange(false);
  }, [handleOpenChange]);

  const { top, left, actualPlacement } = useFloatingPosition({
    anchor: triggerRef,
    floating: menuRef,
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
        menuRef.current?.contains(target)
      ) {
        return;
      }
      closeMenu();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [isOpen, closeOnOutsideClick, closeMenu]);

  // Focus first item upon opening
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstEnabledItem = menuRef.current.querySelector<HTMLButtonElement>(
        'button[role^="menuitem"]:not([disabled]):not([aria-disabled="true"])'
      );
      firstEnabledItem?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation inside menu
  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    if (e.key === 'Escape' && closeOnEscape) {
      e.preventDefault();
      closeMenu();
      const triggerButton = triggerRef.current?.querySelector<HTMLElement>('button, [tabindex="0"], a') || triggerRef.current;
      triggerButton?.focus();
      return;
    }

    const getEnabledItems = () => {
      if (!menuRef.current) return [];
      return Array.from(
        menuRef.current.querySelectorAll<HTMLButtonElement>(
          'button[role^="menuitem"]:not([disabled]):not([aria-disabled="true"])'
        )
      );
    };

    const itemsList = getEnabledItems();
    if (!itemsList.length) return;

    const activeEl = document.activeElement as HTMLButtonElement;
    const currentIndex = itemsList.indexOf(activeEl);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = currentIndex < itemsList.length - 1 ? currentIndex + 1 : 0;
      itemsList[nextIndex]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : itemsList.length - 1;
      itemsList[prevIndex]?.focus();
    } else if (e.key === 'Home') {
      e.preventDefault();
      itemsList[0]?.focus();
    } else if (e.key === 'End') {
      e.preventDefault();
      itemsList[itemsList.length - 1]?.focus();
    } else if (e.key === 'Tab') {
      // Close on tab out
      closeMenu();
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      if (!isOpen) {
        e.preventDefault();
        handleOpenChange(true);
      }
    } else if (e.key === 'Escape' && isOpen) {
      e.preventDefault();
      closeMenu();
    }
  };

  // Helper to render declarative items if passed
  const renderDeclarativeItems = (itemsToRender: DropdownMenuItemConfig[]) => {
    return itemsToRender.map((item, idx) => {
      if (item.type === 'separator') {
        return <MenuSeparator key={item.id ?? `sep-${idx}`} />;
      }
      if (item.type === 'group' && item.items) {
        return (
          <MenuGroup key={item.id ?? `group-${idx}`} label={typeof item.label === 'string' ? item.label : undefined}>
            {renderDeclarativeItems(item.items)}
          </MenuGroup>
        );
      }
      if (item.type === 'checkbox') {
        return (
          <CheckboxMenuItem
            key={item.id ?? `chk-${idx}`}
            checked={Boolean(item.checked)}
            onCheckedChange={(checked) => item.onCheckedChange?.(checked)}
            disabled={item.disabled}
            shortcut={item.shortcut}
          >
            {item.label}
          </CheckboxMenuItem>
        );
      }
      if (item.type === 'radio') {
        return (
          <RadioMenuItem
            key={item.id ?? `rad-${idx}`}
            checked={Boolean(item.checked)}
            onSelect={() => item.onClick?.()}
            disabled={item.disabled}
            shortcut={item.shortcut}
          >
            {item.label}
          </RadioMenuItem>
        );
      }
      return (
        <MenuItem
          key={item.id ?? `item-${idx}`}
          icon={item.icon}
          trailing={item.trailing}
          shortcut={item.shortcut}
          disabled={item.disabled}
          destructive={item.destructive}
          onClick={item.onClick}
        >
          {item.label}
        </MenuItem>
      );
    });
  };

  return (
    <MenuContext.Provider value={{ onItemSelect: closeMenu, closeOnSelect }}>
      <div
        ref={triggerRef}
        className={`skyra-dropdown-trigger-wrapper ${className}`}
        onClick={toggleOpen}
        onKeyDown={handleTriggerKeyDown}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-controls={isOpen ? menuId : undefined}
        style={{ display: 'inline-block' }}
      >
        {trigger}
      </div>

      {isOpen && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          id={menuId}
          className={`skyra-dropdown-menu-wrapper skyra-dropdown-menu--${actualPlacement} ${contentClassName}`}
          onKeyDown={handleMenuKeyDown}
          style={{
            position: 'fixed',
            top: `${top}px`,
            left: `${left}px`,
            zIndex: 'var(--skyra-z-dropdown, 1000)',
            width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
            minWidth: typeof minWidth === 'number' ? `${minWidth}px` : minWidth,
            maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
          }}
        >
          <MenuContent ariaLabel={ariaLabel}>
            {items ? renderDeclarativeItems(items) : children}
          </MenuContent>
        </div>,
        document.body
      )}
    </MenuContext.Provider>
  );
}
