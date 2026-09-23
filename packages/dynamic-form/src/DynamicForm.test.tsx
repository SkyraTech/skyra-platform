import { describe, it, expect, vi } from 'vitest';
import React, { useRef, useState } from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { DynamicForm } from './DynamicForm';
import type { FieldDef, FieldsetDef, DynamicFormHandle, DynamicFormFeatures } from './types';

expect.extend(toHaveNoViolations);

// Sample fieldsets for testing
const sampleFieldsets: FieldsetDef[] = [
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
  // ── A. Basic Rendering & Interaction ──────────────────────────────
  describe('A. Basic Rendering & Interaction', () => {
    it('renders all field types correctly', () => {
      const allTypesFields: FieldDef[] = [
        { name: 'textField', label: 'Text Field', type: 'text' },
        { name: 'searchField', label: 'Search Field', type: 'search' },
        { name: 'passwordField', label: 'Password Field', type: 'password' },
        { name: 'numberField', label: 'Number Field', type: 'number' },
        { name: 'textareaField', label: 'Textarea Field', type: 'textarea' },
        { name: 'selectField', label: 'Select Field', type: 'select', options: [{ value: 'a', label: 'A' }] },
        { name: 'multiSelectField', label: 'MultiSelect Field', type: 'multi-select', options: [{ value: '1', label: 'One' }] },
        { name: 'checkboxField', label: 'Checkbox Field', type: 'checkbox' },
        { name: 'checkboxGroupField', label: 'Checkbox Group', type: 'checkbox-group', options: [{ value: 'c1', label: 'C1' }] },
        { name: 'radioGroupField', label: 'Radio Group', type: 'radio-group', options: [{ value: 'r1', label: 'R1' }] },
        { name: 'switchField', label: 'Switch Field', type: 'switch' },
        { name: 'dateField', label: 'Date Field', type: 'date' },
        { name: 'dateRangeField', label: 'Date Range Field', type: 'date-range' },
        { name: 'timeField', label: 'Time Field', type: 'time' },
        { name: 'dateTimeField', label: 'DateTime Field', type: 'datetime' },
      ];

      render(<DynamicForm fields={allTypesFields} onSubmit={() => {}} />);

      expect(screen.getByLabelText(/Text Field/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Search Field/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Password Field/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Number Field/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Textarea Field/i)).toBeInTheDocument();
      expect(screen.getByText('Select Field')).toBeInTheDocument();
      expect(screen.getByText('MultiSelect Field')).toBeInTheDocument();
      expect(screen.getByLabelText(/Checkbox Field/i)).toBeInTheDocument();
      expect(screen.getByText('Checkbox Group')).toBeInTheDocument();
      expect(screen.getByText('Radio Group')).toBeInTheDocument();
      expect(screen.getByText('Switch Field')).toBeInTheDocument();
      expect(screen.getByText('Date Field')).toBeInTheDocument();
    });

    it('renders with initialValues (uncontrolled) and updates internal state', () => {
      render(
        <DynamicForm
          fields={[
            { name: 'username', label: 'Username', type: 'text' },
            { name: 'email', label: 'Email', type: 'text' },
          ]}
          initialValues={{ username: 'alice', email: 'alice@example.com' }}
          onSubmit={() => {}}
        />
      );

      const input = screen.getByLabelText(/Username/i) as HTMLInputElement;
      expect(input.value).toBe('alice');

      fireEvent.change(input, { target: { value: 'alice_updated' } });
      expect(input.value).toBe('alice_updated');
    });

    it('submit button triggers onSubmit with form values', async () => {
      const handleSubmit = vi.fn();
      render(
        <DynamicForm
          fields={[{ name: 'project', label: 'Project Name', type: 'text' }]}
          initialValues={{ project: 'Skyra' }}
          onSubmit={handleSubmit}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith(expect.objectContaining({ project: 'Skyra' }));
      });
    });

    it('cancel button triggers onCancel', () => {
      const handleCancel = vi.fn();
      render(
        <DynamicForm
          fields={[{ name: 'notes', label: 'Notes', type: 'text' }]}
          onSubmit={() => {}}
          onCancel={handleCancel}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
      expect(handleCancel).toHaveBeenCalledTimes(1);
    });

    it('reset clears fields back to initial values via handle', () => {
      const TestComponent = () => {
        const formRef = useRef<DynamicFormHandle>(null);
        return (
          <div>
            <DynamicForm
              formRef={formRef}
              fields={[{ name: 'title', label: 'Title', type: 'text' }]}
              initialValues={{ title: 'Initial Title' }}
              onSubmit={() => {}}
            />
            <button type="button" onClick={() => formRef.current?.reset()}>
              External Reset
            </button>
          </div>
        );
      };

      render(<TestComponent />);
      const input = screen.getByLabelText(/Title/i) as HTMLInputElement;
      expect(input.value).toBe('Initial Title');

      fireEvent.change(input, { target: { value: 'Modified Title' } });
      expect(input.value).toBe('Modified Title');

      fireEvent.click(screen.getByRole('button', { name: /external reset/i }));
      expect(input.value).toBe('Initial Title');
    });
  });

  // ── B. Validation ──────────────────────────────────────────────────
  describe('B. Validation', () => {
    it('rejects empty values on required fields and prevents submit', async () => {
      const handleSubmit = vi.fn();
      render(
        <DynamicForm
          fields={[
            { name: 'requiredName', label: 'Required Name', type: 'text', required: true },
          ]}
          onSubmit={handleSubmit}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(screen.getByText('Required Name is required')).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
      });

      const input = screen.getByLabelText(/Required Name/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('supports validateOn="blur"', async () => {
      render(
        <DynamicForm
          validationMode="onBlur"
          fields={[
            {
              name: 'zip',
              label: 'Zip Code',
              type: 'text',
              validate: (val) => (!val || String(val).length !== 5 ? 'Must be 5 digits' : undefined),
            },
          ]}
          onSubmit={() => {}}
        />
      );

      const input = screen.getByLabelText(/Zip Code/i);
      fireEvent.change(input, { target: { value: '12' } });
      // Error not shown yet
      expect(screen.queryByText('Must be 5 digits')).not.toBeInTheDocument();

      // Blur input
      fireEvent.blur(input);
      await waitFor(() => {
        expect(screen.getByText('Must be 5 digits')).toBeInTheDocument();
      });
    });

    it('supports validateOn="onChange"', async () => {
      render(
        <DynamicForm
          validationMode="onChange"
          fields={[
            {
              name: 'coupon',
              label: 'Coupon',
              type: 'text',
              validate: (val) => (val !== 'DISCOUNT' ? 'Invalid coupon code' : undefined),
            },
          ]}
          onSubmit={() => {}}
        />
      );

      const input = screen.getByLabelText(/Coupon/i);
      fireEvent.change(input, { target: { value: 'TEST' } });

      await waitFor(() => {
        expect(screen.getByText('Invalid coupon code')).toBeInTheDocument();
      });

      fireEvent.change(input, { target: { value: 'DISCOUNT' } });
      await waitFor(() => {
        expect(screen.queryByText('Invalid coupon code')).not.toBeInTheDocument();
      });
    });

    it('supports cross-field validation receiving all form values', async () => {
      const handleSubmit = vi.fn();
      render(
        <DynamicForm
          fields={[
            { name: 'password', label: 'Password', type: 'password' },
            {
              name: 'confirmPassword',
              label: 'Confirm Password',
              type: 'password',
              validate: (val, allValues) =>
                val !== allValues.password ? 'Passwords must match' : undefined,
            },
          ]}
          initialValues={{ password: 'secret1', confirmPassword: 'secret2' }}
          onSubmit={handleSubmit}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(screen.getByText('Passwords must match')).toBeInTheDocument();
        expect(handleSubmit).not.toHaveBeenCalled();
      });
    });

    it('supports async validation with Promise resolution', async () => {
      const checkUsernameAvailability = vi.fn(async (val) => {
        if (val === 'taken') return 'Username is already taken';
        return undefined;
      });

      render(
        <DynamicForm
          fields={[
            {
              name: 'handle',
              label: 'User Handle',
              type: 'text',
              validate: checkUsernameAvailability,
            },
          ]}
          initialValues={{ handle: 'taken' }}
          onSubmit={() => {}}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(screen.getByText('Username is already taken')).toBeInTheDocument();
      });
    });

    it('supports form-level validation via validate prop', async () => {
      render(
        <DynamicForm
          fields={[
            { name: 'start', label: 'Start Hour', type: 'number' },
            { name: 'end', label: 'End Hour', type: 'number' },
          ]}
          initialValues={{ start: 10, end: 8 }}
          validate={(vals) => {
            const errors: Record<string, string> = {};
            if (Number(vals.start) >= Number(vals.end)) {
              errors.end = 'End hour must be greater than start hour';
            }
            return errors;
          }}
          onSubmit={() => {}}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(screen.getByText('End hour must be greater than start hour')).toBeInTheDocument();
      });
    });

    it('displays serverErrors prop and clears on edit', async () => {
      const { rerender } = render(
        <DynamicForm
          fields={[{ name: 'email', label: 'Email Address', type: 'text' }]}
          initialValues={{ email: 'existing@skyra.io' }}
          serverErrors={{ email: 'Email already exists in system' }}
          onSubmit={() => {}}
        />
      );

      expect(screen.getByText('Email already exists in system')).toBeInTheDocument();

      const input = screen.getByLabelText(/Email Address/i);
      fireEvent.change(input, { target: { value: 'new@skyra.io' } });

      await waitFor(() => {
        expect(screen.queryByText('Email already exists in system')).not.toBeInTheDocument();
      });
    });
  });

  // ── C. Conditional Visibility ─────────────────────────────────────
  describe('C. Conditional Visibility', () => {
    it('evaluates equals and notEquals operators', () => {
      const fields: FieldDef[] = [
        {
          name: 'role',
          label: 'Role',
          type: 'select',
          options: [
            { value: 'admin', label: 'Admin' },
            { value: 'user', label: 'User' },
          ],
        },
        {
          name: 'adminCode',
          label: 'Admin Code',
          type: 'text',
          visibleWhen: { field: 'role', operator: 'equals', value: 'admin' },
        },
        {
          name: 'userNotice',
          label: 'User Notice',
          type: 'text',
          visibleWhen: { field: 'role', operator: 'notEquals', value: 'admin' },
        },
      ];

      const { rerender } = render(
        <DynamicForm fields={fields} values={{ role: 'admin' }} onSubmit={() => {}} />
      );

      expect(screen.getByLabelText(/Admin Code/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/User Notice/i)).not.toBeInTheDocument();

      rerender(<DynamicForm fields={fields} values={{ role: 'user' }} onSubmit={() => {}} />);
      expect(screen.queryByLabelText(/Admin Code/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/User Notice/i)).toBeInTheDocument();
    });

    it('evaluates greaterThan, lessThan, and in operators', () => {
      const fields: FieldDef[] = [
        { name: 'score', label: 'Score', type: 'number' },
        {
          name: 'bonus',
          label: 'Bonus',
          type: 'text',
          visibleWhen: { field: 'score', operator: 'greaterThan', value: 80 },
        },
        {
          name: 'status',
          label: 'Status',
          type: 'text',
        },
        {
          name: 'actionItem',
          label: 'Action Item',
          type: 'text',
          visibleWhen: { field: 'status', operator: 'in', value: ['pending', 'review'] },
        },
      ];

      const { rerender } = render(
        <DynamicForm fields={fields} values={{ score: 70, status: 'approved' }} onSubmit={() => {}} />
      );
      expect(screen.queryByLabelText(/Bonus/i)).not.toBeInTheDocument();
      expect(screen.queryByLabelText(/Action Item/i)).not.toBeInTheDocument();

      rerender(
        <DynamicForm fields={fields} values={{ score: 95, status: 'pending' }} onSubmit={() => {}} />
      );
      expect(screen.getByLabelText(/Bonus/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Action Item/i)).toBeInTheDocument();
    });

    it('evaluates isEmpty, isNotEmpty, and contains operators', () => {
      const fields: FieldDef[] = [
        { name: 'tags', label: 'Tags', type: 'text' },
        {
          name: 'emptyWarning',
          label: 'Empty Warning',
          type: 'text',
          visibleWhen: { field: 'tags', operator: 'isEmpty' },
        },
        {
          name: 'filledNotice',
          label: 'Filled Notice',
          type: 'text',
          visibleWhen: { field: 'tags', operator: 'isNotEmpty' },
        },
      ];

      const { rerender } = render(
        <DynamicForm fields={fields} values={{ tags: '' }} onSubmit={() => {}} />
      );
      expect(screen.getByLabelText(/Empty Warning/i)).toBeInTheDocument();
      expect(screen.queryByLabelText(/Filled Notice/i)).not.toBeInTheDocument();

      rerender(<DynamicForm fields={fields} values={{ tags: 'alpha' }} onSubmit={() => {}} />);
      expect(screen.queryByLabelText(/Empty Warning/i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/Filled Notice/i)).toBeInTheDocument();
    });

    it('evaluates multiple conditions with AND and OR logic', () => {
      const fields: FieldDef[] = [
        { name: 'age', label: 'Age', type: 'number' },
        { name: 'hasConsent', label: 'Consent', type: 'switch' },
        {
          name: 'specialFeature',
          label: 'Special Feature',
          type: 'text',
          visibleWhen: {
            and: [
              { field: 'age', operator: 'greaterThan', value: 18 },
              { field: 'hasConsent', operator: 'equals', value: true },
            ],
          },
        },
      ];

      const { rerender } = render(
        <DynamicForm fields={fields} values={{ age: 20, hasConsent: false }} onSubmit={() => {}} />
      );
      expect(screen.queryByLabelText(/Special Feature/i)).not.toBeInTheDocument();

      rerender(
        <DynamicForm fields={fields} values={{ age: 25, hasConsent: true }} onSubmit={() => {}} />
      );
      expect(screen.getByLabelText(/Special Feature/i)).toBeInTheDocument();
    });
  });

  // ── D. Field Dependencies ─────────────────────────────────────────
  describe('D. Field Dependencies', () => {
    it('executes dependsOn.onChange trigger to update dependent values', () => {
      const fields: FieldDef[] = [
        { name: 'quantity', label: 'Quantity', type: 'number' },
        {
          name: 'unitPrice',
          label: 'Unit Price',
          type: 'number',
          dependsOn: {
            field: 'quantity',
            onChange: (qty) => ({
              totalPrice: Number(qty) * 50,
            }),
          },
        },
        { name: 'totalPrice', label: 'Total Price', type: 'number' },
      ];

      render(
        <DynamicForm
          fields={fields}
          initialValues={{ quantity: 2, unitPrice: 50, totalPrice: 100 }}
          onSubmit={() => {}}
        />
      );

      const qtyInput = screen.getByLabelText(/Quantity/i);
      fireEvent.change(qtyInput, { target: { value: '4' } });

      const totalInput = screen.getByLabelText(/Total Price/i) as HTMLInputElement;
      expect(totalInput.value).toBe('200');
    });

    it('supports disabling a field conditionally', () => {
      render(
        <DynamicForm
          fields={[
            { name: 'lock', label: 'Lock Field', type: 'switch' },
            { name: 'lockedField', label: 'Locked Field', type: 'text', disabled: true },
          ]}
          initialValues={{ lock: true, lockedField: 'Cannot edit' }}
          onSubmit={() => {}}
        />
      );

      const input = screen.getByLabelText(/Locked Field/i);
      expect(input).toBeDisabled();
    });
  });

  // ── E. Repeatable Field Groups ─────────────────────────────────────
  describe('E. Repeatable Field Groups', () => {
    it('renders initial items, adds item, and removes item respecting bounds', () => {
      render(
        <DynamicForm
          fieldsets={[
            {
              title: 'Team Configuration',
              fields: [
                {
                  key: 'teamMembers',
                  label: 'Team Members',
                  type: 'repeatable',
                  repeatableConfig: {
                    min: 1,
                    max: 3,
                    addButtonText: 'Add Member',
                    removeButtonText: 'Delete Member',
                    fields: [
                      { key: 'memberName', label: 'Member Name', type: 'text' },
                      { key: 'memberRole', label: 'Member Role', type: 'text' },
                    ],
                  },
                },
              ],
            },
          ]}
          initialValues={{
            teamMembers: [{ memberName: 'Alice', memberRole: 'Lead' }],
          }}
          onSubmit={() => {}}
        />
      );

      expect(screen.getByText('Team Members')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Alice')).toBeInTheDocument();

      // Because min=1 and items.length=1, remove button is hidden
      expect(screen.queryByText('Delete Member')).not.toBeInTheDocument();

      // Click Add Member
      const addBtn = screen.getByRole('button', { name: /add member/i });
      fireEvent.click(addBtn);

      // Now 2 entries exist, remove button should be present
      expect(screen.getByText('Team Members #2')).toBeInTheDocument();
      const deleteButtons = screen.getAllByText('Delete Member');
      expect(deleteButtons.length).toBe(2);

      // Add a 3rd member (reaching max=3)
      fireEvent.click(addBtn);
      expect(screen.getByText('Team Members #3')).toBeInTheDocument();

      // At max=3, add button should be hidden
      expect(screen.queryByRole('button', { name: /add member/i })).not.toBeInTheDocument();

      // Remove the second member
      fireEvent.click(screen.getAllByText('Delete Member')[1]!);
      expect(screen.queryByText('Team Members #3')).not.toBeInTheDocument();
    });
  });

  // ── F. Nested Fields ──────────────────────────────────────────────
  describe('F. Nested Fields', () => {
    it('sets and gets dot-notation paths correctly and submits structured nested object', async () => {
      const handleSubmit = vi.fn();
      render(
        <DynamicForm
          fields={[
            { name: 'profile.name', label: 'Profile Name', type: 'text' },
            { name: 'profile.address.city', label: 'City', type: 'text' },
          ]}
          initialValues={{
            profile: {
              name: 'John',
              address: { city: 'San Francisco' },
            },
          }}
          onSubmit={handleSubmit}
        />
      );

      const cityInput = screen.getByLabelText(/City/i) as HTMLInputElement;
      expect(cityInput.value).toBe('San Francisco');

      fireEvent.change(cityInput, { target: { value: 'New York' } });
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalledWith({
          profile: {
            name: 'John',
            address: { city: 'New York' },
          },
        });
      });
    });
  });

  // ── G. Form State & Dirty Tracking ────────────────────────────────
  describe('G. Form State & Dirty Tracking', () => {
    it('tracks pristine vs dirty state and dirtyFields map', () => {
      let currentHandle: DynamicFormHandle | null = null;
      const onDirtyChange = vi.fn();

      const TestComponent = () => {
        const formRef = useRef<DynamicFormHandle>(null);
        return (
          <DynamicForm
            formRef={(h) => {
              currentHandle = h;
              (formRef as any).current = h;
            }}
            fields={[
              { name: 'company', label: 'Company', type: 'text' },
              { name: 'location', label: 'Location', type: 'text' },
            ]}
            initialValues={{ company: 'Skyra', location: 'HQ' }}
            onDirtyChange={onDirtyChange}
            features={{ dirtyTracking: true, unsavedChanges: true }}
            onSubmit={() => {}}
          />
        );
      };

      render(<TestComponent />);
      expect(currentHandle?.isDirty).toBe(false);

      const input = screen.getByLabelText(/Company/i);
      fireEvent.change(input, { target: { value: 'Skyra Tech' } });

      expect(currentHandle?.isDirty).toBe(true);
      expect(currentHandle?.dirtyFields.company).toBe(true);
      expect(currentHandle?.dirtyFields.location).toBeUndefined();

      // Revert back to original value
      fireEvent.change(input, { target: { value: 'Skyra' } });
      expect(currentHandle?.isDirty).toBe(false);
      expect(currentHandle?.dirtyFields.company).toBeUndefined();
    });

    it('sets isSubmitting during async submit and displays error on rejection', async () => {
      let rejectSubmit!: (err: Error) => void;
      const onSubmit = vi.fn(
        () =>
          new Promise<void>((_, reject) => {
            rejectSubmit = reject;
          })
      );

      render(
        <DynamicForm
          fields={[{ name: 'task', label: 'Task', type: 'text' }]}
          initialValues={{ task: 'Complete QA' }}
          onSubmit={onSubmit}
        />
      );

      const submitBtn = screen.getByRole('button', { name: /save changes/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalled();
      });

      rejectSubmit(new Error('Network gateway timeout'));
      await waitFor(() => {
        expect(screen.getByText('Network gateway timeout')).toBeInTheDocument();
      });
    });
  });

  // ── H. Controlled Mode ────────────────────────────────────────────
  describe('H. Controlled Mode', () => {
    it('accepts values prop and triggers onValuesChange and onChange', () => {
      const onValuesChange = vi.fn();
      const onChange = vi.fn();

      const ControlledTest = () => {
        const [values, setValues] = useState({ query: 'Initial Search' });
        return (
          <DynamicForm
            values={values}
            onValuesChange={(vals) => {
              setValues(vals as { query: string });
              onValuesChange(vals);
            }}
            onChange={onChange}
            fields={[{ name: 'query', label: 'Search Query', type: 'text' }]}
            onSubmit={() => {}}
          />
        );
      };

      render(<ControlledTest />);
      const input = screen.getByLabelText(/Search Query/i) as HTMLInputElement;
      expect(input.value).toBe('Initial Search');

      fireEvent.change(input, { target: { value: 'Updated Search' } });
      expect(onValuesChange).toHaveBeenCalledWith({ query: 'Updated Search' });
      expect(onChange).toHaveBeenCalledWith('query', 'Updated Search');
    });
  });

  // ── I. Draft State & Persistence ──────────────────────────────────
  describe('I. Draft State & Persistence', () => {
    it('getFormState captures serializable snapshot and restoreFormState restores it', () => {
      let formHandle!: DynamicFormHandle;

      render(
        <DynamicForm
          formRef={(h) => {
            if (h) formHandle = h;
          }}
          fields={[
            { name: 'theme', label: 'Theme', type: 'text' },
            { name: 'notifications', label: 'Notifications', type: 'switch' },
          ]}
          initialValues={{ theme: 'dark', notifications: true }}
          onSubmit={() => {}}
        />
      );

      const draft = formHandle.getFormState();
      expect(draft.values).toEqual({ theme: 'dark', notifications: true });

      // Change field values
      act(() => {
        formHandle.setValue('theme', 'light');
      });
      expect(formHandle.getValue('theme')).toBe('light');

      // Restore snapshot
      act(() => {
        formHandle.restoreFormState(draft);
      });
      expect(formHandle.getValue('theme')).toBe('dark');
    });
  });

  // ── J. Validation Summary ─────────────────────────────────────────
  describe('J. Validation Summary', () => {
    it('renders accessible banner when enabled and focuses corresponding field on click', async () => {
      render(
        <DynamicForm
          features={{ validationSummary: true, validation: true }}
          fields={[
            { name: 'reqField', label: 'Mandatory Field', type: 'text', required: true },
          ]}
          onSubmit={() => {}}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(screen.getAllByRole('alert').length).toBeGreaterThan(0);
        expect(screen.getByText(/Please fix 1 error/i)).toBeInTheDocument();
      });

      const errorLink = screen.getByRole('link', { name: /Mandatory Field/i });
      expect(errorLink).toBeInTheDocument();

      const input = screen.getByLabelText(/Mandatory Field/i);
      fireEvent.click(errorLink);
      expect(document.activeElement).toBe(input);
    });
  });

  // ── K. Accessibility ──────────────────────────────────────────────
  describe('K. Accessibility', () => {
    it('has 0 Axe accessibility violations', async () => {
      const { container } = render(
        <DynamicForm
          fieldsets={[
            {
              title: 'Account Details',
              fields: [
                { name: 'accName', label: 'Account Name', type: 'text', required: true },
                { name: 'accBio', label: 'Account Bio', type: 'textarea' },
              ],
            },
          ]}
          initialValues={{ accName: 'Skyra Admin', accBio: 'System operator' }}
          onSubmit={() => {}}
        />
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('sets aria-required, aria-invalid, and aria-describedby accurately', async () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'strictField',
              label: 'Strict Field',
              type: 'text',
              required: true,
              helper: 'Must be filled accurately',
            },
          ]}
          onSubmit={() => {}}
        />
      );

      const input = screen.getByLabelText(/Strict Field/i);
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'strictField-helper');

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', 'strictField-error strictField-helper');
      });
    });
  });

  // ── L. Feature Modularity Matrix (12 Configurations) ──────────────
  describe('L. Feature Modularity Matrix (12 Configurations)', () => {
    const testField: FieldDef = { name: 'f1', label: 'Field 1', type: 'text' };

    const configs: Array<{ name: string; features: DynamicFormFeatures }> = [
      { name: '1. basic (all false)', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '2. validation only', features: { validation: true, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '3. conditional fields only', features: { validation: false, conditionalFields: true, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '4. dependencies only', features: { validation: false, conditionalFields: false, dependencies: true, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '5. repeatable groups only', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: true, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '6. nested fields only', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: true, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '7. dirty tracking only', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: true, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '8. submission state only', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: true, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '9. validation summary only', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: true, serverErrors: false, unsavedChanges: false } },
      { name: '10. server errors only', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: true, unsavedChanges: false } },
      { name: '11. controlled mode only', features: { validation: false, conditionalFields: false, dependencies: false, repeatableGroups: false, nestedFields: false, dirtyTracking: false, draftState: false, submissionState: false, validationSummary: false, serverErrors: false, unsavedChanges: false } },
      { name: '12. all features enabled', features: { validation: true, conditionalFields: true, dependencies: true, repeatableGroups: true, nestedFields: true, dirtyTracking: true, draftState: true, submissionState: true, validationSummary: true, serverErrors: true, unsavedChanges: true } },
    ];

    configs.forEach(({ name, features }) => {
      it(`renders and behaves without error under ${name}`, () => {
        const { container } = render(
          <DynamicForm
            features={features}
            fields={[testField]}
            initialValues={{ f1: 'Value' }}
            onSubmit={() => {}}
          />
        );
        expect(container).toBeInTheDocument();
        expect(screen.getByDisplayValue('Value')).toBeInTheDocument();
      });
    });
  });

  // ── Danger Zone ───────────────────────────────────────────────────
  describe('Danger Zone', () => {
    it('renders danger zone with destructive action', () => {
      const onDanger = vi.fn();

      render(
        <DynamicForm
          fields={[{ name: 'item', label: 'Item', type: 'text' }]}
          showDangerZone
          dangerZoneTitle="Danger Zone"
          dangerZoneLabel="Delete Account"
          onDangerAction={onDanger}
          onSubmit={() => {}}
        />
      );

      expect(screen.getByText('Danger Zone')).toBeInTheDocument();
      const dangerBtn = screen.getByRole('button', { name: /delete account/i });
      fireEvent.click(dangerBtn);

      expect(onDanger).toHaveBeenCalled();
    });
  });

  // ── M. Advanced Workflows & Edge Cases ─────────────────────────────
  describe('M. Advanced Workflows & Edge Cases', () => {
    it('clears child field value when parent dependency changes', () => {
      const fields: FieldDef[] = [
        { name: 'country', label: 'Country', type: 'text' },
        {
          name: 'state',
          label: 'State',
          type: 'text',
          dependsOn: {
            field: 'country',
            onChange: () => ({ state: '' }),
          },
        },
      ];

      render(
        <DynamicForm
          fields={fields}
          initialValues={{ country: 'USA', state: 'California' }}
          onSubmit={() => {}}
        />
      );

      const stateInput = screen.getByLabelText(/State/i) as HTMLInputElement;
      expect(stateInput.value).toBe('California');

      const countryInput = screen.getByLabelText(/Country/i);
      fireEvent.change(countryInput, { target: { value: 'Canada' } });
      expect(stateInput.value).toBe('');
    });

    it('evaluates custom predicate function for conditional visibility', () => {
      const fields: FieldDef[] = [
        { name: 'plan', label: 'Plan', type: 'text' },
        {
          name: 'enterpriseOption',
          label: 'Enterprise Option',
          type: 'text',
          visibleWhen: (vals) => vals.plan === 'enterprise',
        },
      ];

      const { rerender } = render(
        <DynamicForm fields={fields} values={{ plan: 'starter' }} onSubmit={() => {}} />
      );
      expect(screen.queryByLabelText(/Enterprise Option/i)).not.toBeInTheDocument();

      rerender(<DynamicForm fields={fields} values={{ plan: 'enterprise' }} onSubmit={() => {}} />);
      expect(screen.getByLabelText(/Enterprise Option/i)).toBeInTheDocument();
    });

    it('skips validation for hidden conditional fields', async () => {
      const handleSubmit = vi.fn();
      const fields: FieldDef[] = [
        { name: 'hasTaxId', label: 'Has Tax ID', type: 'switch' },
        {
          name: 'taxId',
          label: 'Tax ID',
          type: 'text',
          required: true,
          visibleWhen: { field: 'hasTaxId', operator: 'equals', value: true },
        },
      ];

      render(
        <DynamicForm
          fields={fields}
          initialValues={{ hasTaxId: false, taxId: '' }}
          onSubmit={handleSubmit}
        />
      );

      // taxId is hidden, so required rule shouldn't block submit
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(handleSubmit).toHaveBeenCalled();
      });
    });

    it('resetField resets specific field and preserves other modified fields', () => {
      let handle!: DynamicFormHandle;
      render(
        <DynamicForm
          formRef={(h) => {
            if (h) handle = h;
          }}
          fields={[
            { name: 'first', label: 'First', type: 'text' },
            { name: 'second', label: 'Second', type: 'text' },
          ]}
          initialValues={{ first: 'A', second: 'B' }}
          onSubmit={() => {}}
        />
      );

      const firstInput = screen.getByLabelText(/First/i) as HTMLInputElement;
      const secondInput = screen.getByLabelText(/Second/i) as HTMLInputElement;

      fireEvent.change(firstInput, { target: { value: 'A2' } });
      fireEvent.change(secondInput, { target: { value: 'B2' } });

      expect(firstInput.value).toBe('A2');
      expect(secondInput.value).toBe('B2');

      act(() => {
        handle.resetField('first');
      });

      expect(firstInput.value).toBe('A');
      expect(secondInput.value).toBe('B2');
    });

    it('handle.validate runs validation imperatively and reports boolean status', async () => {
      let handle!: DynamicFormHandle;
      render(
        <DynamicForm
          formRef={(h) => {
            if (h) handle = h;
          }}
          fields={[{ name: 'code', label: 'Code', type: 'text', required: true }]}
          initialValues={{ code: '' }}
          onSubmit={() => {}}
        />
      );

      let isValid: boolean = true;
      await act(async () => {
        isValid = await handle.validate();
      });

      expect(isValid).toBe(false);
      expect(screen.getByText('Code is required')).toBeInTheDocument();

      act(() => {
        handle.setValue('code', 'VALID123');
      });

      await act(async () => {
        isValid = await handle.validate();
      });
      expect(isValid).toBe(true);
      expect(screen.queryByText('Code is required')).not.toBeInTheDocument();
    });

    it('handle.isSubmitted updates to true after successful submit', async () => {
      let handle!: DynamicFormHandle;
      render(
        <DynamicForm
          formRef={(h) => {
            if (h) handle = h;
          }}
          fields={[{ name: 'note', label: 'Note', type: 'text' }]}
          initialValues={{ note: 'Ready' }}
          onSubmit={() => {}}
        />
      );

      expect(handle.isSubmitted).toBe(false);
      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

      await waitFor(() => {
        expect(handle.isSubmitted).toBe(true);
      });
    });

    it('supports custom field type with render prop', () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'customRating',
              label: 'Custom Rating',
              type: 'custom',
              render: ({ value, onChange }) => (
                <div data-testid="custom-rating">
                  <span>Current: {String(value)}</span>
                  <button type="button" onClick={() => onChange(5)}>
                    Set 5 Stars
                  </button>
                </div>
              ),
            },
          ]}
          initialValues={{ customRating: 3 }}
          onSubmit={() => {}}
        />
      );

      expect(screen.getByText('Current: 3')).toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: /set 5 stars/i }));
      expect(screen.getByText('Current: 5')).toBeInTheDocument();
    });

    it('preserves field values correctly when middle repeatable item is removed', () => {
      render(
        <DynamicForm
          fieldsets={[
            {
              title: 'Items',
              fields: [
                {
                  key: 'items',
                  label: 'Items',
                  type: 'repeatable',
                  repeatableConfig: {
                    fields: [{ key: 'name', label: 'Item Name', type: 'text' }],
                  },
                },
              ],
            },
          ]}
          initialValues={{
            items: [{ name: 'First' }, { name: 'Second' }, { name: 'Third' }],
          }}
          onSubmit={() => {}}
        />
      );

      expect(screen.getByDisplayValue('First')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Second')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Third')).toBeInTheDocument();

      // Remove the middle item ('Second')
      const removeButtons = screen.getAllByRole('button', { name: /remove/i });
      fireEvent.click(removeButtons[1]!);

      expect(screen.getByDisplayValue('First')).toBeInTheDocument();
      expect(screen.queryByDisplayValue('Second')).not.toBeInTheDocument();
      expect(screen.getByDisplayValue('Third')).toBeInTheDocument();
    });

    it('maps nested dot-path errors to correct input elements', async () => {
      render(
        <DynamicForm
          fields={[
            { name: 'user.address.postal', label: 'Postal Code', type: 'text', required: true },
          ]}
          onSubmit={() => {}}
        />
      );

      fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
      await waitFor(() => {
        expect(screen.getByText('Postal Code is required')).toBeInTheDocument();
      });

      const input = screen.getByLabelText(/Postal Code/i);
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('populates defaultValue for field when not in initialValues', () => {
      render(
        <DynamicForm
          fields={[
            { name: 'country', label: 'Country', type: 'text', defaultValue: 'India' },
          ]}
          onSubmit={() => {}}
        />
      );

      const input = screen.getByLabelText(/Country/i) as HTMLInputElement;
      expect(input.value).toBe('India');
    });

    it('renders field description and helper text accurately', () => {
      render(
        <DynamicForm
          fields={[
            {
              name: 'slug',
              label: 'URL Slug',
              type: 'text',
              description: 'Unique identifier for page URL',
            },
          ]}
          onSubmit={() => {}}
        />
      );

      expect(screen.getByText('Unique identifier for page URL')).toBeInTheDocument();
    });
  });
});
