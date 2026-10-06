'use client';

import React from 'react';

export interface StatusConfig {
  label: string;
  bg: string;
  color: string;
  border?: string;
}

export type StatusSize = 'sm' | 'md' | 'lg';

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** The status key to look up in statusMap */
  status: string;
  /**
   * Map of status keys to their visual configuration.
   * @skyra/invoice will provide INVOICE_STATUS_MAP for invoice-specific use.
   */
  statusMap: Record<string, StatusConfig>;
  /** Fallback config if status is not in statusMap */
  fallback?: StatusConfig;
  /** Size variant — confirmed from ERP StatusBadge.tsx:26-28 */
  size?: StatusSize;
}

/**
 * @skyra/ui StatusBadge
 *
 * [B] PLATFORM EXTRACTION from skyra-erp/src/components/invoices/StatusBadge.tsx
 *
 * This is the GENERIC StatusBadge. It is NOT invoice-specific.
 * Pass any statusMap to use it for any domain (orders, tasks, projects, etc.).
 *
 * ERP invoice statuses will live in @skyra/invoice as:
 *   import { INVOICE_STATUS_MAP, InvoiceStatusBadge } from '@skyra/invoice'
 *
 * Confirmed visual values from ERP StatusBadge.tsx:
 *   sm: fontSize 0.68rem, padding 0.12rem 0.45rem, letterSpacing 0.02em
 *   md: fontSize 0.75rem, padding 0.2rem 0.65rem, letterSpacing 0.03em
 *   lg: fontSize 0.82rem, padding 0.3rem 0.9rem, letterSpacing 0.04em, fontWeight 700, borderWidth 1.5px
 */
export function StatusBadge({
  status,
  statusMap,
  fallback = { label: status, bg: 'var(--skyra-border)', color: 'var(--skyra-text-muted)', border: 'var(--skyra-border)' },
  size = 'md',
  className = '',
  style,
  ...rest
}: StatusBadgeProps) {
  const cfg = statusMap[status] ?? fallback;

  const sizeStyles: Record<StatusSize, React.CSSProperties> = {
    sm: { fontSize: '0.68rem', padding: '0.12rem 0.45rem', letterSpacing: '0.02em', borderColor: 'transparent', borderWidth: '1px' },
    md: { fontSize: '0.75rem', padding: '0.2rem 0.65rem', letterSpacing: '0.03em', borderColor: 'transparent', borderWidth: '1px' },
    lg: { fontSize: '0.82rem', padding: '0.3rem 0.9rem', letterSpacing: '0.04em', fontWeight: 700, borderColor: cfg.border ?? 'transparent', borderWidth: '1.5px' },
  };

  const sizeStyle = sizeStyles[size];

  return (
    <span
      className={['skyra-status-badge', `skyra-status-badge--${size}`, className].filter(Boolean).join(' ')}
      style={{
        background: cfg.bg,
        color: cfg.color,
        borderColor: sizeStyle.borderColor,
        borderWidth: sizeStyle.borderWidth,
        fontSize: sizeStyle.fontSize,
        padding: sizeStyle.padding,
        letterSpacing: sizeStyle.letterSpacing,
        fontWeight: sizeStyle.fontWeight,
        ...style }}
      {...rest}
    >
      {cfg.label}
    </span>
  );
}
