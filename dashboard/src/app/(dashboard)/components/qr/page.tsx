'use client';

import React from 'react';
import '@skyra-tech-platform/qr/web-component';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { ApiTable } from '@/components/docs/ApiTable';
import { ApiTabs } from '@/components/docs/ApiTabs';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { UsageGuidance } from '@/components/docs/UsageGuidance';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';
import { RelatedComponents } from '@/components/docs/RelatedComponents';
import { Callout } from '@/components/docs/Callout';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { CodeBlock } from '@/components/docs/CodeBlock';

export default function QRDocsPage() {
  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'examples', label: 'Examples' },
    { id: 'usage', label: 'Usage Guidance' },
    { id: 'api', label: 'API Reference' },
    { id: 'frameworks', label: 'Framework Usage' },
    { id: 'content-types', label: 'Content Types' },
    { id: 'analysis', label: 'Analysis & Validation' },
    { id: 'accessibility', label: 'Accessibility' },
    { id: 'related', label: 'Related Components' },
    { id: 'technical', label: 'Technical Reference' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="QR Code"
        description="Framework-agnostic QR generation and styled rendering Web Component for the Skyra Tech Platform."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'QR' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/qr"
        elementName="<skyra-tech-qr-code>"
        version="0.1.0"
        type="Web Component"
      />

      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
        The QR package is a reusable Platform capability that provides mathematically sound QR generation, robust SVG rendering, styling support, and validation. The QR package is purely responsible for generation and rendering.
      </p>

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/qr" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="html"
        code={`<script type="module">
  import '@skyra-tech-platform/qr/web-component';
</script>

<skyra-tech-qr-code value="https://skyra.tech"></skyra-tech-qr-code>`}
      >
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', padding: '2rem', backgroundColor: 'var(--skyra-bg-subtle)', borderRadius: 'var(--skyra-radius-md)' }}>
          <skyra-tech-qr-code value="https://skyra.tech" scale={4} margin={4}></skyra-tech-qr-code>
        </div>
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Styling & Colors</h3>
      <LiveExample 
        language="html"
        title="Styled QR Codes"
        description="Customize the module shape, finder shape, and colors using native attributes."
        code={`<skyra-tech-qr-code 
  value="https://skyra.tech"
  module-shape="dot"
  finder-shape="rounded"
  color-dark="#0f172a"
  finder-color="#3b82f6"
></skyra-tech-qr-code>`}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <skyra-tech-qr-code value="https://skyra.tech" module-shape="dot" finder-shape="rounded" color-dark="#0f172a" finder-color="#3b82f6"></skyra-tech-qr-code>
            <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>Dot Modules & Rounded Finders</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <skyra-tech-qr-code value="https://skyra.tech" module-shape="rounded" finder-shape="square" color-dark="#4c1d95" color-light="#f3e8ff"></skyra-tech-qr-code>
            <span style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>Custom Background Color</span>
          </div>
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance 
        doItems={[
          'Use the QR package for generating valid QR matrices from URLs, Text, Emails, vCards, etc.',
          'Verify contrast levels using the built-in analyzer when allowing users to pick custom colors.',
          'Maintain a minimum margin (quiet zone) of 4 to ensure reliable optical scanning.',
          'Rely on the Dashboard for business logic, UI orchestration, and data export (PNG/Print).'
        ]}
        dontItems={[
          'Do not use this component to generate raw SVG strings directly in the UI; use the <skyra-tech-qr-code> Web Component which handles rendering securely.',
          'Do not attempt to pass arbitrary HTML or malicious content into the value attribute—it will safely be escaped as QR text, not executed as script.',
          'Do not set extremely low contrast combinations or same-color foregrounds/backgrounds, as the QR will fail to scan.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <ApiTabs 
        tabs={[
          {
            id: 'attributes',
            label: 'Properties & Attributes',
            content: (
              <ApiTable 
                rows={[
                  { name: 'value', type: 'string', defaultVal: "''", description: 'The payload data to encode into the QR code.' },
                  { name: 'error-correction-level', type: "'L' | 'M' | 'Q' | 'H'", defaultVal: "'M'", description: 'The error correction level. Higher levels allow for more visual damage but create denser matrices.' },
                  { name: 'margin', type: 'number', defaultVal: "4", description: 'The size of the quiet zone around the QR code.' },
                  { name: 'scale', type: 'number', defaultVal: "4", description: 'The scale multiplier for the SVG output.' },
                  { name: 'color-dark', type: 'string', defaultVal: "'#000000'", description: 'The hex or rgba color for the QR data modules.' },
                  { name: 'color-light', type: 'string', defaultVal: "'#ffffff'", description: 'The hex or rgba color for the QR background.' },
                  { name: 'module-shape', type: "'square' | 'rounded' | 'dot'", defaultVal: "'square'", description: 'The visual shape of the data modules.' },
                  { name: 'finder-shape', type: "'square' | 'rounded'", defaultVal: "'square'", description: 'The visual shape of the three corner finder patterns.' },
                  { name: 'finder-color', type: 'string', defaultVal: 'same as color-dark', description: 'The color of the finder patterns, allowing for distinct corner accents.' },
                  { name: 'version', type: 'number | undefined', defaultVal: "undefined", description: 'Force a specific QR version (1-40). Usually left undefined to auto-size.' },
                  { name: 'mask-pattern', type: 'number | undefined', defaultVal: "undefined", description: 'Force a specific mask pattern (0-7).' },
                ]}
              />
            )
          }
        ]}
      />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport 
        frameworks={[
          { 
            name: 'Vanilla HTML / JS', 
            support: 'e2e', 
            integration: <p>Import <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/qr/web-component</code> and use <code style={{fontFamily: 'var(--skyra-font-mono)'}}>&lt;skyra-tech-qr-code&gt;</code> natively.</p> 
          },
          { 
            name: 'React / Next.js', 
            support: 'e2e', 
            integration: <p>Declare the custom element in your JSX intrinsic elements (e.g., <code style={{fontFamily: 'var(--skyra-font-mono)'}}>custom-elements.d.ts</code>) to satisfy TypeScript. No adapter is required.</p> 
          },
          { 
            name: 'Angular / Vue 3 / Svelte', 
            support: 'architecture', 
            integration: <p>Standard native element property/attribute bindings work automatically.</p> 
          }
        ]}
      />

      <HeadingAnchor id="content-types">Content Types</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        The core <code style={{fontFamily: 'var(--skyra-font-mono)'}}>@skyra-tech-platform/qr</code> package exports a <code style={{fontFamily: 'var(--skyra-font-mono)'}}>QRContentBuilder</code> utility for robust serialization of 9 distinct payload types:
      </p>
      <ul style={{ color: 'var(--skyra-text)', marginBottom: '3rem', paddingLeft: '1.5rem', lineHeight: 1.8 }}>
        <li><strong>Text</strong>: Standard string serialization</li>
        <li><strong>URL</strong>: Sanitized and protocol-prefixed</li>
        <li><strong>Phone</strong>: <code style={{fontFamily: 'var(--skyra-font-mono)'}}>tel:</code> prefix support</li>
        <li><strong>SMS</strong>: <code style={{fontFamily: 'var(--skyra-font-mono)'}}>smsto:</code> prefix with optional pre-filled message</li>
        <li><strong>Email</strong>: <code style={{fontFamily: 'var(--skyra-font-mono)'}}>mailto:</code> prefix with subject and body query parameter encoding</li>
        <li><strong>Wi-Fi</strong>: <code style={{fontFamily: 'var(--skyra-font-mono)'}}>WIFI:T:WPA;S:ssid;P:pwd;;</code> format generation</li>
        <li><strong>vCard</strong>: Robust serialization of <code style={{fontFamily: 'var(--skyra-font-mono)'}}>BEGIN:VCARD</code> for contacts</li>
        <li><strong>Calendar</strong>: <code style={{fontFamily: 'var(--skyra-font-mono)'}}>BEGIN:VEVENT</code> formatting for events</li>
        <li><strong>Geo</strong>: <code style={{fontFamily: 'var(--skyra-font-mono)'}}>geo:lat,lng</code> URI generation</li>
      </ul>

      <HeadingAnchor id="analysis">Analysis & Validation</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        The QR package exports <code style={{fontFamily: 'var(--skyra-font-mono)'}}>analyzeQRContrast</code> and <code style={{fontFamily: 'var(--skyra-font-mono)'}}>analyzeScanability</code> utilities to mathematically verify generated configurations.
      </p>
      <Callout type="warning" title="Optical Scanability">
        While the matrix validation and SVG rendering are mathematically verified, true optical decoding by a mobile camera depends heavily on screen brightness, camera focus, and physical rendering scale. <strong>Manual camera verification is required</strong> for critical QR integrations.
      </Callout>

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel 
        features={[
          <div key="ar"><strong style={{ color: 'var(--skyra-text)' }}>ARIA Role:</strong> The rendered SVG automatically includes <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>role="img"</code>.</div>,
          <div key="al"><strong style={{ color: 'var(--skyra-text)' }}>Labels:</strong> An implicit <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>&lt;title&gt;</code> tag and <code style={{ fontFamily: 'var(--skyra-font-mono)' }}>aria-label</code> are injected to provide screen-reader context.</div>,
          <div key="es"><strong style={{ color: 'var(--skyra-text)' }}>Error States:</strong> If generation fails, a readable error state replaces the blank shadow DOM natively without crashing the browser.</div>
        ]}
        codeExample={{
          language: 'html',
          code: `<skyra-tech-qr-code 
  value="https://skyra.tech"
  aria-label="QR Code link to Skyra Tech Platform"
></skyra-tech-qr-code>`
        }}
      />

      <HeadingAnchor id="dashboard-integration">Dashboard Integration Example</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
        The Skyra Platform Dashboard embeds the QR Web Component alongside standard form controls to provide a full "QR Studio" experience. The Dashboard manages state, user input, and export features (PNG download and Print).
      </p>
      <CodeBlock 
        language="tsx"
        code={`// QR Studio Snippet (Simplified)
// A simplified abstraction of how the QR Component connects to application state in React.

export function QRStudio() {
  const [url, setUrl] = useState('https://skyra.tech');
  
  return (
    <div className="qr-studio-layout">
      {/* Configuration Form Managed by Application */}
      <skyra-tech-input 
        label="URL Destination" 
        value={url} 
        onInput={(e) => setUrl(e.target.value)} 
      />
      
      {/* Render Output Delegated to QR Component */}
      <div className="qr-preview-pane">
        <skyra-tech-qr-code 
          value={url} 
          error-correction-level="H"
        ></skyra-tech-qr-code>
      </div>
    </div>
  );
}`}
      />

      <HeadingAnchor id="related">Related Components</HeadingAnchor>
      <RelatedComponents 
        components={[
          { title: 'Dynamic Select', description: 'Used to switch QR payload types in the Dashboard.', category: 'Selection', href: '/components/selection/dynamic-select' },
          { title: 'Notification Bar', description: 'Used to provide feedback upon QR Export.', category: 'Basic Controls', href: '/components/basic-controls/notification' }
        ]}
      />

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <Callout type="tech" title="SSR / RSC Hydration">
        The custom element class extension guards against <code style={{fontFamily: 'var(--skyra-font-mono)'}}>HTMLElement</code> being undefined in Node environments, ensuring 100% safe Server-Side Rendering support in Next.js without hydration errors.
      </Callout>
      <Callout type="tech" title="Exports">
        PNG and Print export workflows are executed by the Dashboard integration leveraging standard Canvas Web APIs and browser print dialogs. The QR package remains strictly focused on deterministic SVG rendering.
      </Callout>
      <Callout type="success" title="Security">
        Payload values are strict-escaped before SVG interpolation via <code style={{fontFamily: 'var(--skyra-font-mono)'}}>escapeXml()</code>, guaranteeing that cross-site scripting (XSS) vectors or arbitrary HTML payloads cannot be executed.
      </Callout>
    </DocsLayout>
  );
}
