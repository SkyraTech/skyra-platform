import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../src/skyra-collapsible.js';
import type { SkyraCollapsibleElement } from '../src/skyra-collapsible.js';

describe('SkyraCollapsible', () => {
  let collapsible: SkyraCollapsibleElement;

  beforeEach(() => {
    collapsible = document.createElement('skyra-collapsible') as SkyraCollapsibleElement;
    document.body.appendChild(collapsible);
  });

  afterEach(() => {
    collapsible.remove();
  });

  it('registers the custom element', () => {
    expect(customElements.get('skyra-collapsible')).toBeDefined();
  });

  it('initializes with default closed state', () => {
    expect(collapsible.open).toBe(false);
    expect(collapsible.disabled).toBe(false);
    const trigger = collapsible.shadowRoot?.querySelector('button');
    expect(trigger?.getAttribute('aria-expanded')).toBe('false');
  });

  it('toggles open state when method is called', () => {
    collapsible.toggle();
    expect(collapsible.open).toBe(true);
    const trigger = collapsible.shadowRoot?.querySelector('button');
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });

  it('toggles open state on click', () => {
    const trigger = collapsible.shadowRoot?.querySelector('button');
    trigger?.click();
    expect(collapsible.open).toBe(true);
    expect(trigger?.getAttribute('aria-expanded')).toBe('true');
  });

  it('handles keyboard Enter and Space', () => {
    const trigger = collapsible.shadowRoot?.querySelector('button');
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    trigger?.dispatchEvent(enterEvent);
    expect(collapsible.open).toBe(true);

    const spaceEvent = new KeyboardEvent('keydown', { key: ' ' });
    trigger?.dispatchEvent(spaceEvent);
    expect(collapsible.open).toBe(false);
  });

  it('ignores interactions when disabled', () => {
    collapsible.disabled = true;
    
    // Programmatic
    collapsible.toggle();
    expect(collapsible.open).toBe(false);

    // Click
    const trigger = collapsible.shadowRoot?.querySelector('button');
    trigger?.click();
    expect(collapsible.open).toBe(false);

    // Keydown
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    trigger?.dispatchEvent(enterEvent);
    expect(collapsible.open).toBe(false);
  });

  it('fires skyra-collapsible-change event when toggled', () => {
    let eventFired = false;
    let newOpenState = false;
    collapsible.addEventListener('skyra-collapsible-change', (e: Event) => {
      eventFired = true;
      newOpenState = (e as CustomEvent).detail.open;
    });

    collapsible.toggle();
    expect(eventFired).toBe(true);
    expect(newOpenState).toBe(true);
  });
});
