'use client';

import React, {
  forwardRef,
  useRef,
  useState,
  useCallback,
  ComponentPropsWithoutRef,
  ReactNode,
  DragEvent,
  KeyboardEvent,
} from 'react';
import { Upload, FileUp, AlertCircle } from 'lucide-react';
import {
  useFileUpload,
  validateFiles,
  FileRejection,
  formatFileSize,
} from './FileUpload';

export interface DropzoneProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title' | 'onDrop'> {
  /** Callback fired when valid files are dropped or selected */
  onDrop?: (files: File[]) => void;
  /** Callback fired when files are rejected by validation */
  onReject?: (rejections: FileRejection[]) => void;
  /** Accepted file types / extensions (e.g. 'image/*', '.pdf') */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files */
  maxFiles?: number;
  /** Whether multiple files are allowed */
  multiple?: boolean;
  /** Whether interaction is disabled */
  disabled?: boolean;
  /** Primary label headline */
  title?: ReactNode;
  /** Subtitle or hint description */
  description?: ReactNode;
  /** Custom icon override */
  icon?: ReactNode;
  /** Custom children to override default layout */
  children?: ReactNode;
  className?: string;
}

export const Dropzone = forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      onDrop,
      onReject,
      accept: propAccept,
      maxSize: propMaxSize,
      maxFiles: propMaxFiles,
      multiple: propMultiple,
      disabled: propDisabled,
      title,
      description,
      icon,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Optional parent FileUpload context integration
    let parentContext: ReturnType<typeof useFileUpload> | null = null;
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      parentContext = useFileUpload();
    } catch {
      parentContext = null;
    }

    const disabled = propDisabled ?? parentContext?.disabled ?? false;
    const accept = propAccept ?? parentContext?.accept;
    const maxSize = propMaxSize ?? parentContext?.maxSize;
    const maxFiles = propMaxFiles ?? parentContext?.maxFiles;
    const multiple = propMultiple ?? parentContext?.multiple ?? true;

    const standaloneInputRef = useRef<HTMLInputElement | null>(null);
    const dragCounterRef = useRef(0);

    const [isDragActive, setIsDragActive] = useState(false);
    const [isDragReject, setIsDragReject] = useState(false);

    const openFilePicker = () => {
      if (disabled) return;
      if (parentContext) {
        parentContext.openFilePicker();
      } else if (standaloneInputRef.current) {
        standaloneInputRef.current.value = '';
        standaloneInputRef.current.click();
      }
    };

    const processFiles = useCallback(
      (filesToProcess: File[]) => {
        if (disabled || filesToProcess.length === 0) return;

        const { valid, rejected } = validateFiles(filesToProcess, {
          accept,
          maxSize,
          maxFiles,
        });

        if (rejected.length > 0) {
          onReject?.(rejected);
        }

        if (valid.length > 0) {
          onDrop?.(valid);
          parentContext?.onFilesSelected(valid);
        }
      },
      [accept, disabled, maxFiles, maxSize, onDrop, onReject, parentContext]
    );

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounterRef.current += 1;
      setIsDragActive(true);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      e.dataTransfer.dropEffect = 'copy';
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounterRef.current -= 1;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsDragActive(false);
        setIsDragReject(false);
      }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      dragCounterRef.current = 0;
      setIsDragActive(false);
      setIsDragReject(false);

      const droppedFiles = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
      if (disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openFilePicker();
      }
    };

    return (
      <div
        ref={ref}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="File upload dropzone. Drag and drop files here or press Enter to browse files."
        aria-disabled={disabled}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`skyra-dropzone ${isDragActive ? 'skyra-dropzone--active' : ''} ${
          isDragReject ? 'skyra-dropzone--reject' : ''
        } ${disabled ? 'skyra-dropzone--disabled' : ''} ${className}`}
        {...props}
      >
        {/* Hidden input for standalone usage */}
        {!parentContext && (
          <input
            ref={standaloneInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={(e) => {
              const selected = e.target.files ? Array.from(e.target.files) : [];
              processFiles(selected);
            }}
            aria-hidden="true"
            tabIndex={-1}
            style={{ display: 'none' }}
          />
        )}

        {children ?? (
          <div className="skyra-dropzone-content">
            <div className="skyra-dropzone-icon">
              {icon ?? (isDragActive ? <FileUp size={36} /> : <Upload size={36} />)}
            </div>
            <div className="skyra-dropzone-text">
              <span className="skyra-dropzone-title">
                {title ?? (isDragActive ? 'Drop files here' : 'Drag & drop files here, or browse')}
              </span>
              <span className="skyra-dropzone-desc">
                {description ??
                  (accept
                    ? `Supported formats: ${accept}${maxSize ? ` · Max size: ${formatFileSize(maxSize)}` : ''}`
                    : `Click to browse or drag files here${maxSize ? ` · Max size: ${formatFileSize(maxSize)}` : ''}`)}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }
);
Dropzone.displayName = 'Dropzone';

export const FileUploadDropzone = Dropzone;
export type FileUploadDropzoneProps = DropzoneProps;
