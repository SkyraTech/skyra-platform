'use client';

import React, { useState } from 'react';

export interface ApiTab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ApiTabsProps {
  tabs: ApiTab[];
}

export function ApiTabs({ tabs }: ApiTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div style={{ marginBottom: '3rem' }}>
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        borderBottom: '1px solid var(--skyra-border)', 
        marginBottom: '1.5rem',
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch'
      }}>
        {tabs.map((tab) => {
          const isActive = activeId === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveId(tab.id)}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--skyra-primary)' : '2px solid transparent',
                color: isActive ? 'var(--skyra-text)' : 'var(--skyra-text-muted)',
                padding: '0.75rem 1rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--skyra-text)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.color = 'var(--skyra-text-muted)';
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      
      <div>
        {tabs.find(t => t.id === activeId)?.content}
      </div>
    </div>
  );
}
