import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SkyraTechRadio, defineSkyraTechRadio } from './skyra-tech-radio';

describe('SkyraTechRadio', () => {
  beforeEach(() => {
    defineSkyraTechRadio();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders correctly with default attributes', () => {
    const el = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    document.body.appendChild(el);
    expect(el.checked).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.required).toBe(false);
    
    // Check internal structure
    const input = el.shadowRoot!.querySelector('input');
    expect(input).not.toBeNull();
    expect(input!.type).toBe('radio');
  });

  it('reflects checked attribute to property and updates internal input', () => {
    const el = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    document.body.appendChild(el);
    
    el.setAttribute('checked', '');
    expect(el.checked).toBe(true);
    
    const input = el.shadowRoot!.querySelector('input');
    expect(input!.checked).toBe(true);
    
    el.removeAttribute('checked');
    expect(el.checked).toBe(false);
    expect(input!.checked).toBe(false);
  });

  it('handles programmatic property changes correctly', () => {
    const el = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    document.body.appendChild(el);
    
    el.checked = true;
    expect(el.hasAttribute('checked')).toBe(true);
    
    el.disabled = true;
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('handles label rendering through properties and slots', async () => {
    const el = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    document.body.appendChild(el);
    
    el.label = 'Test Label';
    // Needs a microtask for attributeChangedCallback to finish UI update sometimes if connected? No, attribute callback is sync.
    const slot = el.shadowRoot!.querySelector('slot[name="label"]') as HTMLSlotElement;
    expect(slot.textContent).toBe('Test Label');
  });

  it('handles error messages correctly', () => {
    const el = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    document.body.appendChild(el);
    
    el.error = 'Something went wrong';
    
    const errorContainer = el.shadowRoot!.querySelector('.error-text') as HTMLElement;
    expect(errorContainer.textContent).toBe('Something went wrong');
    expect(errorContainer.style.display).toBe('block');
    expect(el.hasAttribute('invalid')).toBe(true);
  });
});

describe('SkyraTechRadio Group Behavior', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('unchecks other radios with the same name when checked', () => {
    const radio1 = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    radio1.name = 'group1';
    
    const radio2 = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    radio2.name = 'group1';
    
    const radio3 = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    radio3.name = 'group2'; // Different group

    document.body.appendChild(radio1);
    document.body.appendChild(radio2);
    document.body.appendChild(radio3);
    
    radio1.checked = true;
    expect(radio1.checked).toBe(true);
    expect(radio2.checked).toBe(false);
    expect(radio3.checked).toBe(false);

    radio2.checked = true;
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
    expect(radio3.checked).toBe(false);
    
    // Group 2 shouldn't affect group 1
    radio3.checked = true;
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(true);
    expect(radio3.checked).toBe(true);
  });

  it('dispatches exactly one change event when user clicks the internal input', () => {
    const el = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    document.body.appendChild(el);
    
    const spy = vi.fn();
    el.addEventListener('change', spy);
    
    const input = el.shadowRoot!.querySelector('input')!;
    // Simulate user interaction
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    
    expect(spy).toHaveBeenCalledTimes(1);
    expect(el.checked).toBe(true);
  });

  it('navigates via arrow keys correctly', () => {
    const r1 = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    r1.name = 'test';
    const r2 = document.createElement('skyra-tech-radio') as SkyraTechRadio;
    r2.name = 'test';
    
    document.body.appendChild(r1);
    document.body.appendChild(r2);
    
    r1.checked = true;
    
    const input1 = r1.shadowRoot!.querySelector('input')!;
    
    const spy = vi.fn();
    r2.addEventListener('change', spy);
    
    input1.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    
    expect(r1.checked).toBe(false);
    expect(r2.checked).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
