'use client';

import React from 'react';
import { Check, X } from 'lucide-react';

interface UsageGuidanceProps {
  doItems: React.ReactNode[];
  dontItems: React.ReactNode[];
}

export function UsageGuidance({ doItems, dontItems }: UsageGuidanceProps) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '1.5rem',
      marginBottom: '3rem'
    }}>
      {/* When to use */}
      <div style={{ 
        background: 'var(--skyra-surface)', 
        border: '1px solid var(--skyra-border)', 
        borderTop: '3px solid var(--skyra-success)',
        borderRadius: 'var(--skyra-radius-md)',
        padding: '1.5rem',
        boxShadow: 'var(--skyra-shadow-sm)'
      }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
          When to use
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {doItems.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--skyra-text)', lineHeight: 1.5 }}>
              <Check size={16} strokeWidth={3} style={{ color: 'var(--skyra-success)', flexShrink: 0, marginTop: '0.125rem' }} />
              <div>{item}</div>
            </li>
          ))}
        </ul>
      </div>

      {/* When not to use */}
      <div style={{ 
        background: 'var(--skyra-surface)', 
        border: '1px solid var(--skyra-border)', 
        borderTop: '3px solid var(--skyra-danger)',
        borderRadius: 'var(--skyra-radius-md)',
        padding: '1.5rem',
        boxShadow: 'var(--skyra-shadow-sm)'
      }}>
        <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
          When not to use
        </h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {dontItems.map((item, idx) => (
            <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', fontSize: '0.875rem', color: 'var(--skyra-text)', lineHeight: 1.5 }}>
              <X size={16} strokeWidth={3} style={{ color: 'var(--skyra-danger)', flexShrink: 0, marginTop: '0.125rem' }} />
              <div>{item}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
