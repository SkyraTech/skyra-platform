import React from 'react';
import { Card, Badge, Button } from '@skyra/ui';
import { docsRegistry } from '../../../docs-system/registry';
import { bootstrapRegistry } from '../../../docs-system/bootstrap';
import type { PackageMetadata } from '../../../docs-system/metadata';
import Link from 'next/link';

// Initialize the registry for SSR/SSG.
bootstrapRegistry();

export const metadata = { title: 'Packages — Skyra Platform' };

export default function PackagesPage() {
  const packages = docsRegistry.getPackages();

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Platform Packages
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Discover and consume modular capabilities from the Skyra Platform.
          These packages are distributed via the registry and form the foundation of our composable architecture.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {packages.map((pkg: PackageMetadata) => (
          <Card key={pkg.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
                  {pkg.name}
                </h3>
                <Badge variant={pkg.status === 'stable' ? 'success' : pkg.status === 'experimental' ? 'warning' : 'neutral'} size="sm">
                  {pkg.status}
                </Badge>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-subtle)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>
                  v{pkg.version}
                </span>
                <Badge variant="neutral" size="sm">{pkg.runtime}</Badge>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0, minHeight: '40px' }}>
                {pkg.description || 'Core platform capability.'}
              </p>
            </div>
            
            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--skyra-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-subtle)' }}>
                {pkg.exports.length} export(s)
              </span>
              <Link href={`/packages/${pkg.id.replace('@skyra/', '')}`} style={{ textDecoration: 'none' }}>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
