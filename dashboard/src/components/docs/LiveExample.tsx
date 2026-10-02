'use client';

import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';

interface LiveExampleProps {
  children: React.ReactNode;
  code?: string;
  language?: string;
  title?: string;
  description?: string;
}

export function LiveExample({ children, code, language = 'html', title, description }: LiveExampleProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <div style={{ 
      border: '1px solid var(--skyra-border)', 
      borderRadius: 'var(--skyra-radius-lg)', 
      overflow: 'hidden', 
      marginBottom: '2rem',
      background: 'var(--skyra-surface)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1rem',
        borderBottom: '1px solid var(--skyra-border)',
        background: 'var(--skyra-bg-muted)'
      }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
            {title || 'Example'}
          </div>
          {description && (
            <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', marginTop: '0.125rem' }}>
              {description}
            </div>
          )}
        </div>
        {code && (
          <button
            onClick={() => setShowCode(!showCode)}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: showCode ? 'var(--skyra-primary)' : 'var(--skyra-text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 500,
              fontFamily: 'inherit',
              transition: 'color 0.15s ease'
            }}
          >
            {showCode ? 'Hide Code' : 'View Code'}
          </button>
        )}
      </div>

      {/* Preview */}
      <div style={{ 
        padding: '2rem 1.5rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'var(--skyra-bg-muted)',
        backgroundImage: 'radial-gradient(var(--skyra-border) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0'
      }}>
        {children}
      </div>

      {/* Code */}
      {showCode && code && (
        <div style={{ borderTop: '1px solid var(--skyra-border)', padding: '1rem', background: 'var(--skyra-bg-muted)' }}>
          <div style={{ marginBottom: '-1.5rem' }}>
            <CodeBlock code={code.trim()} language={language} />
          </div>
        </div>
      )}
    </div>
  );
}
