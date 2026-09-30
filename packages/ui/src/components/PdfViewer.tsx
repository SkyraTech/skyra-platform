'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Maximize,
  Sidebar,
} from 'lucide-react';
import { usePdfDocument } from './pdfHooks';
import { PdfPage } from './PdfPage';
import { ThumbnailItem } from './PdfThumbnail';

export interface PdfViewerProps {
  title?: string;
  src?: string | Blob | ArrayBuffer;
  totalPages?: number;
  initialPage?: number;
  initialZoom?: number;
  onPageChange?: (page: number) => void;
  onPrint?: () => void;
  onDownload?: () => void;
  loading?: boolean;
  error?: string;
  height?: string | number;
  className?: string;
}

export function PdfViewer({
  title = 'Document Preview',
  src,
  totalPages: propTotalPages,
  initialPage = 1,
  initialZoom = 100,
  onPageChange,
  onPrint,
  onDownload,
  loading: propLoading = false,
  error: propError,
  height = '520px',
  className = '',
}: PdfViewerProps) {
  const { pdf, loading: pdfLoading, error: pdfError } = usePdfDocument(src);
  const totalPages = propTotalPages ?? (pdf?.numPages || 1);
  const loading = propLoading || pdfLoading;
  const error = propError || (pdfError ? 'Failed to load document' : undefined);

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [zoom, setZoom] = useState(initialZoom);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync currentPage with initialPage but ensure it doesn't exceed totalPages
  useEffect(() => {
    if (pdf) {
      setCurrentPage((prev) => Math.min(Math.max(1, prev), pdf.numPages));
    }
  }, [pdf]);

  // Responsive sidebar
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    onPageChange?.(newPage);
    if (isMobile) {
      setSidebarOpen(false); // Close sidebar on mobile after selection
    }
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 300));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoom(100);
  const handleFitWidth = () => {
    if (scrollContainerRef.current) {
      // Approximate fit width based on container
      const containerWidth = scrollContainerRef.current.clientWidth - 48; // padding
      const standardPdfWidth = 595; // A4 approx
      const newZoom = Math.floor((containerWidth / standardPdfWidth) * 100);
      setZoom(Math.min(Math.max(newZoom, 50), 300));
    }
  };

  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);

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

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const getBlobUrl = async () => {
    if (typeof src === 'string') return src;
    if (src instanceof Blob) return URL.createObjectURL(src);
    if (src instanceof ArrayBuffer) return URL.createObjectURL(new Blob([src], { type: 'application/pdf' }));
    return null;
  };

  const handlePrint = async () => {
    if (onPrint) {
      onPrint();
      return;
    }
    const url = await getBlobUrl();
    if (url && typeof window !== 'undefined') {
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = url;
      document.body.appendChild(iframe);
      iframe.onload = () => {
        iframe.contentWindow?.print();
        // Cleanup blob if we created it
        if (url !== src) setTimeout(() => URL.revokeObjectURL(url), 10000);
      };
    }
  };

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const url = await getBlobUrl();
    if (url && typeof window !== 'undefined') {
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      if (url !== src) URL.revokeObjectURL(url);
    }
  };

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
        outline: 'none'
      }}
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
          zIndex: 20
        }}
      >
        {/* Title and Sidebar Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minWidth: '160px' }}>
          <button
            type="button"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={toolbarBtnStyle}
            disabled={!pdf}
          >
            <Sidebar size={18} />
          </button>
          <FileText size={18} style={{ color: 'var(--skyra-primary)', marginLeft: '0.25rem' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--skyra-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {title}
          </span>
        </div>

        {/* Zoom & View Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button type="button" aria-label="Zoom out" onClick={handleZoomOut} style={toolbarBtnStyle} disabled={!pdf}>
            <ZoomOut size={16} />
          </button>

          <button
            type="button"
            aria-label="Reset zoom"
            onClick={handleResetZoom}
            disabled={!pdf}
            style={{
              ...toolbarBtnStyle,
              fontSize: '0.78rem',
              fontWeight: 600,
              minWidth: '48px'
            }}
          >
            {zoom}%
          </button>

          <button type="button" aria-label="Zoom in" onClick={handleZoomIn} style={toolbarBtnStyle} disabled={!pdf}>
            <ZoomIn size={16} />
          </button>

          <div style={{ width: '1px', height: '18px', background: 'var(--skyra-border)', margin: '0 4px' }} />

          <button type="button" aria-label="Rotate clockwise" onClick={handleRotate} style={toolbarBtnStyle} disabled={!pdf}>
            <RotateCw size={16} />
          </button>

          <button type="button" aria-label="Fit width" onClick={handleFitWidth} style={toolbarBtnStyle} disabled={!pdf}>
            <Maximize size={16} />
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <button type="button" aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'} onClick={toggleFullscreen} style={toolbarBtnStyle}>
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <button type="button" aria-label="Print document" onClick={handlePrint} style={toolbarBtnStyle} disabled={!pdf && !src}>
            <Printer size={16} />
          </button>

          <button
            type="button"
            aria-label="Download document"
            onClick={handleDownload}
            disabled={!pdf && !src}
            style={{
              ...toolbarBtnStyle,
              background: 'var(--skyra-primary)',
              color: '#ffffff'
            }}
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* ── Main Body ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative' }}>
        
        {/* Sidebar */}
        {sidebarOpen && pdf && (
          <div
            style={{
              width: isMobile ? '240px' : '220px',
              height: '100%',
              background: 'var(--skyra-surface)',
              borderRight: '1px solid var(--skyra-border)',
              display: 'flex',
              flexDirection: 'column',
              overflowY: 'auto',
              position: isMobile ? 'absolute' : 'relative',
              left: 0,
              top: 0,
              zIndex: 15,
              boxShadow: isMobile ? 'var(--skyra-shadow-lg)' : 'none',
              padding: '1rem',
              gap: '1rem'
            }}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <ThumbnailItem
                key={page}
                pdf={pdf}
                pageNumber={page}
                isActive={currentPage === page}
                onClick={handlePageChange}
              />
            ))}
          </div>
        )}

        {/* Document Area */}
        <div
          ref={scrollContainerRef}
          style={{
            flex: 1,
            overflow: 'auto',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            padding: '1.5rem',
            background: 'var(--skyra-bg)',
            position: 'relative'
          }}
        >
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-text-muted)', margin: 'auto' }}>
              <Loader2 size={32} className="skyra-spin" style={{ color: 'var(--skyra-primary)' }} />
              <span style={{ fontSize: '0.875rem' }}>Loading document...</span>
            </div>
          ) : error ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--skyra-danger)', margin: 'auto' }}>
              <AlertCircle size={32} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{error}</span>
            </div>
          ) : !src ? (
            <div
              className="skyra-motion-transition-transform"
              style={{
                transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                transformOrigin: 'center center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 'auto'
              }}
            >
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
                  boxSizing: 'border-box'
                }}
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
            </div>
          ) : pdf ? (
            <div
              className="skyra-motion-transition-transform"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                margin: 'auto',
              }}
            >
              <PdfPage
                pdf={pdf}
                pageNumber={currentPage}
                scale={zoom / 100}
                rotation={rotation}
              />
            </div>
          ) : null}
        </div>
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
          zIndex: 20
        }}
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
