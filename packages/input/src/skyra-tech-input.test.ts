import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { defineSkyraTechInput } from './skyra-tech-input';

describe('SkyraTechInput Web Component', () => {
  let container: HTMLElement;

  beforeEach(() => {
    defineSkyraTechInput();
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  const setup = (html: string) => {
    container.innerHTML = html;
    return container.firstElementChild as any;
  };

  it('renders correctly', () => {
    const el = setup('<skyra-tech-input></skyra-tech-input>');
    expect(el).toBeDefined();
    expect(el.shadowRoot).toBeDefined();
    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeDefined();
  });

  it('syncs value property to input', () => {
    const el = setup('<skyra-tech-input value="test value"></skyra-tech-input>');
    const input = el.shadowRoot!.querySelector('input');
    expect(input!.value).toBe('test value');
    expect(el.value).toBe('test value');

    el.value = 'new value';
    expect(input!.value).toBe('new value');
    expect(el.getAttribute('value')).toBe('new value');
  });

  it('syncs standard properties to input attributes', () => {
    const el = setup('<skyra-tech-input type="email" placeholder="test" disabled required></skyra-tech-input>');
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(input.getAttribute('type')).toBe('email');
    expect(input.getAttribute('placeholder')).toBe('test');
    expect(input.hasAttribute('disabled')).toBe(true);
    expect(input.hasAttribute('required')).toBe(true);
    
    el.type = 'text';
    expect(input.getAttribute('type')).toBe('text');
  });

  it('toggles clear button based on input value', () => {
    const el = setup('<skyra-tech-input clearable></skyra-tech-input>');
    const clearBtn = el.shadowRoot!.getElementById('clear-btn')!;
    
    // Empty initially
    expect(clearBtn.style.display).toBe('none');
    
    // Add value
    el.value = 'test';
    expect(clearBtn.style.display).toBe('flex');
    
    // Disabled state overrides it
    el.disabled = true;
    expect(clearBtn.style.display).toBe('none');
  });

  it('clears value on clear button click', () => {
    const el = setup('<skyra-tech-input clearable value="hello"></skyra-tech-input>');
    const clearBtn = el.shadowRoot!.getElementById('clear-btn')!;
    
    expect(el.value).toBe('hello');
    clearBtn.click();
    expect(el.value).toBe('');
  });

  it('displays error text and toggles invalid state', () => {
    const el = setup('<skyra-tech-input error="This is an error"></skyra-tech-input>');
    const errorContainer = el.shadowRoot!.querySelector('[part="error-msg"]') as HTMLElement;
    const errorText = el.shadowRoot!.querySelector('#error-text') as HTMLElement;
    const input = el.shadowRoot!.querySelector('input')!;
    
    expect(errorContainer.style.display).toBe('inline-flex');
    expect(errorText.textContent).toBe('This is an error');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    
    // Clear error
    el.error = null;
    expect(errorContainer.style.display).toBe('none');
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('shows loading spinner when loading property is set', () => {
    const el = setup('<skyra-tech-input loading></skyra-tech-input>');
    const spinner = el.shadowRoot!.getElementById('spinner')!;
    
    expect(spinner.style.display).toBe('flex');
    
    el.loading = false;
    expect(spinner.style.display).toBe('none');
  });

  it('supports character count', () => {
    const el = setup('<skyra-tech-input show-count maxlength="10" value="1234"></skyra-tech-input>');
    const count = el.shadowRoot!.getElementById('char-count')!;
    
    expect(count.style.display).toBe('block');
    expect(count.textContent).toBe('4 / 10');
    
    el.value = '12345678901';
    expect(count.textContent).toBe('11 / 10');
    expect(count.classList.contains('char-count--overflow')).toBe(true);
  });
});
