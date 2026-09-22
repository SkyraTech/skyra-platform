import { describe, it, expect } from 'vitest';
import {
  normalizeShortcut,
  parseShortcut,
  formatShortcut,
  matchesShortcutKey,
  isInputElement,
  detectShortcutConflicts,
} from './shortcut';

describe('normalizeShortcut', () => {
  it('normalizes casing and whitespace', () => {
    expect(normalizeShortcut('Ctrl + K')).toBe('ctrl+k');
    expect(normalizeShortcut('cmd+shift+p')).toBe('mod+shift+p');
    expect(normalizeShortcut('MOD + ALT + S')).toBe('mod+alt+s');
  });

  it('normalizes modifier aliases', () => {
    expect(normalizeShortcut('Control + Option + Delete')).toBe('ctrl+alt+delete');
    expect(normalizeShortcut('Command + Shift + Esc')).toBe('mod+shift+escape');
    expect(normalizeShortcut('Cmd + K')).toBe('mod+k');
  });

  it('orders modifiers deterministically: mod/ctrl/meta, alt, shift, key', () => {
    expect(normalizeShortcut('shift+alt+ctrl+x')).toBe('ctrl+alt+shift+x');
    expect(normalizeShortcut('k+mod')).toBe('mod+k');
  });

  it('handles empty/invalid input safely', () => {
    expect(normalizeShortcut('')).toBe('');
    expect(normalizeShortcut(null as any)).toBe('');
  });
});

describe('parseShortcut', () => {
  it('parses structured shortcut descriptor correctly', () => {
    const parsed = parseShortcut('Mod+Shift+P');
    expect(parsed.isMod).toBe(true);
    expect(parsed.shiftKey).toBe(true);
    expect(parsed.altKey).toBe(false);
    expect(parsed.ctrlKey).toBe(false);
    expect(parsed.key).toBe('p');
  });
});

describe('formatShortcut', () => {
  it('formats shortcut for Windows / Linux', () => {
    expect(formatShortcut('mod+k', 'windows')).toBe('Ctrl+K');
    expect(formatShortcut('mod+shift+p', 'linux')).toBe('Ctrl+Shift+P');
    expect(formatShortcut('alt+s', 'windows')).toBe('Alt+S');
    expect(formatShortcut('escape', 'windows')).toBe('Esc');
    expect(formatShortcut('enter', 'windows')).toBe('↵');
  });

  it('formats shortcut for macOS with standard symbols', () => {
    expect(formatShortcut('mod+k', 'mac')).toBe('⌘ K');
    expect(formatShortcut('mod+shift+p', 'mac')).toBe('⌘ ⇧ P');
    expect(formatShortcut('alt+s', 'mac')).toBe('⌥ S');
  });
});

describe('matchesShortcutKey', () => {
  it('matches mod+k on windows with ctrlKey=true', () => {
    const event = { key: 'k', ctrlKey: true, metaKey: false, altKey: false, shiftKey: false };
    expect(matchesShortcutKey(event, 'mod+k', 'windows')).toBe(true);
  });

  it('matches mod+k on macOS with metaKey=true', () => {
    const event = { key: 'k', ctrlKey: false, metaKey: true, altKey: false, shiftKey: false };
    expect(matchesShortcutKey(event, 'mod+k', 'mac')).toBe(true);
  });

  it('rejects if opposing modifier is active on mac (ctrl instead of meta)', () => {
    const event = { key: 'k', ctrlKey: true, metaKey: false, altKey: false, shiftKey: false };
    expect(matchesShortcutKey(event, 'mod+k', 'mac')).toBe(false);
  });

  it('matches special keys (Escape, Enter, Space)', () => {
    expect(matchesShortcutKey({ key: 'Escape' }, 'escape', 'windows')).toBe(true);
    expect(matchesShortcutKey({ key: 'Enter' }, 'enter', 'windows')).toBe(true);
    expect(matchesShortcutKey({ key: ' ' }, 'space', 'windows')).toBe(true);
  });
});

describe('isInputElement', () => {
  it('identifies input, textarea, select, contenteditable as text inputs', () => {
    expect(isInputElement({ tagName: 'INPUT', getAttribute: () => 'text' })).toBe(true);
    expect(isInputElement({ tagName: 'TEXTAREA' })).toBe(true);
    expect(isInputElement({ tagName: 'SELECT' })).toBe(true);
    expect(isInputElement({ isContentEditable: true })).toBe(true);
  });

  it('does not treat buttons or divs as text inputs', () => {
    expect(isInputElement({ tagName: 'BUTTON' })).toBe(false);
    expect(isInputElement({ tagName: 'DIV' })).toBe(false);
    expect(isInputElement({ tagName: 'INPUT', getAttribute: () => 'checkbox' })).toBe(false);
    expect(isInputElement(null)).toBe(false);
  });
});

describe('detectShortcutConflicts', () => {
  it('detects duplicate shortcuts across multiple commands', () => {
    const entries = [
      { id: 'cmd-1', shortcut: 'mod+k' },
      { id: 'cmd-2', shortcut: 'mod+shift+p' },
      { id: 'cmd-3', shortcut: 'Cmd + K' },
    ];
    const conflicts = detectShortcutConflicts(entries);
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0].shortcut).toBe('mod+k');
    expect(conflicts[0].ids).toEqual(['cmd-1', 'cmd-3']);
  });
});
