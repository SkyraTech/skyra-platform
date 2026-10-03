import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SkyraTechSwitch, defineSkyraTechSwitch } from './skyra-tech-switch';

describe('SkyraTechSwitch', () => {
  beforeEach(() => {
    defineSkyraTechSwitch();
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('renders correctly with default attributes', () => {
    const el = document.createElement('skyra-tech-switch') as SkyraTechSwitch;
    document.body.appendChild(el);
    expect(el.checked).toBe(false);
    expect(el.disabled).toBe(false);
    expect(el.required).toBe(false);
    
    // Check internal structure
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn).not.toBeNull();
    expect(btn!.getAttribute('role')).toBe('switch');
    expect(btn!.getAttribute('aria-checked')).toBe('false');
  });

  it('reflects checked attribute to property and updates internal UI', () => {
    const el = document.createElement('skyra-tech-switch') as SkyraTechSwitch;
    document.body.appendChild(el);
    
    el.setAttribute('checked', '');
    expect(el.checked).toBe(true);
    
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn!.getAttribute('aria-checked')).toBe('true');
    
    el.removeAttribute('checked');
    expect(el.checked).toBe(false);
    expect(btn!.getAttribute('aria-checked')).toBe('false');
  });

  it('handles programmatic property changes correctly', () => {
    const el = document.createElement('skyra-tech-switch') as SkyraTechSwitch;
    document.body.appendChild(el);
    
    el.checked = true;
    expect(el.hasAttribute('checked')).toBe(true);
    
    el.disabled = true;
    expect(el.hasAttribute('disabled')).toBe(true);
    const btn = el.shadowRoot!.querySelector('button');
    expect(btn!.disabled).toBe(true);
  });

  it('handles label rendering through properties and slots', () => {
    const el = document.createElement('skyra-tech-switch') as SkyraTechSwitch;
    document.body.appendChild(el);
    
    el.label = 'Test Label';
    const slot = el.shadowRoot!.querySelector('slot[name="label"]') as HTMLSlotElement;
    expect(slot.textContent).toBe('Test Label');
  });

  it('handles error messages correctly', () => {
    const el = document.createElement('skyra-tech-switch') as SkyraTechSwitch;
    document.body.appendChild(el);
    
    el.error = 'Something went wrong';
    
    const errorContainer = el.shadowRoot!.querySelector('.error-text') as HTMLElement;
    const btn = el.shadowRoot!.querySelector('button');
    
    expect(errorContainer.textContent).toBe('Something went wrong');
    expect(errorContainer.style.display).toBe('block');
    expect(el.hasAttribute('invalid')).toBe(true);
    expect(btn!.getAttribute('aria-invalid')).toBe('true');
  });

  it('dispatches exactly one change event when user clicks the internal button', () => {
    const el = document.createElement('skyra-tech-switch') as SkyraTechSwitch;
    document.body.appendChild(el);
    
    const spy = vi.fn();
    el.addEventListener('change', spy);
    
    const btn = el.shadowRoot!.querySelector('button')!;
    btn.click();
    
    expect(spy).toHaveBeenCalledTimes(1);
    expect(el.checked).toBe(true);
  });

  it('does not toggle when disabled, readonly, or loading', () => {
    const el = document.createElement('skyra-tech-switch') as SkyraTechSwitch;
    document.body.appendChild(el);
    
    const spy = vi.fn();
    el.addEventListener('change', spy);
    
    const btn = el.shadowRoot!.querySelector('button')!;
    
    el.disabled = true;
    btn.click();
    expect(spy).toHaveBeenCalledTimes(0);
    expect(el.checked).toBe(false);
    
    el.disabled = false;
    el.readOnly = true;
    btn.click();
    expect(spy).toHaveBeenCalledTimes(0);
    expect(el.checked).toBe(false);
    
    el.readOnly = false;
    el.loading = true;
    btn.click();
    expect(spy).toHaveBeenCalledTimes(0);
    expect(el.checked).toBe(false);
  });
});
