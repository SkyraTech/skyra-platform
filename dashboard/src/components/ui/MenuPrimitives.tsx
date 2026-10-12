'use client';

import React, { createContext, useContext, ReactNode, forwardRef } from 'react';
import '@skyra-tech-platform/dropdown-menu';

export interface MenuContextValue {
  onItemSelect?: () => void;
  closeOnSelect?: boolean;
}

export const MenuContext = createContext<MenuContextValue>({});

/* ============================================================
   MENU CONTENT CONTAINER
   ============================================================ */

export interface MenuContentProps {
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
}

export const MenuContent = forwardRef<HTMLDivElement, MenuContentProps>(
  ({ children, className = '', ariaLabel, style }, ref) => {
    return (
      <div
        ref={ref}
        role="menu"
        aria-label={ariaLabel}
        tabIndex={-1}
        className={`skyra-menu-content ${className}`}
        style={style}
      >
        {children}
      </div>
    );
  }
);
MenuContent.displayName = 'MenuContent';

/* ============================================================
   MENU ITEM
   ============================================================ */

export interface MenuItemProps {
  children: ReactNode;
  icon?: ReactNode;
  trailing?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLElement>) => void;
  className?: string;
  title?: string;
}

export const MenuItem = forwardRef<HTMLElement, MenuItemProps>(
  (
    {
      children,
      icon,
      trailing,
      shortcut,
      disabled = false,
      destructive = false,
      onClick,
      className = '',
      title,
    },
    ref
  ) => {
    const { onItemSelect, closeOnSelect = true } = useContext(MenuContext);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      onClick?.(e);
      if (closeOnSelect) {
        onItemSelect?.();
      }
    };

    return (
      <skyra-dropdown-item
        ref={ref}
        type="item"
        disabled={disabled || undefined}
        destructive={destructive || undefined}
        shortcut={shortcut}
        title={title}
        class={className}
        onClick={handleClick}
      >
        {icon && <span slot="icon">{icon}</span>}
        {children}
        {trailing && <span slot="trailing">{trailing}</span>}
      </skyra-dropdown-item>
    );
  }
);
MenuItem.displayName = 'MenuItem';

/* ============================================================
   MENU GROUP
   ============================================================ */

export interface MenuGroupProps {
  children: ReactNode;
  label?: string;
  className?: string;
}

export function MenuGroup({ children, label, className = '' }: MenuGroupProps) {
  return (
    <skyra-dropdown-group label={label} class={className}>
      {children}
    </skyra-dropdown-group>
  );
}

/* ============================================================
   MENU SEPARATOR
   ============================================================ */

export interface MenuSeparatorProps {
  className?: string;
}

export function MenuSeparator({ className = '' }: MenuSeparatorProps) {
  return <skyra-dropdown-separator class={className} />;
}

/* ============================================================
   CHECKBOX MENU ITEM
   ============================================================ */

export interface CheckboxMenuItemProps {
  children: ReactNode;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  shortcut?: string;
  className?: string;
}

export const CheckboxMenuItem = forwardRef<HTMLElement, CheckboxMenuItemProps>(
  (
    {
      children,
      checked,
      onCheckedChange,
      disabled = false,
      shortcut,
      className = '',
    },
    ref
  ) => {
    const { onItemSelect } = useContext(MenuContext);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      onCheckedChange(!checked);
      onItemSelect?.();
    };

    return (
      <skyra-dropdown-item
        ref={ref}
        type="checkbox"
        checked={checked || undefined}
        disabled={disabled || undefined}
        shortcut={shortcut}
        class={className}
        onClick={handleClick}
      >
        {children}
      </skyra-dropdown-item>
    );
  }
);
CheckboxMenuItem.displayName = 'CheckboxMenuItem';

/* ============================================================
   RADIO MENU ITEM
   ============================================================ */

export interface RadioMenuItemProps {
  children: ReactNode;
  checked: boolean;
  onSelect: () => void;
  disabled?: boolean;
  shortcut?: string;
  className?: string;
}

export const RadioMenuItem = forwardRef<HTMLElement, RadioMenuItemProps>(
  (
    {
      children,
      checked,
      onSelect,
      disabled = false,
      shortcut,
      className = '',
    },
    ref
  ) => {
    const { onItemSelect } = useContext(MenuContext);

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
      if (disabled) return;
      e.preventDefault();
      onSelect();
      onItemSelect?.();
    };

    return (
      <skyra-dropdown-item
        ref={ref}
        type="radio"
        checked={checked || undefined}
        disabled={disabled || undefined}
        shortcut={shortcut}
        class={className}
        onClick={handleClick}
      >
        {children}
      </skyra-dropdown-item>
    );
  }
);
RadioMenuItem.displayName = 'RadioMenuItem';
