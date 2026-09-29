'use client';

import React, { useState } from 'react';
import {
  Spinner,
  Progress,
  CircularProgress,
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonTable,
  DataLoader,
  OverlayLoader,
  Button
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function LoadersShowcasePage() {
  const [progressVal, setProgressVal] = useState(65);
  const [dataState, setDataState] = useState<'loading' | 'success' | 'empty' | 'error'>('success');
  const [overlayActive, setOverlayActive] = useState(false);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Skyra Loading &amp; Skeleton System
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Comprehensive loading suite featuring branded Spinners, determinate and indeterminate linear/circular Progress bars, Skeleton placeholders, and DataLoader state orchestrator.
        </p>
      </div>

      {/* 1. Spinners & Circular Progress */}
      <DemoSection title="1. Branded Spinners &amp; Circular Progress" desc="Multi-size branded SVG spinners and circular progress indicators." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Spinners by Size">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap', padding: '1rem 0' }}>
              {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                <div key={sz} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Spinner size={sz} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>{sz}</span>
                </div>
              ))}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
                <Spinner size="sm" label="Synchronizing..." showLabel />
              </div>
            </div>
          </DemoBlock>

          <DemoBlock title="Circular Progress">
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap', padding: '0.5rem 0' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <CircularProgress value={78} size={48} showValue />
                <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>78% Complete</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                {/* indeterminate mode: omit value prop */}
                <CircularProgress size={48} />
                <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>Indeterminate</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <CircularProgress value={progressVal} size={64} showValue />
                <span style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>Active Upload</span>
              </div>
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Linear Progress Bars */}
      <DemoSection title="2. Linear Progress Bars" desc="Determinate and indeterminate accessible linear progress indicators." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Determinate Linear Progress">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Progress value={progressVal} label="Processing Data Stream" showLabel />
              <Progress value={40} size="sm" />
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <Button size="sm" variant="outline" onClick={() => setProgressVal((v) => Math.max(0, v - 15))}>-15%</Button>
                <Button size="sm" variant="outline" onClick={() => setProgressVal((v) => Math.min(100, v + 15))}>+15%</Button>
              </div>
            </div>
          </DemoBlock>

          <DemoBlock title="Indeterminate Continuous Progress">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* indeterminate: omit value prop */}
              <Progress label="Connecting to WebSocket Cluster..." />
              <Progress size="sm" />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 3. Skeleton Loading Primitives */}
      <DemoSection title="3. Reusable Skeleton Primitives" desc="Content placeholder skeletons matching actual layout geometry." erpSource="ERP Skeleton Layouts">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Skeleton Primitives (Text &amp; Avatar)">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <SkeletonAvatar size={48} />
              <div style={{ flex: 1 }}>
                <Skeleton width="60%" height="16px" style={{ marginBottom: '6px' }} />
                <Skeleton width="40%" height="12px" />
              </div>
            </div>
            <SkeletonText lines={3} />
          </DemoBlock>

          <DemoBlock title="Skeleton Table">
            <SkeletonTable rows={3} columns={3} />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 4. DataLoader State Orchestrator */}
      <DemoSection title="4. DataLoader State Orchestrator" desc="Declarative presentation container handling Loading, Success, Empty, and Error states." erpSource="Platform Foundation">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Simulate State:</span>
            <Button size="sm" variant={dataState === 'loading' ? 'primary' : 'outline'} onClick={() => setDataState('loading')}>Loading</Button>
            <Button size="sm" variant={dataState === 'success' ? 'primary' : 'outline'} onClick={() => setDataState('success')}>Success</Button>
            <Button size="sm" variant={dataState === 'empty' ? 'primary' : 'outline'} onClick={() => setDataState('empty')}>Empty</Button>
            <Button size="sm" variant={dataState === 'error' ? 'primary' : 'outline'} onClick={() => setDataState('error')}>Error</Button>
          </div>

          <div style={{ background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-lg)', padding: '1.5rem' }}>
            <DataLoader
              loading={dataState === 'loading'}
              error={dataState === 'error' ? new Error('Failed to retrieve ledger transactions from server.') : null}
              data={dataState === 'empty' ? [] : [
                { id: 1, name: 'Invoice #SKY-9021', amount: '$4,250.00' },
                { id: 2, name: 'Invoice #SKY-9022', amount: '$1,890.00' },
              ]}
            >
              {(items) => (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map((it) => (
                    <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 1rem', background: 'var(--skyra-bg)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--skyra-text)' }}>{it.name}</span>
                      <span style={{ fontWeight: 700, color: 'var(--skyra-primary)' }}>{it.amount}</span>
                    </div>
                  ))}
                </div>
              )}
            </DataLoader>
          </div>
        </div>
      </DemoSection>

      {/* 5. Overlay Loader Demo */}
      <DemoSection title="5. Overlay Loader" desc="Modal or panel content blocking loader with backdrop." erpSource="Platform Foundation">
        <DemoBlock title="Panel Loading Overlay">
          <div style={{ position: 'relative', minHeight: '160px', padding: '1.5rem', background: 'var(--skyra-bg)', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--skyra-text)' }}>Critical Configuration Panel</h4>
            <p style={{ margin: 0, color: 'var(--skyra-text-muted)', fontSize: '0.875rem' }}>
              Contains sensitive server routing rules and security keys. The loading overlay will block interaction cleanly.
            </p>
            <div style={{ marginTop: '1rem' }}>
              <Button size="sm" onClick={() => { setOverlayActive(true); setTimeout(() => setOverlayActive(false), 2500); }}>
                Simulate 2.5s Background Operation
              </Button>
            </div>
            <OverlayLoader loading={overlayActive} message="Updating cluster security policies..." />
          </div>
        </DemoBlock>
      </DemoSection>
    </div>
  );
}
