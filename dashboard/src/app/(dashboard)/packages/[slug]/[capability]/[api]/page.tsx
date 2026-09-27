import React from 'react';
import { Card, Badge, Button } from '@skyra/ui';
import { docsRegistry } from '../../../../../../docs-system/registry';
import { bootstrapRegistry } from '../../../../../../docs-system/bootstrap';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';

bootstrapRegistry();

export async function generateStaticParams() {
  const apis = docsRegistry.getApis();
  return apis.map((api) => {
    const pkgSlug = api.packageId.replace('@skyra/', '');
    const capSlug = api.capabilityId.split('/')[1];
    return { slug: pkgSlug, capability: capSlug, api: api.name };
  });
}

export function generateMetadata({ params }: { params: { slug: string, capability: string, api: string } }) {
  const capId = `${params.slug}/${params.capability}`;
  const apiId = `@skyra/${params.slug}::${params.api}`;
  const api = docsRegistry.getApi(apiId);
  
  if (!api) {
    return { title: 'API Not Found' };
  }

  return { title: `${api.name} — Skyra Platform` };
}

export default function ApiDetailPage({ params }: { params: { slug: string, capability: string, api: string } }) {
  const apiId = `@skyra/${params.slug}::${params.api}`;
  const api = docsRegistry.getApi(apiId);
  const capId = `${params.slug}/${params.capability}`;
  const cap = docsRegistry.getCapability(capId);

  if (!api || !cap) {
    notFound();
  }

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Navigation */}
      <div>
        <Link href={`/packages/${params.slug}/${params.capability}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to {cap.name}
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem', borderBottom: '1px solid var(--skyra-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--skyra-radius-md)', background: 'var(--skyra-primary-light)', color: 'var(--skyra-primary)' }}>
            <BookOpen size={24} />
          </div>
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--skyra-text)', margin: 0 }}>
            {api.name}
          </h1>
          <Badge variant="brand">
            {api.kind}
          </Badge>
          {api.status === 'deprecated' && (
            <Badge variant="danger">Deprecated</Badge>
          )}
        </div>
        <div style={{ color: 'var(--skyra-text-muted)', fontSize: '1.125rem', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
          {api.description || 'No description provided.'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {api.deprecation && (
             <Card style={{ padding: '1.5rem', borderLeft: '4px solid var(--skyra-danger)', background: 'var(--skyra-bg-muted)' }}>
               <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 0.5rem 0' }}>Deprecated</h3>
               <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>{api.deprecation.reason}</p>
             </Card>
          )}

          {api.signature && (
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>
                Signature
              </h2>
              <div style={{ background: 'var(--skyra-bg-muted)', padding: '1.25rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.875rem', color: 'var(--skyra-text)', overflowX: 'auto', whiteSpace: 'pre' }}>
                {api.signature}
              </div>
            </section>
          )}

          {api.properties && api.properties.length > 0 && (
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>
                {api.kind === 'function' ? 'Parameters' : 'Properties'}
              </h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid var(--skyra-border)' }}>
                      <th style={{ padding: '0.75rem', color: 'var(--skyra-text)', fontWeight: 600 }}>Name</th>
                      <th style={{ padding: '0.75rem', color: 'var(--skyra-text)', fontWeight: 600 }}>Type</th>
                      <th style={{ padding: '0.75rem', color: 'var(--skyra-text)', fontWeight: 600 }}>Required</th>
                      <th style={{ padding: '0.75rem', color: 'var(--skyra-text)', fontWeight: 600 }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {api.properties.map((prop, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid var(--skyra-border)' }}>
                        <td style={{ padding: '0.75rem', color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>
                          {prop.name}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--skyra-primary)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>
                          {prop.type}
                        </td>
                        <td style={{ padding: '0.75rem' }}>
                          {prop.required ? (
                             <Badge variant="neutral" size="sm">Required</Badge>
                          ) : (
                             <Badge variant="outline" size="sm">Optional</Badge>
                          )}
                        </td>
                        <td style={{ padding: '0.75rem', color: 'var(--skyra-text-muted)' }}>
                          {prop.description || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
          
          {api.returnType && (
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>
                Returns
              </h2>
              <div style={{ background: 'var(--skyra-bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
                {api.returnType}
              </div>
            </section>
          )}

          {/* Placeholders for Phase 10.4 and 10.5 */}
          <section>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>Examples</h2>
             <div style={{ padding: '1rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', border: '1px dashed var(--skyra-border)', color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
               Examples — available in Phase 10.4
             </div>
          </section>

          <section>
             <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>Accessibility</h2>
             <div style={{ padding: '1rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', border: '1px dashed var(--skyra-border)', color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
               Accessibility documentation — available in Phase 10.5
             </div>
          </section>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 1rem 0' }}>
              Import Path
            </h3>
            <div style={{ background: 'var(--skyra-bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--skyra-radius-sm)', border: '1px solid var(--skyra-border)', fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.75rem', color: 'var(--skyra-text)', overflowX: 'auto' }}>
              {`import { ${api.name} } from '${api.exportPath}';`}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
