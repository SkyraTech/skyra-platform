'use client';

import React from 'react';
import { Info, AlertTriangle, Zap, Terminal } from 'lucide-react';

export type CalloutType = 'info' | 'warning' | 'success' | 'tech';

interface CalloutProps {
  type?: CalloutType;
  title: string;
  children: React.ReactNode;
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  let color = 'var(--skyra-info)';
  let bg = 'rgba(var(--skyra-info-rgb, 56, 189, 248), 0.1)';
  let border = 'rgba(var(--skyra-info-rgb, 56, 189, 248), 0.2)';
  let Icon = Info;

  if (type === 'warning') {
    color = 'var(--skyra-warning)';
    bg = 'rgba(var(--skyra-warning-rgb, 210, 153, 34), 0.1)';
    border = 'rgba(var(--skyra-warning-rgb, 210, 153, 34), 0.2)';
    Icon = AlertTriangle;
  } else if (type === 'success') {
    color = 'var(--skyra-success)';
    bg = 'rgba(var(--skyra-success-rgb, 46, 160, 67), 0.1)';
    border = 'rgba(var(--skyra-success-rgb, 46, 160, 67), 0.2)';
    Icon = Zap;
  } else if (type === 'tech') {
    color = 'var(--skyra-primary)';
    bg = 'rgba(var(--skyra-primary-rgb, 88, 166, 255), 0.1)';
    border = 'rgba(var(--skyra-primary-rgb, 88, 166, 255), 0.2)';
    Icon = Terminal;
  }

  return (
    <div style={{
      display: 'flex',
      gap: '1rem',
      padding: '1.25rem',
      background: bg,
      border: `1px solid ${border}`,
      borderRadius: 'var(--skyra-radius-md)',
      marginBottom: '1.5rem'
    }}>
      <div style={{ color, flexShrink: 0, marginTop: '0.125rem' }}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div>
        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)' }}>
          {title}
        </h5>
        <div style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', lineHeight: 1.5 }}>
          {children}
        </div>
      </div>
    </div>
  );
}
