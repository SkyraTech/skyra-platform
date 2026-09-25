'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Printer,
  Download,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  FileText,
  AlertCircle,
  Loader2,
  Minimize,
  Maximize,
} from 'lucide-react';

export interface PdfViewerProps {
  /** Document title */
  title?: string;
  /** PDF URL or Blob string */
  src?: string;
  /** Total pages count */
  totalPages?: number;
  /** Initial page index (1-based) */
  initialPage?: number;
  /** Initial zoom level in percentage (e.g. 100) */
  initialZoom?: number;
  /** Custom page renderer for custom preview layouts */
  renderPage?: (page: number, zoom: number) => React.ReactNode;
  /** Page change callback */
  onPageChange?: (page: number) => void;
  /** Print action callback */
  onPrint?: () => void;
  /** Download action callback */
  onDownload?: () => void;
  /** Loading state indicator */
  loading?: boolean;
  /** Error state message */
  error?: string;
  /** Height of viewer container */
  height?: string | number;
  /** Additional CSS class */
  className?: string;
}

/**
 * @skyra/ui PdfViewer
 *
 * Production-ready document viewer UI with toolbar (zoom, fit width/page, fullscreen, print, download),
 * page navigation, dark chrome, accessible controls, and responsive layout.
 */
export function PdfViewer({
  title = 'Document Preview',
  src,
  totalPages = 1,
  initialPage = 1,
  initialZoom = 100,
  renderPage,
  onPageChange,
  onPrint,
  onDownload,
  loading = false,
  error,
  height = '520px',
  className = '',
}: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const printAreaRef = useRef<HTMLDivElement>(null);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 250));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 50));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleFitWidth = () => {
    setZoom(125);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else if (src && typeof window !== 'undefined') {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = src;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
      };
    } else if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else if (src && typeof window !== 'undefined') {
      const a = document.createElement('a');
      a.href = src;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Keyboard controls
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown') {
      e.preventDefault();
      handlePageChange(currentPage + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
      e.preventDefault();
      handlePageChange(currentPage - 1);
    } else if (e.key === '+' || e.key === '=') {
      e.preventDefault();
      handleZoomIn();
    } else if (e.key === '-') {
      e.preventDefault();
      handleZoomOut();
    }
  };

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label={`PDF Viewer: ${title}`}
      className={`skyra-pdf-viewer ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: isFullscreen ? '100vh' : typeof height === 'number' ? `${height}px` : height,
        background: 'var(--skyra-bg)',
        border: '1px solid var(--skyra-border)',
        borderRadius: isFullscreen ? '0' : 'var(--skyra-radius-lg)',
        overflow: 'hidden',
        boxShadow: 'var(--skyra-shadow-md)',
        fontFamily: 'var(--skyra-font-body)',
        outline: 'none' }}
    >
      {/* ── Top Toolbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.625rem 1rem',
          background: 'var(--skyra-surface)',
          borderBottom: '1px solid var(--skyra-border)',
          gap: '0.75rem',
          flexWrap: 'wrap',
          zIndex: 10 }}
      >
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px' }}>
          <FileText size={18} style={{ color: 'var(--skyra-primary)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            aria-label="Zoom out"
            onClick={handleZoomOut}
            style={toolbarBtnStyle}
          >
            <ZoomOut size={16} />
          </button>

          <button
            type="button"
            aria-label="Reset zoom"
            onClick={handleResetZoom}
            style={{
              ...toolbarBtnStyle,
              fontSize: '0.78rem',
              fontWeight: 600,
              minWidth: '48px' }}
          >
            {zoom}%
          </button>

          <button
            type="button"
            aria-label="Zoom in"
            onClick={handleZoomIn}
            style={toolbarBtnStyle}
          >
            <ZoomIn size={16} />
          </button>

          <div style={{ width: '1px', height: '18px', background: 'var(--skyra-border)', margin: '0 4px' }} />

          <button
            type="button"
            aria-label="Rotate clockwise"
            onClick={handleRotate}
            style={toolbarBtnStyle}
          >
            <RotateCw size={16} />
          </button>

          <button
            type="button"
            aria-label="Fit width"
            onClick={handleFitWidth}
            style={toolbarBtnStyle}
          >
            <Maximize size={16} />
          </button>
        </div>

        {/* Action Controls: Fullscreen, Print, Download */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button
            type="button"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            onClick={toggleFullscreen}
            style={toolbarBtnStyle}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button
            type="button"
            aria-label="Print document"
            onClick={handlePrint}
            style={toolbarBtnStyle}
          >
            <Printer size={16} />
          </button>

          <button
            type="button"
            aria-label="Download document"
            onClick={handleDownload}
            style={{
              ...toolbarBtnStyle,
              background: 'var(--skyra-primary)',
              color: '#ffffff' }}
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* ── Document View Area ── */}
      <div
        style={{
          flex: 1,
          overflow: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
          background: 'var(--skyra-bg)',
          position: 'relative' }}
      >
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-text-muted)' }}>
            <Loader2 size={32} className="skyra-spin" style={{ color: 'var(--skyra-primary)' }} />
            <span style={{ fontSize: '0.875rem' }}>Loading document...</span>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-danger)' }}>
            <AlertCircle size={32} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
          </div>
        ) : (
          <div className="skyra-motion-transition-transform"
            ref={printAreaRef}
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center',
              
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center' }}
          >
            {renderPage ? (
              renderPage(currentPage, zoom)
            ) : src ? (
              <iframe
                src={src}
                title={title}
                style={{
                  width: '595px',
                  height: '842px',
                  border: 'none',
                  background: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                  borderRadius: '4px' }}
              />
            ) : (
              /* High fidelity document page preview mockup */
              <div
                style={{
                  width: '560px',
                  minHeight: '760px',
                  background: 'var(--skyra-surface)',
                  padding: '2.5rem',
                  borderRadius: '6px',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  color: 'var(--skyra-text)',
                  boxSizing: 'border-box' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--skyra-border)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--skyra-primary)' }}>{title}</h2>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>Document ID: DOC-{currentPage}9842</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--skyra-text-subtle)' }}>PAGE {currentPage} OF {totalPages}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, padding: '1rem 0' }}>
                  <div style={{ height: '14px', width: '80%', background: 'var(--skyra-border)', borderRadius: '4px' }} />
                  <div style={{ height: '14px', width: '95%', background: 'var(--skyra-border)', borderRadius: '4px' }} />
                  <div style={{ height: '14px', width: '70%', background: 'var(--skyra-border)', borderRadius: '4px' }} />
                  <div style={{ height: '80px', width: '100%', background: 'var(--skyra-bg)', borderRadius: '6px', marginTop: '1rem', border: '1px dashed var(--skyra-border)' }} />
                </div>

                <div style={{ borderTop: '1px solid var(--skyra-border)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--skyra-text-subtle)' }}>
                  <span>Confidential — Skyra Platform Document</span>
                  <span>Page {currentPage}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom Page Navigation Bar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '0.5rem 1rem',
          background: 'var(--skyra-surface)',
          borderTop: '1px solid var(--skyra-border)',
          zIndex: 10 }}
      >
        <button
          type="button"
          aria-label="Previous page"
          disabled={currentPage <= 1 || loading}
          onClick={() => handlePageChange(currentPage - 1)}
          style={toolbarBtnStyle}
        >
          <ChevronLeft size={16} />
        </button>

        <span style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--skyra-text)' }}>
          Page <strong style={{ color: 'var(--skyra-primary)' }}>{currentPage}</strong> of {totalPages}
        </span>

        <button
          type="button"
          aria-label="Next page"
          disabled={currentPage >= totalPages || loading}
          onClick={() => handlePageChange(currentPage + 1)}
          style={toolbarBtnStyle}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

const toolbarBtnStyle: React.CSSProperties = {
  background: 'var(--skyra-bg)',
  border: '1px solid var(--skyra-border)',
  borderRadius: 'var(--skyra-radius-sm, 6px)',
  padding: '6px 10px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--skyra-text)',
  
};

