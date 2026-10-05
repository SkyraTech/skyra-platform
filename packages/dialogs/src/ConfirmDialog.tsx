'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';
import '@skyra-tech-platform/dialog';


export type ConfirmDialogVariant = 'danger' | 'warning' | 'primary';

export interface ConfirmDialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Dialog heading */
  title: string;
  /** Body message */
  message: React.ReactNode;
  /** Confirm button label */
  confirmLabel?: string;
  /** Cancel button label */
  cancelLabel?: string;
  /** Visual variant controls icon and button color */
  variant?: ConfirmDialogVariant;
  /** Called when the user confirms */
  onConfirm: () => void;
  /** Called when the user cancels (also Escape key) */
  onCancel: () => void;
  /** If true, confirm button shows loading state */
  isLoading?: boolean;
}

const VARIANT_CONFIG: Record<ConfirmDialogVariant, {
  icon: React.ReactNode;
  iconBg: string;
  confirmBg: string;
  confirmHover: string;
}> = {
  danger: {
    icon: <Trash2 size={22} aria-hidden="true" />,
    iconBg: 'var(--skyra-danger-light)',
    confirmBg: 'var(--skyra-danger)',
    confirmHover: '#dc2626',
  },
  warning: {
    icon: <AlertTriangle size={22} aria-hidden="true" />,
    iconBg: 'var(--skyra-warning-light)',
    confirmBg: 'var(--skyra-warning)',
    confirmHover: '#d97706',
  },
  primary: {
    icon: <Info size={22} aria-hidden="true" />,
    iconBg: 'var(--skyra-primary-light)',
    confirmBg: 'var(--skyra-primary)',
    confirmHover: 'var(--skyra-primary-hover)',
  },
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'primary',
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmDialogProps) {
  const cfg = VARIANT_CONFIG[variant];
  const ref = useRef<HTMLElement>(null);
  

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const handleCancel = () => onCancel();
    const handleClose = () => onCancel();

    el.addEventListener('skyra-cancel', handleCancel);
    el.addEventListener('skyra-close', handleClose);
    return () => {
      el.removeEventListener('skyra-cancel', handleCancel);
      el.removeEventListener('skyra-close', handleClose);
    };
  }, [onCancel]);

  return (
    <skyra-tech-dialog
      ref={ref}
      open={open || undefined}
      mode="modal"
      hide-close-button
    >
      <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: 'var(--skyra-radius-lg)',
          background: cfg.iconBg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: '1.25rem',
          color: cfg.confirmBg,
        }}>
          {cfg.icon}
        </div>

        <h2 style={{
          fontFamily: 'var(--skyra-font-display)',
          fontWeight: 700, fontSize: '1.125rem',
          color: 'var(--skyra-text)',
          marginBottom: '0.625rem', margin: '0 0 0.625rem',
        }}>
          {title}
        </h2>

        <div style={{
          fontSize: '0.9rem', color: 'var(--skyra-text-muted)',
          lineHeight: 1.6, marginBottom: '1.75rem',
        }}>
          {message}
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            style={{
              background: 'var(--skyra-surface)',
              color: 'var(--skyra-text)',
              border: '1px solid var(--skyra-border)',
              borderRadius: 'var(--skyra-radius-md)',
              padding: '0.6rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              minHeight: '40px',
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            aria-busy={isLoading}
            style={{
              background: cfg.confirmBg,
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--skyra-radius-md)',
              padding: '0.6rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: isLoading ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '40px',
            }}
          >
            {isLoading && (
              <span style={{
                width: '14px', height: '14px',
                borderWidth: '2px', borderStyle: 'solid',
                borderColor: 'rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'skyra-spin 0.7s linear infinite', flexShrink: 0,
              }} aria-hidden="true" />
            )}
            {isLoading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>
    </skyra-tech-dialog>
  );
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-tech-dialog': any;
    }
  }
}
