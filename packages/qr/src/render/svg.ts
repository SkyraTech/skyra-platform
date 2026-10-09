/**
 * @skyra-tech-platform/qr — render/svg.ts
 * Deterministic SVG string generator for QRCodeMatrix.
 */
import { QRCodeMatrix, QRCodeSVGOptions } from '../types';

/**
 * Escapes characters for XML attributes.
 */
function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

function isFinder(row: number, col: number, size: number): boolean {
  if (row <= 6 && col <= 6) return true; // Top-left
  if (row <= 6 && col >= size - 7) return true; // Top-right
  if (row >= size - 7 && col <= 6) return true; // Bottom-left
  return false;
}

function getPathForShape(c: number, r: number, shape: 'square' | 'rounded' | 'dot' = 'square'): string {
  if (shape === 'dot') {
    // A circle using SVG path: Center is c+0.5, r+0.5, radius is 0.45 for a slight gap, or 0.5 for touching
    const rScale = 0.45;
    return `M${c + 0.5},${r + 0.5 - rScale} A${rScale},${rScale} 0 1,1 ${c + 0.5},${r + 0.5 + rScale} A${rScale},${rScale} 0 1,1 ${c + 0.5},${r + 0.5 - rScale}Z `;
  } else if (shape === 'rounded') {
    // A rounded rect using SVG path (rx=0.25)
    return `M${c + 0.25},${r} h0.5 a0.25,0.25 0 0,1 0.25,0.25 v0.5 a0.25,0.25 0 0,1 -0.25,0.25 h-0.5 a0.25,0.25 0 0,1 -0.25,-0.25 v-0.5 a0.25,0.25 0 0,1 0.25,-0.25 Z `;
  }
  // Default square
  return `M${c},${r}h1v1h-1z `;
}

export function renderToSVGString(matrix: QRCodeMatrix, options: QRCodeSVGOptions = {}): string {
  const { size, modules } = matrix;
  
  const scale = options.scale ?? 4;
  const lightColor = options.color?.light ?? '#ffffff';
  const darkColor = options.color?.dark ?? '#000000';
  const responsive = options.responsive ?? true;

  const margin = options.margin ?? 4;
  const totalSize = size + margin * 2;
  const width = options.width ?? (totalSize * scale);
  const height = width;

  const style = options.style || {};
  const moduleShape = style.moduleShape || 'square';
  const finderShape = style.finderShape || 'square';
  const finderColor = style.finderColor || darkColor;

  const bodyPathParts: string[] = [];
  const finderPathParts: string[] = [];

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (modules[row]?.[col]) {
        const x = col + margin;
        const y = row + margin;
        if (isFinder(row, col, size)) {
          finderPathParts.push(getPathForShape(x, y, finderShape));
        } else {
          bodyPathParts.push(getPathForShape(x, y, moduleShape));
        }
      }
    }
  }

  // Assemble SVG root
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" `;
  if (!responsive) {
    svg += `width="${width}" height="${height}" `;
  } else {
    svg += `style="width: 100%; height: auto;" `;
  }
  svg += `shape-rendering="crispEdges">`;

  // Draw background if not transparent
  if (lightColor.toLowerCase() !== 'transparent') {
    svg += `<rect width="100%" height="100%" fill="${escapeXml(lightColor)}" />`;
  }

  // Draw modules
  if (bodyPathParts.length > 0) {
    svg += `<path d="${bodyPathParts.join('')}" fill="${escapeXml(darkColor)}" />`;
  }
  
  if (finderPathParts.length > 0) {
    svg += `<path d="${finderPathParts.join('')}" fill="${escapeXml(finderColor)}" />`;
  }

  svg += `</svg>`;
  return svg;
}

