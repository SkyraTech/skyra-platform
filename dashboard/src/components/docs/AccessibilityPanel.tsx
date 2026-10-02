'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { CodeBlock } from './CodeBlock';

interface AccessibilityPanelProps {
  features: React.ReactNode[];
  codeExample?: {
    code: string;
    language?: string;
  };
}

export function AccessibilityPanel({ features, codeExample }: AccessibilityPanelProps) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: codeExample ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr', 
      gap: '2rem',
      marginBottom: '3rem',
      padding: '2rem',
      background: 'var(--skyra-surface)',
      border: '1px solid var(--skyra-border)',
      borderRadius: 'var(--skyra-radius-lg)',
      boxShadow: 'var(--skyra-shadow-sm)'
    }}>
      <div>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1.25rem' }}>
          Accessibility Features
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {features.map((feature, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
              <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '20px', height: '20px', borderRadius: '50%',
                background: 'rgba(var(--skyra-success-rgb, 46, 160, 67), 0.1)',
                color: 'var(--skyra-success)',
                flexShrink: 0
              }}>
                <Check size={12} strokeWidth={3} />
              </div>
              <span style={{ lineHeight: 1.5 }}>{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      
      {codeExample && (
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1.25rem' }}>
            Usage Example
          </h4>
          <div style={{ flex: 1 }}>
            <CodeBlock code={codeExample.code} language={codeExample.language || 'html'} hideToolbar={true} />
          </div>
        </div>
      )}
    </div>
  );
}
