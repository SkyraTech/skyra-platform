'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Card, Badge, SearchInput, EmptyState } from '@/components/ui';
import '@skyra-tech-platform/button';
import type { PackageMetadata, LifecycleStatus, RuntimeCategory } from '../../../docs-system/metadata';
import { PackageSearch, Code2, AlertCircle, Box, Terminal, Cpu } from 'lucide-react';

interface PackagesClientProps {
  initialPackages: PackageMetadata[];
}

export default function PackagesClient({ initialPackages }: PackagesClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LifecycleStatus | 'all'>('all');
  const [runtimeFilter, setRuntimeFilter] = useState<RuntimeCategory | 'all'>('all');

  const filteredPackages = useMemo(() => {
    return initialPackages.filter(pkg => {
      // 1. Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = pkg.name.toLowerCase().includes(query);
        const matchesDesc = pkg.description?.toLowerCase().includes(query);
        const matchesNamespace = pkg.id.toLowerCase().includes(query);
        if (!matchesName && !matchesDesc && !matchesNamespace) return false;
      }
      
      // 2. Status Filter
      if (statusFilter !== 'all' && pkg.status !== statusFilter) return false;
      
      // 3. Runtime Filter
      if (runtimeFilter !== 'all' && pkg.runtime !== runtimeFilter) return false;

      return true;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [initialPackages, searchQuery, statusFilter, runtimeFilter]);

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'all' || runtimeFilter !== 'all';

  const clearFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setRuntimeFilter('all');
  };

  const getStatusColor = (status: LifecycleStatus) => {
    switch (status) {
      case 'stable': return 'success';
      case 'experimental': return 'warning';
      case 'deprecated': return 'danger';
      case 'removed': return 'danger';
      default: return 'neutral';
    }
  };

  const getRuntimeIcon = (runtime: RuntimeCategory) => {
    switch (runtime) {
      case 'runtime-neutral': return <Box size={14} />;
      case 'react-browser': return <Code2 size={14} />;
      case 'design-tokens': return <Terminal size={14} />;
      case 'mixed': return <Cpu size={14} />;
      default: return <Box size={14} />;
    }
  };

  const getRuntimeLabel = (runtime: RuntimeCategory) => {
    switch (runtime) {
      case 'runtime-neutral': return 'Neutral Runtime';
      case 'react-browser': return 'React / DOM';
      case 'design-tokens': return 'Design Tokens';
      case 'mixed': return 'Mixed Context';
      default: return runtime;
    }
  };

  return (
    <div className="dash-page" style={{ padding: '2.5rem 2rem', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Editorial Header */}
      <header style={{ borderBottom: '1px solid var(--skyra-border)', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '2.25rem', color: 'var(--skyra-text)', margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
              Platform Packages
            </h1>
            <p style={{ color: 'var(--skyra-text-muted)', fontSize: '1.05rem', margin: 0, maxWidth: '640px', lineHeight: 1.6 }}>
              Discover and consume modular capabilities from the Skyra Platform. These packages form the foundation of our composable architecture, providing highly cohesive and reusable primitives.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ padding: '0.75rem 1.25rem', background: 'var(--skyra-surface)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--skyra-primary)' }}>{initialPackages.length}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--skyra-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</span>
            </div>
            <div style={{ padding: '0.75rem 1.25rem', background: 'var(--skyra-surface)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--skyra-success)' }}>{initialPackages.filter(p => p.status === 'stable').length}</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--skyra-text-subtle)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stable</span>
            </div>
          </div>
        </div>
      </header>

      {/* Discovery Toolbar */}
      <section style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center', background: 'var(--skyra-surface)', padding: '1rem', borderRadius: 'var(--skyra-radius-lg)', border: '1px solid var(--skyra-border)' }}>
        <div style={{ flex: '1 1 300px', minWidth: '240px' }}>
          <SearchInput 
            placeholder="Search by package name, namespace or description..." 
            value={searchQuery}
            onChange={(e: any) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value as any)}
            style={{ padding: '0.5rem 2rem 0.5rem 1rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)', fontSize: '0.875rem', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="all">All Statuses</option>
            <option value="stable">Stable</option>
            <option value="experimental">Experimental</option>
            <option value="deprecated">Deprecated</option>
          </select>

          <select 
            value={runtimeFilter} 
            onChange={(e) => setRuntimeFilter(e.target.value as any)}
            style={{ padding: '0.5rem 2rem 0.5rem 1rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', background: 'var(--skyra-bg)', color: 'var(--skyra-text)', fontSize: '0.875rem', cursor: 'pointer', appearance: 'none' }}
          >
            <option value="all">All Runtimes</option>
            <option value="runtime-neutral">Neutral Runtime</option>
            <option value="react-browser">React / DOM</option>
            <option value="design-tokens">Design Tokens</option>
            <option value="mixed">Mixed Context</option>
          </select>
          
          {hasActiveFilters && (
            <skyra-tech-button variant="ghost" size="sm" onClick={clearFilters} style={{ marginLeft: '0.5rem' }}>
              Clear Filters
            </skyra-tech-button>
          )}
        </div>
      </section>

      {/* Grid Status / Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', color: 'var(--skyra-text-muted)', padding: '0 0.5rem' }}>
        <span>Showing <strong>{filteredPackages.length}</strong> {filteredPackages.length === 1 ? 'package' : 'packages'}</span>
      </div>

      {/* Package Grid */}
      {filteredPackages.length > 0 ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', 
          gap: '1.5rem',
          alignItems: 'stretch'
        }}>
          {filteredPackages.map((pkg) => (
            <Link key={pkg.id} href={`/packages/${pkg.id.split('/').pop()}`} style={{ textDecoration: 'none', display: 'flex' }}>
              <Card 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '1.75rem', 
                  width: '100%',
                  transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  boxShadow: 'var(--skyra-shadow-sm)',
                  cursor: 'pointer',
                  border: '1px solid var(--skyra-border)'
                }}
                className="package-card"
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 700, color: 'var(--skyra-text)', lineHeight: 1.3, wordBreak: 'break-word' }}>
                    {pkg.name}
                  </h3>
                  <Badge variant={getStatusColor(pkg.status)} size="sm" style={{ flexShrink: 0 }}>
                    {pkg.status}
                  </Badge>
                </div>
                
                {/* Metadata Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-mono, monospace)', background: 'var(--skyra-bg)', padding: '0.125rem 0.375rem', borderRadius: '4px', border: '1px solid var(--skyra-border-subtle)' }}>
                    v{pkg.version}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: 'var(--skyra-text-subtle)', fontSize: '0.8125rem' }}>
                    {getRuntimeIcon(pkg.runtime)}
                    <span>{getRuntimeLabel(pkg.runtime)}</span>
                  </div>
                </div>

                {/* Description */}
                <p style={{ 
                  fontSize: '0.9375rem', 
                  color: 'var(--skyra-text-muted)', 
                  margin: '0 0 2rem 0', 
                  lineHeight: 1.6,
                  flex: 1
                }}>
                  {pkg.description || 'Core platform capability providing specialized functionality.'}
                </p>
                
                {/* Footer Action */}
                <div style={{ 
                  marginTop: 'auto', 
                  paddingTop: '1.25rem', 
                  borderTop: '1px solid var(--skyra-border)', 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', color: 'var(--skyra-text-subtle)', fontSize: '0.8125rem' }}>
                    <span><strong>{pkg.exports?.length || 0}</strong> exports</span>
                  </div>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-primary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="view-details-link">
                    View Details &rarr;
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<PackageSearch size={48} />}
          title="No packages found"
          description={hasActiveFilters ? "We couldn't find any packages matching your specific search and filter criteria." : "There are currently no packages available in the registry."}
          action={hasActiveFilters ? <skyra-tech-button onClick={clearFilters} variant="outline">Clear all filters</skyra-tech-button> : undefined}
          style={{ padding: '4rem 2rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-lg)' }}
        />
      )}

      {/* Inject hover styles */}
      <style>{`
        .package-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--skyra-shadow-md);
          border-color: var(--skyra-primary-alpha-30);
        }
        .package-card:hover .view-details-link {
          color: var(--skyra-primary-hover);
        }
        /* Custom select styling pseudo elements */
        select {
          background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
          background-repeat: no-repeat;
          background-position: right 0.5rem center;
          background-size: 1em;
        }
      `}</style>
    </div>
  );
}
