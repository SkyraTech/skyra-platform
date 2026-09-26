import React from 'react';
import { Card, Badge, Button } from '@skyra/ui';
import { docsRegistry } from '../../../../docs-system/registry';
import { bootstrapRegistry } from '../../../../docs-system/bootstrap';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Package, ArrowLeft, Terminal, Box, PlayCircle, Code } from 'lucide-react';

// Initialize the registry for SSR/SSG.
bootstrapRegistry();

export async function generateStaticParams() {
  const packages = docsRegistry.getPackages();
  return packages.map((pkg) => ({
    slug: pkg.id.replace('@skyra/', ''),
  }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const id = `@skyra/${params.slug}`;
  const pkg = docsRegistry.getPackage(id);
  
  if (!pkg) {
    return { title: 'Package Not Found' };
  }

  return { title: `${pkg.name} — Skyra Platform` };
}

export default function PackageDetailPage({ params }: { params: { slug: string } }) {
  const id = `@skyra/${params.slug}`;
  const pkg = docsRegistry.getPackage(id);

  if (!pkg) {
    notFound();
  }

  const capabilities = docsRegistry.getCapabilitiesForPackage(id);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Navigation */}
      <div>
        <Link href="/packages" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-text-muted)', textDecoration: 'none', fontSize: '0.875rem' }}>
          <ArrowLeft size={16} /> Back to Packages
        </Link>
      </div>

      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingBottom: '2rem', borderBottom: '1px solid var(--skyra-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: 'var(--skyra-radius-md)', background: 'var(--skyra-primary-light)', color: 'var(--skyra-primary)' }}>
            <Package size={24} />
          </div>
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--skyra-text)', margin: 0 }}>
            {pkg.name}
          </h1>
          <Badge variant={pkg.status === 'stable' ? 'success' : pkg.status === 'experimental' ? 'warning' : 'neutral'}>
            {pkg.status}
          </Badge>
          <Badge variant="neutral">
            v{pkg.version}
          </Badge>
          <Badge variant="neutral">
            {pkg.runtime}
          </Badge>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '1.125rem', maxWidth: '800px', margin: 0, lineHeight: 1.6 }}>
          {pkg.description || 'Core platform capability.'}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '2rem', alignItems: 'start' }}>
        
        {/* Main Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          
          {/* Installation */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={20} /> Installation
            </h2>
            <div style={{ background: 'var(--skyra-bg-muted)', padding: '1.25rem', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', fontFamily: 'var(--skyra-font-mono, monospace)', fontSize: '0.875rem', color: 'var(--skyra-text)' }}>
              {`pnpm add ${pkg.name}`}
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', marginTop: '0.75rem' }}>
              Note: Packages are currently consumed via the internal workspace registry.
            </p>
          </section>

          {/* Capabilities */}
          <section>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Box size={20} /> Capabilities
            </h2>
            {capabilities.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                       <Link href={`/packages/${params.slug}/${cap.id.split('/')[1]}`} style={{ textDecoration: 'none' }}>
                         <Button variant="outline" size="sm">
                            <Code size={14} style={{ marginRight: '0.5rem' }} /> APIs
                         </Button>
                       </Link>
                       <Button variant="outline" size="sm" disabled>
                          <PlayCircle size={14} style={{ marginRight: '0.5rem' }} /> Examples (Phase 10.4)
                       </Button>
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

        </div>

        {/* Sidebar / Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Public Exports */}
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 1rem 0' }}>
              Public Exports
            </h3>
            {pkg.exports.length > 0 ? (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pkg.exports.map(exp => (
                  <li key={exp} style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-mono, monospace)', background: 'var(--skyra-bg-muted)', padding: '0.25rem 0.5rem', borderRadius: 'var(--skyra-radius-sm)', border: '1px solid var(--skyra-border)' }}>
                    {exp}
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-subtle)' }}>No public exports defined.</div>
            )}
          </Card>

          {/* Peer Dependencies */}
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
                        <span style={{ color: 'var(--skyra-text)' }}>{dep}</span>
                        {isOptional && <Badge variant="neutral" size="sm">Optional</Badge>}
                      </div>
                      <span style={{ color: 'var(--skyra-text-subtle)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>{version}</span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-subtle)' }}>No peer dependencies.</div>
            )}
          </Card>

          {/* Dependencies */}
          <Card style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 1rem 0' }}>
              Dependencies
            </h3>
            {Object.keys(pkg.dependencies).length > 0 ? (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {Object.entries(pkg.dependencies).map(([dep, version]) => (
                  <li key={dep} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--skyra-text)' }}>{dep}</span>
                    <span style={{ color: 'var(--skyra-text-subtle)', fontFamily: 'var(--skyra-font-mono, monospace)' }}>{version}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-subtle)' }}>No runtime dependencies.</div>
            )}
          </Card>

        </div>
      </div>
    </div>
  );
}
