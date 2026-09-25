import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/core.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: true,
  },
  {
    entry: ['src/react.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom', '@skyra/qr/core'],
    banner: { js: '"use client";' }
  }
]);
