'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  useId,
  forwardRef,
  ReactNode,
  HTMLAttributes,
  InputHTMLAttributes,
} from 'react';
import { createPortal } from 'react-dom';
import { Search, X, Command as CommandIcon } from 'lucide-react';
import { filterCommands } from '@skyra/utils';
import { Command, useCommandRegistry } from './CommandProvider';
import { Kbd } from './Kbd';

/* ─── Context ─── */

interface CommandPaletteContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  query: string;
  setQuery: (query: string) => void;
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  filteredCommands: Command[];
  onSelectCommand: (command: Command) => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  listId: string;
  inputId: string;
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error('CommandPalette compound components must be used within a CommandPalette');
  }
  return ctx;
}

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
  /** Custom compound children (if omitted, renders standard full UI) */
  children?: ReactNode;
  className?: string;
}

export function CommandPalette({
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  commands: explicitCommands,
  placeholder = 'Type a command or search...',
  emptyText = 'No matching commands found.',
  children,
  className = '',
}: CommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  const listId = useId();
  const inputId = useId();

  // Command source
  let registryCommands: Command[] = [];
  try {
    const registry = useCommandRegistry();
    registryCommands = registry.commands;
  } catch {
    // Not wrapped in CommandProvider
  }

  const rawCommands = explicitCommands ?? registryCommands;
  const filteredCommands = filterCommands(rawCommands, query);
  const enabledCommands = filteredCommands.filter((c: Command) => !c.disabled);

  const setOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setUncontrolledOpen(nextOpen);
      }
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
        setQuery('');
        setActiveIndex(0);
      }
    },
    [isControlled, onOpenChange]
  );

  // Focus management
  useEffect(() => {
    if (isOpen) {
      previousActiveElementRef.current = document.activeElement as HTMLElement | null;
      // Focus search input on open
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    } else {
      if (
        previousActiveElementRef.current &&
        typeof previousActiveElementRef.current.focus === 'function'
      ) {
        previousActiveElementRef.current.focus();
      }
    }
  }, [isOpen]);

  // Keep active index within bounds
  useEffect(() => {
    if (activeIndex >= enabledCommands.length) {
      setActiveIndex(Math.max(0, enabledCommands.length - 1));
    }
  }, [enabledCommands.length, activeIndex]);

  const onSelectCommand = useCallback(
    (cmd: Command) => {
      if (cmd.disabled) return;
      if (cmd.closeOnExecute !== false) {
        setOpen(false);
      }
      cmd.onExecute();
    },
    [setOpen]
  );

  // Global escape and backdrop scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, setOpen]);

  if (!isOpen) return null;

  // Group commands
  const grouped = new Map<string, Command[]>();
  for (const cmd of filteredCommands) {
    const groupName = cmd.group || 'General';
    const list = grouped.get(groupName) ?? [];
    list.push(cmd);
    grouped.set(groupName, list);
  }

  const contextValue: CommandPaletteContextValue = {
    open: isOpen,
    setOpen,
    query,
    setQuery,
    activeIndex,
    setActiveIndex,
    filteredCommands,
    onSelectCommand,
    inputRef,
    listId,
    inputId,
  };

  const content = (
    <CommandPaletteContext.Provider value={contextValue}>
      <div
        className="skyra-command-palette-backdrop"
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command Palette"
        className={['skyra-command-palette-modal', className].filter(Boolean).join(' ')}
      >
        {children ? (
          children
        ) : (
          <>
            <CommandPaletteInput placeholder={placeholder} />
            <CommandPaletteList>
              {filteredCommands.length === 0 ? (
                <CommandPaletteEmpty message={emptyText} />
              ) : (
                Array.from(grouped.entries()).map(([groupName, items]) => (
                  <CommandPaletteGroup key={groupName} heading={groupName}>
                    {items.map((cmd) => (
                      <CommandPaletteItem key={cmd.id} command={cmd} />
                    ))}
                  </CommandPaletteGroup>
                ))
              )}
            </CommandPaletteList>
            <CommandPaletteFooter />
          </>
        )}
      </div>
    </CommandPaletteContext.Provider>
  );

  return typeof document !== 'undefined' ? createPortal(content, document.body) : null;
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

/* ─── CommandPaletteInput ─── */

export interface CommandPaletteInputProps extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const CommandPaletteInput = forwardRef<HTMLInputElement, CommandPaletteInputProps>(
  ({ placeholder = 'Type a command or search...', className = '', ...rest }, ref) => {
    const { query, setQuery, activeIndex, setActiveIndex, filteredCommands, onSelectCommand, setOpen, inputRef, listId, inputId } =
      useCommandPalette();

    const enabledCommands = filteredCommands.filter((c) => !c.disabled);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex(activeIndex + 1 >= enabledCommands.length ? 0 : activeIndex + 1);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex(activeIndex - 1 < 0 ? Math.max(0, enabledCommands.length - 1) : activeIndex - 1);
      } else if (e.key === 'Home') {
        e.preventDefault();
        setActiveIndex(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        setActiveIndex(Math.max(0, enabledCommands.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeCmd = enabledCommands[activeIndex];
        if (activeCmd) {
          onSelectCommand(activeCmd);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
      }
    };

    return (
      <div className="skyra-command-palette-input-wrap">
        <Search size={16} aria-hidden="true" className="skyra-command-palette-search-icon" />
        <input
          ref={(node) => {
            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
          }}
          id={inputId}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="true"
          aria-controls={listId}
          aria-activedescendant={
            enabledCommands[activeIndex] ? `cmd-item-${enabledCommands[activeIndex].id}` : undefined
          }
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={['skyra-command-palette-input', className].filter(Boolean).join(' ')}
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          {...rest}
        />
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setActiveIndex(0);
              inputRef.current?.focus();
            }}
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

/* ─── CommandPaletteList ─── */

export interface CommandPaletteListProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const CommandPaletteList = forwardRef<HTMLDivElement, CommandPaletteListProps>(
  ({ children, className = '', ...rest }, ref) => {
    const { listId } = useCommandPalette();
    return (
      <div
        ref={ref}
        id={listId}
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

/* ─── CommandPaletteGroup ─── */

export interface CommandPaletteGroupProps extends HTMLAttributes<HTMLDivElement> {
  heading: string;
  children?: ReactNode;
}

export const CommandPaletteGroup = forwardRef<HTMLDivElement, CommandPaletteGroupProps>(
  ({ heading, children, className = '', ...rest }, ref) => {
    const headingId = useId();
    return (
      <div
        ref={ref}
        role="group"
        aria-labelledby={headingId}
        className={['skyra-command-palette-group', className].filter(Boolean).join(' ')}
        {...rest}
      >
        <div id={headingId} className="skyra-command-palette-group-heading">
          {heading}
        </div>
        {children}
      </div>
    );
  }
);
CommandPaletteGroup.displayName = 'CommandPaletteGroup';

/* ─── CommandPaletteItem ─── */

export interface CommandPaletteItemProps extends HTMLAttributes<HTMLDivElement> {
  command: Command;
  children?: ReactNode;
}

export const CommandPaletteItem = forwardRef<HTMLDivElement, CommandPaletteItemProps>(
  ({ command, children, className = '', ...rest }, ref) => {
    const { activeIndex, setActiveIndex, onSelectCommand, filteredCommands } = useCommandPalette();

    const enabledCommands = filteredCommands.filter((c) => !c.disabled);
    const enabledIndex = enabledCommands.findIndex((c) => c.id === command.id);
    const isSelected = enabledIndex === activeIndex;

    const handleClick = () => {
      if (!command.disabled) {
        onSelectCommand(command);
      }
    };

    const handleMouseEnter = () => {
      if (!command.disabled && enabledIndex >= 0) {
        setActiveIndex(enabledIndex);
      }
    };

    return (
      <div
        ref={ref}
        id={`cmd-item-${command.id}`}
        role="option"
        aria-selected={isSelected}
        aria-disabled={command.disabled ? 'true' : undefined}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        className={[
          'skyra-command-palette-item',
          isSelected ? 'skyra-command-palette-item--selected' : '',
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

/* ─── CommandPaletteEmpty ─── */

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

/* ─── CommandPaletteSeparator ─── */

export function CommandPaletteSeparator({ className = '' }: { className?: string }) {
  return <hr className={['skyra-command-palette-separator', className].filter(Boolean).join(' ')} />;
}

/* ─── CommandPaletteFooter ─── */

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
