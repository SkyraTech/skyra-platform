'use client';

import React from 'react';

interface ResponsiveDemoProps {
  description: string;
  desktop: React.ReactNode;
  mobile: React.ReactNode;
  fullWidth: React.ReactNode;
}

export function ResponsiveDemo({ description, desktop, mobile, fullWidth }: ResponsiveDemoProps) {
  return (
    <div style={{ marginBottom: '3rem' }}>
      <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '2rem' }}>
        {description}
      </p>
      
      <div style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '2rem',
        padding: '2rem',
        background: 'var(--skyra-bg-muted)',
        border: '1px solid var(--skyra-border)',
        borderRadius: 'var(--skyra-radius-lg)',
        backgroundImage: 'radial-gradient(var(--skyra-border) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        backgroundPosition: '0 0'
      }}>
        {/* Desktop */}
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Desktop Behavior
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            {desktop}
          </div>
        </div>

        {/* Mobile */}
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Mobile Target (min 44px)
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            {mobile}
          </div>
        </div>

        {/* Full Width */}
        <div>
          <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>
            Full Width Container
          </div>
          <div style={{ display: 'block', width: '100%' }}>
            {fullWidth}
          </div>
        </div>
      </div>
    </div>
  );
}
