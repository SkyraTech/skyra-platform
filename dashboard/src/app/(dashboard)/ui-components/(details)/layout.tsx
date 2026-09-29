'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function UIComponentsDetailLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === '/ui-components') return <>{children}</>;

  return (
    <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto' }}>
      <div className="skyra-back-wrapper">
        <Link 
          href="/ui-components" 
          aria-label="Back to UI Components"
          className="skyra-back-button"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          <span className="skyra-back-text">Back</span>
        </Link>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .skyra-back-wrapper {
          position: absolute;
          top: 2rem;
          right: 1rem;
          z-index: 10;
        }
        
        .skyra-back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.875rem;
          background: var(--skyra-surface);
          border: 1px solid var(--skyra-border);
          border-radius: var(--skyra-radius-md);
          color: var(--skyra-text);
          font-size: 0.875rem;
          font-weight: 500;
          text-decoration: none;
          box-shadow: var(--skyra-shadow-sm);
          transition: all 0.2s ease;
        }

        .skyra-back-button:hover {
          background: var(--skyra-surface-hover);
          border-color: var(--skyra-primary);
        }

        .skyra-back-button:focus-visible {
          outline: none;
          box-shadow: var(--skyra-focus-ring);
          border-color: var(--skyra-primary);
        }

        @media (max-width: 640px) {
          .skyra-back-wrapper {
            position: relative;
            top: 0;
            right: 0;
            padding: 1rem 1rem 0 1rem;
            margin-bottom: -1rem; /* Pull up next content */
            display: flex;
            justify-content: flex-start;
          }
          .skyra-back-button {
            padding: 0.375rem 0.75rem;
            font-size: 0.8rem;
          }
        }
      `}} />
      {children}
    </div>
  );
}
