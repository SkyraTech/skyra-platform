import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

const pkgJson = JSON.parse(fs.readFileSync(path.resolve('./package.json'), 'utf-8'));
const isReactPackage = pkgJson.peerDependencies && pkgJson.peerDependencies['react'];
const isQR = pkgJson.name === '@skyra/qr';

export default defineConfig({
  entry: isQR ? ['src/core.ts', 'src/react.ts'] : ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  banner: isReactPackage && !isQR ? { js: '"use client";' } : undefined,
});
