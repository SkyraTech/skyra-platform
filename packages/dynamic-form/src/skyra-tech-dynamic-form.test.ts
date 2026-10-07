import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SkyraTechDynamicForm } from './skyra-tech-dynamic-form';

describe('SkyraTechDynamicForm', () => {
  let form: SkyraTechDynamicForm;

  beforeEach(() => {
    form = document.createElement('skyra-tech-dynamic-form') as SkyraTechDynamicForm;
    document.body.appendChild(form);
  });

  afterEach(() => {
    document.body.removeChild(form);
  });

  it('registers the custom element', () => {
    expect(customElements.get('skyra-tech-dynamic-form')).toBeDefined();
    expect(form).toBeInstanceOf(SkyraTechDynamicForm);
  });

  it('renders a form with schema', () => {
    form.fields = [
      { name: 'testField', type: 'text', label: 'Test Label' }
    ];
    
    // Check shadow root for form and fieldset
    const shadowForm = form.shadowRoot?.querySelector('form');
    expect(shadowForm).toBeDefined();
    
    const fieldset = shadowForm?.querySelector('fieldset');
    expect(fieldset).toBeDefined();
    
    // Check if inner component is requested (mocked in test-setup)
    const input = fieldset?.querySelector('skyra-tech-input');
    expect(input).toBeDefined();
    expect(input?.getAttribute('label')).toBe('Test Label');
  });

  it('supports initial values', () => {
    form.initialValues = { testField: 'Hello' };
    form.fields = [
      { name: 'testField', type: 'text', label: 'Test Label' }
    ];
    
    const input = form.shadowRoot?.querySelector('skyra-tech-input');
    expect(input?.getAttribute('value')).toBe('Hello');
  });

  it('handles validation and errors', async () => {
    form.fields = [
      { name: 'testField', type: 'text', label: 'Test Label', required: true }
    ];
    
    const isValid = await form.validate();
    expect(isValid).toBe(false);
    
    expect(form.errors).toHaveProperty('testField');
  });

  it('tracks dirty state', () => {
    form.fields = [
      { name: 'testField', type: 'text', label: 'Test Label' }
    ];
    
    const input = form.shadowRoot?.querySelector('skyra-tech-input');
    input?.dispatchEvent(new CustomEvent('skyra-change', { detail: { value: 'New Value' } }));
    
    expect(form.isDirty).toBe(true);
    expect(form.values.testField).toBe('New Value');
  });

  it('handles conditional visibility', () => {
    form.fields = [
      { name: 'toggle', type: 'switch', label: 'Toggle' },
      { 
        name: 'conditionalField', 
        type: 'text', 
        label: 'Hidden Field',
        visibleWhen: { field: 'toggle', operator: 'equals', value: true }
      }
    ];
    
    // Should not render conditionalField initially
    let hiddenInput = form.shadowRoot?.querySelector('skyra-tech-input[id="field-conditionalField"]');
    expect(hiddenInput).toBeNull();
    
    // Update toggle to true
    form.setValue('toggle', true);
    
    // Should render now
    hiddenInput = form.shadowRoot?.querySelector('skyra-tech-input[id="field-conditionalField"]');
    expect(hiddenInput).toBeDefined();
  });

  it('fires submit event', async () => {
    form.fields = [
      { name: 'testField', type: 'text', label: 'Test Label' }
    ];
    form.setValue('testField', 'Val');
    
    const submitSpy = vi.fn();
    form.addEventListener('skyra-submit', submitSpy);
    
    const event = new Event('submit', { cancelable: true });
    await (form as unknown as { _handleSubmit: (e: Event) => Promise<void> })._handleSubmit(event);
    
    expect(submitSpy).toHaveBeenCalled();
    const eventArg = submitSpy.mock.calls[0]![0] as CustomEvent;
    expect(eventArg.detail.values.testField).toBe('Val');
  });

  it('can reset form', () => {
    form.initialValues = { testField: 'Initial' };
    form.fields = [
      { name: 'testField', type: 'text', label: 'Test Label' }
    ];
    
    form.setValue('testField', 'Changed');
    expect(form.values.testField).toBe('Changed');
    
    form.reset();
    expect(form.values.testField).toBe('Initial');
    expect(form.isDirty).toBe(false);
  });
  
  it('supports multiple instances without ID clashes', () => {
     const form2 = document.createElement('skyra-tech-dynamic-form') as SkyraTechDynamicForm;
     document.body.appendChild(form2);
     
     form.fields = [{ name: 'field1', type: 'text', label: 'F1' }];
     form2.fields = [{ name: 'field1', type: 'text', label: 'F1' }];
     
     const input1 = form.shadowRoot?.querySelector('skyra-tech-input');
     const input2 = form2.shadowRoot?.querySelector('skyra-tech-input');
     
     // IDs can be same because they are in isolated Shadow DOMs
     expect(input1?.id).toBe(input2?.id);
     
     // However, they should be different DOM nodes
     expect(input1).not.toBe(input2);
     
     document.body.removeChild(form2);
  });
});
