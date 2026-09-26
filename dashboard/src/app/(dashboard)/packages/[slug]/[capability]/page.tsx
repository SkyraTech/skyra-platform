import React from 'react';
import { Card, Badge, Button } from '@skyra/ui';
import { docsRegistry } from '../../../../../docs-system/registry';
import { bootstrapRegistry } from '../../../../../docs-system/bootstrap';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Box, Code } from 'lucide-react';

bootstrapRegistry();

export async function generateStaticParams() {
  const capabilities = docsRegistry.getCapabilities();
  return capabilities.map((cap) => {
    const pkgSlug = cap.packageId.replace('@skyra/', '');
    const capSlug = cap.id.split('/')[1];
    return { slug: pkgSlug, capability: capSlug };
  });
}

export function generateMetadata({ params }: { params: { slug: string, capability: string } }) {
  const capId = `${params.slug}/${params.capability}`;
  const cap = docsRegistry.getCapability(capId);
  
  if (!cap) {
    return { title: 'Capability Not Found' };
  }

  return { title: `${cap.name} — Skyra Platform` };
}

export default function CapabilityDetailPage({ params }: { params: { slug: string, capability: string } }) {
  const capId = `${params.slug}/${params.capability}`;
  const cap = docsRegistry.getCapability(capId);

  if (!cap) {
    notFound();
  }

  const packageId = `@skyra/${params.slug}`;
  const apis = cap.apis.map(apiId => docsRegistry.getApi(apiId)).filter(Boolean);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Navigation */}
      <div>
        <Link href={`/packages/${params.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Package
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem', borderBottom: '1px solid var(--skyra-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--skyra-radius-md)', background: 'var(--skyra-primary-light)', color: 'var(--skyra-primary)' }}>
            <Box size={24} />
          </div>
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--skyra-text)', margin: 0 }}>
            {cap.name}
          </h1>
          {cap.status && (
            <Badge variant={cap.status === 'stable' ? 'success' : cap.status === 'experimental' ? 'warning' : 'neutral'}>
              {cap.status}
            </Badge>
          )}
          <Badge variant="neutral">
            {cap.runtime}
          </Badge>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '1.125rem', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
          {cap.description}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Code size={20} /> Public APIs
            </h2>
            {apis.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {apis.map((api) => (
                  <Link key={api!.id} href={`/packages/${params.slug}/${params.capability}/${api!.name}`} style={{ textDecoration: 'none' }}>
                    <Card style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }} className="hover-card">
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>
                          {api!.name}
                        </h3>
                        <Badge variant="neutral" size="sm">{api!.kind}</Badge>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.6 }}>
                        {api!.description || `A public ${api!.kind} in ${cap.name}.`}
                      </p>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', color: 'var(--skyra-text-muted)' }}>
                No documented APIs found for this capability.
              </div>
            )}
          </section>

        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 1rem 0' }}>
              Usage
            </h3>
            <div style={{ background: 'var(--skyra-bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--skyra-radius-sm)', border: '1px solid var(--skyra-border)', fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.75rem', color: 'var(--skyra-text)', overflowX: 'auto' }}>
              {cap.usageNote || `import {} from '${cap.exportPath}';`}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
