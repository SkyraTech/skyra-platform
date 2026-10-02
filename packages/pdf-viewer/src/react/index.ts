'use client';
import React, { useEffect, useRef } from 'react';
import '../index'; // Ensure custom element is registered

export interface PdfViewerProps {
  title?: string;
  src?: string | Blob | ArrayBuffer;
  totalPages?: number;
  initialPage?: number;
  initialZoom?: number;
  workerSrc?: string;
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
  initialPage = 1,
  initialZoom = 100,
  workerSrc,
  onPageChange,
  onPrint,
  onDownload,
  height = '520px',
  className = '',
}: PdfViewerProps) {
  const ref = useRef<any>(null);

  // Sync props to element
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    el.docTitle = title;
    el.src = src;
    
    if (workerSrc) el.setAttribute('worker-src', workerSrc);
    else el.removeAttribute('worker-src');
  }, [title, src, workerSrc]);

  // Sync event listeners
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    
    const handlePageChange = (e: any) => onPageChange?.(e.detail);
    const handlePrint = () => onPrint?.();
    const handleDownload = () => onDownload?.();
    
    el.addEventListener('skyra-page-change', handlePageChange);
    el.addEventListener('skyra-print', handlePrint);
    el.addEventListener('skyra-download', handleDownload);
    
    return () => {
      el.removeEventListener('skyra-page-change', handlePageChange);
      el.removeEventListener('skyra-print', handlePrint);
      el.removeEventListener('skyra-download', handleDownload);
    };
  }, [onPageChange, onPrint, onDownload]);

  const style = {
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return React.createElement('skyra-tech-pdf-viewer', {
    ref,
    class: className,
    style,
    'initial-page': initialPage,
    'initial-zoom': initialZoom,
  });
}
