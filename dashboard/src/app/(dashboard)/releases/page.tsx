'use client';

import React, { useEffect, useState } from 'react';
import { Card, Badge, Divider } from '@/components/ui';;
import { docsRegistry } from '../../../docs-system/registry';
import { bootstrapRegistry } from '../../../docs-system/bootstrap';
import type { ReleaseMetadata, ReleaseChange } from '../../../docs-system/metadata';
import Link from 'next/link';
import { ArrowRight, Box, Shield, AlertTriangle, FileText, CheckCircle, Trash2 } from 'lucide-react';

export default function ReleasesPage() {
  const [releases, setReleases] = useState<ReleaseMetadata[]>([]);

  useEffect(() => {
    bootstrapRegistry();
    // In a real app we might sort these by date. We just reverse them for now.
    const allReleases = docsRegistry.getReleases().reverse();
    setReleases(allReleases);
  }, []);

  const getChangeIcon = (type: ReleaseChange['type']) => {
    switch (type) {
      case 'added': return <CheckCircle size={16} style={{ color: 'var(--skyra-success)' }} />;
      case 'changed': return <FileText size={16} style={{ color: 'var(--skyra-primary)' }} />;
      case 'deprecated': return <AlertTriangle size={16} style={{ color: 'var(--skyra-warning)' }} />;
      case 'removed': return <Trash2 size={16} style={{ color: 'var(--skyra-danger)' }} />;
      case 'fixed': return <CheckCircle size={16} style={{ color: 'var(--skyra-success)' }} />;
      case 'security': return <Shield size={16} style={{ color: 'var(--skyra-danger)' }} />;
      default: return <FileText size={16} />;
    }
  };

  const getChangeVariant = (type: ReleaseChange['type']) => {
    switch (type) {
      case 'added': return 'success';
      case 'changed': return 'primary';
      case 'deprecated': return 'warning';
      case 'removed': return 'danger';
      case 'fixed': return 'success';
      case 'security': return 'danger';
      default: return 'neutral';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1024px', margin: '0 auto' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, margin: '0 0 1rem 0', color: 'var(--skyra-text)' }}>
          Releases & Changelog
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--skyra-text-muted)', margin: 0, maxWidth: '800px' }}>
          Discover recent updates to the Skyra Platform packages. This page aggregates release artifacts, breaking changes, and migration guidelines to help you keep your integrations up to date.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {releases.length === 0 && (
          <p style={{ color: 'var(--skyra-text-muted)' }}>No releases found.</p>
        )}

        {releases.map((release) => (
          <div key={release.id} id={release.id} style={{ scrollMarginTop: '6rem' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--skyra-text)' }}>
                {release.version}
              </h2>
              <span style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                {release.date}
              </span>
              {release.breaking && (
                <Badge variant="danger">Breaking Changes</Badge>
              )}
            </div>

            {release.summary && (
              <p style={{ fontSize: '1rem', color: 'var(--skyra-text)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                {release.summary}
              </p>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {release.packages.map((pkg, idx) => (
                <Card key={idx} style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Box size={20} style={{ color: 'var(--skyra-primary)' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: 0, fontFamily: 'var(--skyra-font-mono)' }}>
                      {pkg.packageName}
                    </h3>
                    {pkg.version && (
                      <span style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
                        v{pkg.version}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {pkg.changes.map(change => (
                      <div key={change.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--skyra-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <div style={{ marginTop: '0.25rem' }}>
                            {getChangeIcon(change.type)}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                              <Badge variant={getChangeVariant(change.type)} size="sm">
                                {change.type.toUpperCase()}
                              </Badge>
                              {change.breaking && (
                                <Badge variant="danger" size="sm">BREAKING</Badge>
                              )}
                            </div>
                            <h4 style={{ fontSize: '1rem', fontWeight: 500, margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>
                              {change.title}
                            </h4>
                            {change.description && (
                              <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.5 }}>
                                {change.description}
                              </div>
                            )}
                            {change.migrationGuide && (
                              <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--skyra-bg-muted)', borderRadius: 'var(--skyra-radius-md)', fontSize: '0.875rem', borderLeft: '3px solid var(--skyra-primary)' }}>
                                <strong style={{ color: 'var(--skyra-text)' }}>Migration Guide:</strong><br />
                                {change.migrationGuide}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                    <Link href={`/packages/${pkg.packageName.replace('@skyra/', '')}`} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: 'var(--skyra-primary)', textDecoration: 'none', fontWeight: 500 }}>
                      View Package Documentation <ArrowRight size={14} />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
