'use client';
import React, { useState } from 'react';
import { Button } from '@skyra/ui';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const VIEWPORTS = [
  { name: 'Mobile XS', width: 320, icon: <Smartphone size={16} /> },
  { name: 'Mobile SM', width: 375, icon: <Smartphone size={16} /> },
  { name: 'Tablet SM', width: 640, icon: <Tablet size={16} /> },
  { name: 'Tablet MD', width: 768, icon: <Tablet size={16} /> },
  { name: 'Desktop SM', width: 1024, icon: <Monitor size={16} /> },
  { name: 'Desktop MD', width: 1280, icon: <Monitor size={16} /> },
  { name: 'Desktop LG', width: 1536, icon: <Monitor size={16} /> },
];

export default function ResponsiveStudioPage() {
  const [activeWidth, setActiveWidth] = useState(768);

  return (
    <div className="dash-page" style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
          Responsive Viewport Studio
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)' }}>
          Test Skyra Platform components across all 7 canonical viewports.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid var(--skyra-border)', marginBottom: '2rem' }}>
        {VIEWPORTS.map(vp => (
          <Button 
            key={vp.width}
            variant={activeWidth === vp.width ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setActiveWidth(vp.width)}
            leftIcon={vp.icon}
          >
            {vp.name} ({vp.width}px)
          </Button>
        ))}
      </div>

      <div style={{ flex: 1, background: 'var(--skyra-surface)', border: '1px dashed var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', display: 'flex', justifyContent: 'center', overflow: 'hidden', padding: '1rem' }}>
        <iframe 
          src="/responsive-sandbox" 
          style={{ 
            width: `${activeWidth}px`, 
            height: '100%', 
            border: '1px solid var(--skyra-border)', 
            borderRadius: 'var(--skyra-radius-md)',
            background: 'var(--skyra-background)',
            transition: 'width 0.3s ease',
            boxShadow: 'var(--skyra-shadow-md)'
          }}
          title="Viewport Sandbox"
        />
      </div>
    </div>
  );
}
