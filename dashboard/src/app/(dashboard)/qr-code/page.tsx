'use client';

import React from 'react';
import { Badge } from '@/components/ui';
import QRStudio from './QRStudio';

export default function QRCodeShowcase() {
  return (
    <div className="dash-page" style={{ padding: '2rem 1.5rem', maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.85rem', color: 'var(--skyra-text)', margin: 0 }}>
            Skyra QR Studio
          </h1>
          <Badge variant="primary" style={{ fontFamily: 'monospace' }}>@skyra-tech-platform/qr</Badge>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', maxWidth: '800px', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          Create beautiful, customizable, production-ready QR codes using the framework-agnostic Skyra Platform QR capability.
          Supports multiple data formats, real-time scanability analysis, and SVG/PNG generation.
        </p>
      </header>

      <QRStudio />
    </div>
  );
}
