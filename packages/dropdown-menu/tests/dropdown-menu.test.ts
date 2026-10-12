import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/index.js';
import type { SkyraDropdownMenuElement } from '../src/index.js';
import type { SkyraDropdownItemElement } from '../src/index.js';

describe('SkyraDropdownMenuElement', () => {
  let menu: SkyraDropdownMenuElement;

  beforeEach(() => {
    menu = document.createElement('skyra-dropdown-menu') as SkyraDropdownMenuElement;
    document.body.appendChild(menu);
  });

  afterEach(() => {
    menu.remove();
  });

  it('registers all custom elements in customElements registry', () => {
    expect(customElements.get('skyra-dropdown-menu')).toBeDefined();
    expect(customElements.get('skyra-tech-dropdown-menu')).toBeDefined();
    expect(customElements.get('skyra-dropdown-item')).toBeDefined();
    expect(customElements.get('skyra-tech-dropdown-item')).toBeDefined();
    expect(customElements.get('skyra-dropdown-separator')).toBeDefined();
    expect(customElements.get('skyra-tech-dropdown-separator')).toBeDefined();
    expect(customElements.get('skyra-dropdown-group')).toBeDefined();
    expect(customElements.get('skyra-tech-dropdown-group')).toBeDefined();
  });

  it('initializes with default closed state and proper ARIA semantics', () => {
    expect(menu.open).toBe(false);
    expect(menu.disabled).toBe(false);
    expect(menu.placement).toBe('bottom');
    expect(menu.align).toBe('start');
    expect(menu.closeOnSelect).toBe(true);

    const trigger = menu.shadowRoot?.querySelector('.skyra-dropdown-trigger');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
    expect(trigger?.getAttribute('aria-haspopup')).toBe('menu');

    const panel = menu.shadowRoot?.querySelector('.skyra-dropdown-panel');
    expect(panel?.getAttribute('role')).toBe('menu');
  });

  it('synchronizes properties with attributes', () => {
    menu.placement = 'top';
    expect(menu.getAttribute('placement')).toBe('top');

    menu.align = 'end';
    expect(menu.getAttribute('align')).toBe('end');

    menu.open = true;
    expect(menu.hasAttribute('open')).toBe(true);
    const trigger = menu.shadowRoot?.querySelector('.skyra-dropdown-trigger');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');

    menu.open = false;
    expect(menu.hasAttribute('open')).toBe(false);
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles open state on trigger click', () => {
    const trigger = menu.shadowRoot?.querySelector('.skyra-dropdown-trigger') as HTMLElement;
    trigger.click();
    expect(menu.open).toBe(true);

    trigger.click();
    expect(menu.open).toBe(false);
  });

  it('does not open when disabled', () => {
    menu.disabled = true;
    const trigger = menu.shadowRoot?.querySelector('.skyra-dropdown-trigger') as HTMLElement;
    trigger.click();
    expect(menu.open).toBe(false);

    menu.show();
    expect(menu.open).toBe(false);
  });

  it('opens on ArrowDown key on trigger', () => {
    const trigger = menu.shadowRoot?.querySelector('.skyra-dropdown-trigger') as HTMLElement;
    const arrowDown = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    trigger.dispatchEvent(arrowDown);
    expect(menu.open).toBe(true);
  });

  it('handles item selection and dispatches skyra-dropdown-select event', () => {
    const item1 = document.createElement('skyra-dropdown-item') as SkyraDropdownItemElement;
    item1.value = 'action-1';
    item1.textContent = 'Action 1';
    menu.appendChild(item1);

    menu.show();
    expect(menu.open).toBe(true);

    let selectedDetail: any = null;
    menu.addEventListener('skyra-dropdown-select', (e: Event) => {
      selectedDetail = (e as CustomEvent).detail;
    });

    item1.triggerSelect();

    expect(selectedDetail).toBeDefined();
    expect(selectedDetail.value).toBe('action-1');
    expect(menu.open).toBe(false); // closed because closeOnSelect is true
  });

  it('toggles checkbox items correctly', () => {
    const chk = document.createElement('skyra-dropdown-item') as SkyraDropdownItemElement;
    chk.type = 'checkbox';
    chk.value = 'notifications';
    chk.checked = false;
    menu.appendChild(chk);

    expect(chk.checked).toBe(false);
    chk.triggerSelect();
    expect(chk.checked).toBe(true);
    expect(chk.getAttribute('aria-checked')).toBe('true');

    chk.triggerSelect();
    expect(chk.checked).toBe(false);
    expect(chk.getAttribute('aria-checked')).toBe('false');
  });

  it('sets radio item checked state correctly', () => {
    const rad = document.createElement('skyra-dropdown-item') as SkyraDropdownItemElement;
    rad.type = 'radio';
    rad.value = 'density-compact';
    rad.checked = false;
    menu.appendChild(rad);

    rad.triggerSelect();
    expect(rad.checked).toBe(true);
    expect(rad.getAttribute('aria-checked')).toBe('true');
  });

  it('dismisses on Escape key and restores focus', () => {
    const button = document.createElement('button');
    button.slot = 'trigger';
    button.textContent = 'Trigger Button';
    menu.appendChild(button);

    const focusSpy = vi.spyOn(button, 'focus');

    menu.show();
    expect(menu.open).toBe(true);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(escEvent);

    expect(menu.open).toBe(false);
    expect(focusSpy).toHaveBeenCalled();
  });

  it('dismisses on outside mouse click', () => {
    menu.show();
    expect(menu.open).toBe(true);

    const outsideEl = document.createElement('div');
    document.body.appendChild(outsideEl);

    const mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    outsideEl.dispatchEvent(mouseEvent);

    expect(menu.open).toBe(false);
    outsideEl.remove();
  });

  it('renders declarative items configuration correctly', () => {
    menu.items = [
      { label: 'Item 1', value: 'val-1' },
      { type: 'separator' },
      { label: 'Item 2', value: 'val-2', destructive: true },
    ];

    const renderedItems = menu.querySelectorAll('skyra-dropdown-item');
    expect(renderedItems.length).toBe(2);
    expect(renderedItems[0].value).toBe('val-1');
    expect(renderedItems[1].value).toBe('val-2');
    expect(renderedItems[1].hasAttribute('destructive')).toBe(true);

    const renderedSep = menu.querySelectorAll('skyra-dropdown-separator');
    expect(renderedSep.length).toBe(1);
  });

  it('cleans up listeners on disconnectedCallback without memory leaks', () => {
    menu.show();
    expect(menu.open).toBe(true);

    menu.remove();

    const mouseEvent = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    document.dispatchEvent(mouseEvent);

    const escEvent = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
    document.dispatchEvent(escEvent);
  });
});
