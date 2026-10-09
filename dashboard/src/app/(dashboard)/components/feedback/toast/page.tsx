'use client';

import React from 'react';
import '@skyra-tech-platform/button';
import { toast } from '@skyra-tech-platform/toast';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { CodeTabs } from '@/components/docs/CodeTabs';
import { ApiTable } from '@/components/docs/ApiTable';
import { FrameworkSupport } from '@/components/docs/FrameworkSupport';
import { AccessibilityPanel } from '@/components/docs/AccessibilityPanel';
import { UsageGuidance } from '@/components/docs/UsageGuidance';

export default function ToastDocsPage() {
  const triggerBasicToast = () => {
    toast({
      title: 'Action Completed',
      message: 'Your file has been successfully uploaded to the server.',
      type: 'success',
    });
  };

  const triggerActionToast = () => {
    toast({
      title: 'Update Available',
      message: 'A new version of the dashboard is available.',
      type: 'info',
      duration: 10000,
      action: {
        label: 'Update Now',
        onClick: () => {
          toast({ title: 'Updating...', type: 'info', duration: 2000 });
        }
      }
    });
  };

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'examples', label: 'Examples' },
    { id: 'usage', label: 'Usage Guidance' },
    { id: 'api', label: 'API Reference' },
    { id: 'frameworks', label: 'Framework Usage' },
    { id: 'accessibility', label: 'Accessibility' }
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Toast"
        description="Transient, event-driven feedback mechanism. Imperative API leveraging the native Notification component for rendering."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Feedback' },
          { label: 'Toast' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Vanilla JS API', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/toast"
        version="0.1.0"
        type="TypeScript / Web Component"
      />

      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/toast" />
      </section>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <CodeTabs tabs={[
        {
          label: 'TypeScript',
          language: 'ts',
          code: `import { toast } from '@skyra-tech-platform/toast';
// Must also import the CSS/Component side effects
import '@skyra-tech-platform/toast';

function handleSave() {
  toast({
    title: 'Profile Saved',
    message: 'Your profile settings have been updated successfully.',
    type: 'success',
    duration: 5000
  });
}`
        }
      ]} />
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <skyra-tech-button onClick={triggerBasicToast}>Trigger Basic Toast</skyra-tech-button>
            <skyra-tech-button onClick={triggerActionToast} variant="secondary">Trigger Action Toast</skyra-tech-button>
          </div>
        </LiveExample>
      </div>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance
        doItems={[
          'Use Toast for transient, event-driven feedback (e.g., "Saved successfully").',
          'Use Notification directly for persistent, layout-integrated state.',
          'Provide clear, concise titles and optional short descriptions.'
        ]}
        dontItems={[
          'Do not use Toasts for critical system errors that require user intervention.',
          'Do not stack more than 5 toasts at once (viewport limit).',
          'Avoid overly long messages that cause toasts to wrap excessively.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <ApiTable 
        title="toast(options)"
        headers={['Property', 'Type', 'Description']}
        rows={[
          { name: 'title', type: 'string | HTMLElement', description: 'The title of the toast.' },
          { name: 'message', type: 'string | HTMLElement', description: 'The main message body.' },
          { name: 'type', type: "'success' | 'error' | 'warning' | 'info' | 'neutral'", description: 'The semantic variant.' },
          { name: 'duration', type: 'number', description: 'Auto-dismissal duration in milliseconds (default: 5000).' },
          { name: 'action', type: 'ToastAction', description: 'Optional action button with label and onClick handler.' },
          { name: 'id', type: 'string', description: 'Explicit ID for the toast. Useful for updating.' },
        ]}
      />
      <ApiTable 
        title="Methods"
        headers={['Method', 'Signature', 'Description']}
        rows={[
          { name: 'toast', type: '(options: ToastOptions) => string', description: 'Triggers a toast and returns its unique ID.' },
          { name: 'toast.dismiss', type: '(id: string) => void', description: 'Dismisses a specific toast.' },
          { name: 'toast.dismissAll', type: '() => void', description: 'Dismisses all active toasts.' },
          { name: 'toast.update', type: '(id: string, options: Partial<ToastOptions>) => void', description: 'Updates an existing toast.' },
        ]}
      />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport
        frameworks={[
          {
            name: 'React / Next.js',
            support: 'e2e',
            integration: 'Since it is a Vanilla JS imperative API, it works flawlessly across React. Ensure you import `@skyra-tech-platform/toast` side-effects once at the root.'
          },
          {
            name: 'Vanilla JS',
            support: 'e2e',
            integration: 'The API is entirely framework-agnostic. Import and call `toast()`.'
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel
        features={[
          'The `skyra-toast-viewport` element uses role="region" and aria-live="polite".',
          'Under the hood, it leverages `<skyra-notification-bar>` which manages its own focus and semantics.',
          'Action buttons inherit accessible contrast and focus rings.'
        ]}
      />
    </DocsLayout>
  );
}
