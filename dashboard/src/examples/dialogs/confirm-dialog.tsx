/**
 * @id dialogs-confirm-basic
 * @title Confirm Dialog
 * @apiId @skyra/dialogs::ConfirmDialog
 * @packageId @skyra/dialogs
 */
import React, { useState } from 'react';
import { Button } from '@skyra/ui';
import { ConfirmDialog } from '@skyra/dialogs';

export default function ConfirmDialogExample() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
      
      {result && (
        <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
          Last action: <strong>{result}</strong>
        </div>
      )}

      <ConfirmDialog
        open={open}
        title="Delete Item"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={() => {
          setResult('Confirmed delete');
          setOpen(false);
        }}
        onCancel={() => {
          setResult('Cancelled');
          setOpen(false);
        }}
      />
    </div>
  );
}
