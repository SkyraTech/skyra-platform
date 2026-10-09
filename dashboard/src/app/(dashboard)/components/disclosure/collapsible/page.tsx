'use client';

import React from 'react';
import {
  DocsLayout,
  DocsHeader,
  PackageMeta,
  ApiTable,
  ApiTabs,
  FrameworkSupport,
  InstallCommand,
  LiveExample,
  AccessibilityPanel
} from '@/docs-system/components';
import { Collapsible, CollapsibleTrigger, CollapsibleContent, Badge } from '@/components/ui';
import { ChevronsUpDown } from 'lucide-react';
import '@skyra-tech-platform/button';

export default function CollapsibleDocsPage() {
  const codeBasic = `
<Collapsible defaultOpen={false}>
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
    <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>@skyra/core-engine package</h4>
    <CollapsibleTrigger className="skyra-btn skyra-btn-outline skyra-btn-sm">
      <ChevronsUpDown size={14} style={{ marginRight: '6px' }} />
      Toggle Details
    </CollapsibleTrigger>
  </div>
  <CollapsibleContent>
    <div style={{ padding: '1rem', border: '1px solid var(--skyra-border)', borderTop: 'none', borderRadius: '0 0 var(--skyra-radius-md) var(--skyra-radius-md)' }}>
      <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
        Version: 14.2.0<br/>
        Size: 1.4MB<br/>
        Last updated: 3 days ago
      </p>
    </div>
  </CollapsibleContent>
</Collapsible>
`.trim();

  return (
    <DocsLayout
      toc={[
        { id: 'overview', label: 'Overview' },
        { id: 'installation', label: 'Installation' },
        { id: 'usage', label: 'Usage Examples' },
        { id: 'api', label: 'API Reference' },
        { id: 'accessibility', label: 'Accessibility' }
      ]}
    >
      <DocsHeader
        title="Collapsible"
        description="Independent single expandable region primitive for advanced options and developer payload diagnostics."
        packageId="@skyra-tech-platform/collapsible"
      />

      <section id="overview">
        <PackageMeta packageId="@skyra-tech-platform/collapsible" />
      </section>

      <section id="installation" style={{ marginTop: '3rem' }}>
        <h2 className="docs-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--skyra-text)' }}>Installation</h2>
        <InstallCommand packageName="@skyra-tech-platform/collapsible" />
        <FrameworkSupport react vue svelte vanilla />
      </section>

      <section id="usage" style={{ marginTop: '3rem' }}>
        <h2 className="docs-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--skyra-text)' }}>Usage Examples</h2>
        
        <LiveExample
          title="Basic Collapsible"
          description="Single independent collapsible region with an accessible toggle button."
          code={codeBasic}
        >
          <div style={{ width: '100%' }}>
            <Collapsible defaultOpen={false}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)' }}>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>@skyra/core-engine package</h4>
                <CollapsibleTrigger className="skyra-btn skyra-btn-outline skyra-btn-sm" style={{ display: 'flex', alignItems: 'center' }}>
                  <ChevronsUpDown size={14} style={{ marginRight: '6px' }} />
                  Toggle Details
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div style={{ padding: '1rem', border: '1px solid var(--skyra-border)', borderTop: 'none', borderRadius: '0 0 var(--skyra-radius-md) var(--skyra-radius-md)' }}>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
                    Version: 14.2.0<br/>
                    Size: 1.4MB<br/>
                    Last updated: 3 days ago
                  </p>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </LiveExample>

        <LiveExample
          title="Disabled State"
          description="A collapsible component that cannot be toggled."
          code={`<Collapsible disabled>\n  <CollapsibleTrigger>Can't toggle me</CollapsibleTrigger>\n  <CollapsibleContent>Secret</CollapsibleContent>\n</Collapsible>`}
        >
          <div style={{ width: '100%' }}>
            <Collapsible disabled>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', opacity: 0.5 }}>
                <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Archived Project</h4>
                <CollapsibleTrigger className="skyra-btn skyra-btn-outline skyra-btn-sm" style={{ display: 'flex', alignItems: 'center' }}>
                  <ChevronsUpDown size={14} style={{ marginRight: '6px' }} />
                  Toggle Details
                </CollapsibleTrigger>
              </div>
              <CollapsibleContent>
                <div>Hidden</div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </LiveExample>
      </section>

      <section id="api" style={{ marginTop: '3rem' }}>
        <h2 className="docs-heading" style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--skyra-text)' }}>API Reference</h2>
        
        <ApiTabs
          tabs={[
            {
              label: '<skyra-collapsible>',
              content: (
                <ApiTable
                  props={[
                    { name: 'open', type: 'boolean', default: 'false', description: 'Whether the collapsible region is currently expanded.' },
                    { name: 'disabled', type: 'boolean', default: 'false', description: 'Prevents the user from interacting with the collapsible.' },
                  ]}
                  events={[
                    { name: 'skyra-collapsible-change', detail: '{ open: boolean }', description: 'Fired when the collapsible state changes.' }
                  ]}
                  slots={[
                    { name: 'trigger', description: 'Content rendered inside the native <button>.' },
                    { name: 'default', description: 'Content rendered in the expanded region.' }
                  ]}
                />
              )
            }
          ]}
        />
      </section>

      <section id="accessibility" style={{ marginTop: '3rem' }}>
        <AccessibilityPanel
          description="The Collapsible component follows the WAI-ARIA disclosure pattern."
          features={[
            'Utilizes native `<button>` element for the disclosure trigger.',
            '`aria-expanded` is automatically managed on the trigger.',
            '`aria-controls` links the trigger to its content panel.',
            '`Enter` and `Space` keyboard actions toggle the expanded state.',
            'Follows OS-level prefers-reduced-motion preferences.'
          ]}
        />
      </section>
    </DocsLayout>
  );
}
