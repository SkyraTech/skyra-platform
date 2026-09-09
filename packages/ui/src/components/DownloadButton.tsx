'use client';

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import { Button, ButtonProps } from './Button';

export interface DownloadButtonProps extends Omit<ButtonProps, 'onClick'> {
  /** Download file URL */
  url?: string;
  /** Download Blob */
  blob?: Blob;
  /** Destination filename */
  filename?: string;
  /** Custom download handler */
  onDownload?: () => void | Promise<void>;
  /** Custom button label */
  children?: React.ReactNode;
}

/**
 * @skyra/ui DownloadButton
 *
 * Reusable file download button supporting URLs, Blobs, or async callbacks.
 */
export function DownloadButton({
  url,
  blob,
  filename = 'download',
  onDownload,
  children = 'Download',
  variant = 'outline',
  leftIcon = <Download size={16} />,
  ...rest
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      if (onDownload) {
        await onDownload();
      } else if (blob && typeof window !== 'undefined') {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(blobUrl);
      } else if (url && typeof window !== 'undefined') {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      leftIcon={leftIcon}
      isLoading={isDownloading}
      onClick={handleDownload}
      {...rest}
    >
      {children}
    </Button>
  );
}
