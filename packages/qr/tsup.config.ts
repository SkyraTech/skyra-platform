import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/core.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  banner: { js: '"use client";' }
});
