# @skyra-tech-platform/qr

Skyra Platform generic QR code generation, matrix calculation, and SVG rendering. 
This is a framework-agnostic implementation exposing a Native Web Component `<skyra-tech-qr-code>`.

## Usage

```typescript
import '@skyra-tech-platform/qr/web-component';
```

```html
<skyra-tech-qr-code value="https://skyra.tech" error-correction-level="H" scale="4" margin="4"></skyra-tech-qr-code>
```

## Features
- **Web Component**: Custom element wrapper over generic matrix generation
- **Dynamic Calculation**: High-performance pure matrix generation
- **No Dependencies**: Framework-agnostic
