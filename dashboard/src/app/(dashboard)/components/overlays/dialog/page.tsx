'use client';

import React, { useState } from 'react';
import { Button } from '@skyra/ui';
import { ConfirmDialog, Modal, Drawer } from '@skyra/dialogs';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';

export default function DialogDocsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const toc = [
    { id: 'quick-start', label: 'Quick Start' },
    { id: 'examples', label: 'Examples' },
    { id: 'technical', label: 'Technical Reference' },
  ];

  return (
    <DocsLayout toc={toc}>
      <DocsHeader 
        title="Dialog"
        description="Accessible modal dialogs, confirmation sheets, and overlay primitives built on platform design tokens."
        breadcrumbs={[
          { label: 'Components', href: '/components' },
          { label: 'Overlays' },
          { label: 'Dialog' }
        ]}
        badges={[
          { label: 'Stable', variant: 'stable' },
          { label: 'Web Component', variant: 'tech' }
        ]}
      />

      <PackageMeta 
        packageName="@skyra-tech-platform/dialog"
        elementName="<skyra-tech-dialog>"
        version="0.1.0"
        type="Web Component"
      />

      <HeadingAnchor id="quick-start">Quick Start</HeadingAnchor>
      <InstallCommand packageName="@skyra-tech-platform/dialog" />
      <InstallCommand packageName="@skyra/dialogs" />
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <LiveExample 
        language="tsx"
        code={`import { Modal } from '@skyra/dialogs';

export function Example() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      <Modal open={open} onClose={() => setOpen(false)} title="Basic Modal">
        Content goes here.
      </Modal>
    </>
  );
}`}
      >
        <Button onClick={() => setOpenModal(true)}>Open Modal</Button>
        <Modal open={openModal} onClose={() => setOpenModal(false)} title="Basic Modal">
          <p style={{ color: 'var(--skyra-text-muted)' }}>
            This is a basic modal wrapped over the canonical web component.
          </p>
          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={() => setOpenModal(false)}>Close</Button>
          </div>
        </Modal>
      </LiveExample>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Drawer</h3>
      <LiveExample 
        language="tsx"
        title="Drawer"
        description="A drawer that slides in from the edge of the screen."
        code={`import { Drawer } from '@skyra/dialogs';

export function DrawerExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Drawer</Button>
      <Drawer open={open} onClose={() => setOpen(false)} title="Navigation Menu" side="right">
        Links and forms go here.
      </Drawer>
    </>
  );
}`}
      >
        <Button onClick={() => setOpenDrawer(true)}>Open Drawer</Button>
        <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} title="Navigation Menu" side="right">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Dashboard</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Settings</Button>
            <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Help</Button>
          </div>
        </Drawer>
      </LiveExample>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>ConfirmDialog</h3>
      <LiveExample 
        language="tsx"
        title="Confirm Dialog"
        description="A specialized dialog for critical user actions."
        code={`import { ConfirmDialog } from '@skyra/dialogs';

export function ConfirmExample() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>Delete</Button>
      <ConfirmDialog 
        open={open} 
        onCancel={() => setOpen(false)} 
        onConfirm={() => setOpen(false)}
        title="Delete Item"
        message="Are you sure?"
        variant="danger"
        confirmLabel="Delete"
      />
    </>
  );
}`}
      >
        <Button variant="danger" onClick={() => setOpenConfirm(true)}>Delete Organization</Button>
        <ConfirmDialog 
          open={openConfirm} 
          onCancel={() => setOpenConfirm(false)} 
          onConfirm={() => { alert('Deleted'); setOpenConfirm(false); }}
          title="Delete Organization"
          message="This action is permanent and will delete all associated data, invoices, and users."
          variant="danger"
          confirmLabel="Delete Permanently"
        />
      </LiveExample>

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)' }}>
        The canonical implementation is a native Web Component (<code>&lt;skyra-tech-dialog&gt;</code>) which natively supports focus trapping and escape-key dismissal using the browser's <code>HTMLDialogElement</code> API. The React wrappers simply map props to the custom element.
      </p>

    </DocsLayout>
  );
}
