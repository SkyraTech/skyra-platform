'use client';

import React, {
  createContext,
  useContext,
  forwardRef,
  useRef,
  useState,
  useEffect,
  ComponentPropsWithoutRef,
  ReactNode,
  ChangeEvent,
} from 'react';
import {
  Upload,
  File as FileIcon,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X,
  Trash2,
  RotateCcw,
} from 'lucide-react';
import { Progress } from './Progress';

/* ─── Pure File Validation Utilities ─── */

export type FileErrorCode = 'file-invalid-type' | 'file-too-large' | 'too-many-files';

export interface FileError {
  code: FileErrorCode;
  message: string;
}

export type FileValidationError = FileError;

export interface FileRejection {
  file: File;
  errors: FileError[];
}

/**
 * Formats byte size into human readable string (e.g., 2.4 MB).
 */
export function formatFileSize(bytes: number): string {
  if (bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Validates a file against an accept string (MIME types, wildcards, or extensions).
 */
export function isAcceptedFileType(file: File, accept?: string): boolean {
  if (!accept || accept.trim() === '' || accept === '*' || accept === '*/*') return true;

  const acceptedTypes = accept.split(',').map((t) => t.trim().toLowerCase());
  const fileName = file.name.toLowerCase();
  const fileType = (file.type || '').toLowerCase();

  return acceptedTypes.some((type) => {
    if (type === '*' || type === '*/*') return true;
    // Extension match: .pdf, .png, etc.
    if (type.startsWith('.')) {
      return fileName.endsWith(type);
    }
    // Wildcard MIME match: image/*, audio/*, video/*
    if (type.endsWith('/*')) {
      const category = type.slice(0, -2);
      return fileType.startsWith(`${category}/`);
    }
    // Exact MIME match
    return fileType === type;
  });
}

export interface ValidateFilesOptions {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  currentCount?: number;
  currentFileCount?: number;
}

export type FileValidationOptions = ValidateFilesOptions;

export interface ValidateFilesResult {
  valid: File[];
  rejected: FileRejection[];
}

/**
 * Pure deterministic validation function for files against accept, maxSize, and maxFiles rules.
 */
export function validateFiles(
  files: File[],
  options: ValidateFilesOptions = {}
): ValidateFilesResult {
  const { accept, maxSize, maxFiles = Infinity } = options;
  const currentTotal = options.currentFileCount ?? options.currentCount ?? 0;
  const valid: File[] = [];
  const rejected: FileRejection[] = [];

  let totalAllowed = maxFiles - currentTotal;

  files.forEach((file) => {
    const errors: FileError[] = [];

    // Check accept type
    if (!isAcceptedFileType(file, accept)) {
      errors.push({
        code: 'file-invalid-type',
        message: `File type "${file.type || file.name.split('.').pop() || 'unknown'}" is not accepted.`,
      });
    }

    // Check max size
    if (maxSize && file.size > maxSize) {
      errors.push({
        code: 'file-too-large',
        message: `File size (${formatFileSize(file.size)}) exceeds maximum limit of ${formatFileSize(maxSize)}.`,
      });
    }

    // Check max files quota
    if (totalAllowed <= 0) {
      errors.push({
        code: 'too-many-files',
        message: `Cannot upload more than ${maxFiles} file${maxFiles === 1 ? '' : 's'}.`,
      });
    }

    if (errors.length > 0) {
      rejected.push({ file, errors });
    } else {
      valid.push(file);
      totalAllowed -= 1;
    }
  });

  return { valid, rejected };
}

/* ─── FileUpload Context ─── */

export type FileUploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export interface FileItemState {
  file: File;
  id?: string;
  status?: FileUploadStatus;
  progress?: number;
  error?: string;
  previewUrl?: string;
}

export interface FileUploadContextValue {
  files: File[];
  fileStates?: Record<string, FileItemState>;
  disabled?: boolean;
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  openFilePicker: () => void;
  removeFile: (fileToRemove: File) => void;
  clearFiles: () => void;
  onFilesSelected: (selectedFiles: File[]) => void;
}

const FileUploadContext = createContext<FileUploadContextValue | null>(null);

export function useFileUpload(): FileUploadContextValue {
  const context = useContext(FileUploadContext);
  if (!context) {
    throw new Error('useFileUpload must be used within a <FileUpload> provider.');
  }
  return context;
}

/* ─── FileUpload Component ─── */

export interface FileUploadProps extends ComponentPropsWithoutRef<'div'> {
  /** Controlled file collection */
  files?: File[];
  /** Default uncontrolled file collection */
  defaultFiles?: File[];
  /** Callback fired when file collection changes */
  onFilesChange?: (files: File[]) => void;
  /** Callback fired when files are rejected during validation */
  onReject?: (rejections: FileRejection[]) => void;
  /** Accepted file types / extensions (e.g., 'image/*', '.pdf,.docx') */
  accept?: string;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Maximum number of files allowed */
  maxFiles?: number;
  /** Whether multiple files can be selected */
  multiple?: boolean;
  /** Whether file upload interactions are disabled */
  disabled?: boolean;
  /** Custom children composition */
  children?: ReactNode;
  className?: string;
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(
  (
    {
      files: controlledFiles,
      defaultFiles = [],
      onFilesChange,
      onReject,
      accept,
      maxSize,
      maxFiles,
      multiple = false,
      disabled = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const isControlled = controlledFiles !== undefined;
    const [internalFiles, setInternalFiles] = useState<File[]>(defaultFiles);
    const activeFiles = isControlled ? controlledFiles : internalFiles;

    const inputRef = useRef<HTMLInputElement | null>(null);

    const openFilePicker = () => {
      if (disabled) return;
      if (inputRef.current) {
        inputRef.current.value = '';
        inputRef.current.click();
      }
    };

    const handleFilesSelected = (newFiles: File[]) => {
      if (disabled || newFiles.length === 0) return;

      const { valid, rejected } = validateFiles(newFiles, {
        accept,
        maxSize,
        maxFiles,
        currentCount: activeFiles.length,
      });

      if (rejected.length > 0) {
        onReject?.(rejected);
      }

      if (valid.length > 0) {
        const updatedFiles = multiple ? [...activeFiles, ...valid] : valid;
        if (!isControlled) {
          setInternalFiles(updatedFiles);
        }
        onFilesChange?.(updatedFiles);
      }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files ? Array.from(e.target.files) : [];
      handleFilesSelected(selected);
    };

    const removeFile = (fileToRemove: File) => {
      if (disabled) return;
      const updatedFiles = activeFiles.filter((f) => f !== fileToRemove);
      if (!isControlled) {
        setInternalFiles(updatedFiles);
      }
      onFilesChange?.(updatedFiles);
    };

    const clearFiles = () => {
      if (disabled) return;
      if (!isControlled) {
        setInternalFiles([]);
      }
      onFilesChange?.([]);
    };

    return (
      <FileUploadContext.Provider
        value={{
          files: activeFiles,
          disabled,
          accept,
          maxSize,
          maxFiles,
          multiple,
          inputRef,
          openFilePicker,
          removeFile,
          clearFiles,
          onFilesSelected: handleFilesSelected }}
      >
        <div
          ref={ref}
          className={`skyra-file-upload ${disabled ? 'skyra-file-upload--disabled' : ''} ${className}`}
          {...props}
        >
          {/* Accessible hidden file input */}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            onChange={handleInputChange}
            aria-label="Upload files"
            data-testid="skyra-file-input"
            tabIndex={-1}
            style={{ display: 'none' }}
          />
          {children}
        </div>
      </FileUploadContext.Provider>
    );
  }
);
FileUpload.displayName = 'FileUpload';

/* ─── FileUploadTrigger ─── */

export interface FileUploadTriggerProps extends ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
  children?: ReactNode;
}

export const FileUploadTrigger = forwardRef<HTMLButtonElement, FileUploadTriggerProps>(
  ({ onClick, className = '', children, ...props }, ref) => {
    const context = useContext(FileUploadContext);
    const disabled = context?.disabled ?? false;

    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented && context?.openFilePicker) {
            context.openFilePicker();
          }
        }}
        className={`skyra-file-upload-trigger ${className}`}
        {...props}
      >
        {children ?? (
          <>
            <Upload size={16} aria-hidden="true" />
            <span>Select Files</span>
          </>
        )}
      </button>
    );
  }
);
FileUploadTrigger.displayName = 'FileUploadTrigger';

/* ─── FileUploadList ─── */

export interface FileUploadListProps extends ComponentPropsWithoutRef<'ul'> {
  className?: string;
  children?: ReactNode;
}

export const FileUploadList = forwardRef<HTMLUListElement, FileUploadListProps>(
  ({ className = '', children, ...props }, ref) => {
    const context = useContext(FileUploadContext);
    const files = context?.files ?? [];

    if (!children && files.length === 0) return null;

    return (
      <ul ref={ref} className={`skyra-file-upload-list ${className}`} {...props}>
        {children ??
          files.map((file, index) => (
            <FileUploadItem
              key={`${file.name}-${file.size}-${index}`}
              file={file}
              onRemove={() => context?.removeFile(file)}
            />
          ))}
      </ul>
    );
  }
);
FileUploadList.displayName = 'FileUploadList';

export interface FileUploadItemProps extends ComponentPropsWithoutRef<'li'> {
  file: File;
  status?: FileUploadStatus;
  progress?: number;
  error?: string;
  errorMessage?: string;
  onRemove?: (file: File) => void;
  onRetry?: (file: File) => void;
  showPreview?: boolean;
  className?: string;
  children?: ReactNode;
}

export const FileUploadItem = forwardRef<HTMLLIElement, FileUploadItemProps>(
  (
    {
      file,
      status = 'idle',
      progress = 0,
      error,
      errorMessage,
      onRemove,
      onRetry,
      showPreview = true,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const fileUploadContext = useContext(FileUploadContext);
    const effectiveError = error ?? errorMessage;
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleRemoveClick = () => {
      if (onRemove) {
        onRemove(file);
      } else if (fileUploadContext?.removeFile) {
        fileUploadContext.removeFile(file);
      }
    };

    const handleRetryClick = () => {
      onRetry?.(file);
    };

    const isImage = file.type.startsWith('image/');

    useEffect(() => {
      if (!showPreview || !isImage) return;

      let url: string | null = null;
      try {
        url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } catch {
        setPreviewUrl(null);
      }

      return () => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      };
    }, [file, isImage, showPreview]);

    const getFileIcon = () => {
      if (isImage) return <ImageIcon size={18} aria-hidden="true" />;
      if (file.type.includes('pdf') || file.name.endsWith('.pdf')) {
        return <FileText size={18} aria-hidden="true" />;
      }
      return <FileIcon size={18} aria-hidden="true" />;
    };

    if (children) {
      return (
        <li
          ref={ref}
          className={`skyra-file-upload-item skyra-file-upload-item--${status} ${className}`}
          {...props}
        >
          {children}
        </li>
      );
    }

    return (
      <li
        ref={ref}
        className={`skyra-file-upload-item skyra-file-upload-item--${status} ${className}`}
        {...props}
      >
        {/* Preview or Icon */}
        <div className="skyra-file-item-thumb">
          {previewUrl ? (
            <img src={previewUrl} alt={file.name} className="skyra-file-item-img" />
          ) : (
            <div className="skyra-file-item-icon">{getFileIcon()}</div>
          )}
        </div>

        {/* File Metadata */}
        <div className="skyra-file-item-info">
          <div className="skyra-file-item-header">
            <span className="skyra-file-item-name" title={file.name}>
              {file.name}
            </span>
            <span className="skyra-file-item-size">{formatFileSize(file.size)}</span>
          </div>

          {/* Progress Bar when uploading */}
          {status === 'uploading' && (
            <div className="skyra-file-item-progress">
              <Progress value={progress} size="sm" aria-label={`Uploading ${file.name}`} />
              <span className="skyra-file-item-progress-text">{Math.round(progress)}%</span>
            </div>
          )}

          {/* Error Message */}
          {status === 'error' && effectiveError && (
            <div className="skyra-file-item-error" role="alert">
              <AlertCircle size={14} aria-hidden="true" />
              <span>{effectiveError}</span>
            </div>
          )}

          {/* Success badge */}
          {status === 'success' && (
            <div className="skyra-file-item-success">
              <CheckCircle2 size={14} aria-hidden="true" />
              <span>Uploaded</span>
            </div>
          )}
        </div>

        {/* Actions (Retry / Remove) */}
        <div className="skyra-file-item-actions">
          {status === 'error' && onRetry && (
            <button
              type="button"
              disabled={fileUploadContext?.disabled}
              onClick={handleRetryClick}
              className="skyra-file-item-btn skyra-file-item-btn--retry"
              aria-label={`Retry ${file.name}`}
            >
              <RotateCcw size={15} />
            </button>
          )}

          {(onRemove || fileUploadContext?.removeFile) && (
            <button
              type="button"
              disabled={fileUploadContext?.disabled}
              onClick={handleRemoveClick}
              className="skyra-file-item-btn skyra-file-item-btn--remove"
              aria-label={`Remove ${file.name}`}
            >
              <X size={15} />
            </button>
          )}
        </div>
      </li>
    );
  }
);
FileUploadItem.displayName = 'FileUploadItem';
