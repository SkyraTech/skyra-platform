'use client';

import React, { useState } from 'react';
import {
  Dropzone,
  FileUploadList,
  FileUploadItem,
  FileRejection,
  Alert,
  Badge,
} from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function DropzoneShowcasePage() {
  const [basicFiles, setBasicFiles] = useState<File[]>([]);
  const [basicRejections, setBasicRejections] = useState<FileRejection[]>([]);

  const [pdfFiles, setPdfFiles] = useState<File[]>([]);
  const [pdfRejections, setPdfRejections] = useState<FileRejection[]>([]);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Dropzone Primitive
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Accessible drag-and-drop surface with nested element event tracking, click-to-browse fallback, full keyboard triggers (Enter / Space), and client-side validation.
        </p>
      </div>

      {/* 1. Standard Dropzone */}
      <DemoSection title="1. Universal Drag-and-Drop Surface" desc="Drop any file or click / press Enter to open the native OS file picker." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Multi-format Dropzone (Any file)">
            <Dropzone
              multiple
              onDrop={(files) => {
                setBasicFiles((prev) => [...prev, ...files]);
                setBasicRejections([]);
              }}
              onReject={(rejections) => setBasicRejections(rejections)}
            />

            {basicRejections.length > 0 && (
              <Alert variant="danger" style={{ marginTop: '1rem' }}>
                {basicRejections.map((r, i) => (
                  <div key={i}>
                    <strong>{r.file.name}:</strong> {r.errors.map((e) => e.message).join(', ')}
                  </div>
                ))}
              </Alert>
            )}

            {basicFiles.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Dropped Files</span>
                  <Badge variant="primary">{basicFiles.length}</Badge>
                </div>
                <FileUploadList>
                  {basicFiles.map((file, idx) => (
                    <FileUploadItem
                      key={idx}
                      file={file}
                      onRemove={(f) => setBasicFiles((prev) => prev.filter((item) => item !== f))}
                    />
                  ))}
                </FileUploadList>
              </div>
            )}
          </DemoBlock>

          <DemoBlock title="Restricted PDF Dropzone (Max 10MB)">
            <Dropzone
              accept=".pdf"
              maxSize={10 * 1024 * 1024}
              title="Upload PDF Documents"
              description="Drop PDF reports here or press Enter to choose files"
              onDrop={(files) => {
                setPdfFiles((prev) => [...prev, ...files]);
                setPdfRejections([]);
              }}
              onReject={(rejections) => setPdfRejections(rejections)}
            />

            {pdfRejections.length > 0 && (
              <Alert variant="danger" style={{ marginTop: '1rem' }}>
                {pdfRejections.map((r, i) => (
                  <div key={i}>
                    <strong>{r.file.name}:</strong> {r.errors.map((e) => e.message).join(', ')}
                  </div>
                ))}
              </Alert>
            )}

            {pdfFiles.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <FileUploadList>
                  {pdfFiles.map((file, idx) => (
                    <FileUploadItem
                      key={idx}
                      file={file}
                      onRemove={(f) => setPdfFiles((prev) => prev.filter((item) => item !== f))}
                    />
                  ))}
                </FileUploadList>
              </div>
            )}
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Custom Content & Disabled States */}
      <DemoSection title="2. Custom Content & Disabled State" desc="Dropzones support custom ReactNode children, compact views, and disabled interaction locks." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Custom Child Layout">
            <Dropzone accept="image/*" onDrop={() => {}}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                <div style={{ fontSize: '2rem' }}>🖼️</div>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--skyra-text)' }}>Avatar / Logo Uploader</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--skyra-text-muted)' }}>
                    PNG, JPG, or SVG up to 5MB
                  </div>
                </div>
              </div>
            </Dropzone>
          </DemoBlock>

          <DemoBlock title="Disabled Dropzone">
            <Dropzone
              disabled
              title="Uploads Locked"
              description="This dropzone is currently disabled by system administrators"
            />
          </DemoBlock>
        </div>
      </DemoSection>
    </div>
  );
}
