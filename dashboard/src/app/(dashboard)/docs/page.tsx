import React from 'react';
import { Card } from '@skyra/ui';

export const metadata = { title: 'Documentation Architecture — Skyra Platform' };

export default function DocsArchitecturePage() {
  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Phase 10 Documentation Architecture
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Welcome to the Skyra Platform Developer Documentation System foundation. 
          This architecture ensures a scalable, framework-neutral, and single-source-of-truth approach to platform documentation.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--skyra-border)' }}>
            1. Documentation Layers
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Card style={{ padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>Layer A: Packages</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                Top-level distribution units (e.g., <code>@skyra/ui</code>, <code>@skyra/data-table</code>). Documentation explains installation, dependencies, versioning, and public exports.
              </p>
            </Card>
            <Card style={{ padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>Layer B: Capabilities &amp; Modules</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                Conceptual features within packages (e.g., <code>@skyra/qr/core</code> vs <code>@skyra/qr/react</code>). Explains usage patterns, limitations, and runtime requirements.
              </p>
            </Card>
            <Card style={{ padding: '1.25rem' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 600 }}>Layer C: Components &amp; APIs</h3>
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                Consumer-facing exports (e.g., <code>DynamicSelect</code>, <code>formatDate</code>). Explains props, signatures, accessibility, responsive behavior, and executable examples.
              </p>
            </Card>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--skyra-border)' }}>
            2. Metadata Model &amp; Source of Truth
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', marginBottom: '1rem', lineHeight: 1.6 }}>
            The documentation system relies on a framework-neutral <code>DocumentationRegistry</code>. 
            We strictly separate <strong>Machine-Derived</strong> data from <strong>Human-Authored</strong> explanations.
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
            <li><strong>Package Metadata:</strong> Bootstrapped directly from authoritative workspace <code>package.json</code> files.</li>
            <li><strong>Lifecycle Governance:</strong> Driven by Phase 9 platform standards (stable, experimental, deprecated).</li>
            <li><strong>Design Tokens:</strong> Derived strictly from <code>@skyra/design-tokens</code>. Do not hardcode hex codes.</li>
            <li><strong>What not to duplicate:</strong> Never manually redefine TypeScript signatures, package dependencies, or CSS styles globally.</li>
          </ul>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--skyra-border)' }}>
            3. Package Discovery
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
            The current Phase 10.1 registry discovers packages by parsing their manifests safely in a Node/Server context. This guarantees that when an export is added or a version bumped, the documentation dashboard synchronizes immediately without human intervention.
          </p>
        </section>

        <section>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--skyra-border)' }}>
            4. Future Phases
          </h2>
          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.6 }}>
            <li><strong>Phase 10.2 / 10.3:</strong> Implementation of AST parsing to automatically extract JSDoc and Prop types into the Layer C API models.</li>
            <li><strong>Phase 10.4:</strong> The Example Execution engine, allowing live component previews derived directly from public <code>@skyra/*</code> imports without internal path coupling.</li>
            <li><strong>Phase 10.6 / 10.7:</strong> Client-side search indexing and automated Changeset release history parsing.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
