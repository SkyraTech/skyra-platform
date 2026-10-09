import React from 'react';
import { Card, Badge } from '@/components/ui';
import '@skyra-tech-platform/button';;
import { docsRegistry } from '../../../../docs-system/registry';
import { bootstrapRegistry } from '../../../../docs-system/bootstrap';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, ArrowLeft, Terminal, Box, PlayCircle, Code, History, BookOpen } from 'lucide-react';

import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';

// Initialize the registry for SSR/SSG.
bootstrapRegistry();

export async function generateStaticParams() {
  const packages = docsRegistry.getPackages();
  return packages.map((pkg) => ({
    slug: pkg.id.split('/').pop() || '',
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = docsRegistry.getPackages().find(p => p.id.endsWith(`/${slug}`));
  
  if (!pkg) {
    return { title: 'Package Not Found' };
  }

  return { title: `${pkg.name} — Skyra Platform` };
}

export default async function PackageDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const pkg = docsRegistry.getPackages().find(p => p.id.endsWith(`/${slug}`));

  if (!pkg) {
    notFound();
  }
  
  const id = pkg!.id;

  const capabilities = docsRegistry.getCapabilitiesForPackage(id);
  const releases = docsRegistry.getReleases()
    .filter(r => r.packages.some(p => p.packageId === id))
    .reverse();

  // Frozen packages with dedicated documentation pages
  const DOCS_PAGES: Record<string, string> = {
    'design-tokens': '/docs/design-tokens',
    'utils':         '/docs/utils',
    'validation':    '/docs/validation',
    'data-export':   '/docs/data-export',
    'dialog':        '/components/overlays/dialog',
    'dynamic-form':  '/components/forms/dynamic-form',
    'qr':            '/components/utilities/qr',
    'app-shell':     '/components/layouts/app-shell',
    'notification':  '/components/feedback/notification',
  };
  const docsHref = DOCS_PAGES[slug];

  const toc = [
    { id: 'installation', label: 'Installation' },
    { id: 'capabilities', label: 'Capabilities' },
    { id: 'exports', label: 'Public Exports' },
    { id: 'dependencies', label: 'Dependencies' },
    { id: 'recent-changes', label: 'Recent Changes' },
  ];

  return (
    <DocsLayout toc={toc}>
      
      {/* Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Packages
        </Link>
      </div>

      <DocsHeader 
        title={pkg.name}
        description={pkg.description || 'Core platform capability.'}
        breadcrumbs={[
          { label: 'Platform', href: '/overview' },
          { label: 'Packages', href: '/packages' },
          { label: pkg.name }
        ]}
        badges={[
          { label: pkg.status, variant: pkg.status === 'stable' ? 'stable' : pkg.status === 'experimental' ? 'experimental' : 'planned' },
          { label: `v${pkg.version}`, variant: 'tech' },
          { label: pkg.runtime, variant: 'tech' }
        ]}
      />

      {docsHref && (
        <div style={{ marginBottom: '3rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
          <BookOpen size={24} style={{ color: 'var(--skyra-primary)' }} />
          <div style={{ flex: 1 }}>
            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Dedicated Documentation</h3>
            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>This package has a dedicated deep-dive documentation page with live examples and API details.</p>
          </div>
          <Link href={docsHref} style={{ textDecoration: 'none' }}>
            <skyra-tech-button variant="primary">View Documentation</skyra-tech-button>
          </Link>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        <section id="installation">
          <HeadingAnchor id="installation" level={2}>Installation</HeadingAnchor>
          <div style={{ background: 'var(--skyra-bg-muted)', padding: '1.25rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.875rem', color: 'var(--skyra-text)', marginTop: '1rem' }}>
            {`pnpm add ${pkg.name}`}
          </div>
          <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', marginTop: '0.75rem' }}>
            Note: Packages are currently consumed via the internal workspace registry.
          </p>
        </section>

        <section id="capabilities">
          <HeadingAnchor id="capabilities" level={2}>Capabilities</HeadingAnchor>
            {capabilities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
                {capabilities.map((cap) => (
                  <Card key={cap.id} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
                          {cap.name}
                        </h3>
                        {cap.status && (
                          <Badge variant={cap.status === 'stable' ? 'success' : cap.status === 'experimental' ? 'warning' : 'neutral'} size="sm">
                            {cap.status}
                          </Badge>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                        <Badge variant="neutral" size="sm">{cap.runtime}</Badge>
                      </div>
                      <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.6 }}>
                        {cap.description}
                      </p>
                    </div>

                    <div style={{ background: 'var(--skyra-bg-muted)', padding: '0.75rem 1rem', borderRadius: 'var(--skyra-radius-sm)', border: '1px solid var(--skyra-border)', fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.75rem', color: 'var(--skyra-text)', overflowX: 'auto' }}>
                      {cap.usageNote || `import {} from '${cap.exportPath}';`}
                    </div>

                    {cap.limitations && cap.limitations.length > 0 && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <h4 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Limitations</h4>
                        <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                          {cap.limitations.map((limit, i) => (
                            <li key={i}>{limit}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--skyra-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                       <Link href={`/packages/${slug}/${cap.id.split('/')[1]}`} style={{ textDecoration: 'none' }}>
                         <skyra-tech-button variant="outline" size="sm">
                            <Code size={14} style={{ marginRight: '0.5rem' }} /> APIs
                         </skyra-tech-button>
                       </Link>
                       <skyra-tech-button variant="outline" size="sm" disabled>
                          <PlayCircle size={14} style={{ marginRight: '0.5rem' }} /> Examples (Phase 10.4)
                       </skyra-tech-button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', color: 'var(--skyra-text-muted)' }}>
                No authored capability metadata found for this package yet.
              </div>
            )}
        </section>

        <section id="exports">
          <HeadingAnchor id="exports" level={2}>Public Exports</HeadingAnchor>
          {pkg.exports.length > 0 ? (
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
              {pkg.exports.map(exp => {
                let description = '';
                if (exp === '.') {
                  description = 'Main entry point. Contains core runtime APIs and utilities.';
                } else if (exp.includes('web-component')) {
                  description = 'Web Component definition. Import this to register the custom element.';
                } else if (exp.includes('.css')) {
                  description = 'CSS stylesheet containing design tokens or base styles.';
                } else if (exp.includes('types')) {
                  description = 'TypeScript definitions and interfaces.';
                }

                return (
                  <li key={exp} style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', background: 'var(--skyra-bg-muted)', padding: '1.25rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
                    <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-mono, monospace)', fontWeight: 500 }}>
                      {`import ... from '${pkg.name}${exp === '.' ? '' : '/' + exp.replace(/^\.\//, '')}'`}
                    </div>
                    {description && (
                      <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', marginTop: '0.25rem' }}>
                        {description}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-subtle)', marginTop: '1rem' }}>No public exports defined.</div>
          )}
        </section>

        <section id="dependencies">
          <HeadingAnchor id="dependencies" level={2}>Dependencies & Peers</HeadingAnchor>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
            <Card style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 1rem 0' }}>
                Runtime Dependencies
              </h3>
              {Object.keys(pkg.dependencies).length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(pkg.dependencies).map(([dep, version]) => (
                    <li key={dep} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                      <span style={{ color: 'var(--skyra-text)', fontWeight: 500 }}>{dep}</span>
                      <span style={{ color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>{version as React.ReactNode}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-subtle)' }}>No runtime dependencies.</div>
              )}
            </Card>

            <Card style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 1rem 0' }}>
                Peer Dependencies
              </h3>
              {Object.keys(pkg.peerDependencies).length > 0 ? (
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {Object.entries(pkg.peerDependencies).map(([dep, version]) => {
                    const isOptional = pkg.optionalPeerDependencies?.includes(dep);
                    return (
                      <li key={dep} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ color: 'var(--skyra-text)', fontWeight: 500 }}>{dep}</span>
                          {isOptional && <Badge variant="neutral" size="sm">Optional</Badge>}
                        </div>
                        <span style={{ color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>{version as React.ReactNode}</span>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-subtle)' }}>No peer dependencies.</div>
              )}
            </Card>
          </div>
        </section>

        {releases.length > 0 && (
          <section id="recent-changes">
            <HeadingAnchor id="recent-changes" level={2}>Recent Changes</HeadingAnchor>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {releases.slice(0, 3).map((release) => {
                  const pkgChanges = release.packages.find(p => p.packageId === id)?.changes || [];
                  return (
                    <div key={release.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--skyra-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ color: 'var(--skyra-text)' }}>{release.version}</strong>
                        <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>{release.date}</span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.875rem', color: 'var(--skyra-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {pkgChanges.slice(0, 3).map(change => (
                          <li key={change.id}>
                            <span style={{ color: 'var(--skyra-text)' }}>{change.title}</span>
                          </li>
                        ))}
                        {pkgChanges.length > 3 && (
                          <li><em>and {pkgChanges.length - 3} more...</em></li>
                        )}
                      </ul>
                      <Link href={`/releases#${release.id}`} style={{ fontSize: '0.75rem', color: 'var(--skyra-primary)', textDecoration: 'none', alignSelf: 'flex-start', marginTop: '0.25rem' }}>
                        View full release →
                      </Link>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                 <Link href="/releases" style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', textDecoration: 'none' }}>
                   See all releases
                 </Link>
              </div>
            </div>
          </section>
        )}
      </div>
    </DocsLayout>
  );
}
