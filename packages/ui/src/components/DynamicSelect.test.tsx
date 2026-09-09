import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicSelect } from './DynamicSelect';

const sampleOptions = [
  { value: 'eng', label: 'Engineering', description: 'Tech & Dev', group: 'Tech' },
  { value: 'mkt', label: 'Marketing', description: 'Brand & Growth', group: 'Business' },
  { value: 'fin', label: 'Finance', description: 'Accounting', group: 'Business' },
  { value: 'hr', label: 'Human Resources', description: 'People Ops', group: 'People' },
  { value: 'dis', label: 'Disabled Option', disabled: true, group: 'Tech' },
];

describe('DynamicSelect', () => {
  it('renders with placeholder and opens menu on click', () => {
    const onChange = vi.fn();
    render(<DynamicSelect options={sampleOptions} onChange={onChange} placeholder="Choose dept" />);

    const trigger = screen.getByRole('button', { name: /choose dept/i });
    expect(trigger).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('handles single selection and fires onChange', () => {
    const onChange = vi.fn();
    render(<DynamicSelect options={sampleOptions} onChange={onChange} />);

    fireEvent.click(screen.getByRole('button'));
    fireEvent.click(screen.getByText('Engineering'));

    expect(onChange).toHaveBeenCalledWith(sampleOptions[0]);
  });

  it('renders selected value in single mode', () => {
    render(<DynamicSelect options={sampleOptions} value="eng" onChange={() => {}} />);
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('handles multi selection with chips and +N overflow', () => {
    const onChange = vi.fn();
    render(
      <DynamicSelect
        mode="multiple"
        options={sampleOptions}
        value={['eng', 'mkt', 'fin', 'hr']}
        maxVisibleValues={2}
        onChange={onChange}
      />
    );

    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('+2')).toBeInTheDocument();

    // Click +2 opens listbox
    fireEvent.click(screen.getByText('+2'));
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });

  it('removes individual token in multi-select mode', () => {
    const onChange = vi.fn();
    render(
      <DynamicSelect
        mode="multiple"
        options={sampleOptions}
        value={['eng', 'mkt']}
        onChange={onChange}
      />
    );

    const removeBtn = screen.getByRole('button', { name: /remove engineering/i });
    fireEvent.click(removeBtn);

    expect(onChange).toHaveBeenCalled();
  });

  it('supports search filtering and onSearch callback', () => {
    const onSearch = vi.fn();
    render(
      <DynamicSelect
        options={sampleOptions}
        searchable
        onSearch={onSearch}
        onChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'Market' } });

    expect(onSearch).toHaveBeenCalledWith('Market');
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.queryByText('Engineering')).not.toBeInTheDocument();
  });

  it('handles clear button', () => {
    const onChange = vi.fn();
    render(
      <DynamicSelect
        options={sampleOptions}
        value="eng"
        clearable
        onChange={onChange}
      />
    );

    const clearBtn = screen.getByRole('button', { name: /clear selection/i });
    fireEvent.click(clearBtn);

    expect(onChange).toHaveBeenCalledWith(null);
  });

  it('supports select all in multi mode', () => {
    const onChange = vi.fn();
    render(
      <DynamicSelect
        mode="multiple"
        selectAll
        options={sampleOptions}
        value={[]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const selectAllBtn = screen.getByText(/select all/i);
    fireEvent.click(selectAllBtn);

    // Excludes disabled option
    expect(onChange).toHaveBeenCalledWith(sampleOptions.filter((o) => !o.disabled));
  });

  it('supports grouping options', () => {
    render(
      <DynamicSelect
        grouping
        options={sampleOptions}
        onChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('Business')).toBeInTheDocument();
    expect(screen.getByText('People')).toBeInTheDocument();
  });

  it('displays loading state', () => {
    render(<DynamicSelect options={[]} loading onChange={() => {}} />);
    expect(screen.getByLabelText(/loading options/i)).toBeInTheDocument();
  });

  it('displays error state', () => {
    render(<DynamicSelect options={sampleOptions} error="This field is required" onChange={() => {}} />);
    expect(screen.getByRole('alert')).toHaveTextContent('This field is required');
  });

  it('handles creatable options', () => {
    const onCreateOption = vi.fn();
    render(
      <DynamicSelect
        options={sampleOptions}
        searchable
        allowCreate
        onCreateOption={onCreateOption}
        onChange={() => {}}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'New Team' } });

    const createBtn = screen.getByRole('button', { name: /create "new team"/i });
    fireEvent.click(createBtn);

    expect(onCreateOption).toHaveBeenCalledWith('New Team');
  });

  it('handles keyboard navigation (Enter, ArrowDown, Escape)', () => {
    const onChange = vi.fn();
    render(<DynamicSelect options={sampleOptions} onChange={onChange} />);

    const trigger = screen.getByRole('button');
    trigger.focus();

    // Open on Enter
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(screen.getByRole('listbox')).toBeInTheDocument();

    // Arrow down
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });

    // Select with Enter
    fireEvent.keyDown(trigger, { key: 'Enter' });
    expect(onChange).toHaveBeenCalled();

    // Escape closes
    fireEvent.click(trigger);
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('operates Select All strictly on currently filtered options when search filter is active', () => {
    const onChange = vi.fn();
    render(
      <DynamicSelect
        mode="multiple"
        searchable
        selectAll
        options={sampleOptions}
        value={[]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const searchInput = screen.getByRole('textbox');
    
    // Filter down to "Business" options or "Marketing"
    fireEvent.change(searchInput, { target: { value: 'Market' } });
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.queryByText('Engineering')).not.toBeInTheDocument();

    // Click Select all when filtered
    const selectAllBtn = screen.getByText(/select all/i);
    fireEvent.click(selectAllBtn);

    // Only 'Marketing' should be selected, NOT all 5 options
    expect(onChange).toHaveBeenCalledWith([sampleOptions[1]]);
  });

  it('deselects all matching filtered options when all filtered options are already selected', () => {
    const onChange = vi.fn();
    // 'Marketing' and 'Finance' already selected
    render(
      <DynamicSelect
        mode="multiple"
        searchable
        selectAll
        options={sampleOptions}
        value={['mkt', 'fin', 'eng']}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getAllByRole('button')[0]!);
    const searchInput = screen.getByRole('textbox');

    // Filter to 'Market'
    fireEvent.change(searchInput, { target: { value: 'Market' } });
    expect(screen.getByRole('option', { name: /marketing/i })).toBeInTheDocument();

    // Select all row shows 'Deselect all' because the only filtered enabled option 'mkt' is already selected
    const deselectAllBtn = screen.getByText(/deselect all/i);
    fireEvent.click(deselectAllBtn);

    // 'mkt' is removed while 'fin' and 'eng' remain
    expect(onChange).toHaveBeenCalledWith([
      sampleOptions[2], // 'fin'
      sampleOptions[0], // 'eng'
    ]);
  });

  it('renders multi-select sticky footer with selection count and Clear all action', () => {
    const onChange = vi.fn();
    render(
      <DynamicSelect
        mode="multiple"
        options={sampleOptions}
        value={['eng', 'mkt']}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getAllByRole('button')[0]!);
    expect(screen.getByText('2 selected')).toBeInTheDocument();

    const clearAllBtn = screen.getByText('Clear all');
    expect(clearAllBtn).toBeInTheDocument();
    fireEvent.click(clearAllBtn);

    expect(onChange).toHaveBeenCalledWith([]);
  });

  it('allows keyboard activation (Enter/Space) on Select All row', () => {
    const onChange = vi.fn();
    render(
      <DynamicSelect
        mode="multiple"
        selectAll
        options={sampleOptions}
        value={[]}
        onChange={onChange}
      />
    );

    fireEvent.click(screen.getByRole('button'));
    const selectAllRow = screen.getByLabelText(/select all options/i);
    
    // Press Space on select all
    fireEvent.keyDown(selectAllRow, { key: ' ' });
    expect(onChange).toHaveBeenCalledWith(sampleOptions.filter((o) => !o.disabled));
  });
});
