import { bootstrapRegistry } from '@/docs-system/bootstrap';
import { docsRegistry } from '@/docs-system/registry';
import { Card, Badge, Divider } from '@skyra/ui';

export const metadata = { title: 'Design System — Skyra Platform Dashboard' };

export default function DesignSystemPage() {
  bootstrapRegistry();
  const foundations = docsRegistry.getFoundations();
  const allTokens = docsRegistry.getTokens();

  // Group tokens for display by foundation
  const colorFoundation = foundations.find(f => f.category === 'color');
  const radiusFoundation = foundations.find(f => f.category === 'radius');
  
  const colors = colorFoundation ? colorFoundation.tokens.map(id => allTokens.find(t => t.id === id)!) : [];
  const radii = radiusFoundation ? radiusFoundation.tokens.map(id => allTokens.find(t => t.id === id)!) : [];

  return (
    <div className="dash-page">
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        Design System
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem' }}>
        Authoritative platform tokens rendered dynamically from <code>@skyra/design-tokens</code>.
      </p>

      {colorFoundation && (
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
            {colorFoundation.title}
          </h2>
          <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem' }}>{colorFoundation.description}</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem' }}>
            {colors.map((token) => (
              <Card key={token.id} size="sm" flat>
                <div style={{
                  height: '48px', borderRadius: 'var(--skyra-radius-md)',
                  background: token.id.startsWith('--') ? `var(${token.id})` : token.value, 
                  marginBottom: '0.75rem',
                  border: '1px solid var(--skyra-border)',
                }} />
                <div style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.25rem' }}>
                  {token.id}
                </div>
                <div style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.75rem', color: 'var(--skyra-text-muted)', marginBottom: '0.25rem' }}>
                  Light: {token.value}
                </div>
                {token.darkValue && (
                  <div style={{ fontFamily: 'var(--skyra-font-mono)', fontSize: '0.75rem', color: 'var(--skyra-text-muted)', marginBottom: '0.25rem' }}>
                    Dark: {token.darkValue}
                  </div>
                )}
                <Badge variant="success" size="sm">Source: {token.source}</Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      <Divider />

      {radiusFoundation && (
        <>
          <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--skyra-text)', margin: '1.5rem 0 0.5rem' }}>
            {radiusFoundation.title}
          </h2>
          <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem' }}>{radiusFoundation.description}</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {radii.map((token) => (
              <div key={token.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  width: '64px', height: '64px',
                  background: 'var(--skyra-primary-light)', border: '2px solid var(--skyra-primary)',
                  borderRadius: token.value,
                }} />
                <div style={{ fontSize: '0.75rem', color: 'var(--skyra-text-muted)', fontFamily: 'var(--skyra-font-mono)' }}>
                  {token.name} / {token.value}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
