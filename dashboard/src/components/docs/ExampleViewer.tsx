'use client';

import React, { useState } from 'react';
import { Card, Button } from '@skyra/ui';
import type { ExampleMetadata } from '../../docs-system/metadata';
// We import the static mapping of IDs to components
import { exampleComponents } from '../../docs-system/example-components';
import { Code, Eye } from 'lucide-react';

interface ExampleViewerProps {
  example: ExampleMetadata;
}

export function ExampleViewer({ example }: ExampleViewerProps) {
  const [view, setView] = useState<'preview' | 'code'>('preview');

  // Statically resolve the component using the trusted mapping
  const Component = exampleComponents[example.id];

  return (
    <Card style={{ overflow: 'hidden', border: '1px solid var(--skyra-border)', marginBottom: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderBottom: '1px solid var(--skyra-border)', background: 'var(--skyra-bg-muted)' }}>
        <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
          {example.title}
        </h3>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Button 
            variant={view === 'preview' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setView('preview')}
          >
            <Eye size={14} style={{ marginRight: '0.375rem' }} />
            Preview
          </Button>
          <Button 
            variant={view === 'code' ? 'primary' : 'outline'} 
            size="sm" 
            onClick={() => setView('code')}
          >
            <Code size={14} style={{ marginRight: '0.375rem' }} />
            Code
          </Button>
        </div>
      </div>

      <div style={{ padding: '1.5rem', background: view === 'preview' ? 'var(--skyra-bg)' : 'var(--skyra-bg-muted)', overflowX: 'auto' }}>
        {view === 'preview' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Component ? <Component /> : (
              <div style={{ color: 'var(--skyra-text-muted)' }}>
                This is a runtime-neutral example or the component mapping is missing.
                See the Code tab for implementation details.
              </div>
            )}
          </div>
        ) : (
          <pre style={{ margin: 0, fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
            <code>{example.source}</code>
          </pre>
        )}
      </div>
    </Card>
  );
}
