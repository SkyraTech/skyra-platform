'use client';

import React, { useState } from 'react';
import {
  FileUpload,
  FileUploadTrigger,
  FileUploadList,
  FileUploadItem,
  FileUploadDropzone,
  FileUploadStatus,
  FileRejection,
  Button,
  Badge,
  Card,
  Alert,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function FileUploadShowcasePage() {
  // Single file state
  const [singleFiles, setSingleFiles] = useState<File[]>([]);
  const [singleRejections, setSingleRejections] = useState<FileRejection[]>([]);

  // Multiple files with image preview
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryRejections, setGalleryRejections] = useState<FileRejection[]>([]);

  // Simulated upload state tracker
  const [simulatedFiles, setSimulatedFiles] = useState<
    Array<{
      file: File;
      status: FileUploadStatus;
      progress: number;
      error?: string;
    }>
  >(() => {
    // Initial mock files for demonstration
    const doc1 = new File(['Tax Filing 2026 Q3'], 'Tax_Filing_Q3_2026.pdf', {
      type: 'application/pdf',
    });
    const doc2 = new File(['Vendor Contract Signed'], 'Signed_Contract_Acme.pdf', {
      type: 'application/pdf',
    });
    const doc3 = new File(['Corrupted Asset Data'], 'Broken_Export.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    return [
      { file: doc1, status: 'success', progress: 100 },
      { file: doc2, status: 'uploading', progress: 68 },
      { file: doc3, status: 'error', progress: 34, error: 'Network timeout during chunk 3' },
    ];
  });

  const handleSimulatedRetry = (file: File) => {
    setSimulatedFiles((prev) =>
      prev.map((item) =>
        item.file === file
          ? { ...item, status: 'uploading', progress: 10, error: undefined }
          : item
      )
    );

    // Simulate progress completion
    setTimeout(() => {
      setSimulatedFiles((prev) =>
        prev.map((item) =>
          item.file === file
            ? { ...item, status: 'success', progress: 100 }
            : item
        )
      );
    }, 1200);
  };

  const handleSimulatedRemove = (file: File) => {
    setSimulatedFiles((prev) => prev.filter((item) => item.file !== file));
  };

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          File Upload System
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Production-grade file selection and management system with strict type validation, pure client-side verification, progress visualization, accessible keyboard controls, and zero business logic lock-in.
        </p>
      </div>

      {/* 1. Basic Single & Multiple Selection */}
      <DemoSection title="1. Basic File Upload (Single & Multiple)" desc="Accessible native input wrapper with customizable triggers, drag dropzone composition, and file list item management." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Single File (PDF only, Max 5MB)">
            <FileUpload
              accept=".pdf"
              maxSize={5 * 1024 * 1024}
              files={singleFiles}
              onFilesChange={(files) => {
                setSingleFiles(files);
                setSingleRejections([]);
              }}
              onReject={(rejections) => setSingleRejections(rejections)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FileUploadTrigger>
                  <Button variant="outline">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Select PDF Document
                  </Button>
                </FileUploadTrigger>

                {singleRejections.length > 0 && (
                  <Alert variant="danger">
                    {singleRejections.map((r, i) => (
                      <div key={i}>
                        <strong>{r.file.name}:</strong> {r.errors.map((e) => e.message).join(', ')}
                      </div>
                    ))}
                  </Alert>
                )}

                <FileUploadList>
                  {singleFiles.map((file, idx) => (
                    <FileUploadItem key={idx} file={file} />
                  ))}
                </FileUploadList>
              </div>
            </FileUpload>
          </DemoBlock>

          <DemoBlock title="Multiple Images with Safe Preview (Max 3 Files, 2MB each)">
            <FileUpload
              multiple
              accept="image/*"
              maxFiles={3}
              maxSize={2 * 1024 * 1024}
              files={galleryFiles}
              onFilesChange={(files) => {
                setGalleryFiles(files);
                setGalleryRejections([]);
              }}
              onReject={(rejections) => setGalleryRejections(rejections)}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <FileUploadDropzone>
                  <div style={{ textAlign: 'center', padding: '1rem' }}>
                    <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>📷</div>
                    <div style={{ fontWeight: 600, color: 'var(--skyra-text)' }}>Drag & Drop photos or click to browse</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)', marginTop: '4px' }}>
                      Supports PNG, JPG, WebP up to 2MB (Max 3 files)
                    </div>
                  </div>
                </FileUploadDropzone>

                {galleryRejections.length > 0 && (
                  <Alert variant="danger">
                    {galleryRejections.map((r, i) => (
                      <div key={i}>
                        <strong>{r.file.name}:</strong> {r.errors.map((e) => e.message).join(', ')}
                      </div>
                    ))}
                  </Alert>
                )}

                <FileUploadList>
                  {galleryFiles.map((file, idx) => (
                    <FileUploadItem key={idx} file={file} showPreview />
                  ))}
                </FileUploadList>
              </div>
            </FileUpload>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Upload Lifecycle & Status Visualization */}
      <DemoSection title="2. Upload Statuses & Progress Integration" desc="Demonstration of idle, uploading (with Progress primitive), error (with retry action), and success states." erpSource="Platform Foundation">
        <Card style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--skyra-text)' }}>Batch Document Queue</h3>
              <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: 'var(--skyra-text-muted)' }}>
                Shows integration with Skyra progress bar, retry triggers, and dismissal controls.
              </p>
            </div>
            <Badge variant="info">{simulatedFiles.length} In Queue</Badge>
          </div>

          <FileUploadList>
            {simulatedFiles.map((item, idx) => (
              <FileUploadItem
                key={idx}
                file={item.file}
                status={item.status}
                progress={item.progress}
                errorMessage={item.error}
                onRetry={handleSimulatedRetry}
                onRemove={handleSimulatedRemove}
              />
            ))}
          </FileUploadList>
        </Card>
      </DemoSection>

      {/* 3. Disabled & Read-Only State */}
      <DemoSection title="3. Disabled State" desc="When disabled, native picker is non-interactive, dropzone stops accepting events, and remove buttons are locked." erpSource="Platform Foundation">
        <FileUpload
          disabled
          files={[
            new File(['System Archive'], 'Archived_Record_2025.zip', {
              type: 'application/zip',
            }),
          ]}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '500px' }}>
            <FileUploadTrigger>
              <Button disabled variant="outline">Browse Files (Disabled)</Button>
            </FileUploadTrigger>
            <FileUploadList>
              <FileUploadItem
                file={
                  new File(['System Archive'], 'Archived_Record_2025.zip', {
                    type: 'application/zip',
                  })
                }
              />
            </FileUploadList>
          </div>
        </FileUpload>
      </DemoSection>
    </div>
  );
}
