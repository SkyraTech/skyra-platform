import { describe, it, expect } from 'vitest';
import { generateQRCode } from '../generate';
import { renderToSVGString, buildSVGPath } from './svg';

describe('renderToSVGString & buildSVGPath', () => {
  const matrix = generateQRCode('https://skyra.tech/test', { errorCorrectionLevel: 'M' });

  it('renders standard SVG with default options', () => {
    const svg = renderToSVGString(matrix);
    expect(svg).toContain('<svg xmlns="http://www.w3.org/2000/svg"');
    expect(svg).toContain('viewBox=');
    expect(svg).toContain('<rect width="100%" height="100%" fill="#ffffff" />');
    expect(svg).toContain('fill="#000000"');
    expect(svg).toContain('</svg>');
  });

  it('renders custom foreground and background colors', () => {
    const svg = renderToSVGString(matrix, {
      color: {
        dark: '#1e293b',
        light: '#f8fafc'
      }
    });
    expect(svg).toContain('fill="#f8fafc"');
    expect(svg).toContain('fill="#1e293b"');
  });

  it('omits background rect when light color is transparent', () => {
    const svg = renderToSVGString(matrix, {
      color: {
        light: 'transparent'
      }
    });
    expect(svg).not.toContain('<rect');
  });

  it('supports module shapes (square, rounded, dot)', () => {
    const squareSvg = renderToSVGString(matrix, { style: { moduleShape: 'square' } });
    const roundedSvg = renderToSVGString(matrix, { style: { moduleShape: 'rounded' } });
    const dotSvg = renderToSVGString(matrix, { style: { moduleShape: 'dot' } });

    expect(squareSvg).toContain('h1v1h-1z');
    expect(roundedSvg).toContain('a0.25,0.25');
    expect(dotSvg).toContain('A0.45,0.45');
  });

  it('supports finder shapes and finder color', () => {
    const svg = renderToSVGString(matrix, {
      style: {
        finderShape: 'rounded',
        finderColor: '#ff0000'
      }
    });
    expect(svg).toContain('fill="#ff0000"');
  });

  it('supports non-responsive fixed width/height', () => {
    const svg = renderToSVGString(matrix, { responsive: false, width: 300 });
    expect(svg).toContain('width="300"');
    expect(svg).toContain('height="300"');
  });

  it('buildSVGPath outputs dark module path coordinates', () => {
    const path = buildSVGPath(matrix, 4);
    expect(typeof path).toBe('string');
    expect(path.length).toBeGreaterThan(0);
    expect(path).toContain('M');
    expect(path).toContain('h1v1h-1z');
  });
});
