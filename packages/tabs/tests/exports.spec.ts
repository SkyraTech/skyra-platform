import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

describe('Tabs Package Exports Map (F-04 Validation)', () => {
  const pkgDir = path.resolve(__dirname, '..');
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));

  it('defines the standard exports map for the root package entry point', () => {
    expect(pkgJson.exports).toBeDefined();
    expect(pkgJson.exports['.']).toBeDefined();
    expect(pkgJson.exports['.']).toEqual({
      types: './dist/index.d.ts',
      import: './dist/index.js',
      require: './dist/index.cjs',
    });
  });

  it('each target in the exports map points to an existing build artifact', () => {
    const rootExport = pkgJson.exports['.'];

    const typesPath = path.resolve(pkgDir, rootExport.types);
    const importPath = path.resolve(pkgDir, rootExport.import);
    const requirePath = path.resolve(pkgDir, rootExport.require);

    expect(fs.existsSync(typesPath)).toBe(true);
    expect(fs.existsSync(importPath)).toBe(true);
    expect(fs.existsSync(requirePath)).toBe(true);
  });

  it('ESM build entry point exports expected public components', async () => {
    const rootExport = pkgJson.exports['.'];
    const importPath = path.resolve(pkgDir, rootExport.import);

    const esmModule = await import(importPath);
    expect(esmModule.SkyraTabsElement).toBeDefined();
    expect(esmModule.SkyraTabElement).toBeDefined();
    expect(esmModule.SkyraTabPanelElement).toBeDefined();
    expect(customElements.get('skyra-tabs')).toBeDefined();
    expect(customElements.get('skyra-tab')).toBeDefined();
    expect(customElements.get('skyra-tab-panel')).toBeDefined();
  });
});
