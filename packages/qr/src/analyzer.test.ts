import { describe, it, expect } from 'vitest';
import { analyzeQRContrast, analyzeScanability } from './analyzer';

describe('QR Analyzer', () => {
  it('calculates contrast accurately for passing colors', () => {
    const result = analyzeQRContrast('#000000', '#ffffff');
    expect(result.status).toBe('PASS');
    expect(result.contrast).toBeGreaterThan(15);
  });

  it('flags warning for low contrast', () => {
    const result = analyzeQRContrast('#777777', '#888888');
    expect(result.status).toBe('FAIL'); // Very low contrast
    expect(result.contrast).toBeLessThan(2.5);
  });

  it('flags warning for inverted contrast', () => {
    const result = analyzeQRContrast('#ffffff', '#000000');
    expect(result.status).toBe('WARNING');
  });

  it('handles transparent background as white', () => {
    const result = analyzeQRContrast('#000000', 'transparent');
    expect(result.status).toBe('PASS');
  });

  it('returns overall scanability', () => {
    const result = analyzeScanability(
      { size: 21, version: 1, modules: [], errorCorrectionLevel: 'M' },
      4,
      'M',
      '#000000',
      '#ffffff'
    );
    expect(result.overallStatus).toBe('PASS');
    expect(result.issues.length).toBe(0);
  });

  it('adds issue for small margin', () => {
    const result = analyzeScanability(null, 1, 'M', '#000000', '#ffffff');
    expect(result.overallStatus).toBe('WARNING');
    expect(result.issues[0]).toContain('Quiet zone');
  });

  it('adds issue for high density low EC', () => {
    const result = analyzeScanability(
      { size: 100, version: 21, modules: [], errorCorrectionLevel: 'L' },
      4,
      'L',
      '#000000',
      '#ffffff'
    );
    expect(result.overallStatus).toBe('WARNING');
    expect(result.issues[0]).toContain('Very dense QR code');
  });
});
