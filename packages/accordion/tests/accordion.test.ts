import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import '../src/skyra-accordion.js';
import '../src/skyra-accordion-item.js';
import type { SkyraAccordionElement } from '../src/skyra-accordion.js';
import type { SkyraAccordionItemElement } from '../src/skyra-accordion-item.js';

describe('SkyraAccordion', () => {
  let accordion: SkyraAccordionElement;

  beforeEach(() => {
    accordion = document.createElement('skyra-accordion') as SkyraAccordionElement;
    document.body.appendChild(accordion);
  });

  afterEach(() => {
    accordion.remove();
  });

  it('registers the custom elements', () => {
    expect(customElements.get('skyra-accordion')).toBeDefined();
    expect(customElements.get('skyra-accordion-item')).toBeDefined();
  });

  it('initializes with default values', () => {
    expect(accordion.type).toBe('single');
    expect(accordion.collapsible).toBe(false);
  });

  it('handles item expansion in single mode', async () => {
    accordion.type = 'single';
    accordion.innerHTML = `
      <skyra-accordion-item value="1"><div slot="trigger">Item 1</div></skyra-accordion-item>
      <skyra-accordion-item value="2"><div slot="trigger">Item 2</div></skyra-accordion-item>
    `;

    // Wait for slotchange and DOM updates
    await new Promise(r => setTimeout(r, 50));
    const items = Array.from(accordion.querySelectorAll('skyra-accordion-item')) as SkyraAccordionItemElement[];
    expect(items.length).toBe(2);
    
    // Simulate internal toggle
    items[0].dispatchEvent(new CustomEvent('skyra-accordion-internal-toggle', { detail: { value: '1' }, bubbles: true, composed: true }));
    
    expect(items[0].getAttribute('data-state')).toBe('open');
    expect(items[1].getAttribute('data-state')).toBe('closed');
  });

  it('handles collapsible single mode', async () => {
    accordion.type = 'single';
    accordion.collapsible = true;
    accordion.innerHTML = `
      <skyra-accordion-item value="1"><div slot="trigger">Item 1</div></skyra-accordion-item>
    `;

    await new Promise(r => setTimeout(r, 50));
    const item = accordion.querySelector('skyra-accordion-item') as SkyraAccordionItemElement;
    
    // Open
    item.dispatchEvent(new CustomEvent('skyra-accordion-internal-toggle', { detail: { value: '1' }, bubbles: true, composed: true }));
    expect(item.getAttribute('data-state')).toBe('open');
    
    // Close because collapsible
    item.dispatchEvent(new CustomEvent('skyra-accordion-internal-toggle', { detail: { value: '1' }, bubbles: true, composed: true }));
    expect(item.getAttribute('data-state')).toBe('closed');
  });

  it('handles multiple mode', async () => {
    accordion.type = 'multiple';
    accordion.innerHTML = `
      <skyra-accordion-item value="1"><div slot="trigger">Item 1</div></skyra-accordion-item>
      <skyra-accordion-item value="2"><div slot="trigger">Item 2</div></skyra-accordion-item>
    `;

    await new Promise(r => setTimeout(r, 50));
    const items = Array.from(accordion.querySelectorAll('skyra-accordion-item')) as SkyraAccordionItemElement[];
    
    items[0].dispatchEvent(new CustomEvent('skyra-accordion-internal-toggle', { detail: { value: '1' }, bubbles: true, composed: true }));
    items[1].dispatchEvent(new CustomEvent('skyra-accordion-internal-toggle', { detail: { value: '2' }, bubbles: true, composed: true }));
    
    expect(items[0].getAttribute('data-state')).toBe('open');
    expect(items[1].getAttribute('data-state')).toBe('open');
  });
});
