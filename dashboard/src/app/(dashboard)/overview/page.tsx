import { Card } from '@skyra/ui';

export const metadata = { title: 'Overview — Skyra Platform Dashboard' };

const PACKAGES = [
  { name: '@skyra/design-tokens', layer: 'Layer 1', desc: 'CSS custom properties, dark mode, reset', status: 'Ready' },
  { name: '@skyra/utils',         layer: 'Layer 1', desc: 'Pure TS utilities — formatCurrency, amountInWords, date, string', status: 'Ready' },
  { name: '@skyra/validation',    layer: 'Layer 1', desc: 'Zod schemas — org, client, bank, common fields', status: 'Ready' },
  { name: '@skyra/ui',            layer: 'Layer 2', desc: '14 ERP-fidelity UI primitives', status: 'Ready' },
  { name: '@skyra/data-table',    layer: 'Layer 2', desc: 'Typed, sortable, paginated DynamicDataTable', status: 'Ready' },
  { name: '@skyra/dynamic-form',  layer: 'Layer 2', desc: 'Schema-driven DynamicForm, 2-col → 1-col mobile', status: 'Ready' },
  { name: '@skyra/dialogs',       layer: 'Layer 2', desc: 'ConfirmDialog, Modal, Drawer with focus trap', status: 'Ready' },
  { name: '@skyra/invoice',       layer: 'Layer 3', desc: 'Invoice engine, PDF, Email (OUT OF SCOPE this phase)', status: 'Planned' },
];

export default function OverviewPage() {
  return (
    <div className="dash-page">
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
          Skyra Platform
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '1rem', maxWidth: '640px' }}>
          Internal reusable UI foundation. All components are extracted from and visually
          derived from <strong>skyra-erp</strong> — the primary visual source of truth.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
        {PACKAGES.map((pkg) => (
          <Card key={pkg.name} size="sm">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                color: pkg.layer === 'Layer 1' ? 'var(--skyra-success)' : pkg.layer === 'Layer 2' ? 'var(--skyra-primary)' : 'var(--skyra-text-muted)',
                background: pkg.layer === 'Layer 1' ? 'var(--skyra-success-light)' : pkg.layer === 'Layer 2' ? 'var(--skyra-primary-light)' : 'var(--skyra-border)',
                padding: '0.15rem 0.5rem', borderRadius: 'var(--skyra-radius-full)',
              }}>
                {pkg.layer}
              </span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 600,
                color: pkg.status === 'Ready' ? 'var(--skyra-success)' : 'var(--skyra-text-muted)',
              }}>
                {pkg.status === 'Ready' ? '✓ ' : '○ '}{pkg.status}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.8rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.375rem' }}>
              {pkg.name}
            </div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)' }}>
              {pkg.desc}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: '2rem', padding: '1rem 1.25rem', background: 'var(--skyra-primary-light)', borderRadius: 'var(--skyra-radius-lg)', border: '1px solid var(--skyra-primary)', fontSize: '0.875rem', color: 'var(--skyra-primary)' }}>
        <strong>ERP Visual Source of Truth:</strong> All design tokens, component visual behavior, spacing, shadows, and
        responsive breakpoints are confirmed from <code>skyra-erp</code> (READ-ONLY). No assumptions.
      </div>
    </div>
  );
}
