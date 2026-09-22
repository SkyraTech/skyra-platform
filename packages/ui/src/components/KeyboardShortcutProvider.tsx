'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  useId,
  ReactNode,
} from 'react';
import {
  matchesShortcutKey,
  isInputElement,
  normalizeShortcut,
  detectShortcutConflicts,
  ShortcutConflict,
} from '@skyra/utils';

export interface ShortcutOptions {
  /** Description for documentation / shortcut showcase */
  description?: string;
  /** Category / group name */
  group?: string;
  /** Whether the shortcut is currently enabled (default: true) */
  enabled?: boolean;
  /** Whether the shortcut should trigger even when user is typing in an input/textarea (default: false) */
  allowInInput?: boolean;
  /** Whether to call e.preventDefault() when triggered (default: true) */
  preventDefault?: boolean;
}

export interface RegisteredShortcut extends ShortcutOptions {
  id: string;
  shortcut: string;
  normalized: string;
  handler: () => void;
}

interface KeyboardShortcutContextValue {
  registerShortcut: (
    id: string,
    shortcut: string,
    handler: () => void,
    options?: ShortcutOptions
  ) => () => void;
  unregisterShortcut: (id: string) => void;
  shortcuts: RegisteredShortcut[];
  conflicts: ShortcutConflict[];
  platform: 'mac' | 'windows' | 'linux';
}

const KeyboardShortcutContext = createContext<KeyboardShortcutContextValue | null>(null);

export interface KeyboardShortcutProviderProps {
  children: ReactNode;
  /** Explicit platform override (for testing or server rendering) */
  platform?: 'mac' | 'windows' | 'linux';
  /** Callback fired when duplicate/conflicting shortcuts are detected */
  onConflict?: (conflicts: ShortcutConflict[]) => void;
}

export function KeyboardShortcutProvider({
  children,
  platform: explicitPlatform,
  onConflict,
}: KeyboardShortcutProviderProps) {
  const [registry, setRegistry] = useState<Map<string, RegisteredShortcut>>(new Map());
  const [platform, setPlatform] = useState<'mac' | 'windows' | 'linux'>('windows');

  useEffect(() => {
    if (explicitPlatform) {
      setPlatform(explicitPlatform);
    } else if (typeof navigator !== 'undefined') {
      const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform || navigator.userAgent);
      setPlatform(isMac ? 'mac' : 'windows');
    }
  }, [explicitPlatform]);

  const registerShortcut = useCallback(
    (id: string, shortcut: string, handler: () => void, options: ShortcutOptions = {}) => {
      const normalized = normalizeShortcut(shortcut);
      if (!normalized) return () => {};

      setRegistry((prev) => {
        const next = new Map(prev);
        next.set(id, {
          id,
          shortcut,
          normalized,
          handler,
          enabled: options.enabled ?? true,
          allowInInput: options.allowInInput ?? false,
          preventDefault: options.preventDefault ?? true,
          description: options.description,
          group: options.group,
        });
        return next;
      });

      return () => {
        setRegistry((prev) => {
          if (!prev.has(id)) return prev;
          const next = new Map(prev);
          next.delete(id);
          return next;
        });
      };
    },
    []
  );

  const unregisterShortcut = useCallback((id: string) => {
    setRegistry((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Map(prev);
      next.delete(id);
      return next;
    });
  }, []);

  // Global keydown listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isInput = isInputElement(e.target);

      for (const item of registry.values()) {
        if (!item.enabled) continue;
        if (isInput && !item.allowInInput) continue;

        if (matchesShortcutKey(e, item.normalized, platform)) {
          if (item.preventDefault) {
            e.preventDefault();
          }
          item.handler();
          break; // First match wins deterministically
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [registry, platform]);

  const shortcuts = React.useMemo(() => Array.from(registry.values()), [registry]);
  const conflicts = React.useMemo(() => detectShortcutConflicts(shortcuts), [shortcuts]);

  useEffect(() => {
    if (conflicts.length > 0 && onConflict) {
      onConflict(conflicts);
    }
  }, [conflicts, onConflict]);

  const contextValue = React.useMemo<KeyboardShortcutContextValue>(
    () => ({
      registerShortcut,
      unregisterShortcut,
      shortcuts,
      conflicts,
      platform,
    }),
    [registerShortcut, unregisterShortcut, shortcuts, conflicts, platform]
  );

  return (
    <KeyboardShortcutContext.Provider value={contextValue}>
      {children}
    </KeyboardShortcutContext.Provider>
  );
}

/**
 * useKeyboardShortcut — Declarative hook to register a keyboard shortcut.
 */
export function useKeyboardShortcut(
  shortcut: string,
  handler: () => void,
  options: ShortcutOptions = {}
) {
  const context = useContext(KeyboardShortcutContext);
  const registerShortcut = context?.registerShortcut;
  const generatedId = useId();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const { enabled = true, allowInInput = false, preventDefault = true, description, group } = options;

  useEffect(() => {
    if (!registerShortcut || !shortcut || !enabled) return;

    const unregister = registerShortcut(
      generatedId,
      shortcut,
      () => handlerRef.current(),
      { enabled, allowInInput, preventDefault, description, group }
    );

    return unregister;
  }, [registerShortcut, shortcut, enabled, allowInInput, preventDefault, description, group, generatedId]);
}

/**
 * useKeyboardShortcuts — Hook to access all registered shortcuts and conflicts.
 */
export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutProvider');
  }
  return context;
}
