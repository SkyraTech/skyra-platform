'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Package, Layout, FileCode2, Palette, Accessibility, Smartphone, Layers, FileJson, Zap, FileText } from 'lucide-react';
import { docsRegistry } from '../../docs-system/registry';
import { bootstrapRegistry } from '../../docs-system/bootstrap';
import { buildSearchIndex, searchDocumentation, SearchDocument } from '../../docs-system/search';
import { Badge } from '@skyra/ui';

// Map result types to icons and colors
const TypeConfig = {
  package: { icon: Package, color: 'var(--skyra-primary)' },
  capability: { icon: Layout, color: 'var(--skyra-cyan)' },
  api: { icon: FileCode2, color: 'var(--skyra-orange)' },
  example: { icon: Zap, color: 'var(--skyra-warning)' },
  token: { icon: Palette, color: 'var(--skyra-success)' },
  accessibility: { icon: Accessibility, color: 'var(--skyra-info)' },
  responsive: { icon: Smartphone, color: 'var(--skyra-text)' },
  pattern: { icon: Layers, color: 'var(--skyra-text-muted)' },
  foundation: { icon: FileJson, color: 'var(--skyra-text-subtle)' },
  release: { icon: Package, color: 'var(--skyra-success)' },
  change: { icon: FileText, color: 'var(--skyra-primary)' },
} as const;

export function SearchDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Initialize search index on demand
  const searchIndex = useMemo(() => {
    if (!isOpen) return [];
    try {
      bootstrapRegistry(); // Safe to call multiple times
      return buildSearchIndex();
    } catch (e) {
      console.error('Failed to initialize search index', e);
      return [];
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query) return [];
    return searchDocumentation(query, searchIndex).slice(0, 20); // limit to 20
  }, [query, searchIndex]);

  // Handle keyboard shortcuts to open
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

  // Handle focus when opened
  useEffect(() => {
    if (isOpen) {
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden'; // prevent background scrolling
    } else {
      setQuery('');
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current && isOpen) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
         // simple scrollIntoView for accessibility & UX
         activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  const handleNavigate = useCallback((href: string) => {
    setIsOpen(false);
    router.push(href);
  }, [router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev + 1) % (results.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev - 1 + (results.length || 1)) % (results.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[activeIndex]) {
        handleNavigate(results[activeIndex].href);
      }
    }
  };

  const EmptyState = () => (
    <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--skyra-text-muted)' }}>
      {query ? (
        <>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 500, color: 'var(--skyra-text)' }}>No documentation found</p>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>Try searching for:</p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <li>• a package name (e.g. ui, data-table)</li>
            <li>• component name (e.g. Button)</li>
            <li>• API name (e.g. generateQRCode)</li>
            <li>• keyword (e.g. accessibility, dark mode)</li>
          </ul>
        </>
      ) : (
        <div style={{ textAlign: 'left' }}>
          <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: 'var(--skyra-text)' }}>Popular Documentation</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {searchIndex.filter(d => ['page-design-system', 'page-accessibility', 'page-responsive', '@skyra/ui', '@skyra/data-table'].includes(d.id)).map((doc, idx) => {
              const Icon = TypeConfig[doc.type as keyof typeof TypeConfig]?.icon || FileCode2;
              return (
                <button
                  key={doc.id}
                  onClick={() => handleNavigate(doc.href)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem',
                    background: 'transparent', border: '1px solid var(--skyra-border)',
                    borderRadius: 'var(--skyra-radius-md)', cursor: 'pointer', textAlign: 'left',
                    color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-body)'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.background = 'var(--skyra-bg-muted)')}
                  onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <Icon size={18} style={{ color: TypeConfig[doc.type as keyof typeof TypeConfig]?.color }} />
                  <div>
                    <div style={{ fontWeight: 500 }}>{doc.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>{doc.type}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Search documentation"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          background: 'var(--skyra-bg)',
          border: '1px solid var(--skyra-border)',
          borderRadius: 'var(--skyra-radius-md)',
          color: 'var(--skyra-text)',
          cursor: 'pointer',
          fontFamily: 'var(--skyra-font-body)',
          fontSize: '0.875rem',
          width: '100%',
          maxWidth: '320px',
          transition: 'all var(--skyra-duration-fast) var(--skyra-ease-default)'
        }}
      >
        <Search size={16} />
        <span style={{ flex: 1, textAlign: 'left' }}>Search documentation...</span>
        <kbd style={{ 
          fontFamily: 'var(--skyra-font-mono)', 
          fontSize: '0.75rem', 
          background: 'var(--skyra-surface)', 
          padding: '0.125rem 0.375rem', 
          borderRadius: '4px',
          border: '1px solid var(--skyra-border)' 
        }}>
          {typeof window !== 'undefined' && window.navigator.platform.includes('Mac') ? '⌘ K' : 'Ctrl K'}
        </kbd>
      </button>

      {isOpen && (
        <div 
          role="dialog"
          aria-modal="true"
          aria-label="Search Documentation"
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: 'var(--skyra-z-modal, 200)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '4rem 1rem',
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsOpen(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '640px',
              background: 'var(--skyra-surface)',
              borderRadius: 'var(--skyra-radius-lg)',
              boxShadow: 'var(--skyra-shadow-lg)',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: 'calc(100vh - 8rem)',
              border: '1px solid var(--skyra-border)',
              overflow: 'hidden'
            }}
          >
            {/* Search Input Header */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--skyra-border)' }}>
              <Search size={20} style={{ color: 'var(--skyra-text-muted)', marginRight: '1rem' }} />
              <input
                ref={inputRef}
                value={query}
                onChange={e => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search packages, components, guides..."
                aria-label="Search query"
                style={{
                  flex: 1,
                  border: 'none',
                  background: 'transparent',
                  outline: 'none',
                  fontSize: '1.125rem',
                  color: 'var(--skyra-text)',
                  fontFamily: 'var(--skyra-font-body)'
                }}
              />
              <button 
                onClick={() => setIsOpen(false)}
                aria-label="Close search"
                style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  padding: '0.25rem', color: 'var(--skyra-text-muted)',
                  borderRadius: 'var(--skyra-radius-sm)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Results List */}
            <div 
              style={{ flex: 1, overflowY: 'auto', padding: '0.5rem' }}
            >
              {results.length > 0 ? (
                <div role="listbox" aria-label="Search Results" ref={listRef}>
                  {results.map((doc, idx) => {
                    const isActive = idx === activeIndex;
                  const Icon = TypeConfig[doc.type as keyof typeof TypeConfig]?.icon || FileCode2;
                  
                  return (
                    <div
                      key={doc.id}
                      role="option"
                      aria-selected={isActive}
                      onClick={() => handleNavigate(doc.href)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '1rem',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--skyra-radius-md)',
                        cursor: 'pointer',
                        background: isActive ? 'var(--skyra-primary-light)' : 'transparent',
                        borderLeft: isActive ? '3px solid var(--skyra-primary)' : '3px solid transparent',
                      }}
                    >
                      <div style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', 
                        width: '32px', height: '32px', 
                        borderRadius: 'var(--skyra-radius-sm)',
                        background: 'var(--skyra-surface)', 
                        border: '1px solid var(--skyra-border)',
                        color: TypeConfig[doc.type as keyof typeof TypeConfig]?.color 
                      }}>
                        <Icon size={16} />
                      </div>
                      
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--skyra-text)' }}>{doc.title}</span>
                          {doc.status === 'deprecated' && <Badge variant="danger" size="sm">Deprecated</Badge>}
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>
                          <span style={{ textTransform: 'capitalize', fontWeight: 500 }}>{doc.type}</span>
                          {doc.packageId && (
                            <>
                              <span>•</span>
                              <span style={{ fontFamily: 'var(--skyra-font-mono)' }}>{doc.packageId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                </div>
              ) : (
                <EmptyState />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
