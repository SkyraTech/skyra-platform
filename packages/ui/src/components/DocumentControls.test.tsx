import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { PdfViewer } from './PdfViewer';
import { PrintButton } from './PrintButton';
import { DownloadButton } from './DownloadButton';

describe('Document & Action Controls', () => {
  describe('PdfViewer', () => {
    it('renders with title and toolbar controls', () => {
      render(<PdfViewer title="Quarterly Report" totalPages={5} />);
      expect(screen.getAllByText('Quarterly Report').length).toBeGreaterThanOrEqual(1);
      expect(screen.getByLabelText(/zoom in/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/zoom out/i)).toBeInTheDocument();
      expect(screen.getAllByText(/page/i).length).toBeGreaterThanOrEqual(1);
    });

    it('navigates pages on next/prev click', () => {
      const onPageChange = vi.fn();
      render(<PdfViewer totalPages={3} onPageChange={onPageChange} />);

      const nextBtn = screen.getByRole('button', { name: /next page/i });
      fireEvent.click(nextBtn);

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('renders error state', () => {
      render(<PdfViewer error="Failed to load PDF document" />);
      expect(screen.getByText('Failed to load PDF document')).toBeInTheDocument();
    });
  });

  describe('PrintButton', () => {
    it('handles print click and callbacks', () => {
      const onPrint = vi.fn();
      render(<PrintButton onPrint={onPrint}>Print Invoice</PrintButton>);

      const btn = screen.getByRole('button', { name: /print invoice/i });
      fireEvent.click(btn);

      expect(onPrint).toHaveBeenCalled();
    });
  });

  describe('DownloadButton', () => {
    it('handles download click and callbacks', () => {
      const onDownload = vi.fn();
      render(<DownloadButton onDownload={onDownload}>Download File</DownloadButton>);

      const btn = screen.getByRole('button', { name: /download file/i });
      fireEvent.click(btn);

      expect(onDownload).toHaveBeenCalled();
    });
  });
});
