'use client';

import React, { useEffect, useRef } from 'react';
import '@skyra-tech-platform/dialog';


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
  const ref = useRef<HTMLElement>(null);
  
  // Track trigger element to restore focus after closing.
  const triggerRef = useRef<Element | null>(null);
  useEffect(() => {
    if (open) triggerRef.current = document.activeElement;
    else if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  }, [open]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const handleCancel = () => onClose();
    const handleClose = () => onClose();

    el.addEventListener('skyra-cancel', handleCancel);
    el.addEventListener('skyra-close', handleClose);
    return () => {
      el.removeEventListener('skyra-cancel', handleCancel);
      el.removeEventListener('skyra-close', handleClose);
    };
  }, [onClose]);

  return (
    <skyra-tech-dialog as any
      ref={ref}
      open={open || undefined}
      mode="modal"
      size={size}
      close-on-backdrop={closeOnBackdrop}
      close-on-escape={closeOnEscape}
    >
      {title && <span slot="title">{title}</span>}
      {children}
      {footer && <div slot="footer">{footer}</div>}
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
