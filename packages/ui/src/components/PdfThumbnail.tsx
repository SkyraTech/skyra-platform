import React, { useRef, useEffect, useState } from 'react';
import { PdfPage } from './PdfPage';
import * as pdfjsLib from 'pdfjs-dist';

interface ThumbnailItemProps {
  pdf: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  isActive: boolean;
  onClick: (page: number) => void;
}

export function ThumbnailItem({ pdf, pageNumber, isActive, onClick }: ThumbnailItemProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      aria-label={`Page ${pageNumber}`}
      aria-current={isActive ? 'page' : undefined}
      onClick={() => onClick(pageNumber)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(pageNumber);
        }
      }}
      style={{
        padding: '0.75rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.5rem',
        cursor: 'pointer',
        background: isActive ? 'var(--skyra-primary-light)' : 'transparent',
        borderRadius: 'var(--skyra-radius-md)',
        border: isActive ? '1px solid var(--skyra-primary)' : '1px solid transparent',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{
        width: '120px',
        minHeight: '160px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--skyra-bg)',
        border: '1px solid var(--skyra-border)',
        boxShadow: isActive ? 'var(--skyra-shadow-md)' : 'var(--skyra-shadow-sm)',
      }}>
        {isVisible ? (
          <PdfPage pdf={pdf} pageNumber={pageNumber} width={118} />
        ) : (
          <div style={{ color: 'var(--skyra-text-muted)', fontSize: '0.75rem' }}>Loading...</div>
        )}
      </div>
      <span style={{
        fontSize: '0.75rem',
        fontWeight: isActive ? 600 : 500,
        color: isActive ? 'var(--skyra-primary)' : 'var(--skyra-text-subtle)'
      }}>
        {pageNumber}
      </span>
    </div>
  );
}
