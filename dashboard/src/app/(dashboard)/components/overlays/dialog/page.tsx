'use client';

import React, { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/button';;
import '@skyra-tech-platform/dialog';
import { DocsLayout } from '@/components/docs/DocsLayout';
import { DocsHeader } from '@/components/docs/DocsHeader';
import { PackageMeta } from '@/components/docs/PackageMeta';
import { InstallCommand } from '@/components/docs/InstallCommand';
import { LiveExample } from '@/components/docs/LiveExample';
import { HeadingAnchor } from '@/components/docs/HeadingAnchor';
import { CodeTabs } from '@/components/docs/CodeTabs';
import { AlertTriangle, Trash2, Info } from 'lucide-react';

export default function DialogDocsPage() {
  const [openModal, setOpenModal] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  
  const modalRef = useRef<any>(null);
  const drawerRef = useRef<any>(null);
  const confirmRef = useRef<any>(null);

  // Sync state when dialogs close natively (e.g. Escape, Backdrop, Close button)
  useEffect(() => {
    const m = modalRef.current;
    const d = drawerRef.current;
    const c = confirmRef.current;

    const onModalClose = () => setOpenModal(false);
    const onDrawerClose = () => setOpenDrawer(false);
    const onConfirmClose = () => setOpenConfirm(false);

    if (m) m.addEventListener('skyra-close', onModalClose);
    if (d) d.addEventListener('skyra-close', onDrawerClose);
    if (c) {
      c.addEventListener('skyra-close', onConfirmClose);
      c.addEventListener('skyra-cancel', onConfirmClose);
    }

    return () => {
      if (m) m.removeEventListener('skyra-close', onModalClose);
      if (d) d.removeEventListener('skyra-close', onDrawerClose);
      if (c) {
        c.removeEventListener('skyra-close', onConfirmClose);
        c.removeEventListener('skyra-cancel', onConfirmClose);
      }
    };
  }, []);

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
        version="0.1.0"
        type="Web Component"
      />

      <section id="quick-start" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="quick-start" level={2}>Quick Start</HeadingAnchor>
        <InstallCommand packageName="@skyra-tech-platform/dialog" />
      </section>
      
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', marginTop: '3rem', letterSpacing: '-0.01em' }}>
        Basic Usage
      </h3>
      <CodeTabs tabs={[
        {
          label: 'React',
          language: 'tsx',
          code: `import { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/dialog';

export function Example() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const handleClose = () => setOpen(false);
    if (el) el.addEventListener('skyra-close', handleClose);
    return () => {
      if (el) el.removeEventListener('skyra-close', handleClose);
    };
  }, []);

  return (
    <>
      <button onClick={() => setOpen(true)}>Open Modal</button>
      <skyra-tech-dialog ref={ref} open={open || undefined} mode="modal">
        <span slot="title">Basic Modal</span>
        <p>Content goes here.</p>
        <div slot="footer">
          <button onClick={() => setOpen(false)}>Close</button>
        </div>
      </skyra-tech-dialog>
    </>
  );
}`
        },
        {
          label: 'Vanilla JS',
          language: 'html',
          code: `<!-- Import the component globally -->
<script type="module" src="node_modules/@skyra-tech-platform/dialog/dist/index.js"></script>

<button id="open-btn">Open Modal</button>

<skyra-tech-dialog id="my-dialog" mode="modal">
  <span slot="title">Basic Modal</span>
  <p>Content goes here.</p>
  <div slot="footer">
    <button id="close-btn">Close</button>
  </div>
</skyra-tech-dialog>

<script>
  const dialog = document.getElementById('my-dialog');
  document.getElementById('open-btn').addEventListener('click', () => {
    dialog.open = true;
  });
  document.getElementById('close-btn').addEventListener('click', () => {
    dialog.open = false;
  });
</script>`
        }
      ]} />
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <skyra-tech-button onClick={() => setOpenModal(true)}>Open Modal</skyra-tech-button>
          <skyra-tech-dialog ref={modalRef} open={openModal || undefined} mode="modal">
            <span slot="title">Basic Modal</span>
            <p style={{ color: 'var(--skyra-text-muted)' }}>
              This is a basic modal wrapped over the canonical web component.
            </p>
            <div slot="footer" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <skyra-tech-button onClick={() => setOpenModal(false)}>Close</skyra-tech-button>
            </div>
          </skyra-tech-dialog>
        </LiveExample>
      </div>

      <HeadingAnchor id="examples">Examples</HeadingAnchor>
      
      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>Drawer</h3>
      <CodeTabs tabs={[{
        label: 'React',
        language: 'tsx',
        code: `<skyra-tech-dialog ref={ref} open={open || undefined} mode="drawer" side="right" drawer-width="400px">
  <span slot="title">Navigation Menu</span>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <button>Dashboard</button>
    <button>Settings</button>
  </div>
</skyra-tech-dialog>`
      }]} />
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <skyra-tech-button onClick={() => setOpenDrawer(true)}>Open Drawer</skyra-tech-button>
          <skyra-tech-dialog ref={drawerRef} open={openDrawer || undefined} mode="drawer" side="right" drawer-width="320px">
            <span slot="title">Navigation Menu</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <skyra-tech-button variant="ghost" style={{ justifyContent: 'flex-start' }}>Dashboard</skyra-tech-button>
              <skyra-tech-button variant="ghost" style={{ justifyContent: 'flex-start' }}>Settings</skyra-tech-button>
              <skyra-tech-button variant="ghost" style={{ justifyContent: 'flex-start' }}>Help</skyra-tech-button>
            </div>
          </skyra-tech-dialog>
        </LiveExample>
      </div>

      <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--skyra-text)', marginBottom: '0.75rem' }}>ConfirmDialog Composition</h3>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '1rem' }}>
        Confirm Dialogs are built by composing the <code>skyra-tech-dialog</code> with <code>hide-close-button</code> and custom slots.
      </p>
      <CodeTabs tabs={[{
        label: 'React',
        language: 'tsx',
        code: `<skyra-tech-dialog ref={ref} open={open || undefined} mode="modal" hide-close-button>
  <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column' }}>
    <div className="icon-wrapper"><TrashIcon /></div>
    <h2>Delete Item</h2>
    <p>Are you sure?</p>
    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
      <button onClick={() => setOpen(false)}>Cancel</button>
      <button className="danger" onClick={handleConfirm}>Delete</button>
    </div>
  </div>
</skyra-tech-dialog>`
      }]} />
      <div style={{ marginTop: '1rem' }}>
        <LiveExample>
          <skyra-tech-button variant="danger" onClick={() => setOpenConfirm(true)}>Delete Organization</skyra-tech-button>
          <skyra-tech-dialog ref={confirmRef} open={openConfirm || undefined} mode="modal" hide-close-button>
            <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{
                width: '48px', height: '48px', borderRadius: 'var(--skyra-radius-lg)',
                background: 'var(--skyra-danger-light)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--skyra-danger)',
              }}>
                <Trash2 size={22} />
              </div>
              <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--skyra-text)', margin: '0 0 0.625rem' }}>
                Delete Organization
              </h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--skyra-text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
                This action is permanent and will delete all associated data, invoices, and users.
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                <skyra-tech-button variant="ghost" onClick={() => setOpenConfirm(false)}>Cancel</skyra-tech-button>
                <skyra-tech-button variant="danger" onClick={() => { alert('Deleted'); setOpenConfirm(false); }}>Delete Permanently</skyra-tech-button>
              </div>
            </div>
          </skyra-tech-dialog>
        </LiveExample>
      </div>

      <HeadingAnchor id="technical">Technical Reference</HeadingAnchor>
      <p style={{ color: 'var(--skyra-text-muted)' }}>
        The canonical implementation is a native Web Component (<code>&lt;skyra-tech-dialog&gt;</code>) which natively supports focus trapping and escape-key dismissal using the browser's <code>HTMLDialogElement</code> API.
      </p>

    </DocsLayout>
  );
}
