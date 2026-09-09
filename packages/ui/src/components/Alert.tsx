'use client';

import React from 'react';
import { Info, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  onDismiss?: () => void;
}

const DEFAULT_ICONS: Record<AlertVariant, React.ElementType> = {
  info:    Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  danger:  XCircle,
};

/** @skyra/ui Alert — [B] confirmed from ERP .alert-* styles */
export function Alert({ variant = 'info', title, children, icon, onDismiss, className = '', ...rest }: AlertProps) {
  const Icon = DEFAULT_ICONS[variant];
  return (
    <div className={`skyra-alert skyra-alert--${variant} ${className}`} role="alert" {...rest}>
      <span className="skyra-alert__icon" aria-hidden="true">
        {icon ?? <Icon size={16} />}
      </span>
      <div className="skyra-alert__content">
        {title && <div className="skyra-alert__title">{title}</div>}
        {children && <div className="skyra-alert__desc">{children}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss alert"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: '0 0 0 0.5rem', flexShrink: 0 }}
        >
          ×
        </button>
      )}
    </div>
  );
}
