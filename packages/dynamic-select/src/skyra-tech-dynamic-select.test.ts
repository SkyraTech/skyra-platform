import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SkyraTechDynamicSelect, defineSkyraTechDynamicSelect } from './skyra-tech-dynamic-select';

describe('SkyraTechDynamicSelect', () => {
  beforeEach(() => {
    defineSkyraTechDynamicSelect();
    document.body.innerHTML = '';
  });

  it('registers the custom element', () => {
    expect(customElements.get('skyra-tech-dynamic-select')).toBe(SkyraTechDynamicSelect);
  });

  it('renders correctly', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
  });

  it('handles options and basic selection', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    document.body.appendChild(el);
    
    el.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    
    expect(el.options.length).toBe(2);
    
    el.value = { value: '1', label: 'Option 1' };
    expect(el.value.value).toBe('1');
  });
});
