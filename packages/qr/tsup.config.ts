import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/core.ts', 'src/skyra-tech-qr-code.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  banner: { js: '"use client";' }
});
