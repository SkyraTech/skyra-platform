'use client';

import React, { useEffect, useState } from 'react';

interface DocsLayoutProps {
  children: React.ReactNode;
  toc?: { id: string; label: string }[];
}

export function DocsLayout({ children, toc = [] }: DocsLayoutProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    if (toc.length === 0) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0px 0px -80% 0px' }
    );

    toc.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [toc]);

  return (
    <div style={{ position: 'relative', width: '100%', minHeight: '100vh' }}>
      {/* Subtle Background Layer */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '400px',
          background: 'radial-gradient(ellipse at top, var(--skyra-primary-light) 0%, transparent 70%)',
          opacity: 0.1,
          pointerEvents: 'none',
          zIndex: 0
        }} 
      />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'row', alignItems: 'flex-start', maxWidth: '1440px', margin: '0 auto', gap: '3rem', padding: '2rem 2rem' }}>
        
        {/* Main Content */}
        <div style={{ flex: '1 1 auto', minWidth: 0, maxWidth: '850px' }}>
          {children}
        </div>

        {/* On This Page (Right Sidebar) */}
        {toc.length > 0 && (
          <div style={{ 
            flex: '0 0 220px', 
            position: 'sticky', 
            top: '3rem', 
            alignSelf: 'flex-start',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }} className="docs-toc">
            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              On this page
            </h4>
            <div style={{ position: 'relative', paddingLeft: '1rem' }}>
              {/* Tracker line */}
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '1px', background: 'var(--skyra-border)' }} />
              
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {toc.map((item) => {
                  const isActive = activeId === item.id;
                  return (
                    <li key={item.id} style={{ position: 'relative' }}>
                      {/* Active indicator */}
                      {isActive && (
                        <div style={{ position: 'absolute', left: '-1rem', top: '0.125rem', bottom: '0.125rem', width: '2px', background: 'var(--skyra-primary)', borderRadius: '2px' }} />
                      )}
                      <a 
                        href={"#" + item.id}
                        style={{ 
                          display: 'block',
                          fontSize: '0.8125rem', 
                          color: isActive ? 'var(--skyra-primary)' : 'var(--skyra-text-muted)',
                          textDecoration: 'none',
                          fontWeight: isActive ? 600 : 500,
                          transition: 'all 0.15s ease',
                          transform: 'translateX(0)'
                        }}
                        onMouseEnter={(e) => { 
                          if (!isActive) {
                            e.currentTarget.style.color = 'var(--skyra-text)'; 
                            e.currentTarget.style.transform = 'translateX(2px)';
                          }
                        }}
                        onMouseLeave={(e) => { 
                          if (!isActive) {
                            e.currentTarget.style.color = 'var(--skyra-text-muted)'; 
                            e.currentTarget.style.transform = 'translateX(0)';
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' });
                          window.history.pushState(null, '', "#" + item.id);
                        }}
                      >
                        {item.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
