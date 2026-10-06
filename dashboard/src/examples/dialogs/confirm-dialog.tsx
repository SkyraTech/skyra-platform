/**
 * @id dialogs-confirm-basic
 * @title Confirm Dialog
 * @apiId @skyra/dialogs::ConfirmDialog
 * @packageId @skyra/dialogs
 */
import React, { useState, useRef, useEffect } from 'react';
import '@skyra-tech-platform/button';;
import { Trash2 } from 'lucide-react';
import '@skyra-tech-platform/dialog';

export default function ConfirmDialogExample() {
  const [open, setOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const ref = useRef<any>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleClose = () => setOpen(false);
    el.addEventListener('skyra-close', handleClose);
    el.addEventListener('skyra-cancel', handleClose);

    return () => {
      el.removeEventListener('skyra-close', handleClose);
      el.removeEventListener('skyra-cancel', handleClose);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
      <skyra-tech-button variant="danger" onClick={() => setOpen(true)}>Open Confirm Dialog</skyra-tech-button>
      
      {result && (
        <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)' }}>
          Last action: <strong>{result}</strong>
        </div>
      )}

      <skyra-tech-dialog ref={ref} open={open || undefined} mode="modal" hide-close-button>
        <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: 'var(--skyra-radius-lg)',
            background: 'var(--skyra-danger-light)', display: 'flex', alignItems: 'center',
            justifyContent: 'center', marginBottom: '1.25rem', color: 'var(--skyra-danger)',
          }}>
            <Trash2 size={22} />
          </div>
          <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.125rem', color: 'var(--skyra-text)', margin: '0 0 0.625rem' }}>
            Delete Item
          </h2>
          <div style={{ fontSize: '0.9rem', color: 'var(--skyra-text-muted)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
            Are you sure you want to delete this item? This action cannot be undone.
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <skyra-tech-button variant="ghost" onClick={() => {
              setResult('Cancelled');
              setOpen(false);
            }}>Cancel</skyra-tech-button>
            <skyra-tech-button variant="danger" onClick={() => {
              setResult('Confirmed delete');
              setOpen(false);
            }}>Delete</skyra-tech-button>
          </div>
        </div>
      </skyra-tech-dialog>
    </div>
  );
}
