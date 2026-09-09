import { tokens } from '@skyra/design-tokens';
import { Card, Badge, Divider } from '@skyra/ui';

export const metadata = { title: 'Design System — Skyra Platform Dashboard' };

export default function DesignSystemPage() {
  const colorGroups = [
    { label: 'Brand', items: [
      { name: '--skyra-primary',      value: tokens.primary,     note: '[CONFIRMED]' },
      { name: '--skyra-primary-hover',value: tokens.primaryHover, note: '[CONFIRMED]' },
      { name: '--skyra-orange',       value: tokens.orange,      note: '[CONFIRMED]' },
      { name: '--skyra-cyan',         value: tokens.cyan,        note: '[CONFIRMED]' },
      { name: '--skyra-navy',         value: tokens.navy,        note: '[CONFIRMED]' },
    ]},
    { label: 'Semantic', items: [
      { name: '--skyra-danger',   value: tokens.danger,   note: '[CONFIRMED]' },
      { name: '--skyra-success',  value: tokens.success,  note: '[CONFIRMED]' },
      { name: '--skyra-warning',  value: tokens.warning,  note: '[CONFIRMED]' },
      { name: '--skyra-info',     value: tokens.info,     note: '[CONFIRMED]' },
    ]},
    { label: 'Surface (Light)', items: [
      { name: '--skyra-bg',      value: tokens.bg,      note: '[CONFIRMED]' },
      { name: '--skyra-surface', value: tokens.surface,  note: '[CONFIRMED]' },
    ]},
  ];

  return (
    <div className="dash-page">
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        Design System
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem' }}>
        All tokens confirmed from <code>skyra-erp/src/app/globals.css</code> (READ-ONLY).
        Platform uses <code>--skyra-*</code> namespace.
      </p>

      {colorGroups.map((group) => (
        <div key={group.label} style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--skyra-text)', marginBottom: '1rem' }}>
            {group.label}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {group.items.map(({ name, value, note }) => (
              <Card key={name} size="sm" flat>
                <div style={{
                  height: '48px', borderRadius: 'var(--skyra-radius-md)',
                  background: value, marginBottom: '0.75rem',
                  border: '1px solid var(--skyra-border)',
                }} />
                <div style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.25rem' }}>{name}</div>
                <div style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.75rem', color: 'var(--skyra-text-muted)', marginBottom: '0.25rem' }}>{value}</div>
                <Badge variant="success" size="sm">{note}</Badge>
              </Card>
            ))}
          </div>
        </div>
      ))}

      <Divider />

      <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--skyra-text)', margin: '1.5rem 0 1rem' }}>
        Border Radius
      </h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {[
          { name: 'sm', value: tokens.radiusSm },
          { name: 'md', value: tokens.radiusMd },
          { name: 'lg', value: tokens.radiusLg },
          { name: 'xl', value: tokens.radiusXl },
        ].map(({ name, value }) => (
          <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'var(--skyra-primary-light)', border: '2px solid var(--skyra-primary)',
              borderRadius: value,
            }} />
            <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-mono)' }}>{name} / {value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
