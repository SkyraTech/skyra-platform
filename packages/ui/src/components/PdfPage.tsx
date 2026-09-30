import React, { useRef, useEffect, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

interface PdfPageProps {
  pdf: pdfjsLib.PDFDocumentProxy;
  pageNumber: number;
  scale?: number;
  rotation?: number;
  width?: number;
  onLoadSuccess?: (page: pdfjsLib.PDFPageProxy) => void;
  className?: string;
}

export function PdfPage({
  pdf,
  pageNumber,
  scale = 1,
  rotation = 0,
  width,
  onLoadSuccess,
  className = '',
}: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pageInfo, setPageInfo] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    let isCancelled = false;
    let renderTask: pdfjsLib.RenderTask | null = null;
    let page: pdfjsLib.PDFPageProxy | null = null;

    const renderPage = async () => {
      try {
        page = await pdf.getPage(pageNumber);
        if (isCancelled) return;

        let viewport = page.getViewport({ scale: 1, rotation });
        
        // Calculate the actual scale based on either the requested scale or a fixed width
        let actualScale = scale;
        if (width) {
          actualScale = width / viewport.width;
        }
        
        viewport = page.getViewport({ scale: actualScale, rotation });

        setPageInfo({ width: viewport.width, height: viewport.height });
        onLoadSuccess?.(page);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        // Support high-DPI displays
        const outputScale = window.devicePixelRatio || 1;
        canvas.width = Math.floor(viewport.width * outputScale);
        canvas.height = Math.floor(viewport.height * outputScale);
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;

        const transform = outputScale !== 1
          ? [outputScale, 0, 0, outputScale, 0, 0]
          : undefined;

        const renderContext = {
          canvasContext: context,
          transform,
          viewport,
        };

        renderTask = page.render(renderContext);
        await renderTask.promise;
      } catch (err) {
        if (!isCancelled && err instanceof Error && err.name !== 'RenderingCancelledException') {
          console.error('Error rendering page:', err);
        }
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTask) {
        renderTask.cancel();
      }
      if (page) {
        page.cleanup();
      }
    };
  }, [pdf, pageNumber, scale, rotation, width]);

  return (
    <div 
      className={className} 
      style={{ 
        position: 'relative', 
        display: 'inline-flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        background: '#ffffff',
        width: pageInfo ? `${pageInfo.width}px` : (width ? `${width}px` : 'auto'),
        height: pageInfo ? `${pageInfo.height}px` : (width ? `${width * 1.414}px` : 'auto'), // A4 approx ratio as fallback
        boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
      {!pageInfo && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', color: 'var(--skyra-text-muted)' }}>
          <svg className="skyra-spin" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
        </div>
      )}
    </div>
  );
}
