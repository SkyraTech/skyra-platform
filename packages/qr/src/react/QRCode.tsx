/**
 * @skyra/qr — react/QRCode.tsx
 * Accessible React component for rendering QR Codes via SVG.
 */
import React, { useMemo } from 'react';
import { generateQRCode } from '../generate';
import { buildSVGPath } from '../render/svg';
import { QRCodeOptions, QRCodeRenderOptions } from '../types';

export interface QRCodeProps extends QRCodeOptions, QRCodeRenderOptions, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  /** The string payload to encode in the QR code. */
  value: string;
  /** Accessible label describing the QR code destination/content. */
  'aria-label'?: string;
  /** Custom CSS class for the wrapper element. */
  className?: string;
}

/**
 * Renders an optimized SVG QR Code.
 */
export const QRCode = React.forwardRef<HTMLDivElement, QRCodeProps>((props, ref) => {
  const {
    value,
    errorCorrectionLevel = 'M',
    version,
    margin = 4,
    maskPattern,
    scale = 4,
    width,
    color,
    className,
    style,
    'aria-label': ariaLabel,
    ...rest
  } = props;

  // Memoize matrix generation to prevent expensive recalculations on re-renders
  const matrix = useMemo(() => {
    try {
      if (!value) return null;
      return generateQRCode(value, {
        errorCorrectionLevel,
        version,
        maskPattern,
      });
    } catch (e) {
      console.error('[@skyra/qr] Failed to generate QR code:', e);
      return null;
    }
  }, [value, errorCorrectionLevel, version, maskPattern]);

  if (!matrix) {
    return null; // Or a fallback placeholder
  }

  const { size } = matrix;
  const totalSize = size + margin * 2;
  const lightColor = color?.light ?? '#ffffff';
  const darkColor = color?.dark ?? '#000000';
  const responsiveWidth = width ?? (totalSize * scale);

  // Generate SVG path natively in React using the shared helper
  const pathData = useMemo(() => buildSVGPath(matrix, margin), [matrix, margin]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        width: width ?? responsiveWidth,
        maxWidth: '100%',
        ...style,
      }}
      role="img"
      aria-label={ariaLabel || 'QR Code'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${totalSize} ${totalSize}`}
        style={{ width: '100%', height: 'auto' }}
        shapeRendering="crispEdges"
      >
        {lightColor.toLowerCase() !== 'transparent' && (
          <rect width="100%" height="100%" fill={lightColor} />
        )}
        {pathData && <path d={pathData} fill={darkColor} />}
      </svg>
    </div>
  );
});

QRCode.displayName = 'QRCode';
