'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from './useFocusTrap';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  /** If false, clicking backdrop does NOT close the modal */
  closeOnBackdrop?: boolean;
  /** If false, Escape does NOT close the modal */
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
}

const MODAL_WIDTHS: Record<ModalSize, string> = {
  sm:   '400px',
  md:   '560px',
  lg:   '720px',
  xl:   '900px',
  full: '100%',
};

/**
 * @skyra/dialogs Modal
 *
 * [C] PLATFORM ENHANCEMENT — ad-hoc overlay pattern in ERP generalized into a reusable Modal.
 * Visual language consistent with ConfirmDialog (same backdrop, shadow, radius-lg).
 */
export function Modal({
  open, onClose, title, children, size = 'md',
  closeOnBackdrop = true, closeOnEscape = true, footer,
}: ModalProps) {
  const trapRef = useFocusTrap(open);
  const titleId = React.useId();

  const triggerRef = React.useRef<Element | null>(null);
  useEffect(() => {
    if (open) triggerRef.current = document.activeElement;
    else if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  }, [open]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (closeOnEscape && e.key === 'Escape') { e.preventDefault(); onClose(); }
  }, [onClose, closeOnEscape]);

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

  const maxWidth = MODAL_WIDTHS[size] ?? '560px';

  const modal = (
    <>
      <div onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', zIndex: 199 }}
      />
      <div ref={trapRef} role="dialog" aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        style={{
          position: 'fixed', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: maxWidth, maxWidth: 'calc(100vw - 2rem)',
          maxHeight: 'calc(100dvh - 2rem)',
          background: 'var(--skyra-surface)',
          borderRadius: 'var(--skyra-radius-lg)',
          boxShadow: 'var(--skyra-shadow-lg)',
          zIndex: 200,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: 'skyra-dialog-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--skyra-border)', flexShrink: 0 }}>
            <h2 id={titleId} style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--skyra-text)', margin: 0 }}>
              {title}
            </h2>
            <button onClick={onClose} aria-label="Close modal"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', display: 'flex', padding: '4px', borderRadius: 'var(--skyra-radius-sm)' }}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>
          {children}
        </div>
        {footer && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--skyra-border)', flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </>
  );

  return typeof document !== 'undefined' ? createPortal(modal, document.body) : null;
}
