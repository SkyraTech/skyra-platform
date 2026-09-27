/**
 * @id dynamic-form-basic
 * @title Basic Dynamic Form
 * @apiId @skyra/dynamic-form::DynamicForm
 * @packageId @skyra/dynamic-form
 */
import React from 'react';
import { DynamicForm } from '@skyra/dynamic-form';

export default function DynamicFormBasicExample() {
  const fields = [
    { id: 'firstName', type: 'text' as const, label: 'First Name', required: true },
    { id: 'lastName', type: 'text' as const, label: 'Last Name' },
    { id: 'email', type: 'text' as const, label: 'Email', required: true }
  ];

  return (
    <div style={{ maxWidth: '400px' }}>
      <DynamicForm 
        fields={fields}
        onSubmit={(data: any) => alert(JSON.stringify(data, null, 2))}
      />
    </div>
  );
}
