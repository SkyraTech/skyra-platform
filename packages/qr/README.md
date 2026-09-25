# @skyra/qr

## Overview
Skyra Platform generic QR code generation, matrix calculation, and SVG rendering.

## Architecture & Exports
This package explicitly separates pure generation logic from React rendering:
- `@skyra/qr/core`: Runtime-neutral QR matrix calculation.
- `@skyra/qr/react`: React SVG rendering components.

## Runtime Support
- `./core`: Runtime-neutral (Node.js / Browser)
- `./react`: React + Browser

## Installation
```bash
pnpm add @skyra/qr
```

## Basic Usage

**React Component:**
```tsx
import { QRCode } from '@skyra/qr/react';

export function Ticket() {
  return <QRCode value="https://skyra.tech" size={128} />;
}
```

**Core Generation:**
```ts
import { generateQRMatrix } from '@skyra/qr/core';

const matrix = generateQRMatrix('https://skyra.tech', { errorCorrectionLevel: 'H' });
```

## Dependencies / Peer Dependencies
- **Dependencies:** `qrcode`
- **Peer Dependencies (Optional):** `react`, `react-dom`

The React peer dependencies are optional. Consumers using only `@skyra/qr/core` do not need to install React.

## Version & Lifecycle
Current Version: `0.1.0` (Pre-1.0 Minor bumps signify breaking changes).
Lifecycle: `@stable`
