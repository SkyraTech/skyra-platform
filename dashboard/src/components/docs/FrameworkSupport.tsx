'use client';

import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface Framework {
  name: string;
  support: 'e2e' | 'architecture' | 'unsupported';
  integration: React.ReactNode;
}

interface FrameworkSupportProps {
  frameworks: Framework[];
}

export function FrameworkSupport({ frameworks }: FrameworkSupportProps) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ 
        overflowX: 'auto', 
        border: '1px solid var(--skyra-border)', 
        borderRadius: 'var(--skyra-radius-md)',
        background: 'var(--skyra-surface)',
        boxShadow: 'var(--skyra-shadow-sm)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
          <thead>
            <tr style={{ background: 'var(--skyra-bg-muted)', borderBottom: '1px solid var(--skyra-border)' }}>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Framework</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
              <th style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Integration</th>
            </tr>
          </thead>
          <tbody>
            {frameworks.map((fw, i) => (
              <tr 
                key={i} 
                style={{ borderBottom: i === frameworks.length - 1 ? 'none' : '1px solid var(--skyra-border)' }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.015)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '1.25rem 1rem', verticalAlign: 'top', width: '20%' }}>
                  <strong style={{ fontSize: '0.875rem', color: 'var(--skyra-text)' }}>{fw.name}</strong>
                </td>
                <td style={{ padding: '1.25rem 1rem', verticalAlign: 'top', width: '25%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {fw.support === 'e2e' ? (
                      <>
                        <CheckCircle2 size={16} style={{ color: 'var(--skyra-success)' }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--skyra-success)' }}>Native</span>
                      </>
                    ) : fw.support === 'architecture' ? (
                      <>
                        <CheckCircle2 size={16} style={{ color: 'var(--skyra-warning)' }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--skyra-warning)' }}>Compatible</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle size={16} style={{ color: 'var(--skyra-danger)' }} />
                        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--skyra-danger)' }}>Unsupported</span>
                      </>
                    )}
                  </div>
                </td>
                <td style={{ padding: '1.25rem 1rem', verticalAlign: 'top', fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
                  {fw.integration}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
