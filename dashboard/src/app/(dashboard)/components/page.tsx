import React from 'react';
import Link from 'next/link';
import { ChevronRight, Layers } from 'lucide-react';

export const metadata = { title: 'Components — Skyra Platform' };

import { docsRegistry } from '@/docs-system/registry';
import { bootstrapRegistry } from '@/docs-system/bootstrap';

bootstrapRegistry();

const COMPONENT_GROUPS = [
  {
    title: 'Basic Controls',
    description: 'Core interactive primitives — fully framework-independent Web Components.',
    items: [
      { packageId: '@skyra-tech-platform/button', href: '/components/basic-controls/button', label: 'Button', desc: 'Framework-independent accessible button' },
      { packageId: '@skyra-tech-platform/input', href: '/components/basic-controls/input', label: 'Input', desc: 'Text input, search, password, and number controls.' },
      { packageId: '@skyra-tech-platform/textarea', href: '/components/basic-controls/textarea', label: 'Textarea', desc: 'Auto-resizing, character count, validation states.' },
      { packageId: '@skyra-tech-platform/checkbox', href: '/components/basic-controls/checkbox', label: 'Checkbox', desc: 'Accessible single and grouped checkboxes.' },
      { packageId: '@skyra-tech-platform/radio', href: '/components/basic-controls/radio', label: 'Radio', desc: 'WAI-ARIA roving tabindex single-selection controls.' },
      { packageId: '@skyra-tech-platform/switch', href: '/components/basic-controls/switch', label: 'Switch', desc: '5 design variants across 3 sizes.' },
    ],
  },
  {
    title: 'Selection',
    description: 'Dropdowns, comboboxes, and multi-select elements.',
    items: [
      { packageId: '@skyra-tech-platform/dynamic-select', href: '/components/selection/dynamic-select', label: 'Dynamic Select', desc: 'Single/multi select with search, creatable, chip display.' },
    ]
  },
  {
    title: 'Navigation',
    description: 'Wayfinding and structural routing controls.',
    items: [
      { packageId: '@skyra-tech-platform/tabs', href: '/components/navigation/tabs', label: 'Tabs', desc: 'Accessible tabbed navigation with line and pill variants.' },
    ]
  },
  {
    title: 'Layout',
    description: 'Application scaffolding and structure.',
    items: [
      { packageId: '@skyra-tech-platform/app-shell', href: '/components/layouts/app-shell', label: 'App Shell', desc: 'Framework-agnostic application layout component.' },
    ]
  },
  {
    title: 'Forms',
    description: 'Complex data entry and validation structures.',
    items: [
      { packageId: '@skyra-tech-platform/date-time', href: '/components/forms/date-time', label: 'Date & Time', desc: '10-component suite: Calendar, DateField, TimeField, and range inputs.' },
      { packageId: '@skyra-tech-platform/dynamic-form', href: '/components/forms/dynamic-form', label: 'Dynamic Form', desc: 'JSON-driven form generation.' },
    ]
  },
  {
    title: 'Feedback',
    description: 'User notification and system feedback.',
    items: [
      { packageId: '@skyra-tech-platform/notification', href: '/components/feedback/notification', label: 'Notification', desc: 'In-page alert banners and system alerts.' },
      { packageId: '@skyra-tech-platform/toast', href: '/components/feedback/toast', label: 'Toast', desc: 'Ephemeral overlay notifications.' },
      { packageId: '@skyra-tech-platform/loader', href: '/ui-components/loaders', label: 'Loader System', desc: 'Spinners, progress bars, and skeletons.' },
    ]
  },
  {
    title: 'Data Display',
    description: 'Complex data visualization and tabular display.',
    items: [
      { packageId: '@skyra-tech-platform/data-table', href: '/data-table', label: 'Data Table', desc: 'Virtualised data grid with sorting and filtering.' },
    ]
  },
  {
    title: 'Disclosure',
    description: 'Expandable panels and progressive disclosure.',
    items: [
      { packageId: '@skyra-tech-platform/accordion', href: '/components/disclosure/accordion', label: 'Accordion', desc: 'Expandable multi-section container with single/multiple expand modes.' },
      { packageId: '@skyra-tech-platform/collapsible', href: '/components/disclosure/collapsible', label: 'Collapsible', desc: 'Independent single expandable region primitive.' },
    ]
  },
  {
    title: 'Overlays',
    description: 'Modals, popovers, and contextual layers.',
    items: [
      { packageId: '@skyra-tech-platform/dialog', href: '/components/overlays/dialog', label: 'Dialog', desc: 'Accessible modal dialog wrapper.' },
    ]
  },
  {
    title: 'Documents',
    description: 'Document rendering and interaction.',
    items: [
      { packageId: '@skyra-tech-platform/pdf-viewer', href: '#', label: 'PDF Viewer', desc: 'Client-side PDF rendering component.', manualStatus: 'planned' },
    ]
  },
  {
    title: 'Utilities',
    description: 'Helper components and specialized rendering.',
    items: [
      { packageId: '@skyra-tech-platform/qr', href: '/components/utilities/qr', label: 'QR Code', desc: 'Framework-agnostic QR generation and styled rendering.' },
      { packageId: 'future-misc', href: '#', label: 'Future components', desc: 'Placeholder for upcoming utilities.', manualStatus: 'planned' },
    ]
  }
];

function resolveItem(item: any) {
  const pkg = docsRegistry.getPackage(item.packageId);
  return {
    ...item,
    status: item.manualStatus || (pkg ? pkg.status : 'planned'),
    tech: pkg && pkg.runtime === 'react-browser' ? 'React' : (pkg ? 'Web Component' : 'Misc')
  };
}

export default function ComponentsIndexPage() {
  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '1100px', margin: '0 auto' }}>
      <div style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <Layers size={28} style={{ color: 'var(--skyra-primary)' }} />
          <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '2rem', color: 'var(--skyra-text)', margin: 0 }}>
            Components
          </h1>
        </div>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '1.125rem', maxWidth: '700px', lineHeight: 1.6, margin: 0 }}>
          Canonical documentation for the Skyra Platform component library. Components are built as native Web Components with thin React adapters.
        </p>
      </div>

      {COMPONENT_GROUPS.map((group) => (
        <section key={group.title} style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--skyra-text)', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--skyra-border)' }}>
            {group.title}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', marginBottom: '1.5rem' }}>{group.description}</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {group.items.map(resolveItem).map((item) => {
              const isPlanned = item.status === 'planned';
              const CardContent = (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.25rem',
                    background: isPlanned ? 'var(--skyra-bg-muted)' : 'var(--skyra-surface)',
                    border: '1px solid var(--skyra-border)',
                    borderRadius: 'var(--skyra-radius-lg)',
                    textDecoration: 'none',
                    transition: isPlanned ? 'none' : 'border-color 0.15s ease, box-shadow 0.15s ease',
                    boxShadow: isPlanned ? 'none' : 'var(--skyra-shadow-sm)',
                    opacity: isPlanned ? 0.7 : 1,
                    height: '100%',
                    cursor: isPlanned ? 'default' : 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--skyra-text)', fontFamily: 'var(--skyra-font-display)' }}>
                      {item.label}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                      <span style={{ 
                        fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: 'var(--skyra-radius-full)', 
                        background: item.status === 'stable' ? 'var(--skyra-success-light)' : 'var(--skyra-bg-muted)', 
                        color: item.status === 'stable' ? 'var(--skyra-success)' : 'var(--skyra-text-muted)', 
                        border: item.status === 'stable' ? '1px solid var(--skyra-success)' : '1px solid transparent' 
                      }}>
                        {item.status}
                      </span>
                      {item.tech && (
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, padding: '0.15rem 0.45rem', borderRadius: 'var(--skyra-radius-full)', background: 'var(--skyra-bg-muted)', color: 'var(--skyra-text-muted)' }}>
                          {item.tech}
                        </span>
                      )}
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--skyra-text-muted)', margin: '0 0 0.75rem 0', flex: 1, lineHeight: 1.4 }}>
                    {item.desc}
                  </p>
                  {!isPlanned && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-primary)' }}>
                      View Documentation <ChevronRight size={13} />
                    </div>
                  )}
                </div>
              );

              return isPlanned ? (
                <div key={item.label}>{CardContent}</div>
              ) : (
                <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                  {CardContent}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
