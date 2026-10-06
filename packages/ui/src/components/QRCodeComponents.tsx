'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { QRCode, QRCodeProps } from './QRCode';
import { Button, DropdownMenu, Input, Badge, Alert } from '../index';
import { Download, Copy, Share2, ZoomIn, ZoomOut, Check, AlertTriangle, Maximize, RefreshCw, XCircle } from 'lucide-react';
import { renderToSVGString, generateQRCode } from '@skyra-tech-platform/qr';

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

/** Evaluates standard WCAG relative luminance for a hex color */
function getLuminance(hex: string) {
  const c = hex.substring(1);
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;
  
  const a = [r, g, b].map(function (v) {
    v /= 255;
  });
  const [ra, ga, ba] = a;
  return ra! * 0.2126 + ga! * 0.7152 + ba! * 0.0722;
}

/** Calculates contrast ratio between two hex colors */
function getContrastRatio(hex1: string, hex2: string) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);
  return (lightest + 0.05) / (darkest + 0.05);
}

// ---------------------------------------------------------
// QRCodeScanabilityStatus
// ---------------------------------------------------------

export interface QRCodeValidationProps {
  value: string;
  margin?: number;
  darkColor?: string;
  lightColor?: string;
}

export function QRCodeScanabilityStatus({ value, margin = 4, darkColor = '#000000', lightColor = '#ffffff' }: QRCodeValidationProps) {
  const warnings: string[] = [];
  const errors: string[] = [];

  if (!value) {
    errors.push('Payload empty. QR Code cannot be generated.');
  } else if (value.length > 2000) {
    warnings.push('Payload is large; the QR symbol may require a larger version and may be harder to reproduce at small physical sizes.');
  }

  if (margin < 4) {
    warnings.push(`Quiet zone is ${margin} modules. A four-module quiet zone is recommended for reliable QR scanning.`);
  }

  const contrast = getContrastRatio(darkColor, lightColor);
  if (contrast < 3) {
    warnings.push('Custom colors may reduce QR scanability. Consider using a darker foreground and lighter background.');
  }
  
  // Ensure background is actually lighter than foreground (QR scanners expect dark on light)
  if (getLuminance(darkColor) > getLuminance(lightColor)) {
    warnings.push('Inverted colors (light foreground on dark background) may fail on many QR scanners.');
  }

  if (errors.length > 0) {
    return (
      <Alert variant="danger" icon={<XCircle size={16} />}>
        {errors[0]}
      </Alert>
    );
  }

  if (warnings.length > 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {warnings.map((warn, i) => (
          <Alert key={i} variant="warning" icon={<AlertTriangle size={16} />}>
            {warn}
          </Alert>
        ))}
      </div>
    );
  }

  return (
    <Alert variant="success" icon={<Check size={16} />}>
      Configuration looks good. Recommended scanability.
    </Alert>
  );
}

// ---------------------------------------------------------
// QRCodeExportMenu
// ---------------------------------------------------------

export interface QRCodeExportMenuProps extends QRCodeProps {
  filename?: string;
}

export function QRCodeExportMenu({ filename = 'skyra-qr', ...qrProps }: QRCodeExportMenuProps) {
  const handleDownloadSVG = () => {
    try {
      const matrix = generateQRCode(qrProps.value, { errorCorrectionLevel: qrProps.errorCorrectionLevel, version: qrProps.version, maskPattern: qrProps.maskPattern });
      const svgStr = renderToSVGString(matrix, { scale: qrProps.scale, margin: qrProps.margin, color: qrProps.color });
      
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Failed to export SVG', e);
    }
  };

  const handleDownloadPNG = () => {
    try {
      const matrix = generateQRCode(qrProps.value, { errorCorrectionLevel: qrProps.errorCorrectionLevel, version: qrProps.version, maskPattern: qrProps.maskPattern });
      const svgStr = renderToSVGString(matrix, { scale: qrProps.scale, margin: qrProps.margin, color: qrProps.color });
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const pngUrl = URL.createObjectURL(pngBlob);
              const link = document.createElement('a');
              link.href = pngUrl;
              link.download = `${filename}.png`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(pngUrl);
            }
          }, 'image/png');
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    } catch (e) {
      console.error('Failed to export PNG', e);
    }
  };

  const handleCopyPayload = async () => {
    try {
      await navigator.clipboard.writeText(qrProps.value);
    } catch (e) {
      console.error('Clipboard copy failed', e);
    }
  };

  const canShare = typeof navigator !== 'undefined' && !!navigator.share;
  const handleShare = async () => {
    if (canShare) {
      try {
        await navigator.share({
          title: 'QR Code Payload',
          text: qrProps.value,
        });
      } catch (e) {
        console.error('Share failed', e);
      }
    }
  };

  const items: any[] = [
    { type: 'item', label: 'Download SVG', icon: <Download size={14} />, onClick: handleDownloadSVG },
    { type: 'item', label: 'Download PNG', icon: <Download size={14} />, onClick: handleDownloadPNG },
    { type: 'separator' },
    { type: 'item', label: 'Copy Payload', icon: <Copy size={14} />, onClick: handleCopyPayload },
    ...(canShare ? [{ type: 'item', label: 'Share', icon: <Share2 size={14} />, onClick: handleShare }] : []),
  ];

  return (
    <DropdownMenu
      trigger={
        <Button variant="outline" rightIcon={<Download size={14} />}>
          Export
        </Button>
      }
      items={items}
    />
  );
}

// ---------------------------------------------------------
// QRCodePreview
// ---------------------------------------------------------

export interface QRCodePreviewProps extends QRCodeProps {
  filename?: string;
}

export function QRCodePreview({ filename, ...qrProps }: QRCodePreviewProps) {
  const [zoomIndex, setZoomIndex] = useState(0); // 0 = Fit, 1 = 50%, 2 = 75%, 3 = 100%, 4 = 150%, 5 = 200%
  const zoomLevels = ['Fit', 0.5, 0.75, 1, 1.5, 2.0];
  const containerRef = useRef<HTMLDivElement>(null);

  const matrix = useMemo(() => {
    try {
      return qrProps.value ? generateQRCode(qrProps.value, { errorCorrectionLevel: qrProps.errorCorrectionLevel, version: qrProps.version, maskPattern: qrProps.maskPattern }) : null;
    } catch {
      return null;
    }
  }, [qrProps.value, qrProps.errorCorrectionLevel, qrProps.version, qrProps.maskPattern]);

  // Actual generated dimension
  const scale = qrProps.scale ?? 4;
  const margin = qrProps.margin ?? 4;
  const generatedSize = matrix ? (matrix.size + margin * 2) * scale : 200;

  const currentZoom = zoomLevels[zoomIndex];
  const isFit = currentZoom === 'Fit';

  return (
    <div 
      className="skyra-qr-preview-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid var(--skyra-border)',
        borderRadius: 'var(--skyra-radius-lg)',
        background: 'var(--skyra-surface)',
        overflow: 'hidden',
        boxShadow: 'var(--skyra-shadow-sm)',
        width: '100%',
      }}
    >
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.25rem',
        borderBottom: '1px solid var(--skyra-border)',
        background: 'var(--skyra-bg)',
        flexWrap: 'wrap',
        gap: '0.5rem',
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--skyra-text)' }}>Live Preview</span>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', overflow: 'hidden' }}>
            <button 
              type="button"
              onClick={() => setZoomIndex(Math.max(1, zoomIndex - 1))}
              disabled={isFit || zoomIndex === 1}
              style={{ padding: '0.25rem 0.5rem', background: 'transparent', border: 'none', cursor: isFit || zoomIndex === 1 ? 'not-allowed' : 'pointer', color: 'var(--skyra-text)' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <div style={{ fontSize: '0.75rem', padding: '0 0.5rem', minWidth: '3.5rem', textAlign: 'center', color: 'var(--skyra-text)', fontWeight: 500 }}>
              {isFit ? 'Fit' : `${(currentZoom as number) * 100}%`}
            </div>
            <button 
              type="button"
              onClick={() => setZoomIndex(isFit ? 4 : Math.min(zoomLevels.length - 1, zoomIndex + 1))} // default to 150% if jumping from fit
              disabled={!isFit && zoomIndex === zoomLevels.length - 1}
              style={{ padding: '0.25rem 0.5rem', background: 'transparent', border: 'none', cursor: !isFit && zoomIndex === zoomLevels.length - 1 ? 'not-allowed' : 'pointer', color: 'var(--skyra-text)' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button 
              type="button"
              onClick={() => setZoomIndex(0)}
              style={{ padding: '0.25rem 0.5rem', background: 'transparent', borderLeft: '1px solid var(--skyra-border)', borderTop: 'none', borderRight: 'none', borderBottom: 'none', cursor: 'pointer', color: 'var(--skyra-text)' }}
              title="Fit to Stage"
            >
              <Maximize size={14} />
            </button>
          </div>
          <QRCodeExportMenu filename={filename} {...qrProps} />
        </div>
      </div>

      {/* Stage */}
      <div 
        ref={containerRef}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          minHeight: '360px',
          background: 'var(--skyra-bg)',
          backgroundImage: 'radial-gradient(var(--skyra-border) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          overflow: isFit ? 'hidden' : 'auto', // Scrollbars only when zoomed
          position: 'relative'
        }}
      >
        <div style={{
           display: 'flex',
           alignItems: 'center',
           justifyContent: 'center',
           // The wrapper controls actual dimensions if fit is needed
           ...(isFit ? {
             width: '100%',
             height: '100%',
             maxHeight: '400px',
           } : {
             width: generatedSize * (currentZoom as number),
             height: generatedSize * (currentZoom as number),
             flexShrink: 0,
           }),
           transition: 'all 0.2s ease-out'
        }}>
          {qrProps.value ? (
            <div style={{
              background: qrProps.color?.light ?? '#ffffff',
              borderRadius: '4px',
              boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.05)',
              // Contains the QR Code component completely
              width: isFit ? 'auto' : '100%',
              height: isFit ? 'auto' : '100%',
              maxWidth: '100%',
              maxHeight: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
            }}>
              <QRCode 
                {...qrProps} 
                style={{
                   // When Fit is enabled, the SVG scales implicitly via its viewBox & wrapper
                   width: isFit ? '100%' : '100%', 
                   height: isFit ? '100%' : '100%',
                   display: 'block'
                }} 
              />
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed var(--skyra-border)', borderRadius: 'var(--skyra-radius-md)', background: 'var(--skyra-surface)', width: '200px', height: '200px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--skyra-text-muted)', fontWeight: 500 }}>No payload</span>
            </div>
          )}
        </div>
      </div>

      {/* Metadata */}
      <div style={{ padding: '1rem 1.25rem', background: 'var(--skyra-surface)', borderTop: '1px solid var(--skyra-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Encoded Data</span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Badge variant="neutral" style={{ fontSize: '0.7rem' }}>EC: {qrProps.errorCorrectionLevel ?? 'M'}</Badge>
            {matrix && <Badge variant="neutral" style={{ fontSize: '0.7rem' }}>{matrix.size}×{matrix.size}</Badge>}
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', color: 'var(--skyra-text)', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {qrProps.value || 'Empty'}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------
// QRCodeConfigurator
// ---------------------------------------------------------

export interface QRCodeConfiguratorProps {
  value: string;
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H';
  margin: number;
  scale: number;
  darkColor: string;
  lightColor: string;
  onChange: (updates: Partial<Omit<QRCodeConfiguratorProps, 'onChange'>>) => void;
}

export function QRCodeConfigurator(props: QRCodeConfiguratorProps) {
  const { value, errorCorrectionLevel, margin, scale, darkColor, lightColor, onChange } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Content</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Payload Value</label>
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange({ value: e.target.value })}
            placeholder="Enter URL or text..."
            style={{ fontFamily: 'monospace', height: '2.5rem', width: '100%' }}
          />
        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--skyra-border)' }} />

      {/* Rendering Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Rendering Options</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', width: '100%' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Error Correction</label>
            <select
              value={errorCorrectionLevel}
              onChange={(e) => onChange({ errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
              style={{
                height: '2.5rem',
                width: '100%',
                borderRadius: 'var(--skyra-radius-md)',
                border: '1px solid var(--skyra-border)',
                background: 'var(--skyra-bg)',
                color: 'var(--skyra-text)',
                padding: '0 0.75rem',
                fontSize: '0.875rem'
              }}
            >
              <option value="L">L (7% - Low)</option>
              <option value="M">M (15% - Default)</option>
              <option value="Q">Q (25% - High)</option>
              <option value="H">H (30% - Highest)</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Scale (px/mod)</label>
            <Input
              type="number"
              value={scale}
              min={1}
              max={100}
              onChange={(e) => onChange({ scale: Number(e.target.value) })}
              style={{ height: '2.5rem', width: '100%' }}
            />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Quiet Zone</label>
            <Input
              type="number"
              value={margin}
              min={0}
              max={20}
              onChange={(e) => onChange({ margin: Number(e.target.value) })}
              style={{ height: '2.5rem', width: '100%' }}
            />
          </div>

        </div>
      </div>

      <div style={{ borderTop: '1px solid var(--skyra-border)' }} />

      {/* Colors */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--skyra-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>Colors</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', width: '100%' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Foreground</label>
            <Input
              type="text"
              value={darkColor}
              onChange={(e) => onChange({ darkColor: e.target.value })}
              className="font-mono uppercase"
              style={{ width: '100%' }}
              prefix={
                <div style={{
                  width: '1.25rem', height: '1.25rem', borderRadius: '3px', overflow: 'hidden',
                  border: '1px solid var(--skyra-border)', position: 'relative', boxShadow: 'var(--skyra-shadow-sm)',
                  pointerEvents: 'auto',
                }}>
                  <input type="color" value={darkColor} onChange={(e) => onChange({ darkColor: e.target.value })}
                    style={{ width: '200%', height: '200%', margin: '-50%', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }} />
                </div>
              }
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--skyra-text)' }}>Background</label>
            <Input
              type="text"
              value={lightColor}
              onChange={(e) => onChange({ lightColor: e.target.value })}
              className="font-mono uppercase"
              style={{ width: '100%' }}
              prefix={
                <div style={{
                  width: '1.25rem', height: '1.25rem', borderRadius: '3px', overflow: 'hidden',
                  border: '1px solid var(--skyra-border)', position: 'relative', boxShadow: 'var(--skyra-shadow-sm)',
                  pointerEvents: 'auto',
                }}>
                  <input type="color" value={lightColor} onChange={(e) => onChange({ lightColor: e.target.value })}
                    style={{ width: '200%', height: '200%', margin: '-50%', padding: 0, border: 'none', cursor: 'pointer', background: 'none' }} />
                </div>
              }
            />
          </div>

        </div>
      </div>
      
    </div>
  );
}
