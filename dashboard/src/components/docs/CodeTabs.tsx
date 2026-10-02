'use client';

import React, { useState } from 'react';
import { CodeBlock } from './CodeBlock';
import { Copy, Check } from 'lucide-react';

interface Tab {
  label: string;
  code: string;
  language?: string;
}

interface CodeTabsProps {
  tabs: Tab[];
}

export function CodeTabs({ tabs }: CodeTabsProps) {
  const [activeIdx, setActiveIdx] = useState(0);

  const [copied, setCopied] = useState(false);

  if (!tabs || tabs.length === 0) return null;

  const handleCopy = () => {
    const tab = tabs[activeIdx];
    if (tab?.code) {
      navigator.clipboard.writeText(tab.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem', borderRadius: 'var(--skyra-radius-md)', overflow: 'hidden', border: '1px solid var(--skyra-border)' }}>
      {/* Tab Header (Dark themed like codeblock) */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#161b22', // Match github dark header
        padding: '0.4rem 0.6rem',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {tabs.map((tab, idx) => {
            const isActive = activeIdx === idx;
            return (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                style={{
                  background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  border: '1px solid',
                  borderColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isActive ? '#ffffff' : 'rgba(255,255,255,0.6)',
                  padding: '0.25rem 0.6rem',
                  borderRadius: 'var(--skyra-radius-sm)',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  transition: 'all 0.15s ease',
                  fontFamily: 'inherit'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        
        <button 
          onClick={handleCopy}
          style={{ 
            background: 'transparent',
            border: 'none', 
            cursor: 'pointer', 
            color: copied ? 'var(--skyra-success)' : 'rgba(255,255,255,0.6)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem',
            padding: '0.25rem 0.5rem', 
            borderRadius: 'var(--skyra-radius-sm)',
            fontFamily: 'inherit',
            fontSize: '0.75rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          aria-label="Copy code"
          onMouseEnter={(e) => { 
            if (!copied) e.currentTarget.style.color = '#ffffff'; 
          }}
          onMouseLeave={(e) => { 
            if (!copied) e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; 
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
      
      {/* Code Area - use margin removal to blend with header */}
      <div style={{ margin: 0 }}>
        <CodeBlock code={tabs[activeIdx]?.code || ''} language={tabs[activeIdx]?.language || 'html'} hideToolbar={true} hideCopyButton={true} />
      </div>
    </div>
  );
}
