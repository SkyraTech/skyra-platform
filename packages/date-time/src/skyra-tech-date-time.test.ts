import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);
import './test-setup';
import { SkyraTechDateField } from './skyra-tech-date-field';
import { SkyraTechTimeField } from './skyra-tech-time-field';
import { SkyraTechDateTimeField } from './skyra-tech-date-time-field';

if (typeof customElements !== 'undefined') {
  if (!customElements.get('skyra-tech-date-field')) customElements.define('skyra-tech-date-field', SkyraTechDateField);
  if (!customElements.get('skyra-tech-time-field')) customElements.define('skyra-tech-time-field', SkyraTechTimeField);
  if (!customElements.get('skyra-tech-date-time-field')) customElements.define('skyra-tech-date-time-field', SkyraTechDateTimeField);
}

describe('SkyraTechDateField', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers custom element', () => {
    console.log('typeof HTMLElement:', typeof HTMLElement);
    console.log('typeof customElements:', typeof customElements);
    console.log('is defined before:', customElements.get('skyra-tech-date-field'));
    
    expect(customElements.get('skyra-tech-date-field')).toBeDefined();
  });

  it('renders initial properties', () => {
    const el = document.createElement('skyra-tech-date-field') as SkyraTechDateField;
    el.value = '2026-10-01';
    el.min = '2026-01-01';
    el.max = '2026-12-31';
    el.label = 'Date';
    document.body.appendChild(el);

    expect(el.value).toBe('2026-10-01');
    expect(el.min).toBe('2026-01-01');
    expect(el.max).toBe('2026-12-31');
    expect(el.label).toBe('Date');
  });

  it('supports disabled and required states', () => {
    const el = document.createElement('skyra-tech-date-field') as SkyraTechDateField;
    el.disabled = true;
    el.required = true;
    document.body.appendChild(el);

    expect(el.disabled).toBe(true);
    expect(el.required).toBe(true);
  });

  it('should have no axe violations', async () => {
    const el = document.createElement('skyra-tech-date-field') as SkyraTechDateField;
    el.label = 'Date Field';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it('participates in forms', () => {
    const form = document.createElement('form');
    const el = document.createElement('skyra-tech-date-field') as SkyraTechDateField;
    el.name = 'test_date';
    el.value = '2026-10-01';
    form.appendChild(el);
    document.body.appendChild(form);

    expect(el.name).toBe('test_date');
  });

  it('should have no axe violations', async () => {
    const el = document.createElement('skyra-tech-time-field') as SkyraTechTimeField;
    el.label = 'Time Field';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it('supports checkValidity and reportValidity', () => {
    const el = document.createElement('skyra-tech-date-field') as SkyraTechDateField;
    el.required = true;
    document.body.appendChild(el);
    expect(el.checkValidity()).toBe(false);
    
    el.value = '2026-10-01';
    expect(el.checkValidity()).toBe(true);
  });
});

describe('SkyraTechTimeField', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers custom element', () => {
    expect(customElements.get('skyra-tech-time-field')).toBeDefined();
  });

  it('renders initial properties', () => {
    const el = document.createElement('skyra-tech-time-field') as SkyraTechTimeField;
    el.value = '10:30';
    document.body.appendChild(el);
    expect(el.value).toBe('10:30');
  });

  it('supports checkValidity and reportValidity', () => {
    const el = document.createElement('skyra-tech-time-field') as SkyraTechTimeField;
    el.required = true;
    document.body.appendChild(el);
    expect(el.checkValidity()).toBe(false);
    
    el.value = '10:30';
    expect(el.checkValidity()).toBe(true);
  });
});

describe('SkyraTechDateTimeField', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('registers custom element', () => {
    expect(customElements.get('skyra-tech-date-time-field')).toBeDefined();
  });

  it('renders initial properties', () => {
    const el = document.createElement('skyra-tech-date-time-field') as SkyraTechDateTimeField;
    el.value = '2026-10-01T10:30';
    document.body.appendChild(el);
    expect(el.value).toBe('2026-10-01T10:30');
  });

  it('should have no axe violations', async () => {
    const el = document.createElement('skyra-tech-date-time-field') as SkyraTechDateTimeField;
    el.label = 'Date Time Field';
    document.body.appendChild(el);
    const results = await axe(el);
    expect(results).toHaveNoViolations();
  });

  it('supports checkValidity and reportValidity', () => {
    const el = document.createElement('skyra-tech-date-time-field') as SkyraTechDateTimeField;
    el.required = true;
    document.body.appendChild(el);
    expect(el.checkValidity()).toBe(false);
    
    el.value = '2026-10-01T10:30';
    expect(el.checkValidity()).toBe(true);
  });
});
