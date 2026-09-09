import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ExportButton } from './ExportButton';
import { ExportMenu } from './ExportMenu';

describe('Export Controls', () => {
  const testData = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];

  describe('ExportButton', () => {
    it('renders with export action label and executes handler', async () => {
      const onExport = vi.fn();
      render(<ExportButton format="csv" data={testData} onExport={onExport} />);

      const btn = screen.getByRole('button', { name: /export csv/i });
      await act(async () => { fireEvent.click(btn); });

      expect(onExport).toHaveBeenCalled();
    });
  });

  describe('ExportMenu', () => {
    it('opens dropdown and displays export choices', () => {
      const onExportPdf = vi.fn();
      render(<ExportMenu data={testData} onExportPdf={onExportPdf} />);

      const trigger = screen.getByRole('button', { name: /export/i });
      fireEvent.click(trigger);

      expect(screen.getByRole('menu')).toBeInTheDocument();
      expect(screen.getByText('Export CSV')).toBeInTheDocument();
      expect(screen.getByText('Export Excel')).toBeInTheDocument();
      expect(screen.getByText('Export PDF')).toBeInTheDocument();

      fireEvent.click(screen.getByText('Export PDF'));
      expect(onExportPdf).toHaveBeenCalled();
    });
  });
});
