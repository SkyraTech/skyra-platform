'use client';

import React, { useRef, useEffect, ReactNode } from 'react';
import '@skyra-tech-platform/context-menu';
import type { SkyraContextMenuElement } from '@skyra-tech-platform/context-menu';
import type { DropdownMenuItemConfig } from './DropdownMenu';
import {
  MenuContext,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  CheckboxMenuItem,
  RadioMenuItem,
} from './MenuPrimitives';

export type { DropdownMenuItemConfig };

export interface ContextMenuProps {
  /** Target element wrapped by the context menu */
  children: ReactNode;
  /** Declarative list of menu items */
  items?: DropdownMenuItemConfig[];
  /** Compositional child menu primitives */
  content?: ReactNode;
  /** Whether the context menu trigger is disabled */
  disabled?: boolean;
  /** Custom width for menu */
  width?: string | number;
  /** Custom min-width for menu */
  minWidth?: string | number;
  /** Custom max-width for menu */
  maxWidth?: string | number;
  /** Whether clicking outside dismisses the menu */
  closeOnOutsideClick?: boolean;
  /** Whether pressing Escape dismisses the menu */
  closeOnEscape?: boolean;
  /** Whether selecting an item dismisses the menu */
  closeOnSelect?: boolean;
  /** Additional CSS class for target wrapper */
  className?: string;
  /** Additional CSS class for floating menu panel */
  contentClassName?: string;
  /** Accessible label for the menu */
  ariaLabel?: string;
}

/**
 * Canonical @skyra-tech-platform/context-menu React Adapter
 *
 * Thin framework adapter delegating directly to the canonical
 * `@skyra-tech-platform/context-menu` (`<skyra-context-menu>`) Custom Element.
 */
export function ContextMenu({
  children,
  items,
  content,
  disabled = false,
  width,
  minWidth = 180,
  maxWidth = 'min(90vw, 300px)',
  closeOnOutsideClick = true,
  closeOnEscape = true,
  closeOnSelect = true,
  className = '',
  contentClassName = '',
  ariaLabel = 'Context actions menu',
}: ContextMenuProps) {
  const menuRef = useRef<SkyraContextMenuElement>(null);

  // Synchronize dynamic properties directly to custom element
  useEffect(() => {
    const el = menuRef.current;
    if (!el) return;
    el.disabled = disabled;
    el.closeOnOutsideClick = closeOnOutsideClick;
    el.closeOnEscape = closeOnEscape;
    el.closeOnSelect = closeOnSelect;
    if (width !== undefined) el.menuWidth = width;
    if (maxWidth !== undefined) el.menuMaxWidth = maxWidth;
    if (minWidth !== undefined) el.menuMinWidth = minWidth;
    if (ariaLabel) el.ariaLabel = ariaLabel;
  }, [
    disabled,
    closeOnOutsideClick,
    closeOnEscape,
    closeOnSelect,
    width,
    maxWidth,
    minWidth,
    ariaLabel,
  ]);

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
      <skyra-context-menu
        ref={menuRef}
        disabled={disabled || undefined}
        close-on-select={closeOnSelect ? undefined : 'false'}
        close-on-outside-click={closeOnOutsideClick ? undefined : 'false'}
        close-on-escape={closeOnEscape ? undefined : 'false'}
        menu-width={width}
        menu-min-width={minWidth}
        menu-max-width={maxWidth}
        aria-label={ariaLabel}
        class={`skyra-context-menu-host ${className}`}
      >
        <div slot="target" className="skyra-context-menu-target-wrapper">
          {children}
        </div>
        <div slot="menu" className={`skyra-context-menu-content ${contentClassName}`}>
          {items ? renderDeclarativeItems(items) : content}
        </div>
      </skyra-context-menu>
    </MenuContext.Provider>
  );
}
