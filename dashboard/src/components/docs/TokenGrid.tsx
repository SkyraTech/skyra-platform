'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export interface Token {
  name: string;
  variable: string;
  value?: string;
}

export interface TokenGroup {
  category: string;
  tokens: Token[];
}

interface TokenGridProps {
  groups: TokenGroup[];
}

export function TokenGrid({ groups }: TokenGridProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  const handleCopy = (variable: string) => {
    navigator.clipboard.writeText(variable);
    setCopiedVar(variable);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', marginBottom: '4rem' }}>
      {groups.map((group, gIdx) => (
        <div key={gIdx}>
          <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1rem', borderBottom: '1px solid var(--skyra-border)', paddingBottom: '0.5rem' }}>
            {group.category}
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1rem' }}>
            {group.tokens.map((token, tIdx) => {
              const isCopied = copiedVar === token.variable;
              return (
                <div key={tIdx} style={{ 
                  display: 'flex', flexDirection: 'column', gap: '0.75rem', 
                  padding: '1.25rem', background: 'var(--skyra-surface)', 
                  border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)',
                  boxShadow: 'var(--skyra-shadow-sm)', transition: 'border-color 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--skyra-text-muted)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--skyra-border)'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {token.value && group.category.toLowerCase().includes('color') && (
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: `var(${token.variable})`, border: '1px solid rgba(0,0,0,0.1)' }} />
                    )}
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)' }}>{token.name}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-mono)' }}>
                      {token.variable}
                    </code>
                    <button 
                      onClick={() => handleCopy(token.variable)}
                      aria-label="Copy token variable"
                      style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer',
                        color: isCopied ? 'var(--skyra-success)' : 'var(--skyra-text-subtle)',
                        display: 'flex', alignItems: 'center', padding: '0.2rem',
                        transition: 'color 0.15s'
                      }}
                      onMouseEnter={e => { if (!isCopied) e.currentTarget.style.color = 'var(--skyra-text)'; }}
                      onMouseLeave={e => { if (!isCopied) e.currentTarget.style.color = 'var(--skyra-text-subtle)'; }}
                    >
                      {isCopied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
