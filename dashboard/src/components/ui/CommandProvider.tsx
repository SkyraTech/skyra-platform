'use client';

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';

export interface Command {
  /** Unique stable command identifier */
  id: string;
  /** Primary human-readable label */
  label: string;
  /** Secondary explanatory text */
  description?: string;
  /** Search keywords/synonyms */
  keywords?: string[];
  /** Group/category section name */
  group?: string;
  /** Visual icon component */
  icon?: React.ReactNode;
  /** Optional keyboard shortcut string (e.g. 'mod+k', 'mod+shift+p') */
  shortcut?: string;
  /** Whether the command is disabled (cannot be executed) */
  disabled?: boolean;
  /** Whether the command is hidden from the palette */
  hidden?: boolean;
  /** Whether executing this command should close the palette (default: true) */
  closeOnExecute?: boolean;
  /** Callback executed when command is activated */
  onExecute: () => void;
}

export interface CommandRegistryContextValue {
  commands: Command[];
  groups: string[];
  registerCommand: (command: Command) => () => void;
  registerCommands: (commands: Command[]) => () => void;
  unregisterCommand: (id: string) => void;
  executeCommand: (id: string) => boolean;
}

const CommandRegistryContext = createContext<CommandRegistryContextValue | null>(null);

export interface CommandProviderProps {
  children: ReactNode;
  /** Initial commands to seed the registry */
  initialCommands?: Command[];
}

export function CommandProvider({ children, initialCommands = [] }: CommandProviderProps) {
  const [registry, setRegistry] = useState<Map<string, Command>>(() => {
    const map = new Map<string, Command>();
    for (const cmd of initialCommands) {
      if (cmd && cmd.id) {
        map.set(cmd.id, cmd);
      }
    }
    return map;
  });

  const registerCommand = useCallback((command: Command) => {
    if (!command || !command.id) return () => {};

    setRegistry((prev) => {
      const next = new Map(prev);
      next.set(command.id, command);
      return next;
    });

    return () => {
      setRegistry((prev) => {
        if (!prev.has(command.id)) return prev;
        const next = new Map(prev);
        next.delete(command.id);
        return next;
      });
    };
  }, []);

  const registerCommands = useCallback((commands: Command[]) => {
    if (!Array.isArray(commands)) return () => {};

    setRegistry((prev) => {
      const next = new Map(prev);
      for (const cmd of commands) {
        if (cmd && cmd.id) {
          next.set(cmd.id, cmd);
        }
      }
      return next;
    });

    return () => {
      setRegistry((prev) => {
        const next = new Map(prev);
        for (const cmd of commands) {
          if (cmd && cmd.id) {
            next.delete(cmd.id);
          }
        }
        return next;
      });
    };
  }, []);

  const unregisterCommand = useCallback((id: string) => {
    setRegistry((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const executeCommand = useCallback(
    (id: string) => {
      const cmd = registry.get(id);
      if (cmd && !cmd.disabled && !cmd.hidden && typeof cmd.onExecute === 'function') {
        cmd.onExecute();
        return true;
      }
      return false;
    },
    [registry]
  );

  const commands = Array.from(registry.values());
  const groupSet = new Set<string>();
  for (const c of commands) {
    if (c.group && !c.hidden) {
      groupSet.add(c.group);
    }
  }
  const groups = Array.from(groupSet);

  return (
    <CommandRegistryContext.Provider
      value={{
        commands,
        groups,
        registerCommand,
        registerCommands,
        unregisterCommand,
        executeCommand }}
    >
      {children}
    </CommandRegistryContext.Provider>
  );
}

/**
 * useCommandRegistry — Hook to register, query, and execute commands.
 */
export function useCommandRegistry(): CommandRegistryContextValue {
  const context = useContext(CommandRegistryContext);
  if (!context) {
    throw new Error('useCommandRegistry must be used within a CommandProvider');
  }
  return context;
}
