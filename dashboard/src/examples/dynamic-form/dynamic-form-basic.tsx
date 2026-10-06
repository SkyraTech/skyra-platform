/**
 * @id dynamic-form-basic
 * @title Basic Dynamic Form
 * @apiId @skyra/ui::DynamicForm
 * @packageId @skyra-tech-platform/dynamic-form
 */
import React from 'react';
import '@skyra-tech-platform/dynamic-form';;

export default function DynamicFormBasicExample() {
  const fields = [
    { id: 'firstName', type: 'text' as const, label: 'First Name', required: true },
    { id: 'lastName', type: 'text' as const, label: 'Last Name' },
    { id: 'email', type: 'text' as const, label: 'Email', required: true }
  ];

  return (
    <div style={{ maxWidth: '400px' }}>
      <skyra-tech-dynamic-form 
        fields={fields}
        onSubmit={(data: any) => alert(JSON.stringify(data, null, 2))}
      />
    </div>
  );
}
