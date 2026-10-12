'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import '@skyra-tech-platform/dropdown-menu';
import type { SkyraDropdownMenuElement } from '@skyra-tech-platform/dropdown-menu';
import type { PopoverPlacement, PopoverAlign } from '@skyra-tech-platform/popover';
import {
  MenuContext,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  CheckboxMenuItem,
  RadioMenuItem,
} from './MenuPrimitives';

type FloatingPlacement = PopoverPlacement;
type FloatingAlign = PopoverAlign;

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
 * Thin framework adapter delegating directly to the canonical
 * `@skyra-tech-platform/dropdown-menu` (`<skyra-dropdown-menu>`) Custom Element.
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
  const menuRef = useRef<SkyraDropdownMenuElement>(null);
  const isControlled = controlledOpen !== undefined;

  // Initialize uncontrolled defaultOpen
  useEffect(() => {
    const el = menuRef.current;
    if (el && !isControlled && defaultOpen) {
      el.open = true;
    }
  }, [defaultOpen, isControlled]);

  // Synchronize controlled open state
  useEffect(() => {
    const el = menuRef.current;
    if (el && isControlled) {
      el.open = Boolean(controlledOpen);
    }
  }, [controlledOpen, isControlled]);

  // Synchronize dynamic properties directly to custom element
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    el.placement = placement;
    el.align = align;
    el.offset = offset;
    el.viewportPadding = viewportPadding;
    el.closeOnSelect = closeOnSelect;
    el.closeOnOutsideClick = closeOnOutsideClick;
    el.closeOnEscape = closeOnEscape;
    el.disabled = disabled;
    if (width !== undefined) el.menuWidth = width;
    if (maxWidth !== undefined) el.menuMaxWidth = maxWidth;
    if (minWidth !== undefined) el.menuMinWidth = minWidth;
    if (ariaLabel) el.ariaLabel = ariaLabel;
  }, [
    placement,
    align,
    offset,
    viewportPadding,
    closeOnSelect,
    closeOnOutsideClick,
    closeOnEscape,
    disabled,
    width,
    maxWidth,
    minWidth,
    ariaLabel,
  ]);

  // Subscribe to canonical custom element events
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const customEvt = e as CustomEvent<{ open: boolean }>;
      onOpenChange?.(customEvt.detail.open);
    };

    el.addEventListener('skyra-dropdown-change', handleChange);
    el.addEventListener('skyra-dropdown-menu-change', handleChange);
    return () => {
      el.removeEventListener('skyra-dropdown-change', handleChange);
      el.removeEventListener('skyra-dropdown-menu-change', handleChange);
    };
  }, [onOpenChange]);

  const closeMenu = () => {
    if (menuRef.current) {
      menuRef.current.hide('select');
    }
  };

  const renderDeclarativeItems = (itemsToRender: DropdownMenuItemConfig[]) => {
    return itemsToRender.map((item, idx) => {
      if (item.type === 'separator') {
        return <MenuSeparator key={item.id ?? `sep-${idx}`} />;
      }
      if (item.type === 'group' && item.items) {
        return (
          <MenuGroup
            key={item.id ?? `group-${idx}`}
            label={typeof item.label === 'string' ? item.label : undefined}
          >
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
      <skyra-dropdown-menu
        ref={menuRef}
        placement={placement}
        align={align}
        offset={offset}
        viewport-padding={viewportPadding}
        close-on-select={closeOnSelect ? undefined : 'false'}
        close-on-outside-click={closeOnOutsideClick ? undefined : 'false'}
        close-on-escape={closeOnEscape ? undefined : 'false'}
        disabled={disabled || undefined}
        menu-width={width}
        menu-min-width={minWidth}
        menu-max-width={maxWidth}
        aria-label={ariaLabel}
        class={`skyra-dropdown-menu-host ${className}`}
      >
        <div slot="trigger" className="skyra-dropdown-trigger-wrapper" style={{ display: 'inline-block' }}>
          {trigger}
        </div>
        {items ? renderDeclarativeItems(items) : children}
      </skyra-dropdown-menu>
    </MenuContext.Provider>
  );
}
