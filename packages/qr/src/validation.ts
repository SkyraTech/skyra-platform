/**
 * @skyra/qr — validation.ts
 * Pure validation logic for QR Code generation.
 */
import { QRCodeOptions, QRCodeErrorCorrectionLevel } from './types';

export class QRCodeValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QRCodeValidationError';
  }
}

/**
 * Validates the generic payload and options for QR code generation.
 * @throws {QRCodeValidationError} if inputs are invalid.
 */
export function validateQRCodeInput(payload: string, options?: QRCodeOptions): void {
  if (typeof payload !== 'string') {
    throw new QRCodeValidationError('Payload must be a string.');
  }

  if (payload.length === 0) {
    throw new QRCodeValidationError('Payload cannot be empty.');
  }

  // The capacity of the QR code is determined by the underlying encoder
  // based on the payload type, version, and error correction level.
  // We allow the encoder to throw its own errors for capacity limits.

  if (options) {
    if (options.version !== undefined && (options.version < 1 || options.version > 40)) {
      throw new QRCodeValidationError('Version must be between 1 and 40.');
    }

    if (options.errorCorrectionLevel !== undefined) {
      const validLevels: QRCodeErrorCorrectionLevel[] = ['L', 'M', 'Q', 'H'];
      if (!validLevels.includes(options.errorCorrectionLevel)) {
        throw new QRCodeValidationError(`Invalid error correction level: ${options.errorCorrectionLevel}`);
      }
    }
  }
}
