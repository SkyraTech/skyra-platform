/**
 * @skyra/qr — generate.ts
 * Core matrix generation engine using 'qrcode' as the underlying encoder.
 */
import QRCodeLib from 'qrcode';
import { QRCodeOptions, QRCodeMatrix } from './types';
import { validateQRCodeInput } from './validation';

/**
 * Generates a framework-independent QR code matrix representation.
 * This performs validation, byte/alphanumeric mode selection, and error correction processing.
 * 
 * @param payload The string data to encode.
 * @param options QR code configuration options.
 * @returns A generic QRCodeMatrix that can be rendered to SVG, Canvas, or other targets.
 */
export function generateQRCode(payload: string, options: QRCodeOptions = {}): QRCodeMatrix {
  // 1. Pure generic validation (no business logic)
  validateQRCodeInput(payload, options);

  // 2. Wrap the core 'qrcode' create API.
  // We use create() to get the raw matrix instead of having it render an SVG string directly,
  // so we can tightly control SVG accessibility and React rendering ourselves.
  const qr = QRCodeLib.create(payload, {
    errorCorrectionLevel: options.errorCorrectionLevel || 'M',
    version: options.version,
    maskPattern: options.maskPattern as any,
  });

  const { modules, version, errorCorrectionLevel } = qr;
  
  // `modules` contains a flat Uint8Array in the qrcode library representing the 2D bit matrix.
  const dataSize = modules.size;
  
  const bitMatrix: boolean[][] = Array(dataSize).fill(null).map(() => Array(dataSize).fill(false));

  for (let row = 0; row < dataSize; row++) {
    for (let col = 0; col < dataSize; col++) {
      // The bitmask is stored linearly. 1 means dark, 0 means light.
      const isDark = modules.data[row * dataSize + col] === 1;
      bitMatrix[row]![col] = isDark;
    }
  }

  return {
    size: dataSize,
    modules: bitMatrix,
    version,
    errorCorrectionLevel: (errorCorrectionLevel as any)?.name?.toUpperCase() || options.errorCorrectionLevel || 'M',
  };
}
