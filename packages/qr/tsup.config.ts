import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/core.ts', 'src/react.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ['react'],
  banner: { js: '"use client";' }
});
