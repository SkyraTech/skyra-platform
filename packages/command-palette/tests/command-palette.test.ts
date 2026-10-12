import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/index.js';
import type { SkyraCommandPaletteElement } from '../src/index.js';
import {
  COMMAND_SELECT_EVENT,
  COMMAND_PALETTE_OPEN_EVENT,
  COMMAND_PALETTE_CLOSE_EVENT,
  COMMAND_PALETTE_CHANGE_EVENT,
  COMMAND_PALETTE_QUERY_EVENT,
  CommandItem,
} from '../src/types.js';

describe('SkyraCommandPaletteElement', () => {
  let palette: SkyraCommandPaletteElement;

  const mockCommands: CommandItem[] = [
    { id: 'home', label: 'Go to Home', group: 'Navigation', shortcut: 'G H' },
    { id: 'settings', label: 'Settings', group: 'Navigation', shortcut: '⌘,' },
    { id: 'profile', label: 'User Profile', group: 'Account', description: 'View your profile' },
    { id: 'billing', label: 'Billing & Invoicing', group: 'Account', disabled: true },
    { id: 'docs', label: 'Documentation', group: 'Help', keywords: ['api', 'guide'] },
  ];

  beforeEach(() => {
    palette = document.createElement('skyra-command-palette') as SkyraCommandPaletteElement;
    palette.commands = [...mockCommands];
    document.body.appendChild(palette);
  });

  afterEach(() => {
    palette.remove();
  });

  it('registers all custom elements in customElements registry', () => {
    expect(customElements.get('skyra-command-palette')).toBeDefined();
    expect(customElements.get('skyra-tech-command-palette')).toBeDefined();
  });

  it('initializes with default closed state and proper accessibility semantics', () => {
    expect(palette.open).toBe(false);
    expect(palette.shortcut).toBe('mod+k');
    expect(palette.placeholder).toBe('Type a command or search...');
    expect(palette.emptyText).toBe('No matching commands found.');
    expect(palette.closeOnSelect).toBe(true);
    expect(palette.closeOnEscape).toBe(true);
    expect(palette.closeOnBackdrop).toBe(true);

    const modal = palette.shadowRoot?.querySelector('.skyra-command-palette-modal');
    expect(modal?.getAttribute('role')).toBe('dialog');
    expect(modal?.getAttribute('aria-modal')).toBe('true');

    const input = palette.shadowRoot?.querySelector('input');
    expect(input?.getAttribute('role')).toBe('combobox');
    expect(input?.getAttribute('aria-autocomplete')).toBe('list');

    const list = palette.shadowRoot?.querySelector('[role="listbox"]');
    expect(list).not.toBeNull();
  });

  it('synchronizes properties with attributes', () => {
    palette.placeholder = 'Search actions...';
    expect(palette.getAttribute('placeholder')).toBe('Search actions...');

    palette.emptyText = 'Nothing found.';
    expect(palette.getAttribute('empty-text')).toBe('Nothing found.');

    palette.shortcut = 'mod+shift+p';
    expect(palette.getAttribute('shortcut')).toBe('mod+shift+p');

    palette.closeOnSelect = false;
    expect(palette.getAttribute('close-on-select')).toBe('false');

    palette.open = true;
    expect(palette.hasAttribute('open')).toBe(true);

    palette.open = false;
    expect(palette.hasAttribute('open')).toBe(false);
  });

  it('opens and closes programmatically using show(), hide(), toggle()', () => {
    const openSpy = vi.fn();
    const closeSpy = vi.fn();
    const changeSpy = vi.fn();

    palette.addEventListener(COMMAND_PALETTE_OPEN_EVENT, openSpy);
    palette.addEventListener(COMMAND_PALETTE_CLOSE_EVENT, closeSpy);
    palette.addEventListener(COMMAND_PALETTE_CHANGE_EVENT, changeSpy);

    palette.show();
    expect(palette.open).toBe(true);
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(changeSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { open: true },
    }));

    palette.hide('programmatic');
    expect(palette.open).toBe(false);
    expect(closeSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { reason: 'programmatic' },
    }));

    palette.toggle();
    expect(palette.open).toBe(true);

    palette.toggle();
    expect(palette.open).toBe(false);
  });

  it('renders command items grouped by category with headers', () => {
    palette.show();

    const groups = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-group');
    expect(groups?.length).toBe(3); // Navigation, Account, Help

    const headings = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-group-heading');
    const headingTexts = Array.from(headings || []).map((h) => h.textContent?.trim());
    expect(headingTexts).toContain('Navigation');
    expect(headingTexts).toContain('Account');
    expect(headingTexts).toContain('Help');

    const items = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-item');
    expect(items?.length).toBe(5);
  });

  it('filters commands via search query and dispatches query event', () => {
    palette.show();
    const querySpy = vi.fn();
    palette.addEventListener(COMMAND_PALETTE_QUERY_EVENT, querySpy);

    const input = palette.shadowRoot?.querySelector('input') as HTMLInputElement;
    expect(input).not.toBeNull();

    input.value = 'profile';
    input.dispatchEvent(new Event('input'));

    expect(querySpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: { query: 'profile', count: 1 },
    }));

    const items = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-item');
    expect(items?.length).toBe(1);
    expect(items?.[0].textContent).toContain('User Profile');
  });

  it('matches commands by keyword and description', () => {
    palette.show();
    const input = palette.shadowRoot?.querySelector('input') as HTMLInputElement;

    // By keyword 'api' -> Documentation
    input.value = 'api';
    input.dispatchEvent(new Event('input'));
    let items = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-item');
    expect(items?.length).toBe(1);
    expect(items?.[0].textContent).toContain('Documentation');

    // By description 'your profile' -> User Profile
    input.value = 'your profile';
    input.dispatchEvent(new Event('input'));
    items = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-item');
    expect(items?.length).toBe(1);
    expect(items?.[0].textContent).toContain('User Profile');
  });

  it('displays empty message when no commands match query', () => {
    palette.show();
    const input = palette.shadowRoot?.querySelector('input') as HTMLInputElement;

    input.value = 'nonexistentxyz';
    input.dispatchEvent(new Event('input'));

    const empty = palette.shadowRoot?.querySelector('.skyra-command-palette-empty') as HTMLElement;
    expect(empty).not.toBeNull();
    expect(empty.hidden).toBe(false);
    expect(empty.textContent).toContain('No matching commands found.');

    const items = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-item');
    expect(items?.length).toBe(0);
  });

  it('navigates through active items using keyboard (ArrowDown, ArrowUp, Home, End)', () => {
    palette.show();
    const input = palette.shadowRoot?.querySelector('input') as HTMLInputElement;

    // Initial enabled command at index 0 (Go to Home)
    const items = palette.shadowRoot?.querySelectorAll('.skyra-command-palette-item');
    expect(items?.[0].getAttribute('aria-selected')).toBe('true');

    // ArrowDown moves to index 1 (Settings)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(items?.[1].getAttribute('aria-selected')).toBe('true');

    // ArrowDown moves to index 2 (User Profile, skipping billing which is disabled)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(items?.[2].getAttribute('aria-selected')).toBe('true');

    // ArrowDown moves to index 4 (Documentation)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(items?.[4].getAttribute('aria-selected')).toBe('true');

    // ArrowUp moves back to index 2
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    expect(items?.[2].getAttribute('aria-selected')).toBe('true');

    // Home moves to first enabled command (index 0)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(items?.[0].getAttribute('aria-selected')).toBe('true');

    // End moves to last enabled command (index 4)
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(items?.[4].getAttribute('aria-selected')).toBe('true');
  });

  it('executes active command on Enter and closes palette when closeOnSelect is true', () => {
    const executeSpy = vi.fn();
    const selectSpy = vi.fn();

    palette.commands = [
      { id: 'test-exec', label: 'Test Execute', onExecute: executeSpy },
    ];
    palette.addEventListener(COMMAND_SELECT_EVENT, selectSpy);
    palette.show();

    const input = palette.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(executeSpy).toHaveBeenCalledTimes(1);
    expect(selectSpy).toHaveBeenCalledWith(expect.objectContaining({
      detail: expect.objectContaining({
        id: 'test-exec',
        label: 'Test Execute',
      }),
    }));
    expect(palette.open).toBe(false);
  });

  it('does not execute disabled command when clicked or triggered', () => {
    const disabledCmd = mockCommands.find((c) => c.disabled);
    expect(disabledCmd).toBeDefined();

    const selectSpy = vi.fn();
    palette.addEventListener(COMMAND_SELECT_EVENT, selectSpy);
    palette.show();

    // Try selecting disabled command directly
    palette.selectCommand(disabledCmd!.id);
    expect(selectSpy).not.toHaveBeenCalled();
    expect(palette.open).toBe(true);

    // Try clicking disabled item in DOM
    const disabledItem = palette.shadowRoot?.querySelector('.skyra-command-palette-item[aria-disabled="true"]') as HTMLElement;
    expect(disabledItem).not.toBeNull();
    disabledItem.click();
    expect(selectSpy).not.toHaveBeenCalled();
    expect(palette.open).toBe(true);
  });

  it('closes on Escape key and restores focus to previous active element', () => {
    const triggerBtn = document.createElement('button');
    triggerBtn.textContent = 'Trigger';
    document.body.appendChild(triggerBtn);
    triggerBtn.focus();
    expect(document.activeElement).toBe(triggerBtn);

    palette.show();
    expect(palette.open).toBe(true);

    const input = palette.shadowRoot?.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));

    expect(palette.open).toBe(false);
    expect(document.activeElement).toBe(triggerBtn);

    triggerBtn.remove();
  });

  it('closes on backdrop click when closeOnBackdrop is enabled', () => {
    palette.show();
    expect(palette.open).toBe(true);

    const backdrop = palette.shadowRoot?.querySelector('.skyra-command-palette-backdrop') as HTMLElement;
    backdrop.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    expect(palette.open).toBe(false);
  });

  it('ignores global shortcut when typing in input or textarea while closed', () => {
    const textInput = document.createElement('input');
    document.body.appendChild(textInput);
    textInput.focus();

    expect(palette.open).toBe(false);

    // Simulate Mod+K while typing in text input
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: textInput });
    window.dispatchEvent(event);

    expect(palette.open).toBe(false);

    textInput.remove();
  });

  it('toggles open on global shortcut when not in text input', () => {
    expect(palette.open).toBe(false);

    // Simulate Mod+K on body
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(palette.open).toBe(true);

    // Press again to close
    window.dispatchEvent(event);
    expect(palette.open).toBe(false);
  });

  it('cleans up global listeners on disconnectedCallback without memory leaks', () => {
    palette.remove();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    window.dispatchEvent(event);

    expect(palette.open).toBe(false);
  });

  it('handles empty and malformed commands array gracefully', () => {
    palette.commands = null as unknown as CommandItem[];
    expect(palette.commands).toEqual([]);

    palette.commands = undefined as unknown as CommandItem[];
    expect(palette.commands).toEqual([]);

    palette.commands = [{ id: '', label: '' }];
    palette.show();
    expect(palette.open).toBe(true);
  });
});
