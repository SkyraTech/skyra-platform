'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search } from 'lucide-react';

const SearchModal = dynamic(() => import('./SearchModal'), {
  ssr: false,
});

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Search documentation"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 'var(--skyra-radius-full)',
          color: 'rgba(255,255,255,0.8)',
          cursor: 'pointer',
          fontFamily: 'var(--skyra-font-body)',
          fontSize: '0.875rem',
          width: '100%',
          maxWidth: '260px',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
      >
        <Search size={16} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search docs...</span>
        <kbd style={{ 
          fontFamily: 'var(--skyra-font-mono)', 
          fontSize: '0.75rem', 
          background: 'rgba(0,0,0,0.2)', 
          padding: '0.125rem 0.375rem', 
          borderRadius: '100px',
          border: '1px solid rgba(255,255,255,0.05)' 
        }}>
          {typeof window !== 'undefined' && window.navigator.platform.includes('Mac') ? '⌘K' : 'Ctrl+K'}
        </kbd>
      </button>

      {isOpen && <SearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />}
    </>
  );
}
