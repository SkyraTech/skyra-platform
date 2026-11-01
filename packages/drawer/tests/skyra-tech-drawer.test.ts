import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SkyraTechDrawer, defineSkyraTechDrawer } from '../src/skyra-tech-drawer';

defineSkyraTechDrawer();

function createDrawer(attrs: Record<string, string> = {}): SkyraTechDrawer {
  const el = document.createElement('skyra-tech-drawer') as SkyraTechDrawer;
  for (const [k, v] of Object.entries(attrs)) {
    el.setAttribute(k, v);
  }
  document.body.appendChild(el);
  return el;
}

function cleanup(el: Element) {
  if (el.parentNode) el.parentNode.removeChild(el);
}

describe('SkyraTechDrawer Web Component', () => {
  let drawer: SkyraTechDrawer;

  beforeEach(() => {
    drawer = createDrawer({ title: 'Test Drawer' });
  });

  afterEach(() => {
    cleanup(drawer);
  });

  it('registers custom element', () => {
    expect(customElements.get('skyra-tech-drawer')).toBe(SkyraTechDrawer);
  });

  it('defaults to closed', () => {
    expect(drawer.open).toBe(false);
    expect(drawer.hasAttribute('open')).toBe(false);
  });

  it('opens and closes via property and methods', () => {
    let openEventFired = false;
    let closeEventFired = false;
    drawer.addEventListener('open', () => { openEventFired = true; });
    drawer.addEventListener('close', () => { closeEventFired = true; });

    drawer.show();
    expect(drawer.open).toBe(true);
    expect(openEventFired).toBe(true);

    drawer.close();
    expect(drawer.open).toBe(false);
    expect(closeEventFired).toBe(true);
  });

  it('supports position and size attributes', () => {
    drawer.position = 'left';
    drawer.size = 'lg';
    expect(drawer.getAttribute('position')).toBe('left');
    expect(drawer.getAttribute('size')).toBe('lg');
  });

  it('renders title in header', () => {
    const titleEl = drawer.shadowRoot!.querySelector('#drawer-title');
    expect(titleEl?.textContent).toBe('Test Drawer');

    drawer.title = 'Updated Title';
    expect(titleEl?.textContent).toBe('Updated Title');
  });

  it('closes on close button click', () => {
    drawer.open = true;
    const closeBtn = drawer.shadowRoot!.querySelector('.skyra-drawer-close') as HTMLButtonElement;
    closeBtn.click();
    expect(drawer.open).toBe(false);
  });

  it('closes on escape key', () => {
    drawer.open = true;
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(drawer.open).toBe(false);
  });
});

