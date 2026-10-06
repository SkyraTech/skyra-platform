import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DynamicForm } from './DynamicForm';
import { FieldDef } from '@skyra-tech-platform/dynamic-form';
import '@testing-library/jest-dom';

describe('DynamicForm React Adapter', () => {
  const mockFields: FieldDef[] = [
    { name: 'firstName', type: 'text', label: 'First Name', required: true },
    { name: 'lastName', type: 'text', label: 'Last Name' }
  ];

  it('renders correctly', () => {
    const { container } = render(<DynamicForm fields={mockFields} />);
    const wc = container.querySelector('skyra-tech-dynamic-form');
    expect(wc).toBeInTheDocument();
  });

  it('passes props to web component', () => {
    const { container } = render(
      <DynamicForm 
        fields={mockFields} 
        initialValues={{ firstName: 'John' }}
        features={{ showValidationIcons: true } as any}
      />
    );
    const wc = container.querySelector('skyra-tech-dynamic-form') as any;
    expect(wc.fields).toEqual(mockFields);
    expect(wc.initialValues).toEqual({ firstName: 'John' });
    expect(wc.features).toEqual({ showValidationIcons: true });
  });

  it('handles change event', () => {
    const handleChange = vi.fn();
    const handleValuesChange = vi.fn();
    
    const { container } = render(
      <DynamicForm fields={mockFields} onChange={handleChange} onValuesChange={handleValuesChange} />
    );
    const wc = container.querySelector('skyra-tech-dynamic-form') as any;
    
    const changeEvent = new CustomEvent('skyra-change', { 
      detail: { values: { firstName: 'Jane' }, name: 'firstName', value: 'Jane' } 
    });
    wc.dispatchEvent(changeEvent);
    
    expect(handleChange).toHaveBeenCalledWith('firstName', 'Jane');
    expect(handleValuesChange).toHaveBeenCalledWith({ firstName: 'Jane' });
  });
  
  it('exposes imperative handle (ref)', () => {
     const ref = React.createRef<any>();
     const { container } = render(
       <DynamicForm fields={mockFields} formRef={ref} />
     );
     
     const wc = container.querySelector('skyra-tech-dynamic-form') as any;
     wc.submit = vi.fn();
     wc.reset = vi.fn();
     wc.validate = vi.fn().mockReturnValue(true);
     wc.getValues = vi.fn().mockReturnValue({ firstName: 'Bob' });
     wc.errors = {};
     
     ref.current?.submit();
     expect(wc.submit).toHaveBeenCalled();
     
     ref.current?.reset();
     expect(wc.reset).toHaveBeenCalled();
     
     const isValid = ref.current?.validate();
     expect(isValid).toBe(true);
     
     const state = ref.current?.getFormState();
     expect(state.values).toEqual({ firstName: 'Bob' });
  });
});
