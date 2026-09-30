'use client';

import React, { useState } from 'react';
import { Badge } from '@skyra/ui';
import { QRCodeConfigurator, QRCodePreview, QRCodeScanabilityStatus } from '@skyra/qr/react';

export default function QRCodeShowcase() {
  const [value, setValue] = useState('https://skyra.tech/demo-qr');
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState<'L' | 'M' | 'Q' | 'H'>('Q');
  const [margin, setMargin] = useState(4);
  const [scale, setScale] = useState(4);
  const [darkColor, setDarkColor] = useState('#0f172a');
  const [lightColor, setLightColor] = useState('#ffffff');

  const updateConfig = (updates: any) => {
    if (updates.value !== undefined) setValue(updates.value);
    if (updates.errorCorrectionLevel !== undefined) setErrorCorrectionLevel(updates.errorCorrectionLevel);
    if (updates.margin !== undefined) setMargin(updates.margin);
    if (updates.scale !== undefined) setScale(updates.scale);
    if (updates.darkColor !== undefined) setDarkColor(updates.darkColor);
    if (updates.lightColor !== undefined) setLightColor(updates.lightColor);
  };

  return (
    <div className="dash-page" style={{ padding: '2rem 1.5rem', maxWidth: '1200px', margin: '0 auto', paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.85rem', color: 'var(--skyra-text)', margin: 0 }}>
            QR Code Showcase
          </h1>
          <Badge variant="primary" style={{ fontFamily: 'monospace' }}>@skyra/qr</Badge>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', maxWidth: '800px', fontSize: '0.95rem', margin: 0, lineHeight: 1.5 }}>
          Generate and preview highly scannable QR codes using Skyra Platform's reusable QR engine. Fully accessible SVG output.
        </p>
      </header>

      {/* Main Layout: 2 columns */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Left Col: Config & Status */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          <section 
            aria-label="Configuration Panel"
            style={{ 
              background: 'var(--skyra-surface)', 
              border: '1px solid var(--skyra-border)', 
              borderRadius: 'var(--skyra-radius-lg)', 
              padding: '1.5rem', 
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              minWidth: 0
            }}
          >
            <h2 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: 0 }}>Configuration</h2>
            <QRCodeConfigurator 
              value={value}
              errorCorrectionLevel={errorCorrectionLevel}
              margin={margin}
              scale={scale}
              darkColor={darkColor}
              lightColor={lightColor}
              onChange={updateConfig}
            />
          </section>

          <section aria-label="Diagnostic Status">
            <QRCodeScanabilityStatus 
              value={value}
              margin={margin}
              darkColor={darkColor}
              lightColor={lightColor}
            />
          </section>

          {/* Capabilities */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 0.35rem 0' }}>SVG Matrix Rendering</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.4 }}>Lightweight, infinitely scalable vector output via <code>&lt;svg&gt;</code> elements.</p>
            </div>
            <div style={{ padding: '1.25rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 0.35rem 0' }}>Error Correction</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', margin: 0, lineHeight: 1.4 }}>Up to 30% structural damage recovery ensures scannability.</p>
            </div>
          </div>
        </div>

        {/* Right Col: Preview & Code */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: 0 }}>
          
          <QRCodePreview 
            value={value}
            errorCorrectionLevel={errorCorrectionLevel}
            margin={margin}
            scale={scale}
            color={{ dark: darkColor, light: lightColor }}
            filename="skyra-qr"
          />

          {/* Code */}
          <section style={{ 
            background: 'var(--skyra-surface)', 
            border: '1px solid var(--skyra-border)', 
            borderRadius: 'var(--skyra-radius-lg)', 
            overflow: 'hidden' 
          }}>
            <div style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--skyra-border)' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Implementation code</span>
            </div>
            <pre style={{ 
              margin: 0, 
              padding: '1.25rem', 
              background: '#0B111E', 
              color: '#E2E8F0', 
              fontSize: '0.85rem', 
              fontFamily: 'monospace', 
              overflowX: 'auto',
              lineHeight: 1.6
            }}>
<span style={{ color: '#38BDF8' }}>import</span> {'{ '} <span style={{ color: '#FDE047' }}>QRCode</span> {' }'} <span style={{ color: '#38BDF8' }}>from</span> <span style={{ color: '#34D399' }}>'@skyra/qr/react'</span>;{'\n\n'}
<span style={{ color: '#64748B' }}>// React Usage</span>{'\n'}
{'<'}<span style={{ color: '#FDE047' }}>QRCode</span>{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>value</span>={'{'}<span style={{ color: '#34D399' }}>'{value}'</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>errorCorrectionLevel</span>={'{'}<span style={{ color: '#34D399' }}>'{errorCorrectionLevel}'</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>margin</span>={'{'}<span style={{ color: '#FB923C' }}>{margin}</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>scale</span>={'{'}<span style={{ color: '#FB923C' }}>{scale}</span>{'}'}{'\n'}
{'  '}<span style={{ color: '#38BDF8' }}>color</span>={'{'}{'{ '}{'\n'}
{'    '}<span style={{ color: '#38BDF8' }}>dark</span>: <span style={{ color: '#34D399' }}>'{darkColor}'</span>,{'\n'}
{'    '}<span style={{ color: '#38BDF8' }}>light</span>: <span style={{ color: '#34D399' }}>'{lightColor}'</span>{'\n'}
{'  '}{'}'}{'}'}{'\n'}
{'/>'}
            </pre>
          </section>

        </div>
      </div>
    </div>
  );
}
