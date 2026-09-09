'use client';
import React, { useState } from 'react';
import { DynamicForm } from '@skyra/dynamic-form';
import { FieldsetSchema } from '@skyra/dynamic-form';
import { Alert } from '@skyra/ui';

// Dummy validation (mimicking Zod without requiring the actual parsing in the demo UI)
const validate = (values: Record<string, any>) => {
  const errors: Record<string, string> = {};
  if (!values.firstName) errors.firstName = 'First name is required';
  if (!values.lastName) errors.lastName = 'Last name is required';
  if (!values.email || !/\S+@\S+\.\S+/.test(values.email)) errors.email = 'Valid email is required';
  if (values.status === '') errors.status = 'Status is required';
  return errors;
};

const FORM_SCHEMA: FieldsetSchema[] = [
  {
    title: 'Personal Information',
    fields: [
      { key: 'firstName', label: 'First Name', type: 'text', required: true, placeholder: 'Jane' },
      { key: 'lastName', label: 'Last Name', type: 'text', required: true, placeholder: 'Doe' },
      { key: 'email', label: 'Email Address', type: 'email', required: true, placeholder: 'jane@example.com' },
      { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+1 (555) 000-0000', helper: 'Optional contact number' },
    ]
  },
  {
    title: 'Account Settings',
    fields: [
      { key: 'status', label: 'Account Status', type: 'select', required: true, options: [
        { value: '', label: 'Select status...' },
        { value: 'active', label: 'Active' },
        { value: 'suspended', label: 'Suspended' }
      ]},
      { key: 'notifications', label: 'Enable email notifications', type: 'checkbox' },
      { key: 'bio', label: 'Biography', type: 'textarea', placeholder: 'Tell us about yourself...', helper: 'Max 500 characters' }
    ]
  },
  {
    title: 'Danger Zone',
    
    fields: [
      { key: 'deleteConfirm', label: 'I understand that deleting this account is permanent', type: 'checkbox' }
    ]
  }
];

export default function DynamicFormPage() {
  const [values, setValues] = useState<Record<string, any>>({ notifications: true, status: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    const validationErrors = validate(values);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  const handleChange = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  return (
    <div className="dash-page" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        Dynamic Form Showcase
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem' }}>
        Interactive demonstration of <code>DynamicForm</code>. Showcases 2-column responsive layout, fieldsets, validation states, and the Danger Zone.
      </p>

      {success && (
        <div style={{ marginBottom: '2rem' }}>
          <Alert variant="success" title="Profile Updated" onDismiss={() => setSuccess(false)}>
            The account profile has been successfully saved.
          </Alert>
        </div>
      )}

      <DynamicForm 
        fieldsets={FORM_SCHEMA}
        values={values}
        errors={errors}
        onChange={handleChange}
        onSubmit={() => handleSubmit(new Event('submit') as any)}
        isLoading={loading}
        submitLabel="Save Profile"
      />
    </div>
  );
}
