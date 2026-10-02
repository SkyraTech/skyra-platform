'use client';

import React from 'react';
import Link from 'next/link';
import { StatusBadge, BadgeVariant } from './StatusBadge';

interface DocsHeaderProps {
  title: string;
  description: string;
  breadcrumbs: { label: string; href?: string }[];
  badges?: { label: string; variant: BadgeVariant }[];
}

export function DocsHeader({ title, description, breadcrumbs, badges = [] }: DocsHeaderProps) {
  return (
    <div style={{ marginBottom: '1.5rem' }}>
      {/* Category / Eyebrow */}
      <nav aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.6875rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>
          Category
        </div>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', fontWeight: 500 }}>
          {breadcrumbs.map((bc, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {bc.href && !isLast ? (
                  <Link href={bc.href} style={{ color: 'var(--skyra-text-muted)', textDecoration: 'none', transition: 'color 0.15s ease' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--skyra-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--skyra-text-muted)'}>
                    {bc.label}
                  </Link>
                ) : (
                  <span style={{ color: 'var(--skyra-text)' }}>{bc.label}</span>
                )}
                {!isLast && <span style={{ color: 'var(--skyra-text-muted)', opacity: 0.5 }}>/</span>}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Title */}
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '3rem', color: 'var(--skyra-text)', margin: '0 0 1rem 0', letterSpacing: '-0.02em', lineHeight: 1.1, textTransform: 'capitalize' }}>
        {title}
      </h1>

      {/* Description */}
      <p style={{ color: 'var(--skyra-text-muted)', fontSize: '1.125rem', maxWidth: '720px', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
        {description}
      </p>

      {/* Badges */}
      {badges.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {badges.map((badge, idx) => (
            <StatusBadge key={idx} label={badge.label} variant={badge.variant} />
          ))}
        </div>
      )}
    </div>
  );
}
