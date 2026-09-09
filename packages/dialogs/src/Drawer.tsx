'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useFocusTrap } from './useFocusTrap';

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
  const trapRef = useFocusTrap(open);
  const titleId = React.useId();

  const triggerRef = React.useRef<Element | null>(null);
  useEffect(() => {
    if (open) triggerRef.current = document.activeElement;
    else if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
  }, [open]);

  const handleEscape = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); }
  }, [onClose]);

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

  const positionStyles: React.CSSProperties =
    side === 'bottom'
      ? { bottom: 0, left: 0, right: 0, borderRadius: 'var(--skyra-radius-xl) var(--skyra-radius-xl) 0 0', maxHeight: '90dvh' }
      : side === 'left'
      ? { top: 0, left: 0, bottom: 0, borderRadius: '0 var(--skyra-radius-xl) var(--skyra-radius-xl) 0' }
      : { top: 0, right: 0, bottom: 0, borderRadius: 'var(--skyra-radius-xl) 0 0 var(--skyra-radius-xl)' };

  const drawer = (
    <>
      <div onClick={closeOnBackdrop ? onClose : undefined} aria-hidden="true"
        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)', zIndex: 199 }}
      />
      <div ref={trapRef} role="dialog" aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        style={{
          position: 'fixed',
          ...positionStyles,
          width: side !== 'bottom' ? `min(${width}, 100vw)` : undefined,
          background: 'var(--skyra-surface)',
          boxShadow: 'var(--skyra-shadow-lg)',
          zIndex: 200,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          animation: `skyra-drawer-${side} 0.25s cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        <style>{`
          @keyframes skyra-drawer-right  { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes skyra-drawer-left   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
          @keyframes skyra-drawer-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
        `}</style>

        {title && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--skyra-border)', flexShrink: 0 }}>
            <h2 id={titleId} style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 700, fontSize: '1.0625rem', color: 'var(--skyra-text)', margin: 0 }}>
              {title}
            </h2>
            <button onClick={onClose} aria-label="Close drawer"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--skyra-text-muted)', display: 'flex', padding: '4px', borderRadius: 'var(--skyra-radius-sm)' }}>
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        )}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>{children}</div>
        {footer && (
          <div style={{ padding: '1.25rem 1.5rem', borderTop: '1px solid var(--skyra-border)', flexShrink: 0 }}>
            {footer}
          </div>
        )}
      </div>
    </>
  );

  return typeof document !== 'undefined' ? createPortal(drawer, document.body) : null;
}
