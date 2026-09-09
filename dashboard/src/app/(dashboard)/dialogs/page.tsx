'use client';
import React, { useState } from 'react';
import { ConfirmDialog, Modal, Drawer } from '@skyra/dialogs';
import { Button, Input, Checkbox } from '@skyra/ui';
import { AlertCircle, Trash2, CheckCircle2 } from 'lucide-react';

export default function DialogsPage() {
  // Confirm Dialog states
  const [confirmPrimary, setConfirmPrimary] = useState(false);
  const [confirmWarning, setConfirmWarning] = useState(false);
  const [confirmDanger, setConfirmDanger] = useState(false);

  // Modal states
  const [modalSm, setModalSm] = useState(false);
  const [modalMd, setModalMd] = useState(false);
  const [modalLg, setModalLg] = useState(false);

  // Drawer states
  const [drawerRight, setDrawerRight] = useState(false);
  const [drawerLeft, setDrawerLeft] = useState(false);
  const [drawerBottom, setDrawerBottom] = useState(false);

  return (
    <div className="dash-page" style={{ maxWidth: '900px' }}>
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        Dialogs Showcase
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '3rem' }}>
        Interactive demonstration of <code>ConfirmDialog</code>, <code>Modal</code>, and <code>Drawer</code>. All overlays implement focus trapping and escape-key dismissal.
      </p>

      {/* Confirm Dialogs */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Confirm Dialogs</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button onClick={() => setConfirmPrimary(true)}>Primary Confirm</Button>
          <Button variant="orange" onClick={() => setConfirmWarning(true)}>Warning Confirm</Button>
          <Button variant="danger" onClick={() => setConfirmDanger(true)}>Danger Confirm</Button>
        </div>
      </section>

      {/* Modals */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Modals (Sizes)</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="outline" onClick={() => setModalSm(true)}>Small (sm)</Button>
          <Button variant="outline" onClick={() => setModalMd(true)}>Medium (md)</Button>
          <Button variant="outline" onClick={() => setModalLg(true)}>Large (lg)</Button>
        </div>
      </section>

      {/* Drawers */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>Drawers (Positions)</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button variant="ghost" onClick={() => setDrawerRight(true)}>Right Drawer</Button>
          <Button variant="ghost" onClick={() => setDrawerLeft(true)}>Left Drawer</Button>
          <Button variant="ghost" onClick={() => setDrawerBottom(true)}>Bottom Drawer</Button>
        </div>
      </section>


      {/* OVERLAYS RENDERED BELOW */}

      <ConfirmDialog
        open={confirmPrimary}
        onCancel={() => setConfirmPrimary(false)}
        title="Approve Transaction"
        message="Are you sure you want to approve this transaction? This action cannot be undone."
        confirmLabel="Approve"
        onConfirm={() => { alert('Approved'); setConfirmPrimary(false); }}
        variant="primary"
      />

      <ConfirmDialog
        open={confirmWarning}
        onCancel={() => setConfirmWarning(false)}
        title="Archive Client"
        message="Archiving this client will hide them from active lists. They can be restored later."
        confirmLabel="Archive"
        onConfirm={() => { alert('Archived'); setConfirmWarning(false); }}
        variant="warning"
      />

      <ConfirmDialog
        open={confirmDanger}
        onCancel={() => setConfirmDanger(false)}
        title="Delete Organization"
        message="This action is permanent and will delete all associated data, invoices, and users."
        confirmLabel="Delete Permanently"
        onConfirm={() => { alert('Deleted'); setConfirmDanger(false); }}
        variant="danger"
      />

      <Modal open={modalSm} onClose={() => setModalSm(false)} title="Quick Note" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Title" placeholder="Enter note title..." />
          <Button fullWidth onClick={() => setModalSm(false)}>Save Note</Button>
        </div>
      </Modal>

      <Modal open={modalMd} onClose={() => setModalMd(false)} title="Standard Form Modal" size="md">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input label="Email Address" required />
          <Input label="Full Name" required />
          <Checkbox label="Send invitation email" />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="outline" onClick={() => setModalMd(false)}>Cancel</Button>
            <Button onClick={() => setModalMd(false)}>Submit</Button>
          </div>
        </div>
      </Modal>

      <Modal open={modalLg} onClose={() => setModalLg(false)} title="Large Data View" size="lg">
        <div style={{ height: '300px', background: 'var(--skyra-surface)', border: '1px dashed var(--skyra-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--skyra-radius-md)' }}>
          Large Content Area
        </div>
      </Modal>

      <Drawer open={drawerRight} onClose={() => setDrawerRight(false)} title="Edit Details" side="right">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ color: 'var(--skyra-text-muted)' }}>Drawers are perfect for forms that need to stay in context with the main screen.</p>
          <Input label="Field 1" />
          <Input label="Field 2" />
        </div>
      </Drawer>

      <Drawer open={drawerLeft} onClose={() => setDrawerLeft(false)} title="Navigation Menu" side="left">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Dashboard</Button>
          <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Settings</Button>
          <Button variant="ghost" style={{ justifyContent: 'flex-start' }}>Help</Button>
        </div>
      </Drawer>

      <Drawer open={drawerBottom} onClose={() => setDrawerBottom(false)} title="Mobile Action Sheet" side="bottom">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Button variant="outline" fullWidth>Share</Button>
          <Button variant="outline" fullWidth>Copy Link</Button>
          <Button variant="danger" fullWidth>Delete</Button>
        </div>
      </Drawer>

    </div>
  );
}
