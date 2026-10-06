/**
 * @id qr-core-basic
 * @title Core QR Generation
 * @apiId @skyra-tech-platform/qr::generateQRCode
 * @packageId @skyra-tech-platform/qr
 * @capabilityId qr/core
 */
import { generateQRCode } from '@skyra-tech-platform/qr';

export function runExample() {
  // Runtime neutral QR code generation
  // Can be executed on Node.js, edge, or browser
  return generateQRCode('https://skyra.com', {
    errorCorrectionLevel: 'H',
    version: 4
  });
}
