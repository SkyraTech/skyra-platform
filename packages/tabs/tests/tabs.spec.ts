import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import '../src/index';

describe('Tabs Web Components', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('registers custom elements', () => {
    expect(customElements.get('skyra-tabs')).toBeDefined();
    expect(customElements.get('skyra-tab')).toBeDefined();
    expect(customElements.get('skyra-tab-panel')).toBeDefined();
  });

  it('sets initial selection based on default-value', async () => {
    container.innerHTML = `
      <skyra-tabs default-value="tab-2">
        <skyra-tab value="tab-1">Tab 1</skyra-tab>
        <skyra-tab value="tab-2">Tab 2</skyra-tab>
        <skyra-tab value="tab-3">Tab 3</skyra-tab>
        <skyra-tab-panel value="tab-1">Panel 1</skyra-tab-panel>
        <skyra-tab-panel value="tab-2">Panel 2</skyra-tab-panel>
        <skyra-tab-panel value="tab-3">Panel 3</skyra-tab-panel>
      </skyra-tabs>
    `;

    await new Promise(r => requestAnimationFrame(r));
    
    const tabs = container.querySelectorAll('skyra-tab');
    const panels = container.querySelectorAll('skyra-tab-panel');

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[1].hasAttribute('hidden')).toBe(false);
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(panels[0].hasAttribute('hidden')).toBe(true);
  });

  it('updates selection on tab click and fires event', async () => {
    container.innerHTML = `
      <skyra-tabs>
        <skyra-tab value="tab-1">Tab 1</skyra-tab>
        <skyra-tab value="tab-2">Tab 2</skyra-tab>
        <skyra-tab-panel value="tab-1">Panel 1</skyra-tab-panel>
        <skyra-tab-panel value="tab-2">Panel 2</skyra-tab-panel>
      </skyra-tabs>
    `;

    await new Promise(r => requestAnimationFrame(r));
    const skyraTabs = container.querySelector('skyra-tabs');
    const tabs = container.querySelectorAll('skyra-tab');
    const panels = container.querySelectorAll('skyra-tab-panel');

    const eventSpy = vi.fn();
    skyraTabs?.addEventListener('skyra-tabs-change', eventSpy);

    // Default should be first tab
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    // Click second tab
    (tabs[1] as HTMLElement).click();

    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(panels[1].hasAttribute('hidden')).toBe(false);
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect((eventSpy.mock.calls[0][0] as CustomEvent).detail.value).toBe('tab-2');
  });

  it('respects controlled value', async () => {
    container.innerHTML = `
      <skyra-tabs value="tab-1">
        <skyra-tab value="tab-1">Tab 1</skyra-tab>
        <skyra-tab value="tab-2">Tab 2</skyra-tab>
        <skyra-tab-panel value="tab-1">Panel 1</skyra-tab-panel>
        <skyra-tab-panel value="tab-2">Panel 2</skyra-tab-panel>
      </skyra-tabs>
    `;

    await new Promise(r => requestAnimationFrame(r));
    const tabs = container.querySelectorAll('skyra-tab');
    
    // Controlled value doesn't change automatically when clicked
    (tabs[1] as HTMLElement).click();
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('ignores clicks on disabled tabs', async () => {
    container.innerHTML = `
      <skyra-tabs>
        <skyra-tab value="tab-1">Tab 1</skyra-tab>
        <skyra-tab value="tab-2" disabled>Tab 2</skyra-tab>
        <skyra-tab-panel value="tab-1">Panel 1</skyra-tab-panel>
        <skyra-tab-panel value="tab-2">Panel 2</skyra-tab-panel>
      </skyra-tabs>
    `;

    await new Promise(r => requestAnimationFrame(r));
    const tabs = container.querySelectorAll('skyra-tab');
    
    (tabs[1] as HTMLElement).click();
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('supports horizontal keyboard navigation with automatic activation', async () => {
    container.innerHTML = `
      <skyra-tabs orientation="horizontal" activation-mode="automatic">
        <skyra-tab value="t1">1</skyra-tab>
        <skyra-tab value="t2">2</skyra-tab>
        <skyra-tab value="t3">3</skyra-tab>
        <skyra-tab-panel value="t1">P1</skyra-tab-panel>
        <skyra-tab-panel value="t2">P2</skyra-tab-panel>
        <skyra-tab-panel value="t3">P3</skyra-tab-panel>
      </skyra-tabs>
    `;
    await new Promise(r => requestAnimationFrame(r));
    
    const skyraTabs = container.querySelector('skyra-tabs') as HTMLElement;
    const tabs = container.querySelectorAll('skyra-tab');

    // Right Arrow should select t2
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');

    // End should select t3
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');

    // Left Arrow should select t2
    tabs[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    
    // Home should select t1
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('supports vertical keyboard navigation with manual activation', async () => {
    container.innerHTML = `
      <skyra-tabs orientation="vertical" activation-mode="manual">
        <skyra-tab value="t1">1</skyra-tab>
        <skyra-tab value="t2">2</skyra-tab>
        <skyra-tab-panel value="t1">P1</skyra-tab-panel>
        <skyra-tab-panel value="t2">P2</skyra-tab-panel>
      </skyra-tabs>
    `;
    await new Promise(r => requestAnimationFrame(r));
    
    const tabs = container.querySelectorAll('skyra-tab');

    // ArrowDown should just focus t2 but NOT activate it
    tabs[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');

    // Simulate pressing Enter to activate
    tabs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
  });
  
  it('correctly associates tabs and panels via ARIA attributes', async () => {
    container.innerHTML = `
      <skyra-tabs>
        <skyra-tab value="t1">1</skyra-tab>
        <skyra-tab value="t2">2</skyra-tab>
        <skyra-tab-panel value="t1">P1</skyra-tab-panel>
        <skyra-tab-panel value="t2">P2</skyra-tab-panel>
      </skyra-tabs>
    `;
    await new Promise(r => requestAnimationFrame(r));
    
    const tabs = container.querySelectorAll('skyra-tab');
    const panels = container.querySelectorAll('skyra-tab-panel');

    const tabId = tabs[0].id;
    const panelId = panels[0].id;

    expect(tabId).toBeTruthy();
    expect(panelId).toBeTruthy();
    expect(tabs[0].getAttribute('aria-controls')).toBe(panelId);
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabId);
    
    // Check semantics
    const skyraTabsList = container.querySelector('skyra-tabs')?.shadowRoot?.querySelector('.skyra-tabs-list');
    expect(skyraTabsList?.getAttribute('role')).toBe('tablist');
    expect(tabs[0].getAttribute('role')).toBe('tab');
    expect(panels[0].getAttribute('role')).toBe('tabpanel');
  });
});
