import { Card } from '@/components/ui';;
import Link from 'next/link';
import { docsRegistry } from '../../../docs-system/registry';
import { bootstrapRegistry } from '../../../docs-system/bootstrap';

export const metadata = { title: 'Overview — Skyra Platform Dashboard' };

export default function OverviewPage() {
  bootstrapRegistry();
  const packages = docsRegistry.getPackages();

  const getLayer = (id: string) => {
    if (['@skyra-tech-platform/design-tokens', '@skyra-tech-platform/utils', '@skyra-tech-platform/validation'].includes(id)) return 'Layer 1';
    if (['@skyra/ui', '@skyra-tech-platform/app-shell', '@skyra/dialogs', '@skyra/data-table', '@skyra-tech-platform/dynamic-form'].includes(id)) return 'Layer 2';
    if (['@skyra-tech-platform/data-export', '@skyra-tech-platform/qr'].includes(id)) return 'Layer 3';
    return 'Layer 3';
  };

  const layerOrder: Record<string, number> = { 'Layer 1': 1, 'Layer 2': 2, 'Layer 3': 3, 'Other': 4 };

  const sortedPackages = packages
    .filter(pkg => pkg.id !== '@skyra/invoice')
    .sort((a, b) => {
      const layerA = getLayer(a.id);
      const layerB = getLayer(b.id);
      if (layerOrder[layerA] !== layerOrder[layerB]) {
        return (layerOrder[layerA] || 4) - (layerOrder[layerB] || 4);
      }
      return a.id.localeCompare(b.id);
    });

  return (
    <div className="dash-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
          Skyra Platform
        </h1>
        <p style={{ color: 'var(--skyra-text)', fontSize: '1rem', maxWidth: '640px', opacity: 0.8 }}>
          Reusable UI foundation for Skyra applications. Visual behavior and design references are derived from the read-only <strong>skyra-erp</strong> source of truth.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {sortedPackages.map((pkg) => {
          const layer = getLayer(pkg.id);
          const status = pkg.status === 'stable' ? 'Ready' : pkg.status;
          const route = `/packages/${pkg.id.replace(/^@skyra(-tech-platform)?\//, '')}`;
          
          return (
            <Link key={pkg.id} href={route} style={{ textDecoration: 'none', display: 'block' }}>
              <Card size="sm" style={{ height: '100%', transition: 'border-color 0.15s', cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <span style={{
                    color: layer === 'Layer 1' ? 'var(--skyra-text)' : layer === 'Layer 2' ? 'var(--skyra-text)' : 'var(--skyra-text)',
                    background: layer === 'Layer 1' ? 'var(--skyra-success-light)' : layer === 'Layer 2' ? 'var(--skyra-primary-light)' : 'var(--skyra-border)',
                    padding: '0.15rem 0.5rem', borderRadius: 'var(--skyra-radius-full)', fontSize: '0.75rem', fontWeight: 600
                  }}>
                    {layer}
                  </span>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 600,
                    color: 'var(--skyra-text)',
                    textTransform: 'capitalize'
                  }}>
                    {status === 'Ready' ? '✓ ' : '○ '}{status}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.375rem' }}>
                  {pkg.id} <span style={{ opacity: 0.6, fontSize: '0.7rem', marginLeft: '0.25rem' }}>v{pkg.version}</span>
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)' }}>
                  {pkg.description}
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'var(--skyra-primary-light)', borderRadius: 'var(--skyra-radius-lg)', border: '1px solid var(--skyra-primary)', fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
        <strong>ERP Visual Source of Truth:</strong> All design tokens, component visual behavior, spacing, shadows, and
        responsive breakpoints are confirmed from <code>skyra-erp</code> (READ-ONLY). No assumptions.
      </div>
    </div>
  );
}
