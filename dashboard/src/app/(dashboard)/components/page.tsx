import React from 'react';
import Link from 'next/link';
import { ChevronRight, Layers } from 'lucide-react';

export const metadata = { title: 'Components — Skyra Platform' };

const COMPONENT_GROUPS = [
  {
    title: 'Basic Controls',
    description: 'Core interactive primitives — fully framework-independent Web Components.',
    items: [
      { href: '/components/basic-controls/button', label: 'Button', desc: 'Framework-independent accessible button', status: 'stable', tech: 'Web Component' },
      { href: '/components/basic-controls/input', label: 'Input', desc: 'Text input, search, password, and number controls.', status: 'stable', tech: 'Web Component' },
      { href: '/components/basic-controls/textarea', label: 'Textarea', desc: 'Auto-resizing, character count, validation states.', status: 'stable', tech: 'Web Component' },
      { href: '/components/basic-controls/checkbox', label: 'Checkbox', desc: 'Accessible single and grouped checkboxes.', status: 'stable', tech: 'Web Component' },
      { href: '/components/basic-controls/radio', label: 'Radio', desc: 'WAI-ARIA roving tabindex single-selection controls.', status: 'stable', tech: 'Web Component' },
      { href: '/components/basic-controls/switch', label: 'Switch', desc: '5 design variants across 3 sizes.', status: 'stable', tech: 'Web Component' },
    ],
  },
  {
    title: 'Selection',
    description: 'Dropdowns, comboboxes, and multi-select elements.',
    items: [
      { href: '/components/selection/dynamic-select', label: 'Dynamic Select', desc: 'Single/multi select with search, creatable, chip display.', status: 'stable', tech: 'Web Component' },
    ]
  },
  {
    title: 'Forms',
    description: 'Complex data entry and validation structures.',
    items: [
      { href: '/components/forms/date-time', label: 'Date & Time', desc: '10-component suite: Calendar, DateField, TimeField, and range inputs.', status: 'stable', tech: 'Web Component' },
      { href: '#', label: 'Dynamic Form', desc: 'JSON-driven form generation.', status: 'planned', tech: 'React' },
    ]
  },
  {
    title: 'Feedback',
    description: 'User notification and system feedback.',
    items: [
      { href: '#', label: 'Notification', desc: 'In-page alert banners and system alerts.', status: 'planned', tech: 'Web Component' },
      { href: '#', label: 'Toast', desc: 'Ephemeral overlay notifications.', status: 'planned', tech: 'Web Component' },
    ]
  },
  {
    title: 'Data Display',
    description: 'Complex data visualization and tabular display.',
    items: [
      { href: '#', label: 'Data Table', desc: 'Virtualised data grid with sorting and filtering.', status: 'planned', tech: 'React' },
    ]
  },
  {
    title: 'Overlays',
    description: 'Modals, popovers, and contextual layers.',
    items: [
      { href: '#', label: 'Dialog', desc: 'Accessible modal dialog wrapper.', status: 'planned', tech: 'Web Component' },
    ]
  },
  {
    title: 'Documents',
    description: 'Document rendering and interaction.',
    items: [
      { href: '#', label: 'PDF Viewer', desc: 'Client-side PDF rendering component.', status: 'planned', tech: 'React' },
    ]
  },
  {
    title: 'Utilities',
    description: 'Helper components and future additions.',
    items: [
      { href: '#', label: 'Future components', desc: 'Placeholder for upcoming utilities.', status: 'planned', tech: 'Misc' },
    ]
  }
];

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
            {group.items.map((item) => {
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
