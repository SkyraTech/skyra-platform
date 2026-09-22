import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  FileUpload,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadDropzone,
  validateFiles,
  formatFileSize,
  isAcceptedFileType,
} from './FileUpload';

describe('File Validation Utilities', () => {
  describe('formatFileSize', () => {
    it('formats 0 bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 B');
    });

    it('formats bytes, KB, MB, and GB', () => {
      expect(formatFileSize(500)).toBe('500 B');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024 * 2.5)).toBe('2.5 MB');
      expect(formatFileSize(1024 * 1024 * 1024 * 1.2)).toBe('1.2 GB');
    });
  });

  describe('isAcceptedFileType', () => {
    it('accepts any file when accept is empty or "*"', () => {
      const file = new File(['hello'], 'document.pdf', { type: 'application/pdf' });
      expect(isAcceptedFileType(file, '')).toBe(true);
      expect(isAcceptedFileType(file, '*')).toBe(true);
      expect(isAcceptedFileType(file, '*/*')).toBe(true);
    });

    it('matches exact MIME types', () => {
      const pdf = new File(['content'], 'doc.pdf', { type: 'application/pdf' });
      const png = new File(['content'], 'img.png', { type: 'image/png' });
      expect(isAcceptedFileType(pdf, 'application/pdf')).toBe(true);
      expect(isAcceptedFileType(png, 'application/pdf')).toBe(false);
    });

    it('matches wildcard MIME patterns like image/*', () => {
      const png = new File(['content'], 'img.png', { type: 'image/png' });
      const jpeg = new File(['content'], 'img.jpg', { type: 'image/jpeg' });
      const txt = new File(['content'], 'text.txt', { type: 'text/plain' });

      expect(isAcceptedFileType(png, 'image/*')).toBe(true);
      expect(isAcceptedFileType(jpeg, 'image/*')).toBe(true);
      expect(isAcceptedFileType(txt, 'image/*')).toBe(false);
    });

    it('matches file extensions like .pdf, .docx', () => {
      const pdf = new File(['content'], 'contract.PDF', { type: '' });
      const docx = new File(['content'], 'report.docx', { type: '' });
      const zip = new File(['content'], 'archive.zip', { type: '' });

      expect(isAcceptedFileType(pdf, '.pdf')).toBe(true);
      expect(isAcceptedFileType(docx, '.pdf, .docx')).toBe(true);
      expect(isAcceptedFileType(zip, '.pdf, .docx')).toBe(false);
    });
  });

  describe('validateFiles', () => {
    const file1 = new File(['12345'], 'file1.png', { type: 'image/png' });
    const file2 = new File(['1234567890'], 'file2.png', { type: 'image/png' });
    const pdfFile = new File(['pdfcontent'], 'doc.pdf', { type: 'application/pdf' });

    it('validates file types correctly', () => {
      const { valid, rejected } = validateFiles([file1, pdfFile], { accept: 'image/*' });
      expect(valid).toEqual([file1]);
      expect(rejected).toHaveLength(1);
      expect(rejected[0].file.name).toBe('doc.pdf');
      expect(rejected[0].errors[0].code).toBe('file-invalid-type');
    });

    it('validates max file size correctly', () => {
      const { valid, rejected } = validateFiles([file1, file2], { maxSize: 8 });
      expect(valid).toEqual([file1]);
      expect(rejected).toHaveLength(1);
      expect(rejected[0].file.name).toBe('file2.png');
      expect(rejected[0].errors[0].code).toBe('file-too-large');
    });

    it('validates max file count taking existing files into account', () => {
      const { valid, rejected } = validateFiles([file1, file2, pdfFile], {
        maxFiles: 2,
        currentFileCount: 1,
      });
      // maxFiles = 2, current = 1 -> only 1 more allowed
      expect(valid).toEqual([file1]);
      expect(rejected).toHaveLength(2);
      expect(rejected[0].errors[0].code).toBe('too-many-files');
      expect(rejected[1].errors[0].code).toBe('too-many-files');
    });

    it('handles multiple validation errors on a single file', () => {
      const largePdf = new File(['large content exceeding size'], 'large.pdf', { type: 'application/pdf' });
      const { rejected } = validateFiles([largePdf], { accept: 'image/*', maxSize: 5 });
      expect(rejected).toHaveLength(1);
      expect(rejected[0].errors.map((e) => e.code)).toContain('file-invalid-type');
      expect(rejected[0].errors.map((e) => e.code)).toContain('file-too-large');
    });
  });
});

describe('FileUpload Component', () => {
  beforeEach(() => {
    vi.stubGlobal('URL', {
      createObjectURL: vi.fn(() => 'blob:mock-url'),
      revokeObjectURL: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders correctly with accessible file input', () => {
    render(
      <FileUpload accept="image/*">
        <FileUploadTrigger>Choose File</FileUploadTrigger>
      </FileUpload>
    );

    const input = screen.getByTestId('skyra-file-input') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.type).toBe('file');
    expect(input.accept).toBe('image/*');
    expect(input.multiple).toBe(false);
  });

  it('supports multiple files selection', () => {
    render(
      <FileUpload multiple>
        <FileUploadTrigger>Upload Files</FileUploadTrigger>
      </FileUpload>
    );

    const input = screen.getByTestId('skyra-file-input') as HTMLInputElement;
    expect(input.multiple).toBe(true);
  });

  it('triggers onFilesChange when valid files are selected', () => {
    const handleFilesChange = vi.fn();
    const handleReject = vi.fn();

    render(
      <FileUpload onFilesChange={handleFilesChange} onReject={handleReject}>
        <FileUploadTrigger>Select</FileUploadTrigger>
      </FileUpload>
    );

    const input = screen.getByTestId('skyra-file-input') as HTMLInputElement;
    const file = new File(['content'], 'test.png', { type: 'image/png' });

    fireEvent.change(input, { target: { files: [file] } });

    expect(handleFilesChange).toHaveBeenCalledTimes(1);
    expect(handleFilesChange).toHaveBeenCalledWith([file]);
    expect(handleReject).not.toHaveBeenCalled();
  });

  it('triggers onReject when selected file exceeds maxSize', () => {
    const handleFilesChange = vi.fn();
    const handleReject = vi.fn();

    render(
      <FileUpload
        maxSize={10}
        onFilesChange={handleFilesChange}
        onReject={handleReject}
      >
        <FileUploadTrigger>Select</FileUploadTrigger>
      </FileUpload>
    );

    const input = screen.getByTestId('skyra-file-input') as HTMLInputElement;
    const bigFile = new File(['this content is way larger than 10 bytes'], 'big.png', {
      type: 'image/png',
    });

    fireEvent.change(input, { target: { files: [bigFile] } });

    expect(handleFilesChange).not.toHaveBeenCalled();
    expect(handleReject).toHaveBeenCalledTimes(1);
    expect(handleReject.mock.calls[0][0][0].errors[0].code).toBe('file-too-large');
  });

  it('renders file list and handles item removal', async () => {
    const handleRemove = vi.fn();
    const handleFilesChange = vi.fn();
    const file = new File(['data'], 'invoice.pdf', { type: 'application/pdf' });

    render(
      <FileUpload files={[file]} onFilesChange={handleFilesChange}>
        <FileUploadList>
          <FileUploadItem file={file} onRemove={handleRemove} />
        </FileUploadList>
      </FileUpload>
    );

    expect(screen.getByText('invoice.pdf')).toBeInTheDocument();
    const removeBtn = screen.getByRole('button', { name: /Remove invoice.pdf/i });
    expect(removeBtn).toBeInTheDocument();

    await userEvent.click(removeBtn);
    expect(handleRemove).toHaveBeenCalledWith(file);
  });

  it('supports upload status: uploading with progress and error state', () => {
    const file = new File(['data'], 'photo.jpg', { type: 'image/jpeg' });
    const onRetry = vi.fn();

    const { rerender } = render(
      <FileUpload files={[file]}>
        <FileUploadList>
          <FileUploadItem file={file} status="uploading" progress={65} />
        </FileUploadList>
      </FileUpload>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();

    // Rerender with error
    rerender(
      <FileUpload files={[file]}>
        <FileUploadList>
          <FileUploadItem
            file={file}
            status="error"
            errorMessage="Network timeout"
            onRetry={onRetry}
          />
        </FileUploadList>
      </FileUpload>
    );

    expect(screen.getByText('Network timeout')).toBeInTheDocument();
    const retryBtn = screen.getByRole('button', { name: /Retry photo.jpg/i });
    fireEvent.click(retryBtn);
    expect(onRetry).toHaveBeenCalledWith(file);
  });

  it('creates and cleans up object URLs for image preview', () => {
    const imageFile = new File(['image-bytes'], 'banner.png', { type: 'image/png' });

    const { unmount } = render(
      <FileUpload files={[imageFile]}>
        <FileUploadList>
          <FileUploadItem file={imageFile} showPreview />
        </FileUploadList>
      </FileUpload>
    );

    expect(URL.createObjectURL).toHaveBeenCalledWith(imageFile);

    unmount();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('disables interactions when disabled prop is set', () => {
    const file = new File(['data'], 'doc.pdf', { type: 'application/pdf' });

    render(
      <FileUpload files={[file]} disabled>
        <FileUploadTrigger>Upload</FileUploadTrigger>
        <FileUploadList>
          <FileUploadItem file={file} />
        </FileUploadList>
      </FileUpload>
    );

    const input = screen.getByTestId('skyra-file-input') as HTMLInputElement;
    expect(input.disabled).toBe(true);

    const removeBtn = screen.getByRole('button', { name: /Remove doc.pdf/i });
    expect(removeBtn).toBeDisabled();
  });
});
