'use client';

import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  hideToolbar?: boolean;
  hideCopyButton?: boolean;
}

export function CodeBlock({ code, language = 'html', hideToolbar = false, hideCopyButton = false }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyButton = (
    <button 
      onClick={handleCopy}
      style={{ 
        background: 'rgba(255,255,255,0.05)', 
        border: '1px solid rgba(255,255,255,0.1)', 
        cursor: 'pointer', 
        color: copied ? 'var(--skyra-success)' : 'var(--skyra-text-muted)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.35rem',
        padding: '0.3rem 0.6rem', 
        borderRadius: 'var(--skyra-radius-sm)',
        fontFamily: 'inherit',
        fontSize: '0.75rem',
        fontWeight: 600,
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(4px)'
      }}
      aria-label="Copy code"
      onMouseEnter={(e) => { 
        if (!copied) {
          e.currentTarget.style.color = 'var(--skyra-text)'; 
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; 
        }
      }}
      onMouseLeave={(e) => { 
        if (!copied) {
          e.currentTarget.style.color = 'var(--skyra-text-muted)'; 
          e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; 
        }
      }}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );

  return (
    <div style={{ 
      position: 'relative', 
      background: '#0d1117', // Enforce dark background for code
      border: '1px solid var(--skyra-border)', 
      borderRadius: 'var(--skyra-radius-md)', 
      marginBottom: '1.5rem',
      overflow: 'hidden',
      boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.2)'
    }}>
      {!hideToolbar && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          background: 'rgba(255,255,255,0.02)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span style={{ 
              fontSize: '0.65rem', 
              fontWeight: 700, 
              color: 'rgba(255,255,255,0.5)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.05em' 
            }}>
              {language}
            </span>
          </div>
          {copyButton}
        </div>
      )}
      
      {/* Floating copy button if toolbar is hidden */}
      {(hideToolbar && !hideCopyButton) && (
        <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
          {copyButton}
        </div>
      )}

      <pre style={{ 
        margin: 0, 
        padding: hideToolbar && !hideCopyButton ? '2.5rem 1rem 1rem 1rem' : '1rem', 
        fontSize: '0.875rem', 
        lineHeight: 1.6,
        overflowX: 'auto', 
        color: '#e6edf3', // Enforce light text
        fontFamily: 'var(--skyra-font-mono)'
      }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
