import React from 'react';
import { Card, Badge } from '@/components/ui';
import '@skyra-tech-platform/button';;
import { docsRegistry } from '../../../../../../docs-system/registry';
import { bootstrapRegistry } from '../../../../../../docs-system/bootstrap';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { ExampleViewer } from '../../../../../../components/docs/ExampleViewer';

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
  const pkgId = `@skyra/${params.slug}`;
  const pkg = docsRegistry.getPackage(pkgId);
  const examples = docsRegistry.getExamplesForApi(apiId);

  if (!api || !cap) {
    notFound();
  }

  // Find latest release referencing this API
  const releases = docsRegistry.getReleases().reverse();
  let latestChangeForApi: any = null;
  let latestReleaseForApi: any = null;
  
  for (const release of releases) {
    for (const p of release.packages) {
      if (p.packageId === pkgId) {
        for (const change of p.changes) {
          if (change.apiIds?.includes(apiId) || change.title.includes(api.name)) {
            if (!latestChangeForApi) {
              latestChangeForApi = change;
              latestReleaseForApi = release;
            }
          }
        }
      }
    }
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
          <Badge variant="primary">
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
               {api.deprecation.replacement && (
                 <p style={{ margin: '0.5rem 0 0 0', color: 'var(--skyra-text)', fontSize: '0.875rem' }}>
                   <strong>Replacement:</strong> {api.deprecation.replacement}
                 </p>
               )}
               {latestChangeForApi?.migrationGuide && (
                 <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--skyra-border)' }}>
                   <strong style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Migration Guide</strong>
                   <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>{latestChangeForApi.migrationGuide}</p>
                 </div>
               )}
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
                             <Badge variant="neutral" size="sm">Optional</Badge>
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

          {/* Phase 10.4: Executable Examples */}
          {examples && examples.length > 0 ? (
            <section>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>Examples</h2>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 {examples.map((example) => (
                   <ExampleViewer key={example.id} example={example} />
                 ))}
               </div>
            </section>
          ) : (
            <section>
               <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>Examples</h2>
               <div style={{ padding: '1rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', border: '1px dashed var(--skyra-border)', color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                 No examples available yet.
               </div>
            </section>
          )}

          {/* Phase 10.5: Behavioral Metadata */}
          {(api.design || api.accessibility || api.responsive) && (
            <section style={{ display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1.5rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
              
              {api.design && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>Design & UX</h2>
                  {api.design.rationale && <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{api.design.rationale}</p>}
                  
                  <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                    {api.design.variants && (
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Variants</strong>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {api.design.variants.map(v => <Badge key={v} variant="neutral">{v}</Badge>)}
                        </div>
                      </div>
                    )}
                    {api.design.states && (
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>States</strong>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {api.design.states.map(s => <Badge key={s} variant="neutral">{s}</Badge>)}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {api.accessibility && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>Accessibility (A11y)</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {Object.entries(api.accessibility).map(([key, value]) => {
                      if (!value) return null;
                      return (
                        <div key={key} style={{ background: 'var(--skyra-surface)', padding: '1rem', borderRadius: 'var(--skyra-radius-sm)', border: '1px solid var(--skyra-border)' }}>
                          <strong style={{ display: 'block', fontSize: '0.875rem', textTransform: 'capitalize', marginBottom: '0.5rem' }}>{key.replace(/([A-Z])/g, ' $1')}</strong>
                          {Array.isArray(value) ? (
                            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                              {value.map(v => <li key={v}>{v}</li>)}
                            </ul>
                          ) : (
                            <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>{value}</p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {api.responsive && (
                <div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem' }}>Responsive Behavior</h2>
                  {api.responsive.breakpointsSupported && (
                    <div style={{ marginBottom: '1rem' }}>
                      <strong style={{ display: 'block', fontSize: '0.875rem', marginBottom: '0.5rem' }}>Supported Breakpoints</strong>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {api.responsive.breakpointsSupported.map(b => <Badge key={b} variant="primary">{b === 'all' ? 'All Viewports' : `${b}px`}</Badge>)}
                      </div>
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {api.responsive.mobileBehavior && (
                      <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}><strong>Mobile:</strong> {api.responsive.mobileBehavior}</p>
                    )}
                    {api.responsive.tabletBehavior && (
                      <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}><strong>Tablet:</strong> {api.responsive.tabletBehavior}</p>
                    )}
                    {api.responsive.desktopBehavior && (
                      <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}><strong>Desktop:</strong> {api.responsive.desktopBehavior}</p>
                    )}
                  </div>
                </div>
              )}
            </section>
          )}
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

          {/* Release & Package Information */}
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 1rem 0' }}>
              Package Information
            </h3>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem' }}>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--skyra-text-muted)' }}>Package</span>
                <Link href={`/packages/${params.slug}`} style={{ color: 'var(--skyra-primary)', textDecoration: 'none' }}>
                  {pkg?.name}
                </Link>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--skyra-text-muted)' }}>Version</span>
                <span style={{ color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-mono)' }}>{pkg?.version}</span>
              </li>
              <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--skyra-text-muted)' }}>Lifecycle</span>
                <Badge variant={pkg?.status === 'stable' ? 'success' : pkg?.status === 'experimental' ? 'warning' : 'neutral'} size="sm">
                  {pkg?.status}
                </Badge>
              </li>
              {latestReleaseForApi && latestChangeForApi && (
                <li style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px dashed var(--skyra-border)' }}>
                  <span style={{ color: 'var(--skyra-text-muted)' }}>Recent Change (v{latestReleaseForApi.version})</span>
                  <Link href={`/releases#${latestReleaseForApi.id}`} style={{ color: 'var(--skyra-text)', textDecoration: 'underline' }}>
                    {latestChangeForApi.title}
                  </Link>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
