'use client';

import React, { createContext, useContext, ReactNode, forwardRef } from 'react';
import { Check, Dot } from 'lucide-react';

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
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  title?: string;
}

export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
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

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
      <button
        ref={ref}
        type="button"
        role="menuitem"
        aria-disabled={disabled}
        disabled={disabled}
        title={title}
        onClick={handleClick}
        className={`skyra-menu-item ${destructive ? 'skyra-menu-item--destructive' : ''} ${className}`}
      >
        {icon && <span className="skyra-menu-item-icon">{icon}</span>}
        <span className="skyra-menu-item-label">{children}</span>
        {shortcut && <span className="skyra-menu-item-shortcut">{shortcut}</span>}
        {trailing && <span className="skyra-menu-item-trailing">{trailing}</span>}
      </button>
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
    <div role="group" aria-label={label} className={`skyra-menu-group ${className}`}>
      {label && <div className="skyra-menu-group-label">{label}</div>}
      {children}
    </div>
  );
}

/* ============================================================
   MENU SEPARATOR
   ============================================================ */

export interface MenuSeparatorProps {
  className?: string;
}

export function MenuSeparator({ className = '' }: MenuSeparatorProps) {
  return <div role="separator" aria-orientation="horizontal" className={`skyra-menu-separator ${className}`} />;
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

export const CheckboxMenuItem = forwardRef<HTMLButtonElement, CheckboxMenuItemProps>(
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

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      e.preventDefault();
      onCheckedChange(!checked);
      onItemSelect?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        role="menuitemcheckbox"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
        className={`skyra-menu-item skyra-menu-item--checkbox ${className}`}
      >
        <span className="skyra-menu-item-check-indicator">
          {checked && <Check size={14} strokeWidth={2.5} />}
        </span>
        <span className="skyra-menu-item-label">{children}</span>
        {shortcut && <span className="skyra-menu-item-shortcut">{shortcut}</span>}
      </button>
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

export const RadioMenuItem = forwardRef<HTMLButtonElement, RadioMenuItemProps>(
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

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      e.preventDefault();
      onSelect();
      onItemSelect?.();
    };

    return (
      <button
        ref={ref}
        type="button"
        role="menuitemradio"
        aria-checked={checked}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={handleClick}
        className={`skyra-menu-item skyra-menu-item--radio ${className}`}
      >
        <span className="skyra-menu-item-radio-indicator">
          {checked && <Dot size={20} strokeWidth={3} />}
        </span>
        <span className="skyra-menu-item-label">{children}</span>
        {shortcut && <span className="skyra-menu-item-shortcut">{shortcut}</span>}
      </button>
    );
  }
);
RadioMenuItem.displayName = 'RadioMenuItem';
