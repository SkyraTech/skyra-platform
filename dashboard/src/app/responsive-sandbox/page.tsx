'use client';
import React from 'react';
import { Button, Input, Card } from '@skyra/ui';
import { DynamicForm } from '@skyra/dynamic-form';

export default function SandboxPage() {
  return (
    <div style={{ padding: '1rem', background: 'var(--skyra-background)', minHeight: '100vh' }}>
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.5rem', marginBottom: '1.5rem' }}>
        Fluid Typography & Grid Tester
      </h1>
      <Card style={{ marginBottom: '1.5rem' }}>
        <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem' }}>
          Resize the viewport from the parent studio to observe how grid columns collapse and typography scales.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button>Primary</Button>
          <Button variant="outline">Secondary</Button>
        </div>
      </Card>
      
      <DynamicForm 
        fieldsets={[
          {
            title: 'Responsive Grid Form',
            fields: [
              { key: 'f1', label: 'First Name', type: 'text' },
              { key: 'f2', label: 'Last Name', type: 'text' },
              { key: 'f3', label: 'Email', type: 'email' },
            ]
          }
        ]}
        values={{}}
        errors={{}}
        onChange={() => {}}
        onSubmit={() => {}}
      />
    </div>
  );
}
