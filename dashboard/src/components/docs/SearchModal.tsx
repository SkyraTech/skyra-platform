'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Package, Layout, FileCode2, Palette, Accessibility, Smartphone, Layers, FileJson, Zap, FileText } from 'lucide-react';
import { bootstrapRegistry } from '../../docs-system/bootstrap';
import { buildSearchIndex, searchDocumentation } from '../../docs-system/search';
import { Badge } from '../ui/Badge';

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

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const searchIndex = useMemo(() => {
    if (!isOpen) return [];
    try {
      bootstrapRegistry();
      return buildSearchIndex();
    } catch (e) {
      console.error('Failed to initialize search index', e);
      return [];
    }
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query) return [];
    return searchDocumentation(query, searchIndex).slice(0, 20);
  }, [query, searchIndex]);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      setActiveIndex(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';

      const handleWindowKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      };
      window.addEventListener('keydown', handleWindowKeyDown);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleWindowKeyDown);
      };
    } else {
      setIsAnimating(false);
      setQuery('');
      document.body.style.overflow = '';
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    if (listRef.current && isOpen) {
      const activeEl = listRef.current.children[activeIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex, isOpen]);

  const handleNavigate = useCallback((href: string) => {
    onClose();
    router.push(href);
  }, [onClose, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
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

  if (!isOpen) return null;

  return (
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
        padding: '1rem',
        paddingTop: 'min(15vh, 6rem)',
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        opacity: isAnimating ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}
      onClick={onClose}
    >
      <div 
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'var(--skyra-surface)',
          borderRadius: 'var(--skyra-radius-xl)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: 'calc(100vh - 4rem)',
          border: '1px solid var(--skyra-border)',
          overflow: 'hidden',
          transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(-10px)',
          transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Search Input Header */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--skyra-border)', background: 'var(--skyra-bg-muted)' }}>
          <Search size={22} style={{ color: 'var(--skyra-primary)', marginRight: '1rem' }} />
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
              fontFamily: 'var(--skyra-font-body)',
              fontWeight: 500
            }}
          />
          <button 
            onClick={onClose}
            aria-label="Close search"
            style={{
              background: 'var(--skyra-bg)', border: '1px solid var(--skyra-border)', cursor: 'pointer',
              padding: '0.35rem', color: 'var(--skyra-text-muted)',
              borderRadius: 'var(--skyra-radius-md)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--skyra-text)'; e.currentTarget.style.borderColor = 'var(--skyra-text-muted)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--skyra-text-muted)'; e.currentTarget.style.borderColor = 'var(--skyra-border)'; }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Results List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0.75rem' }}>
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
                      alignItems: 'center',
                      gap: '1rem',
                      padding: '0.875rem 1rem',
                      borderRadius: 'var(--skyra-radius-md)',
                      cursor: 'pointer',
                      background: isActive ? 'var(--skyra-primary-light)' : 'transparent',
                      borderLeft: isActive ? '3px solid var(--skyra-primary)' : '3px solid transparent',
                      transition: 'background 0.1s ease',
                    }}
                  >
                    <div style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', 
                      width: '36px', height: '36px', 
                      borderRadius: 'var(--skyra-radius-md)',
                      background: isActive ? 'var(--skyra-surface)' : 'var(--skyra-bg-muted)', 
                      border: '1px solid var(--skyra-border)',
                      color: TypeConfig[doc.type as keyof typeof TypeConfig]?.color 
                    }}>
                      <Icon size={18} />
                    </div>
                    
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--skyra-text)', fontSize: '0.9375rem' }}>{doc.title}</span>
                        {doc.status === 'deprecated' && <Badge variant="danger" size="sm">Deprecated</Badge>}
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>
                        <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{doc.type}</span>
                        {doc.packageId && (
                          <>
                            <span style={{ opacity: 0.5 }}>•</span>
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
                  <p style={{ margin: '0 0 1rem 0', fontWeight: 600, color: 'var(--skyra-text)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Popular Documentation</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {searchIndex.filter(d => ['page-design-system', 'page-accessibility', 'page-components', '@skyra-tech-platform/button', '@skyra/ui', '@skyra/data-table'].includes(d.id)).slice(0, 5).map((doc) => {
                      const Icon = TypeConfig[doc.type as keyof typeof TypeConfig]?.icon || FileCode2;
                      return (
                        <button
                          key={doc.id}
                          onClick={() => handleNavigate(doc.href)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem',
                            background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)',
                            borderRadius: 'var(--skyra-radius-md)', cursor: 'pointer', textAlign: 'left',
                            color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-body)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--skyra-primary)'; e.currentTarget.style.background = 'var(--skyra-bg-muted)'; }}
                          onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--skyra-border)'; e.currentTarget.style.background = 'var(--skyra-surface)'; }}
                        >
                          <Icon size={18} style={{ color: TypeConfig[doc.type as keyof typeof TypeConfig]?.color }} />
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{doc.title}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', textTransform: 'capitalize' }}>{doc.type}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div style={{ padding: '0.75rem 1.5rem', borderTop: '1px solid var(--skyra-border)', background: 'var(--skyra-bg-muted)', display: 'flex', gap: '1.5rem', fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><kbd style={{ padding: '2px 6px', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '4px', fontFamily: 'inherit' }}>↵</kbd> to select</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><kbd style={{ padding: '2px 6px', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '4px', fontFamily: 'inherit' }}>↓</kbd> <kbd style={{ padding: '2px 6px', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '4px', fontFamily: 'inherit' }}>↑</kbd> to navigate</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}><kbd style={{ padding: '2px 6px', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: '4px', fontFamily: 'inherit' }}>esc</kbd> to close</span>
        </div>
      </div>
    </div>
  );
}
