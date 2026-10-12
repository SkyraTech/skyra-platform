'use client';

import React, {
  useRef,
  useEffect,
  forwardRef,
  ReactNode,
  HTMLAttributes,
  InputHTMLAttributes,
} from 'react';
import '@skyra-tech-platform/command-palette';
import type { SkyraCommandPaletteElement, CommandItem } from '@skyra-tech-platform/command-palette';
import { Search, X, Command as CommandIcon } from 'lucide-react';
import { Command, useCommandRegistry } from './CommandProvider';
import { Kbd } from './Kbd';

export type { CommandItem };

/* ─── CommandPalette Root ─── */

export interface CommandPaletteProps {
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled default open state */
  defaultOpen?: boolean;
  /** Callback fired when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Commands list (if omitted, pulls from CommandProvider registry) */
  commands?: Command[];
  /** Search placeholder text */
  placeholder?: string;
  /** Empty results message */
  emptyText?: string;
  /** Shortcut key to toggle palette (e.g. 'mod+k') */
  shortcut?: string;
  /** Whether selecting a command closes the palette (default: true) */
  closeOnSelect?: boolean;
  /** Whether Escape closes the palette (default: true) */
  closeOnEscape?: boolean;
  /** Whether backdrop click closes the palette (default: true) */
  closeOnBackdrop?: boolean;
  /** Optional callback fired when a command is selected */
  onSelect?: (command: CommandItem) => void;
  /** Custom compound children (if omitted, renders canonical Web Component dialog) */
  children?: ReactNode;
  className?: string;
}

/**
 * Canonical @skyra-tech-platform/command-palette React Adapter
 *
 * Thin framework adapter delegating directly to the canonical
 * `@skyra-tech-platform/command-palette` (`<skyra-command-palette>`) Custom Element.
 */
export function CommandPalette({
  open,
  defaultOpen = false,
  onOpenChange,
  commands: explicitCommands,
  placeholder = 'Type a command or search...',
  emptyText = 'No matching commands found.',
  shortcut = 'mod+k',
  closeOnSelect = true,
  closeOnEscape = true,
  closeOnBackdrop = true,
  onSelect,
  className = '',
}: CommandPaletteProps) {
  const paletteRef = useRef<SkyraCommandPaletteElement>(null);

  // Command source from registry if not provided explicitly
  let registryCommands: Command[] = [];
  try {
    const registry = useCommandRegistry();
    registryCommands = registry.commands;
  } catch {
    // Not wrapped in CommandProvider
  }

  const rawCommands = explicitCommands ?? registryCommands;

  // Convert Commands to CommandItems format compatible with Custom Element
  const items: CommandItem[] = (rawCommands || []).map((cmd) => ({
    id: cmd.id,
    label: cmd.label,
    description: cmd.description,
    keywords: cmd.keywords,
    group: cmd.group,
    shortcut: cmd.shortcut,
    disabled: cmd.disabled,
    hidden: cmd.hidden,
    closeOnExecute: cmd.closeOnExecute,
    onExecute: cmd.onExecute,
    payload: cmd,
  }));

  // Synchronize properties to Custom Element
  useEffect(() => {
    const el = paletteRef.current;
    if (!el) return;

    el.commands = items;
    el.shortcut = shortcut;
    el.placeholder = placeholder;
    el.emptyText = emptyText;
    el.closeOnSelect = closeOnSelect;
    el.closeOnEscape = closeOnEscape;
    el.closeOnBackdrop = closeOnBackdrop;
  }, [items, shortcut, placeholder, emptyText, closeOnSelect, closeOnEscape, closeOnBackdrop]);

  // Synchronize controlled open state
  useEffect(() => {
    const el = paletteRef.current;
    if (!el || open === undefined) return;
    el.open = open;
  }, [open]);

  // Set initial uncontrolled state once on mount
  useEffect(() => {
    const el = paletteRef.current;
    if (el && open === undefined && defaultOpen) {
      el.open = true;
    }
  }, [defaultOpen, open]);

  // Event handlers
  useEffect(() => {
    const el = paletteRef.current;
    if (!el) return;

    const handleChange = (e: Event) => {
      const customEvent = e as CustomEvent<{ open: boolean }>;
      onOpenChange?.(customEvent.detail.open);
    };

    const handleSelect = (e: Event) => {
      const customEvent = e as CustomEvent<{ command: CommandItem }>;
      onSelect?.(customEvent.detail.command);
    };

    el.addEventListener('skyra-command-palette-change', handleChange);
    el.addEventListener('skyra-command-select', handleSelect);

    return () => {
      el.removeEventListener('skyra-command-palette-change', handleChange);
      el.removeEventListener('skyra-command-select', handleSelect);
    };
  }, [onOpenChange, onSelect]);

  return (
    <skyra-command-palette
      ref={paletteRef}
      shortcut={shortcut}
      placeholder={placeholder}
      empty-text={emptyText}
      close-on-select={closeOnSelect ? undefined : 'false'}
      close-on-escape={closeOnEscape ? undefined : 'false'}
      close-on-backdrop={closeOnBackdrop ? undefined : 'false'}
      class={className || undefined}
    />
  );
}

/* ─── CommandPaletteTrigger ─── */

export interface CommandPaletteTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  shortcut?: string;
  children?: ReactNode;
}

export const CommandPaletteTrigger = forwardRef<HTMLButtonElement, CommandPaletteTriggerProps>(
  ({ shortcut = 'mod+k', children, className = '', onClick, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={['skyra-command-palette-trigger', className].filter(Boolean).join(' ')}
        onClick={onClick}
        aria-label="Open Command Palette"
        {...rest}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <Search size={15} aria-hidden="true" style={{ color: 'var(--skyra-text-muted)' }} />
          <span>{children || 'Search commands...'}</span>
        </span>
        {shortcut && <Kbd shortcut={shortcut} size="xs" />}
      </button>
    );
  }
);
CommandPaletteTrigger.displayName = 'CommandPaletteTrigger';

/* ─── Static Compound UI Primitives for Custom Layouts ─── */

export interface CommandPaletteInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  onClear?: () => void;
}

export const CommandPaletteInput = forwardRef<HTMLInputElement, CommandPaletteInputProps>(
  ({ placeholder = 'Type a command or search...', className = '', value, onClear, ...rest }, ref) => {
    return (
      <div className="skyra-command-palette-input-wrap">
        <Search size={16} aria-hidden="true" className="skyra-command-palette-search-icon" />
        <input
          ref={ref}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          value={value}
          placeholder={placeholder}
          className={['skyra-command-palette-input', className].filter(Boolean).join(' ')}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          {...rest}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="skyra-command-palette-clear-btn"
          >
            <X size={14} aria-hidden="true" />
          </button>
        )}
      </div>
    );
  }
);
CommandPaletteInput.displayName = 'CommandPaletteInput';

export interface CommandPaletteListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CommandPaletteList = forwardRef<HTMLDivElement, CommandPaletteListProps>(
  ({ children, className = '', ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="listbox"
        aria-label="Commands"
        className={['skyra-command-palette-list', className].filter(Boolean).join(' ')}
        {...rest}
      >
        {children}
      </div>
    );
  }
);
CommandPaletteList.displayName = 'CommandPaletteList';

export interface CommandPaletteGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading: string;
  children?: ReactNode;
}

export const CommandPaletteGroup = forwardRef<HTMLDivElement, CommandPaletteGroupProps>(
  ({ heading, children, className = '', ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="group"
        className={['skyra-command-palette-group', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <div className="skyra-command-palette-group-heading">{heading}</div>
        {children}
      </div>
    );
  }
);
CommandPaletteGroup.displayName = 'CommandPaletteGroup';

export interface CommandPaletteItemProps extends HTMLAttributes<HTMLDivElement> {
  command: Command;
  children?: ReactNode;
  selected?: boolean;
}

export const CommandPaletteItem = forwardRef<HTMLDivElement, CommandPaletteItemProps>(
  ({ command, children, selected = false, className = '', ...rest }, ref) => {
    return (
      <div
        ref={ref}
        role="option"
        aria-selected={selected}
        aria-disabled={command.disabled ? 'true' : undefined}
        className={[
          'skyra-command-palette-item',
          selected ? 'skyra-command-palette-item--selected' : '',
          command.disabled ? 'skyra-command-palette-item--disabled' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...rest}
      >
        {children ? (
          children
        ) : (
          <>
            <span className="skyra-command-palette-item-main">
              {command.icon ? (
                <span className="skyra-command-palette-item-icon" aria-hidden="true">
                  {command.icon}
                </span>
              ) : (
                <CommandIcon size={14} className="skyra-command-palette-item-icon" aria-hidden="true" />
              )}
              <span className="skyra-command-palette-item-text">
                <span className="skyra-command-palette-item-label">{command.label}</span>
                {command.description && (
                  <span className="skyra-command-palette-item-desc">{command.description}</span>
                )}
              </span>
            </span>
            {command.shortcut && <Kbd shortcut={command.shortcut} size="xs" />}
          </>
        )}
      </div>
    );
  }
);
CommandPaletteItem.displayName = 'CommandPaletteItem';

export interface CommandPaletteEmptyProps extends HTMLAttributes<HTMLDivElement> {
  message?: string;
}

export function CommandPaletteEmpty({
  message = 'No matching commands found.',
  className = '',
  ...rest
}: CommandPaletteEmptyProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={['skyra-command-palette-empty', className].filter(Boolean).join(' ')}
      {...rest}
    >
      <Search size={22} aria-hidden="true" className="skyra-command-palette-empty-icon" />
      <span>{message}</span>
    </div>
  );
}

export function CommandPaletteSeparator({ className = '' }: { className?: string }) {
  return <hr className={['skyra-command-palette-separator', className].filter(Boolean).join(' ')} />;
}

export function CommandPaletteFooter({ className = '' }: { className?: string }) {
  return (
    <div className={['skyra-command-palette-footer', className].filter(Boolean).join(' ')}>
      <div className="skyra-command-palette-footer-item">
        <Kbd size="xs">↑</Kbd>
        <Kbd size="xs">↓</Kbd>
        <span>Navigate</span>
      </div>
      <div className="skyra-command-palette-footer-item">
        <Kbd size="xs">↵</Kbd>
        <span>Select</span>
      </div>
      <div className="skyra-command-palette-footer-item">
        <Kbd size="xs">Esc</Kbd>
        <span>Close</span>
      </div>
    </div>
  );
}
