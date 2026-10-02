/**
 * @skyra/qr — react/QRCode.tsx
 * Accessible React component for rendering QR Codes via SVG.
 */
import React, { useMemo } from 'react';
import { generateQRCode, buildSVGPath, QRCodeOptions, QRCodeRenderOptions } from '@skyra/qr/core';

export interface QRCodeProps extends QRCodeOptions, QRCodeRenderOptions, Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  /** The string payload to encode in the QR code. */
  value: string;
  /** Accessible label describing the QR code destination/content. */
  'aria-label'?: string;
  /** Custom CSS class for the wrapper element. */
  className?: string;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'skyra-qr-code': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        value?: string;
        'error-correction-level'?: string;
        version?: number;
        margin?: number;
        'mask-pattern'?: number;
        scale?: number;
        'color-light'?: string;
        'color-dark'?: string;
        width?: number | string;
        'aria-label'?: string;
      };
    }
  }
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

  const lightColor = color?.light ?? '#ffffff';
  const darkColor = color?.dark ?? '#000000';

  if (!value) return null;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        display: 'inline-block',
        maxWidth: '100%',
        ...style,
      }}
    >
      <skyra-qr-code
        value={value}
        error-correction-level={errorCorrectionLevel}
        version={version}
        margin={margin}
        mask-pattern={maskPattern}
        scale={scale}
        color-light={lightColor}
        color-dark={darkColor}
        width={width}
        aria-label={ariaLabel || 'QR Code'}
      />
    </div>
  );
});

QRCode.displayName = 'QRCode';
