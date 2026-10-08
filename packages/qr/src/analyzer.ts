import { QRCodeMatrix } from './types';

// Helper to convert hex to rgb
function hexToRgb(hex: string) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1] as string, 16),
    g: parseInt(result[2] as string, 16),
    b: parseInt(result[3] as string, 16)
  } : null;
}

// Relative luminance based on sRGB
function getLuminance(r: number, g: number, b: number) {
  const getC = (c: number) => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const rs = getC(r);
  const gs = getC(g);
  const bs = getC(b);
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function analyzeQRContrast(darkColor: string, lightColor: string) {
  // Transparent is usually rendered on a white surface, assuming #fff for analysis
  if (lightColor.toLowerCase() === 'transparent') lightColor = '#ffffff';

  const darkRgb = hexToRgb(darkColor);
  const lightRgb = hexToRgb(lightColor);

  if (!darkRgb || !lightRgb) {
    return {
      contrast: 0,
      status: 'FAIL' as const,
      message: 'Invalid colors provided for contrast analysis.'
    };
  }

  const l1 = getLuminance(lightRgb.r, lightRgb.g, lightRgb.b);
  const l2 = getLuminance(darkRgb.r, darkRgb.g, darkRgb.b);
  
  // Contrast ratio calculation
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  let status: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
  let message = 'Contrast is excellent.';

  if (ratio < 2.5) {
    status = 'FAIL';
    message = 'Contrast is extremely low. QR code will likely not scan.';
  } else if (ratio < 4.0) {
    status = 'WARNING';
    message = 'Contrast is low. QR code may be difficult to scan in low light.';
  }

  if (l2 > l1) {
    status = 'WARNING';
    message = 'Inverted contrast detected (light foreground on dark background). Some older scanners do not support inverted QR codes.';
  }

  return {
    contrast: parseFloat(ratio.toFixed(2)),
    status,
    message
  };
}

export function analyzeScanability(
  matrix: QRCodeMatrix | null,
  margin: number,
  errorCorrectionLevel: 'L' | 'M' | 'Q' | 'H',
  darkColor: string,
  lightColor: string
) {
  const contrastResult = analyzeQRContrast(darkColor, lightColor);
  let overallStatus: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
  const issues: string[] = [];

  if (contrastResult.status === 'FAIL') {
    overallStatus = 'FAIL';
    issues.push(contrastResult.message);
  } else if (contrastResult.status === 'WARNING') {
    overallStatus = 'WARNING';
    issues.push(contrastResult.message);
  }

  if (margin < 4) {
    if (overallStatus as string !== 'FAIL') overallStatus = 'WARNING';
    issues.push(`Quiet zone (margin) is ${margin}. A margin of 4 is recommended for optimal scannability.`);
  }

  // Large payload density analysis
  if (matrix && matrix.version > 20 && errorCorrectionLevel === 'L') {
    if (overallStatus as string !== 'FAIL') overallStatus = 'WARNING';
    issues.push('Very dense QR code with Low error correction. High risk of scan failure if slightly damaged.');
  }

  return {
    overallStatus,
    issues,
    contrast: contrastResult.contrast
  };
}
