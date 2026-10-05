/**
 * @id qr-core-basic
 * @title Core QR Generation
 * @apiId @skyra/qr::generateQRCode
 * @packageId @skyra/qr
 * @capabilityId qr/core
 */
import { generateQRCode } from '@skyra/qr/core';

export function runExample() {
  // Runtime neutral QR code generation
  // Can be executed on Node.js, edge, or browser
  return generateQRCode('https://skyra.com', {
    errorCorrectionLevel: 'H',
    version: 4
  });
}
