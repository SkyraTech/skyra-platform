'use client';

import React, { useState, useRef, useEffect, useId, useCallback, ReactNode } from 'react';
import { useFloatingPosition, VirtualAnchor } from '../hooks/useFloatingPosition';
import {
  MenuContext,
  MenuContent,
  MenuItem,
  MenuGroup,
  MenuSeparator,
  CheckboxMenuItem,
  RadioMenuItem,
} from './MenuPrimitives';
import { DropdownMenuItemConfig } from './DropdownMenu';

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
 * @skyra/ui ContextMenu
 *
 * Right-click contextual action menu anchored to pointer click coordinates with
 * viewport edge collision protection, keyboard navigation, and dark mode support.
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
  const [isOpen, setIsOpen] = useState(false);
  const [virtualAnchor, setVirtualAnchor] = useState<VirtualAnchor | null>(null);

  const targetRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    e.preventDefault();
    e.stopPropagation();

    setVirtualAnchor({ x: e.clientX, y: e.clientY });
    setIsOpen(true);
  };

  const closeMenu = useCallback(() => {
    setIsOpen(false);
  }, []);

  const { top, left, actualPlacement } = useFloatingPosition({
    anchor: virtualAnchor,
    floating: menuRef,
    open: isOpen,
    placement: 'bottom',
    align: 'start',
    offset: 2,
    viewportPadding: 8,
  });

  // Handle outside click & window scroll to dismiss
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) {
        closeMenu();
      }
    };

    const handleScroll = () => {
      closeMenu();
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    window.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      window.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isOpen, closeMenu]);

  // Focus first menu item on open
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstEnabledItem = menuRef.current.querySelector<HTMLButtonElement>(
        'button[role^="menuitem"]:not([disabled]):not([aria-disabled="true"])'
      );
      firstEnabledItem?.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isOpen) return;

    if (e.key === 'Escape' && closeOnEscape) {
      e.preventDefault();
      closeMenu();
      targetRef.current?.focus();
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
        ref={targetRef}
        className={`skyra-context-menu-target ${className}`}
        onContextMenu={handleContextMenu}
        tabIndex={0}
      >
        {children}
      </div>

      {isOpen && (
        <div
          ref={menuRef}
          id={menuId}
          className={`skyra-context-menu-wrapper skyra-context-menu--${actualPlacement} ${contentClassName}`}
          onKeyDown={handleKeyDown}
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
            {items ? renderDeclarativeItems(items) : content}
          </MenuContent>
        </div>
      )}
    </MenuContext.Provider>
  );
}
