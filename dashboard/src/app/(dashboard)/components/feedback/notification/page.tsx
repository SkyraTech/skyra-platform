'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/button';
import '@skyra-tech-platform/notification';
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

export default function NotificationDocsPage() {
  const [showNotification, setShowNotification] = useState(false);
  const notifRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = notifRef.current;
    const handleClose = () => setShowNotification(false);
    if (el) el.addEventListener('skyra-close', handleClose);
    return () => {
      if (el) el.removeEventListener('skyra-close', handleClose);
    };
  }, [showNotification]);

  const triggerNotification = () => {
    setShowNotification(false);
    setTimeout(() => setShowNotification(true), 10);
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
        title="Notification"
        description="Enterprise feedback bars featuring timed auto-dismissal, top countdown progress bar, pause-on-hover, semantic status colors, and optional system error/status codes."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Feedback' },
          { label: 'Notification' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/notification"
        version="0.1.0"
        type="Web Component"
      />

      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/notification" />
      </section>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <CodeTabs tabs={[
        {
          label: 'React',
          language: 'tsx',
          code: `import { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/notification';

export function Example() {
  const [show, setShow] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const handleClose = () => setShow(false);
    if (el) el.addEventListener('skyra-close', handleClose);
    return () => {
      if (el) el.removeEventListener('skyra-close', handleClose);
    };
  }, []);

  return (
    <>
      <button onClick={() => setShow(true)}>Show Notification</button>
      {show && (
        <skyra-notification-bar ref={ref} type="success" code="200" duration="5000">
          <span slot="title">Invoice Generated</span>
          Invoice #INV-2026-0892 has been generated and queued for dispatch.
        </skyra-notification-bar>
      )}
    </>
  );
}`
        },
        {
          label: 'Vanilla JS',
          language: 'html',
          code: `<!-- Import the component globally -->
<script type="module" src="node_modules/@skyra-tech-platform/notification/dist/index.js"></script>

<skyra-notification-bar type="info" duration="3000">
  <span slot="title">System Update</span>
  A new system update is available for download.
</skyra-notification-bar>`
        }
      ]} />
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <skyra-tech-button onClick={triggerNotification}>Spawn Notification</skyra-tech-button>
          
          <div style={{ marginTop: '1.5rem', minHeight: '80px' }}>
            {showNotification && (
              <skyra-notification-bar ref={notifRef as any} type="info" code="INFO_100" duration="5000">
                <span slot="title">Telemetry Synchronized (5s Auto-Dismiss)</span>
                Cluster status metrics updated. Watch the animated top progress bar reflect remaining time.
              </skyra-notification-bar>
            )}
          </div>
        </LiveExample>
      </div>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1.5rem' }}>
        The notification component supports 5 distinct semantic types. The component natively renders semantic icons matching each type.
      </p>
      <LiveExample>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
          <skyra-notification-bar type="success" duration="0" code="SUCCESS">
            <span slot="title">Transaction Successful</span>
            The operation completed successfully without errors.
          </skyra-notification-bar>

          <skyra-notification-bar type="error" duration="0" code="ERR_500">
            <span slot="title">Connection Failed</span>
            Failed to connect to the database. Please try again.
          </skyra-notification-bar>

          <skyra-notification-bar type="warning" duration="0">
            <span slot="title">Disk Space Low</span>
            You are running out of storage space.
          </skyra-notification-bar>

          <skyra-notification-bar type="info" duration="0">
            <span slot="title">New Feature Available</span>
            Check out the new accessibility dashboard in your settings.
          </skyra-notification-bar>

          <skyra-notification-bar type="neutral" duration="0">
            <span slot="title">Draft Saved</span>
            Your changes have been saved locally.
          </skyra-notification-bar>
        </div>
      </LiveExample>

      <HeadingAnchor id="usage">Usage Guidance</HeadingAnchor>
      <UsageGuidance
        doItems={[
          'Use concise and clear messages.',
          'Provide a recognizable `type` that matches the urgency of the notification.',
          'Include a `code` for technical contexts (e.g., HTTP status, internal error codes).',
          'Use `duration="0"` for highly critical errors that require manual dismissal.'
        ]}
        dontItems={[
          'Do not use notifications for permanent page-level banners; use an Alert instead.',
          'Do not rely on auto-dismiss for actions that require explicit user confirmation.',
          'Do not inject unescaped user data directly into the message slot.'
        ]}
      />

      <HeadingAnchor id="api">API Reference</HeadingAnchor>
      <ApiTable 
        title="Properties & Attributes"
        rows={[
          { name: 'type', type: "'success' | 'error' | 'warning' | 'info' | 'neutral'", defaultVal: "'info'", description: 'The semantic variant of the notification. Dictates colors and default icons.' },
          { name: 'code', type: 'string', description: 'An optional badge string displayed next to the title.' },
          { name: 'duration', type: 'number', defaultVal: '5000', description: 'Auto-dismissal duration in milliseconds. Set to 0 to disable auto-dismissal.' },
        ]}
      />
      <ApiTable 
        title="Events"
        headers={['Event Name', 'Detail', 'Description']}
        rows={[
          { name: 'skyra-close', type: 'CustomEvent<null>', description: 'Fired when the notification is dismissed manually by clicking the close button or automatically when the duration expires.' },
        ]}
      />
      <ApiTable 
        title="Slots"
        headers={['Slot Name', 'Description']}
        rows={[
          { name: 'title', description: 'The emphasized title text displayed at the top of the notification.' },
          { name: 'icon', description: 'Overrides the default semantic icon.' },
          { name: 'default', description: 'The main message content body.' },
        ]}
      />

      <HeadingAnchor id="frameworks">Framework Usage</HeadingAnchor>
      <FrameworkSupport
        frameworks={[
          {
            name: 'React 19+',
            support: 'e2e',
            integration: 'React 19 supports Custom Elements natively. Pass attributes directly, and use a ref to attach the custom skyra-close event listener.'
          },
          {
            name: 'Vanilla JS / HTML',
            support: 'e2e',
            integration: 'Import the Web Component globally. Use addEventListener to listen to skyra-close.'
          }
        ]}
      />

      <HeadingAnchor id="accessibility">Accessibility</HeadingAnchor>
      <AccessibilityPanel
        features={[
          'Automatically applies role="alert" to the host element.',
          'Focus-managed: The timer pauses when the user focuses the component or hovers over it with a mouse.',
          'Sufficient contrast ratios across all 5 semantic variants in both light and dark mode.',
          'Includes aria-label="Close notification" on the dismissal button.'
        ]}
      />
    </DocsLayout>
  );
}
