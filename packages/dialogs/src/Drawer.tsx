'use client';

import React, { useEffect, useRef } from 'react';
import '@skyra-tech-platform/dialog';


export type DrawerSide = 'right' | 'left' | 'bottom';

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: DrawerSide;
  /** Drawer width (for side drawers). On mobile always 100vw. */
  width?: string;
  closeOnBackdrop?: boolean;
  footer?: React.ReactNode;
}

/**
 * @skyra/dialogs Drawer
 *
 * [B] PLATFORM EXTRACTION from ERP PaymentDrawer/TemplateDrawer ad-hoc implementations.
 * Generalized into a configurable Drawer with focus trap, ARIA, and mobile full-width.
 *
 * Mobile behavior [CONFIRMED: migration-plan.md]:
 *   Drawer expands to 100vw on mobile.
 */
export function Drawer({
  open, onClose, title, children, side = 'right',
  width = '480px', closeOnBackdrop = true, footer,
}: DrawerProps) {
  const ref = useRef<HTMLElement>(null);


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
    <skyra-tech-dialog
      ref={ref}
      open={open || undefined}
      mode="drawer"
      side={side}
      drawer-width={width}
      close-on-backdrop={closeOnBackdrop}
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
