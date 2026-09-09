import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { DynamicForm } from './DynamicForm';
import type { FieldsetSchema } from './types';

const sampleFieldsets: FieldsetSchema[] = [
  {
    title: 'General Information',
    fields: [
      { key: 'name', label: 'Full Name', type: 'text', required: true },
      { key: 'bio', label: 'Biography', type: 'textarea', maxLength: 200 },
      { key: 'age', label: 'Age', type: 'number', min: 18 },
      {
        key: 'dept',
        label: 'Department',
        type: 'select',
        options: [
          { value: 'eng', label: 'Engineering' },
          { value: 'mkt', label: 'Marketing' },
        ],
      },
      {
        key: 'skills',
        label: 'Skills',
        type: 'checkbox-group',
        options: [
          { value: 'react', label: 'React' },
          { value: 'node', label: 'Node.js' },
        ],
      },
      {
        key: 'level',
        label: 'Experience Level',
        type: 'radio-group',
        options: [
          { value: 'junior', label: 'Junior' },
          { value: 'senior', label: 'Senior' },
        ],
      },
      { key: 'isRemote', label: 'Remote Worker', type: 'switch' },
      { key: 'startDate', label: 'Start Date', type: 'date' },
      { key: 'shiftTime', label: 'Shift Time', type: 'time' },
      {
        key: 'remoteAllowance',
        label: 'Remote Allowance',
        type: 'text',
        dependsOn: { field: 'isRemote', value: true },
      },
    ],
  },
];

describe('DynamicForm', () => {
  it('renders all fields and fieldsets', () => {
    const onChange = vi.fn();
    const onSubmit = vi.fn();

    render(
      <DynamicForm
        fieldsets={sampleFieldsets}
        values={{
          name: 'Jane Doe',
          bio: 'Developer',
          age: 28,
          dept: 'eng',
          skills: ['react'],
          level: 'senior',
          isRemote: false,
          startDate: '2026-09-09',
          shiftTime: '09:00 AM',
        }}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    );

    expect(screen.getByText('General Information')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Jane Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Developer')).toBeInTheDocument();
    expect(screen.getByText('Remote Worker')).toBeInTheDocument();

    // Conditional field remoteAllowance should not be visible when isRemote is false
    expect(screen.queryByText('Remote Allowance')).not.toBeInTheDocument();
  });

  it('renders conditional field when dependency is satisfied', () => {
    render(
      <DynamicForm
        fieldsets={sampleFieldsets}
        values={{
          isRemote: true,
        }}
        onChange={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByText('Remote Allowance')).toBeInTheDocument();
  });

  it('handles submit and cancel triggers', () => {
    const onSubmit = vi.fn();
    const onCancel = vi.fn();

    render(
      <DynamicForm
        fieldsets={sampleFieldsets}
        values={{}}
        onChange={() => {}}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(onSubmit).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(onCancel).toHaveBeenCalled();
  });

  it('renders danger zone with destructive action', () => {
    const onDanger = vi.fn();

    render(
      <DynamicForm
        fieldsets={sampleFieldsets}
        values={{}}
        onChange={() => {}}
        onSubmit={() => {}}
        showDangerZone
        dangerZoneLabel="Delete Account"
        onDangerAction={onDanger}
      />
    );

    expect(screen.getByText('Danger Zone')).toBeInTheDocument();
    const dangerBtn = screen.getByRole('button', { name: /delete account/i });
    fireEvent.click(dangerBtn);

    expect(onDanger).toHaveBeenCalled();
  });
});
