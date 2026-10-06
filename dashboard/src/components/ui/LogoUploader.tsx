'use client';

import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';
import { Spinner } from './Spinner';

export interface LogoUploaderProps {
  /** Current logo URL (controlled) */
  currentLogoUrl?: string;
  /** Called when user selects a file — application handles the actual upload */
  onUpload: (file: File) => Promise<string | null>;
  /** Called when user removes logo */
  onRemove?: () => void;
  /** Displayed label */
  label?: string;
  /** Accepted file types */
  accept?: string;
  /** Max file size in bytes */
  maxSizeBytes?: number;
  disabled?: boolean;
}

/**
 * @skyra/ui LogoUploader
 *
 * [B] PLATFORM EXTRACTION — generalized from ERP logo upload patterns.
 *
 * Adapter pattern — this component does NOT make any API or storage calls.
 * The application provides onUpload(file) → Promise<url | null>.
 * Supabase, Vercel Blob, S3, etc. are application concerns.
 */
export function LogoUploader({
  currentLogoUrl,
  onUpload,
  onRemove,
  label = 'Organization Logo',
  accept = 'image/png,image/jpeg,image/webp,image/svg+xml',
  maxSizeBytes = 2 * 1024 * 1024,  // 2MB default
  disabled,
}: LogoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentLogoUrl);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (file.size > maxSizeBytes) {
      setError(`File too large. Maximum size is ${Math.round(maxSizeBytes / 1024 / 1024)}MB.`);
      return;
    }

    // Local preview while uploading
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setIsUploading(true);

    try {
      const url = await onUpload(file);
      if (url) {
        setPreview(url);
        URL.revokeObjectURL(objectUrl);
      } else {
        setPreview(currentLogoUrl);
        setError('Upload failed. Please try again.');
      }
    } catch {
      setPreview(currentLogoUrl);
      setError('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleRemove = () => {
    setPreview(undefined);
    setError(null);
    onRemove?.();
  };

  return (
    <div className="skyra-logo-uploader">
      {label && (
        <div className="skyra-label" style={{ textAlign: 'center' }}>
          {label}
        </div>
      )}

      <div className="skyra-logo-preview">
        {isUploading ? (
          <Spinner size="md" label="Uploading logo..." />
        ) : preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Organization logo" />
        ) : (
          <Upload size={24} style={{ color: 'var(--skyra-text-subtle)' }} aria-hidden="true" />
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          aria-label="Upload logo"
          onChange={handleFileChange}
          disabled={disabled || isUploading}
          style={{ display: 'none' }}
          id="skyra-logo-file-input"
        />
        <button
          type="button"
          className="skyra-logo-upload-btn"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || isUploading}
          aria-label="Choose a logo image file to upload"
        >
          {preview ? 'Change Logo' : 'Upload Logo'}
        </button>
        {preview && onRemove && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled || isUploading}
            aria-label="Remove logo"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--skyra-danger)',
              fontSize: '0.8125rem',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem' }}
          >
            <X size={12} aria-hidden="true" />
            Remove
          </button>
        )}
      </div>

      {error && (
        <span className="skyra-error-msg" role="alert" style={{ fontSize: '0.8rem' }}>
          {error}
        </span>
      )}

      <p style={{ fontSize: '0.75rem', color: 'var(--skyra-text-subtle)', textAlign: 'center' }}>
        PNG, JPG, WebP or SVG · Max {Math.round(maxSizeBytes / 1024 / 1024)}MB
      </p>
    </div>
  );
}
