import { describe, it, expect } from 'vitest';
import { generateQRCode } from './generate';
import { QRCodeValidationError } from './validation';

describe('generateQRCode', () => {
  it('generates a valid QR matrix from a simple string', () => {
    const matrix = generateQRCode('https://skyra.tech');
    expect(matrix).toBeDefined();
    expect(matrix.size).toBeGreaterThan(0);
    expect(matrix.modules.length).toBe(matrix.size);
    expect(matrix.modules[0]?.length).toBe(matrix.size);
    expect(matrix.version).toBeGreaterThanOrEqual(1);
    expect(['L', 'M', 'Q', 'H']).toContain(matrix.errorCorrectionLevel);
  });

  it('supports explicit error correction levels', () => {
    const matrixL = generateQRCode('Test payload', { errorCorrectionLevel: 'L' });
    const matrixH = generateQRCode('Test payload', { errorCorrectionLevel: 'H' });
    expect(matrixL.errorCorrectionLevel).toBe('L');
    expect(matrixH.errorCorrectionLevel).toBe('H');
  });

  it('throws QRCodeValidationError for empty string', () => {
    expect(() => generateQRCode('')).toThrow(QRCodeValidationError);
    expect(() => generateQRCode('')).toThrow('Payload cannot be empty.');
  });

  it('throws QRCodeValidationError for non-string input', () => {
    expect(() => generateQRCode(null as any)).toThrow(QRCodeValidationError);
    expect(() => generateQRCode(123 as any)).toThrow(QRCodeValidationError);
  });

  it('validates version range (1-40)', () => {
    expect(() => generateQRCode('test', { version: 0 })).toThrow(QRCodeValidationError);
    expect(() => generateQRCode('test', { version: 41 })).toThrow(QRCodeValidationError);
    expect(() => generateQRCode('test', { version: 2 })).not.toThrow();
  });

  it('validates error correction level values', () => {
    expect(() => generateQRCode('test', { errorCorrectionLevel: 'X' as any })).toThrow(QRCodeValidationError);
  });

  it('throws when payload exceeds version capacity', () => {
    // 300 characters cannot fit into version 1 (which maxes out at ~25 bytes)
    const longPayload = 'A'.repeat(300);
    expect(() => generateQRCode(longPayload, { version: 1 })).toThrow();
  });
});
