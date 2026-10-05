'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Type } from 'lucide-react';

interface ComponentLink {
  title: string;
  description: string;
  category: string;
  href: string;
}

interface RelatedComponentsProps {
  components: ComponentLink[];
}

export function RelatedComponents({ components }: RelatedComponentsProps) {
  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '1.5rem',
      marginBottom: '4rem'
    }}>
      {components.map((comp, idx) => (
        <Link 
          key={idx} 
          href={comp.href}
          style={{ textDecoration: 'none' }}
        >
          <div 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              padding: '1.5rem', 
              background: 'var(--skyra-surface)', 
              border: '1px solid var(--skyra-border)', 
              borderRadius: 'var(--skyra-radius-md)',
              boxShadow: 'var(--skyra-shadow-sm)',
              height: '100%',
              transition: 'all 0.2s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--skyra-primary)';
              e.currentTarget.style.boxShadow = 'var(--skyra-shadow-md)';
              const icon = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
              if (icon) icon.style.transform = 'translateX(4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--skyra-border)';
              e.currentTarget.style.boxShadow = 'var(--skyra-shadow-sm)';
              const icon = e.currentTarget.querySelector('.nav-icon') as HTMLElement;
              if (icon) icon.style.transform = 'translateX(0)';
            }}
          >
            <h4 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--skyra-text)', margin: '0 0 0.5rem 0' }}>
              {comp.title}
            </h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
              {comp.description}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {comp.category}
              </span>
              <ArrowRight className="nav-icon" size={16} style={{ color: 'var(--skyra-primary)', transition: 'transform 0.2s ease' }} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
