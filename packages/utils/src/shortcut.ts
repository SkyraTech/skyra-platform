/**
 * @skyra/utils — Keyboard Shortcut Utilities
 *
 * Pure TypeScript utilities for normalizing, parsing, formatting,
 * and matching keyboard shortcuts.
 * Zero DOM / Zero React / Zero browser dependencies.
 */

export type ModifierKey = 'ctrl' | 'meta' | 'alt' | 'shift' | 'mod';

export interface ShortcutDescriptor {
  raw: string;
  normalized: string;
  ctrlKey: boolean;
  metaKey: boolean;
  altKey: boolean;
  shiftKey: boolean;
  isMod: boolean;
  key: string;
}

export interface KeyboardEventLike {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
  target?: unknown;
}

const MODIFIER_ALIASES: Record<string, 'ctrl' | 'meta' | 'alt' | 'shift' | 'mod'> = {
  ctrl: 'ctrl',
  control: 'ctrl',
  cmd: 'mod',
  command: 'mod',
  meta: 'meta',
  alt: 'alt',
  option: 'alt',
  opt: 'alt',
  shift: 'shift',
  mod: 'mod',
};

const SPECIAL_KEY_ALIASES: Record<string, string> = {
  esc: 'escape',
  return: 'enter',
  space: ' ',
  spacebar: ' ',
  up: 'arrowup',
  down: 'arrowdown',
  left: 'arrowleft',
  right: 'arrowright',
};

/**
 * Normalizes a shortcut string to a standard canonical format.
 * Example: 'Cmd + Shift + P' -> 'mod+shift+p'
 */
export function normalizeShortcut(shortcut: string): string {
  if (!shortcut || typeof shortcut !== 'string') return '';

  const parts = shortcut
    .toLowerCase()
    .split(/[\s+]+/)
    .map((p) => p.trim())
    .filter(Boolean);

  let hasMod = false;
  let hasCtrl = false;
  let hasMeta = false;
  let hasAlt = false;
  let hasShift = false;
  let mainKey = '';

  for (const part of parts) {
    const alias = MODIFIER_ALIASES[part];
    if (alias === 'mod') {
      hasMod = true;
    } else if (alias === 'ctrl') {
      hasCtrl = true;
    } else if (alias === 'meta') {
      hasMeta = true;
    } else if (alias === 'alt') {
      hasAlt = true;
    } else if (alias === 'shift') {
      hasShift = true;
    } else {
      mainKey = SPECIAL_KEY_ALIASES[part] ?? part;
    }
  }

  const normalizedModifiers: string[] = [];
  if (hasMod) normalizedModifiers.push('mod');
  if (!hasMod && hasCtrl) normalizedModifiers.push('ctrl');
  if (!hasMod && hasMeta) normalizedModifiers.push('meta');
  if (hasAlt) normalizedModifiers.push('alt');
  if (hasShift) normalizedModifiers.push('shift');

  if (!mainKey && normalizedModifiers.length === 0) return '';
  if (!mainKey) return normalizedModifiers.join('+');

  return [...normalizedModifiers, mainKey].join('+');
}

/**
 * Parses a shortcut string into a structured descriptor.
 */
export function parseShortcut(shortcut: string): ShortcutDescriptor {
  const normalized = normalizeShortcut(shortcut);
  const parts = normalized.split('+');

  let ctrlKey = false;
  let metaKey = false;
  let altKey = false;
  let shiftKey = false;
  let isMod = false;
  let key = '';

  for (const part of parts) {
    if (part === 'mod') {
      isMod = true;
    } else if (part === 'ctrl') {
      ctrlKey = true;
    } else if (part === 'meta') {
      metaKey = true;
    } else if (part === 'alt') {
      altKey = true;
    } else if (part === 'shift') {
      shiftKey = true;
    } else {
      key = part;
    }
  }

  return {
    raw: shortcut,
    normalized,
    ctrlKey,
    metaKey,
    altKey,
    shiftKey,
    isMod,
    key,
  };
}

/**
 * Formats a shortcut for human-readable display on specific platform (mac vs windows/linux).
 * Safe for SSR (defaults to standard readable cross-platform format if platform is undefined).
 */
export function formatShortcut(shortcut: string, platform?: 'mac' | 'windows' | 'linux'): string {
  if (!shortcut) return '';
  const parsed = parseShortcut(shortcut);
  const isMac = platform === 'mac';

  const tokens: string[] = [];

  if (parsed.isMod) {
    tokens.push(isMac ? '⌘' : 'Ctrl');
  } else {
    if (parsed.ctrlKey) tokens.push(isMac ? '⌃' : 'Ctrl');
    if (parsed.metaKey) tokens.push(isMac ? '⌘' : 'Win');
  }

  if (parsed.altKey) tokens.push(isMac ? '⌥' : 'Alt');
  if (parsed.shiftKey) tokens.push(isMac ? '⇧' : 'Shift');

  if (parsed.key) {
    const k = parsed.key;
    if (k === 'escape') tokens.push('Esc');
    else if (k === 'enter') tokens.push('↵');
    else if (k === 'arrowup') tokens.push('↑');
    else if (k === 'arrowdown') tokens.push('↓');
    else if (k === 'arrowleft') tokens.push('←');
    else if (k === 'arrowright') tokens.push('→');
    else if (k === 'backspace') tokens.push('⌫');
    else if (k === 'delete') tokens.push('Del');
    else if (k === 'tab') tokens.push('Tab');
    else if (k === ' ') tokens.push('Space');
    else tokens.push(k.toUpperCase());
  }

  return isMac ? tokens.join(' ') : tokens.join('+');
}

/**
 * Matches a KeyboardEvent against a shortcut string.
 * Accounts for platform-neutral mod (Cmd on Mac, Ctrl on Win/Linux).
 */
export function matchesShortcutKey(
  event: KeyboardEventLike,
  shortcut: string,
  platform?: 'mac' | 'windows' | 'linux'
): boolean {
  if (!shortcut || !event || !event.key) return false;

  const parsed = parseShortcut(shortcut);
  const eventKey = event.key.toLowerCase();
  const targetKey = parsed.key.toLowerCase();

  // Key equality
  const keyMatches =
    eventKey === targetKey ||
    (targetKey === 'escape' && eventKey === 'esc') ||
    (targetKey === 'enter' && eventKey === 'return') ||
    (targetKey === ' ' && (eventKey === 'space' || eventKey === 'spacebar'));

  if (!keyMatches) return false;

  const isMac = platform === 'mac';

  // Check mod modifier or direct modifiers
  if (parsed.isMod) {
    const modActive = isMac ? !!event.metaKey : !!event.ctrlKey;
    if (!modActive) return false;

    // The opposing mod key must not be pressed
    if (isMac && event.ctrlKey) return false;
    if (!isMac && event.metaKey) return false;
  } else {
    if (!!event.ctrlKey !== parsed.ctrlKey) return false;
    if (!!event.metaKey !== parsed.metaKey) return false;
  }

  if (!!event.altKey !== parsed.altKey) return false;
  if (!!event.shiftKey !== parsed.shiftKey) return false;

  return true;
}

/**
 * Detects if a DOM node or event target is an interactive text input element.
 */
export function isInputElement(target: unknown): boolean {
  if (!target || typeof target !== 'object') return false;

  const el = target as {
    tagName?: string;
    isContentEditable?: boolean;
    getAttribute?: (name: string) => string | null;
  };

  if (el.isContentEditable) return true;

  const tag = (el.tagName ?? '').toLowerCase();
  if (tag === 'textarea' || tag === 'select') return true;

  if (tag === 'input') {
    const type = el.getAttribute ? (el.getAttribute('type') || 'text').toLowerCase() : 'text';
    const nonTextTypes = ['button', 'checkbox', 'radio', 'submit', 'reset', 'range', 'color'];
    return !nonTextTypes.includes(type);
  }

  return false;
}

/**
 * Validates a list of shortcut definitions and reports duplicate / conflicting keybindings.
 */
export interface ShortcutConflict {
  shortcut: string;
  ids: string[];
}

export function detectShortcutConflicts(
  entries: Array<{ id: string; shortcut: string }>
): ShortcutConflict[] {
  const map = new Map<string, string[]>();

  for (const entry of entries) {
    if (!entry.shortcut) continue;
    const normalized = normalizeShortcut(entry.shortcut);
    if (!normalized) continue;

    const existing = map.get(normalized) ?? [];
    existing.push(entry.id);
    map.set(normalized, existing);
  }

  const conflicts: ShortcutConflict[] = [];
  for (const [shortcut, ids] of map.entries()) {
    if (ids.length > 1) {
      conflicts.push({ shortcut, ids });
    }
  }

  return conflicts;
}
