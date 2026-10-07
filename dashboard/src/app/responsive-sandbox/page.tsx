'use client';
import React from 'react';
import { Card } from '@/components/ui';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/input';;
import '@skyra-tech-platform/dynamic-form';;

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
          <skyra-tech-button>Primary</skyra-tech-button>
          <skyra-tech-button variant="outline">Secondary</skyra-tech-button>
        </div>
      </Card>
      
      <skyra-tech-dynamic-form 
        ref={(el: any) => {
          if (el) {
            el.fieldsets = [
              {
                title: 'Responsive Grid Form',
                fields: [
                  { name: 'f1', label: 'First Name', type: 'text' },
                  { name: 'f2', label: 'Last Name', type: 'text' },
                  { name: 'f3', label: 'Email', type: 'email' },
                ]
              }
            ];
          }
        }}
      />
    </div>
  );
}
