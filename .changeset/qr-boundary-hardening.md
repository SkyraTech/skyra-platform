---
'@skyra/qr': patch
---

Harden dependency boundaries: `@skyra/qr/core` is fully runtime-neutral. `react` is an optional peer dependency required only by `@skyra/qr/react`. `react-dom` is not imported or required by this package and has been removed from the published manifest.
