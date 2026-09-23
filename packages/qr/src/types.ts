/**
 * @skyra/qr — types.ts
 * Generic QR Code types and interfaces.
 */

/**
 * QR Code Error Correction Level
 * L = Low (~7%)
 * M = Medium (~15%)
 * Q = Quartile (~25%)
 * H = High (~30%)
 */
export type QRCodeErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

/**
 * QR Code Generation Options
 */
export interface QRCodeOptions {
  /**
   * Error correction level.
   * Higher levels provide better damage resistance but increase data density.
   * @default 'M'
   */
  errorCorrectionLevel?: QRCodeErrorCorrectionLevel;
  /**
   * QR Code version (1-40).
   * If not specified, the optimal version will be calculated automatically based on payload size.
   */
  version?: number;
  /**
   * Force a specific masking pattern (0-7).
   * Usually automatically determined by the encoder for optimal readability.
   */
  maskPattern?: number;
}

/**
 * Generic representation of a generated QR Code matrix.
 * Independent of rendering target (SVG, Canvas, React).
 */
export interface QRCodeMatrix {
  /** The size of the matrix (number of modules per side). */
  size: number;
  /** The 2D boolean array representing the QR modules (true = dark, false = light). */
  modules: boolean[][];
  /** The version used to encode the data. */
  version: number;
  /** The error correction level used. */
  errorCorrectionLevel: QRCodeErrorCorrectionLevel;
}

/**
 * Base options for rendering a QR code matrix.
 */
export interface QRCodeRenderOptions {
  /**
   * Scale factor (pixels per module).
   * @default 4
   */
  scale?: number;
  /**
   * Width of the output image in pixels. Overrides `scale` if provided.
   */
  width?: number;
  /** Color configuration */
  color?: {
    /** Dark module color (e.g. '#000000') @default '#000000' */
    dark?: string;
    /** Light module (background) color (e.g. '#ffffff' or 'transparent') @default '#ffffff' */
    light?: string;
  };
  /**
   * The quiet zone size (in modules) to add around the matrix when rendering.
   * @default 4
   */
  margin?: number;
}

export interface QRCodeSVGOptions extends QRCodeRenderOptions {
  /** Whether to output a responsive viewBox instead of fixed width/height. @default true */
  responsive?: boolean;
}
