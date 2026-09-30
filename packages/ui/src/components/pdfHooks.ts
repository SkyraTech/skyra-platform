import { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Ensure worker is loaded
if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export function usePdfDocument(src?: string | Blob | ArrayBuffer) {
  const [pdf, setPdf] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!src) {
      setPdf(null);
      return;
    }
    
    let isCancelled = false;
    let loadingTask: pdfjsLib.PDFDocumentLoadingTask;

    const loadPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        let source;
        if (typeof src === 'string') {
          source = { url: src };
        } else if (src instanceof ArrayBuffer) {
          source = { data: src };
        } else if (src instanceof Blob) {
          source = { data: await src.arrayBuffer() };
        }

        if (source) {
          loadingTask = pdfjsLib.getDocument(source);
          const loadedPdf = await loadingTask.promise;
          if (!isCancelled) {
            setPdf(loadedPdf);
          }
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load PDF'));
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadPdf();

    return () => {
      isCancelled = true;
      if (loadingTask) {
        loadingTask.destroy().catch(() => {});
      }
    };
  }, [src]);

  return { pdf, loading, error };
}
