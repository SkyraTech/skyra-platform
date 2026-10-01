import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DynamicSelect } from './DynamicSelect';

expect.extend(toHaveNoViolations);

const sampleOptions = [
  { value: 'eng', label: 'Engineering' },
  { value: 'mkt', label: 'Marketing' }
];

describe('DynamicSelect', () => {
  it('has no accessibility violations across states', async () => {
    const { container } = render(
      <main>
        <DynamicSelect options={sampleOptions} label="Dept" onChange={() => {}} />
        <DynamicSelect options={sampleOptions} label="Dept (Search)" searchable onChange={() => {}} />
        <DynamicSelect options={sampleOptions} label="Dept (Multi)" mode="multiple" value={['eng']} onChange={() => {}} />
        <DynamicSelect options={sampleOptions} label="Dept (Disabled)" disabled onChange={() => {}} />
        <DynamicSelect options={sampleOptions} label="Dept (Error)" error="Invalid selection" onChange={() => {}} />
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  it('renders a custom element wrapper', () => {
    const { container } = render(
      <DynamicSelect
        options={sampleOptions}
        placeholder="Choose dept"
        label="Department"
      />
    );
    const wc = container.querySelector('skyra-tech-dynamic-select') as any;
    expect(wc).toBeInTheDocument();
    expect(wc.getAttribute('placeholder')).toBe('Choose dept');
    expect(wc.getAttribute('label')).toBe('Department');
    expect(wc.getAttribute('mode')).toBe('single');
  });

  it('passes options and value properties correctly', () => {
    const { container } = render(
      <DynamicSelect
        options={sampleOptions}
        value={sampleOptions[0]}
        onChange={() => {}}
      />
    );
    const wc = container.querySelector('skyra-tech-dynamic-select') as any;
    expect(wc.options).toEqual(sampleOptions);
    expect(wc.value).toEqual(sampleOptions[0]);
  });

  it('handles skyra-change event', () => {
    const onChange = vi.fn();
    const { container } = render(
      <DynamicSelect options={sampleOptions} onChange={onChange} />
    );
    
    const wc = container.querySelector('skyra-tech-dynamic-select') as any;
    
    const event = new CustomEvent('skyra-change', { detail: { value: sampleOptions[1] } });
    wc.dispatchEvent(event);
    
    expect(onChange).toHaveBeenCalledWith(sampleOptions[1]);
  });

  it('handles skyra-search event', () => {
    const onSearch = vi.fn();
    const { container } = render(
      <DynamicSelect options={sampleOptions} searchable onSearch={onSearch} onChange={() => {}} />
    );
    
    const wc = container.querySelector('skyra-tech-dynamic-select') as any;
    expect(wc.getAttribute('searchable')).toBe('');
    
    const event = new CustomEvent('skyra-search', { detail: { query: 'Eng' } });
    wc.dispatchEvent(event);
    
    expect(onSearch).toHaveBeenCalledWith('Eng');
  });

  it('handles skyra-create event', () => {
    const onCreateOption = vi.fn();
    const { container } = render(
      <DynamicSelect options={sampleOptions} allowCreate onCreateOption={onCreateOption} onChange={() => {}} />
    );
    
    const wc = container.querySelector('skyra-tech-dynamic-select') as any;
    expect(wc.getAttribute('allow-create')).toBe('');
    
    const event = new CustomEvent('skyra-create', { detail: { query: 'HR' } });
    wc.dispatchEvent(event);
    
    expect(onCreateOption).toHaveBeenCalledWith('HR');
  });

  it('passes attributes based on props correctly', () => {
    const { container } = render(
      <DynamicSelect
        options={sampleOptions}
        onChange={() => {}}
        mode="multiple"
        selectAll
        clearable
        loading
        disabled
        grouping
        required
        maxMenuHeight={300}
        maxVisibleValues={5}
        maxSelections={3}
      />
    );
    const wc = container.querySelector('skyra-tech-dynamic-select') as any;
    expect(wc.getAttribute('mode')).toBe('multiple');
    expect(wc.getAttribute('select-all')).toBe('');
    expect(wc.getAttribute('clearable')).toBe('');
    expect(wc.getAttribute('loading')).toBe('');
    expect(wc.getAttribute('disabled')).toBe('');
    expect(wc.getAttribute('grouping')).toBe('');
    expect(wc.getAttribute('required')).toBe('');
    expect(wc.getAttribute('max-menu-height')).toBe('300');
    expect(wc.getAttribute('max-visible-values')).toBe('5');
    expect(wc.getAttribute('max-selections')).toBe('3');
  });
});
