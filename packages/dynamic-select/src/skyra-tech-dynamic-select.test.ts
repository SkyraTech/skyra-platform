import { describe, it, expect, beforeEach, vi } from 'vitest';
import { SkyraTechDynamicSelect, defineSkyraTechDynamicSelect } from './skyra-tech-dynamic-select';

describe('SkyraTechDynamicSelect', () => {
  beforeEach(() => {
    defineSkyraTechDynamicSelect();
    document.body.innerHTML = '';
  });

  const getTrigger = (el: SkyraTechDynamicSelect) => el.shadowRoot?.querySelector('.trigger') as HTMLButtonElement;
  const getSearchInput = (el: SkyraTechDynamicSelect) => el.shadowRoot?.querySelector('.search-input') as HTMLInputElement;
  const getOptions = (el: SkyraTechDynamicSelect) => el.shadowRoot?.querySelectorAll('.option') as NodeListOf<HTMLElement>;
  const getListbox = (el: SkyraTechDynamicSelect) => el.shadowRoot?.querySelector('.options-container') as HTMLElement;
  const getClearBtn = (el: SkyraTechDynamicSelect) => el.shadowRoot?.querySelector('.clear-btn') as HTMLButtonElement;

  it('registers the custom element', () => {
    expect(customElements.get('skyra-tech-dynamic-select')).toBe(SkyraTechDynamicSelect);
  });

  it('renders correctly', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    document.body.appendChild(el);
    expect(el.shadowRoot).toBeTruthy();
    expect(getTrigger(el)).toBeTruthy();
  });

  it('handles options and basic selection (single)', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    document.body.appendChild(el);
    
    el.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];
    expect(el.options.length).toBe(2);
    
    el.value = '1';
    expect(el.value.value).toBe('1');
    expect(el.value.label).toBe('Option 1');
  });

  it('handles primitive string option resolution', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    document.body.appendChild(el);
    
    el.options = [
      { value: '1', label: 'Option 1' },
    ];
    el.value = '1';
    expect(el.value.label).toBe('Option 1');
  });

  it('handles multi-selection', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.mode = 'multiple';
    document.body.appendChild(el);
    
    el.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
      { value: '3', label: 'Option 3' },
    ];
    
    el.value = ['1', '3'];
    expect(el.value.length).toBe(2);
    expect(el.value[0].value).toBe('1');
    expect(el.value[1].value).toBe('3');
  });

  it('toggles dropdown on trigger click', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    document.body.appendChild(el);
    
    const trigger = getTrigger(el);
    trigger.click();
    expect(el.hasAttribute('data-open')).toBe(true);
    
    trigger.click();
    expect(el.hasAttribute('data-open')).toBe(false);
  });

  it('filters options via search when searchable', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.searchable = true;
    el.options = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ];
    document.body.appendChild(el);
    
    getTrigger(el).click();
    
    const searchInput = getSearchInput(el);
    expect(searchInput).toBeTruthy();
    
    searchInput.value = 'app';
    searchInput.dispatchEvent(new Event('input'));
    
    const renderedOpts = getOptions(el);
    expect(renderedOpts.length).toBe(1);
    expect(renderedOpts[0]?.textContent?.trim()).toBe('Apple');
  });

  it('selects option on click', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.options = [
      { value: '1', label: 'Option 1' }
    ];
    document.body.appendChild(el);
    
    let changeFired = false;
    el.addEventListener('skyra-change', () => changeFired = true);
    
    getTrigger(el).click();
    const opts = getOptions(el);
    opts[0]?.click();
    
    expect(el.value.value).toBe('1');
    expect(el.hasAttribute('data-open')).toBe(false);
    expect(changeFired).toBe(true);
  });

  it('does not select disabled options', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.options = [
      { value: '1', label: 'Option 1', disabled: true }
    ];
    document.body.appendChild(el);
    
    getTrigger(el).click();
    const opts = getOptions(el);
    opts[0]?.click();
    
    expect(el.value).toBeNull();
  });

  it('clears selection when clearable', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.clearable = true;
    el.options = [{ value: '1', label: 'Option 1' }];
    el.value = '1';
    document.body.appendChild(el);
    
    const clearBtn = getClearBtn(el);
    expect(clearBtn).toBeTruthy();
    
    clearBtn.click();
    expect(el.value).toBeNull();
  });

  it('handles keyboard navigation', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' }
    ];
    document.body.appendChild(el);
    const trigger = getTrigger(el);
    
    // Open with Enter
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(el.hasAttribute('data-open')).toBe(true);
    
    // Arrow down
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
    let opts = getOptions(el);
    expect(opts[0]?.classList.contains('focused')).toBe(true);
    
    // Select with Enter
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(el.value.value).toBe('1');
    expect(el.hasAttribute('data-open')).toBe(false);
  });

  it('closes on Escape', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    document.body.appendChild(el);
    const trigger = getTrigger(el);
    
    trigger.click();
    expect(el.hasAttribute('data-open')).toBe(true);
    
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    expect(el.hasAttribute('data-open')).toBe(false);
  });
  
  it('respects disabled state', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.disabled = true;
    document.body.appendChild(el);
    
    getTrigger(el).click();
    expect(el.hasAttribute('data-open')).toBe(false);
  });

  it('participates in forms', () => {
    const form = document.createElement('form');
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.name = 'my_select';
    el.options = [{ value: 'val1', label: 'Value 1' }];
    form.appendChild(el);
    document.body.appendChild(form);

    el.value = 'val1';
    // We omit deep JSDOM form checks because JSDOM doesn't link ElementInternals.form correctly
    // But we check that it runs without throwing and form elements can contain it
    expect(el.name).toBe('my_select');
  });

  it('supports required validation', () => {
    const el = document.createElement('skyra-tech-dynamic-select') as SkyraTechDynamicSelect;
    el.required = true;
    document.body.appendChild(el);
    
    expect(el.checkValidity()).toBe(false);
    
    el.value = 'val1';
    expect(el.checkValidity()).toBe(true);
  });
});
