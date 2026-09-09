'use client';
import React from 'react';

export function DemoSection({ title, desc, children, erpSource }: { title: string, desc: string, children: React.ReactNode, erpSource?: string }) {
  return (
    <section style={{ marginBottom: '3rem' }}>
      <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--skyra-border)', paddingBottom: '1rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
          {title}
        </h2>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>{desc}</p>
        {erpSource && (
          <div style={{ fontSize: '0.75rem', color: 'var(--skyra-primary)', fontWeight: 600, display: 'inline-block', background: 'var(--skyra-primary-light)', padding: '0.2rem 0.6rem', borderRadius: 'var(--skyra-radius-full)' }}>
            ERP Source: {erpSource}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {children}
      </div>
    </section>
  );
}

export function DemoBlock({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-lg)', padding: '1.5rem' }}>
      <h3 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.25rem' }}>
        {title}
      </h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'flex-start' }}>
        {children}
      </div>
    </div>
  );
}
