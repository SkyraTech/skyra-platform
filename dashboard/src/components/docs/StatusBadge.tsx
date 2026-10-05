'use client';

import React from 'react';
import { Circle, Hexagon, Code2, AlertTriangle, Info } from 'lucide-react';

export type BadgeVariant = 'stable' | 'beta' | 'experimental' | 'tech' | 'deprecated' | 'planned';

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
}

export function StatusBadge({ label, variant }: StatusBadgeProps) {
  let color = 'var(--skyra-text-muted)';
  let bg = 'var(--skyra-bg-muted)';
  let border = 'var(--skyra-border)';
  let Icon = Info;

  switch (variant) {
    case 'stable':
      color = 'var(--skyra-success)';
      bg = 'rgba(var(--skyra-success-rgb, 46, 160, 67), 0.1)';
      border = 'rgba(var(--skyra-success-rgb, 46, 160, 67), 0.2)';
      Icon = Circle;
      break;
    case 'beta':
      color = 'var(--skyra-warning)';
      bg = 'rgba(var(--skyra-warning-rgb, 210, 153, 34), 0.1)';
      border = 'rgba(var(--skyra-warning-rgb, 210, 153, 34), 0.2)';
      Icon = Hexagon;
      break;
    case 'experimental':
      color = 'var(--skyra-orange)';
      bg = 'rgba(234, 88, 12, 0.1)';
      border = 'rgba(234, 88, 12, 0.2)';
      Icon = AlertTriangle;
      break;
    case 'tech':
      color = 'var(--skyra-primary)';
      bg = 'rgba(var(--skyra-primary-rgb, 88, 166, 255), 0.1)';
      border = 'rgba(var(--skyra-primary-rgb, 88, 166, 255), 0.2)';
      Icon = Code2;
      break;
    case 'deprecated':
      color = 'var(--skyra-danger)';
      bg = 'rgba(var(--skyra-danger-rgb, 248, 81, 73), 0.1)';
      border = 'rgba(var(--skyra-danger-rgb, 248, 81, 73), 0.2)';
      Icon = AlertTriangle;
      break;
    case 'planned':
      color = 'var(--skyra-text-muted)';
      bg = 'var(--skyra-surface)';
      border = 'var(--skyra-border)';
      Icon = Circle;
      break;
  }

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.2rem 0.6rem',
      background: bg,
      color: color,
      border: `1px solid ${border}`,
      borderRadius: 'var(--skyra-radius-full)',
      fontSize: '0.6875rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      whiteSpace: 'nowrap'
    }}>
      <Icon size={10} strokeWidth={3} />
      {label}
    </span>
  );
}
