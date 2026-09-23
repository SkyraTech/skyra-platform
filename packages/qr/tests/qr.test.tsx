import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { generateQRCode } from '../src/generate';
import { renderToSVGString } from '../src/render/svg';
import { QRCode } from '../src/react/QRCode';

describe('@skyra/qr - Core Generation', () => {
  it('generates a valid matrix for a string payload', () => {
    const matrix = generateQRCode('https://skyra.tech', { margin: 2 });
    
    expect(matrix).toBeDefined();
    expect(matrix.version).toBeGreaterThan(0);
    expect(matrix.errorCorrectionLevel).toBe('M'); // default
    expect(matrix.modules.length).toBeGreaterThan(0);
    expect(matrix.size).toBe(matrix.modules.length);
  });

  it('throws an error for empty payloads', () => {
    expect(() => generateQRCode('')).toThrow('Payload cannot be empty.');
  });

  it('applies correct error correction levels', () => {
    const matrix = generateQRCode('hello', { errorCorrectionLevel: 'H' });
    expect(matrix.errorCorrectionLevel).toBe('H');
  });

  it('supports long payloads within actual capacity', () => {
    // Generate a ~2500 character payload
    const longPayload = Array(2500).fill('A').join('');
    const matrix = generateQRCode(longPayload, { errorCorrectionLevel: 'L' });
    expect(matrix.modules.length).toBeGreaterThan(0);
  });

  it('throws an error for payloads exceeding actual capacity', () => {
    // Generate an extremely long payload (e.g. 8000 chars) that exceeds max QR capacity (7089 for numeric, ~4296 for alphanumeric, ~2953 for byte)
    const tooLongPayload = Array(8000).fill('A').join('');
    expect(() => generateQRCode(tooLongPayload)).toThrow();
  });
});

describe('@skyra/qr - Matrix', () => {
  it('version 1 produces correct base matrix dimensions without margin', () => {
    const matrix = generateQRCode('test', { version: 1 });
    // Version 1 is exactly 21x21 modules
    expect(matrix.size).toBe(21);
    expect(matrix.modules.length).toBe(21);
    expect(matrix.modules[0].length).toBe(21);
  });
});

describe('@skyra/qr - SVG Rendering', () => {
  it('renders a deterministic SVG string', () => {
    const matrix = generateQRCode('test', { margin: 0 });
    const svg = renderToSVGString(matrix, { color: { dark: '#000000', light: '#ffffff' } });
    
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0');
    expect(svg).toContain('fill="#ffffff"'); // light background
    expect(svg).toContain('fill="#000000"'); // dark modules
    expect(svg).toContain('<path d="M');
  });

  it('escapes colors safely to prevent XML injection', () => {
    const matrix = generateQRCode('test');
    const svg = renderToSVGString(matrix, { color: { dark: '"><script>alert(1)</script>' } });
    
    expect(svg).not.toContain('<script>');
    expect(svg).toContain('&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('applies margin correctly to viewBox without modifying matrix', () => {
    const matrix = generateQRCode('test', { version: 1 });
    // base size 21, margin 4 => total size 29
    const svg = renderToSVGString(matrix, { margin: 4 });
    expect(svg).toContain('viewBox="0 0 29 29"');
    
    const svgNoMargin = renderToSVGString(matrix, { margin: 0 });
    expect(svgNoMargin).toContain('viewBox="0 0 21 21"');
  });
});

describe('@skyra/qr - React Component', () => {
  it('renders an SVG element', () => {
    const { container } = render(<QRCode value="test-value" aria-label="Test QR" />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('viewBox');
    
    // Check accessibility wrapper
    const wrapper = container.querySelector('[role="img"]');
    expect(wrapper).toHaveAttribute('aria-label', 'Test QR');
  });

  it('does not crash on empty value', () => {
    const { container } = render(<QRCode value="" />);
    expect(container.firstChild).toBeNull();
  });
});
