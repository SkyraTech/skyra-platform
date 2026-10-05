'use client';

import React from 'react';

interface HeadingAnchorProps {
  id: string;
  children: React.ReactNode;
  level?: 2 | 3 | 4;
}

export function HeadingAnchor({ id, children, level = 2 }: HeadingAnchorProps) {
  const Component = `h${level}` as any;
  
  const fontSize = level === 2 ? '1.875rem' : level === 3 ? '1.5rem' : '1.25rem';
  const fontWeight = level === 2 ? 800 : 700;
  const marginTop = level === 2 ? '4rem' : '2.5rem';
  const marginBottom = '1.5rem';

  return (
    <Component 
      id={id} 
      className="heading-anchor group"
      style={{ 
        fontSize, 
        fontWeight, 
        color: 'var(--skyra-text)', 
        marginTop, 
        marginBottom,
        scrollMarginTop: '6rem',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        letterSpacing: '-0.02em'
      }}
    >
      <a 
        href={`#${id}`} 
        className="heading-anchor-link"
        aria-label={`Link to ${id}`}
        style={{
          color: 'inherit',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        {children}
        <span className="heading-anchor-icon" style={{ 
          color: 'var(--skyra-primary)', 
          opacity: 0, 
          transition: 'opacity 0.2s ease',
          fontSize: '0.8em',
          fontWeight: 400
        }}>
          #
        </span>
      </a>
      <style>{`
        .heading-anchor:hover .heading-anchor-icon {
          opacity: 1 !important;
        }
      `}</style>
    </Component>
  );
}
