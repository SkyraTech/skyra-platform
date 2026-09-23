# @skyra/qr

Skyra Platform generic QR code generation, matrix calculation, and SVG rendering package.

## Purpose

`@skyra/qr` provides reusable, framework-independent QR generation capabilities for the Skyra Platform and its consuming applications (e.g., SkyraQR, Skyra ERP).

> **Boundary Statement:** `@skyra/qr` provides generic QR generation capabilities. Product-specific QR lifecycle, routing, analytics, persistence, authorization, and billing remain in consuming applications.

## Architecture

This package leverages the standard `qrcode` library for robust encoding (handling error correction, masking, and versions), but implements custom, optimized SVG rendering and a React `<QRCode />` component to ensure accessibility and DOM safety without heavy external dependencies.

- **Zero-DOM Core:** Core matrix generation is platform agnostic.
- **Core Matrix:** The `QRCodeMatrix` represents the actual QR modules only (no quiet zone/margin is encoded in the data matrix itself).
- **Rendering & Margin:** The quiet zone (margin) is treated purely as a rendering concern. SVG rendering dynamically applies the requested margin.
- **Capacity:** Actual QR capacity depends on encoding mode, version, and error correction level. The underlying encoder determines whether a payload can be represented. There is no arbitrary, universal character limit.
- **Optimized SVG:** Generates deterministic, crisp SVG strings optimized as single-path vectors.
- **React Component:** Accessible `<QRCode />` wrapper which shares the identical underlying SVG generation architecture.

## Installation

```bash
pnpm add @skyra/qr
```

## Core API

### `generateQRCode(payload: string, options?: QRCodeOptions)`

Generates a `QRCodeMatrix` from a string payload.

```typescript
import { generateQRCode } from '@skyra/qr';

const matrix = generateQRCode('https://skyra.tech', {
  errorCorrectionLevel: 'M', // L, M, Q, H
  margin: 4,
  version: 5, // Optional, auto-calculated if omitted
});
```

### `renderToSVGString(matrix: QRCodeMatrix, options?: QRCodeSVGOptions)`

Renders the matrix to a valid SVG XML string.

```typescript
import { generateQRCode, renderToSVGString } from '@skyra/qr';

const matrix = generateQRCode('https://skyra.tech');
const svg = renderToSVGString(matrix, {
  color: { dark: '#000000', light: '#ffffff' },
  scale: 4,
  responsive: true,
});
```

## React Component

The `<QRCode />` component handles matrix generation and optimized SVG rendering internally.

```tsx
import { QRCode } from '@skyra/qr';

export default function MyPage() {
  return (
    <QRCode 
      value="https://skyra.tech"
      errorCorrectionLevel="H"
      margin={2}
      color={{ dark: '#2c3e50', light: '#ecf0f1' }}
      aria-label="Link to Skyra Tech website"
      className="rounded-lg shadow-sm"
    />
  );
}
```

## Security Considerations

- Treats all payloads as untrusted text strings.
- SVG rendering performs strict XML escaping on color inputs to prevent XSS.
- No dynamic execution or payload fetching occurs within this package.

## Browser / Server Compatibility

`@skyra/qr` is fully compatible with both Node.js (for server-side rendering/generation) and standard Browser environments. The SVG logic uses string manipulation rather than the DOM, ensuring perfect isomorphic execution. PNG generation is deferred to the consumer (e.g. by drawing the SVG to a canvas) to keep the core package dependency-free.
