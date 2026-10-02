'use client';

import React from 'react';
import { Copy, Check } from 'lucide-react';

interface PackageMetaProps {
  packageName: string;
  elementName?: string;
  type: string;
  version: string;
}

export function PackageMeta({ packageName, elementName, type, version }: PackageMetaProps) {
  const [copiedPkg, setCopiedPkg] = React.useState(false);
  const [copiedElem, setCopiedElem] = React.useState(false);

  const handleCopy = (text: string, isElem: boolean) => {
    navigator.clipboard.writeText(text);
    if (isElem) {
      setCopiedElem(true);
      setTimeout(() => setCopiedElem(false), 2000);
    } else {
      setCopiedPkg(true);
      setTimeout(() => setCopiedPkg(false), 2000);
    }
  };

  const copyButton = (copied: boolean, text: string, isElem: boolean) => (
    <button 
      onClick={() => handleCopy(text, isElem)}
      style={{ 
        background: copied ? 'rgba(var(--skyra-success-rgb, 46, 160, 67), 0.1)' : 'var(--skyra-bg-muted)', 
        border: `1px solid ${copied ? 'rgba(var(--skyra-success-rgb, 46, 160, 67), 0.2)' : 'var(--skyra-border)'}`, 
        cursor: 'pointer', 
        color: copied ? 'var(--skyra-success)' : 'var(--skyra-text-muted)', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.35rem',
        padding: '0.2rem 0.5rem', 
        borderRadius: 'var(--skyra-radius-sm)',
        fontFamily: 'inherit',
        fontSize: '0.6875rem',
        fontWeight: 600,
        transition: 'all 0.15s ease'
      }}
      aria-label={`Copy ${text}`}
      onMouseEnter={(e) => { 
        if (!copied) {
          e.currentTarget.style.color = 'var(--skyra-text)'; 
          e.currentTarget.style.background = 'var(--skyra-surface)';
          e.currentTarget.style.borderColor = 'var(--skyra-text-muted)';
        }
      }}
      onMouseLeave={(e) => { 
        if (!copied) {
          e.currentTarget.style.color = 'var(--skyra-text-muted)'; 
          e.currentTarget.style.background = 'var(--skyra-bg-muted)'; 
          e.currentTarget.style.borderColor = 'var(--skyra-border)';
        }
      }}
    >
      {copied ? <Check size={12} strokeWidth={3} /> : <Copy size={12} strokeWidth={2.5} />}
      <span>{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexWrap: 'wrap',
      padding: '1rem', 
      background: 'var(--skyra-surface)', 
      border: '1px solid var(--skyra-border)', 
      borderLeft: '3px solid var(--skyra-primary)',
      borderRadius: 'var(--skyra-radius-md)', 
      marginBottom: '2rem',
      boxShadow: 'var(--skyra-shadow-sm)'
    }}>
      
      <div style={{ flex: '1 1 min-content', minWidth: '220px', paddingRight: '1.5rem', marginBottom: '0.5rem', overflow: 'hidden' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          Package
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="no-scrollbar">
            <code style={{ color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-mono)', fontSize: '0.875rem' }}>{packageName}</code>
          </div>
          {copyButton(copiedPkg, packageName, false)}
        </div>
      </div>
      
      {elementName && (
        <div style={{ flex: '1 1 min-content', minWidth: '180px', padding: '0 1.5rem', borderLeft: '1px solid var(--skyra-border)', marginBottom: '0.5rem', overflow: 'hidden' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Element
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="no-scrollbar">
              <code style={{ color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-mono)', fontSize: '0.875rem' }}>{elementName}</code>
            </div>
            {copyButton(copiedElem, elementName, true)}
          </div>
        </div>
      )}

      <div style={{ flex: '0 0 auto', padding: '0 1.5rem', borderLeft: '1px solid var(--skyra-border)', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          Type
        </div>
        <div style={{ color: 'var(--skyra-text)', fontSize: '0.875rem', fontWeight: 500, paddingTop: '0.2rem' }}>
          {type}
        </div>
      </div>

      <div style={{ flex: '0 0 auto', paddingLeft: '1.5rem', borderLeft: '1px solid var(--skyra-border)', marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
          Version
        </div>
        <div style={{ color: 'var(--skyra-text)', fontSize: '0.875rem', fontFamily: 'var(--skyra-font-mono)', paddingTop: '0.2rem' }}>
          {version}
        </div>
      </div>
      
      <style>{`
        @media (max-width: 768px) {
          div[style*="borderLeft: '1px solid var(--skyra-border)'"] {
            border-left: none !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            width: 100%;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
}
