'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { AlertTriangle, Info, Trash2 } from 'lucide-react';
import { useFocusTrap } from './useFocusTrap';

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

/**
 * @skyra/dialogs ConfirmDialog
 *
 * [B] PLATFORM EXTRACTION from skyra-erp/src/components/ui/ConfirmDialog.tsx
 *
 * Confirmed ERP visual values:
 *   - Dialog width: 440px  [CONFIRMED: ConfirmDialog.tsx]
 *   - Responsive width: calc(100vw - 2rem)  [CONFIRMED]
 *   - Border radius: var(--radius-lg) = 14px  [CONFIRMED]
 *   - Padding: 2rem  [CONFIRMED]
 *   - Backdrop: rgba(0,0,0,0.5) + blur(2px)  [CONFIRMED]
 *   - z-index overlay: 199, modal: 200  [CONFIRMED]
 *   - Variant prop: danger/warning/primary  [CONFIRMED]
 *
 * [C] PLATFORM ENHANCEMENTS:
 *   - Focus trap (ERP uses basic focus management)
 *   - Focus restoration to trigger element on close
 *   - ARIA role=dialog + aria-modal + aria-labelledby + aria-describedby
 *   - Portal rendering
 */
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
  const trapRef = useFocusTrap(open);
  const titleId = React.useId();
  const descId = React.useId();

  // Store the element that triggered the dialog so we can return focus
  const triggerRef = React.useRef<Element | null>(null);
  useEffect(() => {
    if (open) triggerRef.current = document.activeElement;
    else if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  }, [open]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onCancel(); }
  }, [onCancel]);

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, handleEscape]);

  if (!open) return null;

  const dialog = (
    <>
      {/* Backdrop [CONFIRMED: rgba(0,0,0,0.5) + blur(2px)] */}
      <div
        onClick={onCancel}
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(2px)',
          WebkitBackdropFilter: 'blur(2px)',
          zIndex: 199,                             // [CONFIRMED: z-index 199]
        }}
      />
      {/* Dialog [CONFIRMED: 440px, calc(100vw-2rem), radius-lg, 2rem padding] */}
      <div
        ref={trapRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '440px',                          // [CONFIRMED]
          maxWidth: 'calc(100vw - 2rem)',          // [CONFIRMED]
          background: 'var(--skyra-surface)',
          borderRadius: 'var(--skyra-radius-lg)', // [CONFIRMED: radius-lg = 14px]
          boxShadow: 'var(--skyra-shadow-lg)',
          padding: '2rem',                         // [CONFIRMED]
          zIndex: 200,                             // [CONFIRMED: z-index 200]
          animation: 'skyra-dialog-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <style>{`
          @keyframes skyra-dialog-in {
            from { opacity: 0; transform: translate(-50%, calc(-50% + 12px)); }
            to   { opacity: 1; transform: translate(-50%, -50%); }
          }
        `}</style>

        {/* Icon */}
        <div style={{
          width: '48px', height: '48px', borderRadius: 'var(--skyra-radius-lg)',
          background: cfg.iconBg, display: 'flex', alignItems: 'center',
          justifyContent: 'center', marginBottom: '1.25rem',
          color: cfg.confirmBg,
        }}>
          {cfg.icon}
        </div>

        {/* Title */}
        <h2 id={titleId} style={{
          fontFamily: 'var(--skyra-font-display)',
          fontWeight: 700, fontSize: '1.125rem',
          color: 'var(--skyra-text)',
          marginBottom: '0.625rem', margin: '0 0 0.625rem',
        }}>
          {title}
        </h2>

        {/* Message */}
        <div id={descId} style={{
          fontSize: '0.9rem', color: 'var(--skyra-text-muted)',
          lineHeight: 1.6, marginBottom: '1.75rem',
        }}>
          {message}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
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
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'skyra-spin 0.7s linear infinite', flexShrink: 0,
              }} aria-hidden="true" />
            )}
            {isLoading ? 'Loading...' : confirmLabel}
          </button>
        </div>
      </div>
    </>
  );

  return typeof document !== 'undefined' ? createPortal(dialog, document.body) : null;
}
