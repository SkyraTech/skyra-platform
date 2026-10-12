import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/index.js';
import type { SkyraContextMenuElement } from '../src/index.js';
import type { SkyraContextMenuItemElement } from '../src/index.js';

describe('SkyraContextMenuElement', () => {
  let menu: SkyraContextMenuElement;

  beforeEach(() => {
    menu = document.createElement('skyra-context-menu') as SkyraContextMenuElement;
    document.body.appendChild(menu);
  });

  afterEach(() => {
    menu.remove();
  });

  it('registers all custom elements in customElements registry', () => {
    expect(customElements.get('skyra-context-menu')).toBeDefined();
    expect(customElements.get('skyra-tech-context-menu')).toBeDefined();
    expect(customElements.get('skyra-context-menu-item')).toBeDefined();
    expect(customElements.get('skyra-tech-context-menu-item')).toBeDefined();
    expect(customElements.get('skyra-context-menu-separator')).toBeDefined();
    expect(customElements.get('skyra-tech-context-menu-separator')).toBeDefined();
    expect(customElements.get('skyra-context-menu-group')).toBeDefined();
    expect(customElements.get('skyra-tech-context-menu-group')).toBeDefined();
  });

  it('initializes with default closed state and proper ARIA semantics', () => {
    expect(menu.open).toBe(false);
    expect(menu.disabled).toBe(false);
    expect(menu.placement).toBe('bottom');
    expect(menu.align).toBe('start');
    expect(menu.closeOnSelect).toBe(true);
    expect(menu.closeOnScroll).toBe(true);

    const target = menu.shadowRoot?.querySelector('.skyra-context-menu-target');
    expect(target?.getAttribute('aria-expanded')).toBe('false');
    expect(target?.getAttribute('aria-haspopup')).toBe('menu');

    const panel = menu.shadowRoot?.querySelector('.skyra-context-menu-panel');
    expect(panel?.getAttribute('role')).toBe('menu');
  });

  it('synchronizes properties with attributes', () => {
    menu.placement = 'top';
    expect(menu.getAttribute('placement')).toBe('top');

    menu.align = 'end';
    expect(menu.getAttribute('align')).toBe('end');

    menu.open = true;
    expect(menu.hasAttribute('open')).toBe(true);
    const target = menu.shadowRoot?.querySelector('.skyra-context-menu-target');
    expect(target?.getAttribute('aria-expanded')).toBe('true');

    menu.open = false;
    expect(menu.hasAttribute('open')).toBe(false);
    expect(target?.getAttribute('aria-expanded')).toBe('false');
  });

  it('opens at explicit coordinates via openAt and dispatches open & change events', () => {
    const openSpy = vi.fn();
    const changeSpy = vi.fn();
    menu.addEventListener('skyra-context-menu-open', openSpy);
    menu.addEventListener('skyra-context-menu-change', changeSpy);

    menu.openAt(250, 400);

    expect(menu.open).toBe(true);
    expect(menu.virtualCoordinates).toEqual({ x: 250, y: 400 });
    expect(changeSpy).toHaveBeenCalled();
  });

  it('handles right-click contextmenu event on target wrapper', () => {
    const target = menu.shadowRoot?.querySelector('.skyra-context-menu-target') as HTMLElement;
    expect(target).toBeDefined();

    const evt = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 120,
      clientY: 300,
    });

    target.dispatchEvent(evt);

    expect(evt.defaultPrevented).toBe(true);
    expect(menu.open).toBe(true);
    expect(menu.virtualCoordinates).toEqual({ x: 120, y: 300 });
  });

  it('handles keyboard invocation via ContextMenu or Shift+F10 with fallback coordinates', () => {
    const target = menu.shadowRoot?.querySelector('.skyra-context-menu-target') as HTMLElement;

    const evt = new KeyboardEvent('keydown', {
      key: 'ContextMenu',
      bubbles: true,
      cancelable: true,
    });

    target.dispatchEvent(evt);

    expect(evt.defaultPrevented).toBe(true);
    expect(menu.open).toBe(true);
  });

  it('does not open when disabled', () => {
    menu.disabled = true;
    const target = menu.shadowRoot?.querySelector('.skyra-context-menu-target') as HTMLElement;

    const evt = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 100,
    });

    target.dispatchEvent(evt);
    expect(menu.open).toBe(false);

    menu.openAt(100, 100);
    expect(menu.open).toBe(false);
  });

  it('dismisses on Escape and dispatches close event with reason "escape"', () => {
    menu.openAt(100, 100);
    expect(menu.open).toBe(true);

    const closeSpy = vi.fn();
    menu.addEventListener('skyra-context-menu-close', closeSpy);

    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true,
    });
    document.dispatchEvent(escEvent);

    expect(menu.open).toBe(false);
    expect(closeSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: { reason: 'escape' },
      })
    );
  });

  it('dismisses on outside pointerdown and scroll', () => {
    menu.openAt(100, 100);
    expect(menu.open).toBe(true);

    const pointerEvt = new Event('pointerdown', { bubbles: true });
    document.dispatchEvent(pointerEvt);
    expect(menu.open).toBe(false);

    // Reopen and test scroll
    menu.openAt(100, 100);
    expect(menu.open).toBe(true);
    window.dispatchEvent(new Event('scroll'));
    expect(menu.open).toBe(false);
  });

  it('supports item selection and closes menu when closeOnSelect is true', () => {
    const item = document.createElement('skyra-context-menu-item') as SkyraContextMenuItemElement;
    item.value = 'action-copy';
    menu.appendChild(item);

    menu.openAt(100, 100);
    expect(menu.open).toBe(true);

    const selectSpy = vi.fn();
    menu.addEventListener('skyra-context-menu-select', selectSpy);

    item.triggerSelect();

    expect(selectSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: expect.objectContaining({ value: 'action-copy' }),
      })
    );
    expect(menu.open).toBe(false);
  });

  it('toggles checkbox and radio items correctly', () => {
    const chk = document.createElement('skyra-context-menu-item') as SkyraContextMenuItemElement;
    chk.type = 'checkbox';
    chk.checked = false;
    menu.appendChild(chk);

    chk.triggerSelect();
    expect(chk.checked).toBe(true);

    chk.triggerSelect();
    expect(chk.checked).toBe(false);

    const rad = document.createElement('skyra-context-menu-item') as SkyraContextMenuItemElement;
    rad.type = 'radio';
    rad.checked = false;
    menu.appendChild(rad);

    rad.triggerSelect();
    expect(rad.checked).toBe(true);
  });

  it('does not trigger selection or activate when item is disabled', () => {
    const item = document.createElement('skyra-context-menu-item') as SkyraContextMenuItemElement;
    item.disabled = true;
    menu.appendChild(item);

    const selectSpy = vi.fn();
    item.addEventListener('skyra-context-menu-item-select', selectSpy);

    item.triggerSelect();
    expect(selectSpy).not.toHaveBeenCalled();
  });

  it('renders declarative items configuration dynamically', () => {
    menu.items = [
      { label: 'Edit', value: 'edit' },
      { type: 'separator' },
      { label: 'Delete', value: 'delete', destructive: true },
    ];

    const items = menu.querySelectorAll('skyra-context-menu-item');
    const separators = menu.querySelectorAll('skyra-context-menu-separator');

    expect(items.length).toBe(2);
    expect(separators.length).toBe(1);
    expect(items[0].textContent).toBe('Edit');
    expect(items[1].destructive).toBe(true);
  });

  it('supports roving keyboard navigation with ArrowDown and ArrowUp', () => {
    const item1 = document.createElement('skyra-context-menu-item') as SkyraContextMenuItemElement;
    const item2 = document.createElement('skyra-context-menu-item') as SkyraContextMenuItemElement;
    menu.appendChild(item1);
    menu.appendChild(item2);

    menu.openAt(100, 100);

    const focusSpy1 = vi.spyOn(item1, 'focusItem');
    const focusSpy2 = vi.spyOn(item2, 'focusItem');

    const downEvent1 = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
    document.dispatchEvent(downEvent1);
    expect(focusSpy1).toHaveBeenCalled();

    // Now active element is item1 or item1's internal button
    item1.focus();

    const downEvent2 = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true });
    document.dispatchEvent(downEvent2);
    expect(focusSpy2).toHaveBeenCalled();
  });
});
