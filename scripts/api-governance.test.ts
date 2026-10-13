import { describe, it, expect } from 'vitest';
import * as path from 'path';
import { Project } from 'ts-morph';
import { TARGETS, validateTargets, getBaselinePath, extractAPI, TargetPackage } from './api-governance';

describe('API Governance Validation', () => {
  const rootDir = path.resolve(__dirname, '..');

  it('all canonical targets use @skyra-tech-platform/* namespace and no obsolete packages', () => {
    expect(TARGETS.length).toBeGreaterThan(0);
    for (const target of TARGETS) {
      expect(target.packageId).toMatch(/^@skyra-tech-platform\//);
      expect(target.packageId).not.toContain('@skyra/ui');
      expect(target.packageId).not.toContain('@skyra/dialogs');
      expect(target.dir).not.toContain('packages/dialogs');
      expect(target.dir).not.toContain('packages/ui');
    }
  });

  it('validateTargets succeeds for current canonical workspace packages', () => {
    const validated = validateTargets(rootDir, TARGETS);
    expect(validated).toEqual(TARGETS);
  });

  it('getBaselinePath resolves baseline file path matching convention', () => {
    const dataTableTarget: TargetPackage = {
      packageId: '@skyra-tech-platform/data-table',
      dir: 'packages/data-table',
      entry: 'packages/data-table/dist/index.d.ts',
    };
    const resolvedPath = getBaselinePath(rootDir, dataTableTarget);
    expect(resolvedPath).toBe(path.resolve(rootDir, 'packages/data-table/data-table-api-baseline.json'));

    const qrTarget: TargetPackage = {
      packageId: '@skyra-tech-platform/qr',
      dir: 'packages/qr',
      entry: 'packages/qr/dist/core.d.ts',
      baselineFile: 'qr-core-api-baseline.json',
    };
    const resolvedQrPath = getBaselinePath(rootDir, qrTarget);
    expect(resolvedQrPath).toBe(path.resolve(rootDir, 'packages/qr/qr-core-api-baseline.json'));
  });

  it('validateTargets throws actionable error for nonexistent package directory', () => {
    const invalidTarget: TargetPackage = {
      packageId: '@skyra-tech-platform/nonexistent',
      dir: 'packages/nonexistent-package-xyz',
      entry: 'packages/nonexistent-package-xyz/dist/index.d.ts',
    };
    expect(() => validateTargets(rootDir, [invalidTarget])).toThrowError(
      /Package directory not found: packages\/nonexistent-package-xyz/
    );
  });

  it('validateTargets throws actionable error for package name mismatch', () => {
    const mismatchedTarget: TargetPackage = {
      packageId: '@skyra-tech-platform/wrong-name',
      dir: 'packages/utils',
      entry: 'packages/utils/dist/index.d.ts',
    };
    expect(() => validateTargets(rootDir, [mismatchedTarget])).toThrowError(
      /Package name mismatch in packages\/utils/
    );
  });

  it('validateTargets throws actionable error for missing declaration entry file', () => {
    const missingEntryTarget: TargetPackage = {
      packageId: '@skyra-tech-platform/utils',
      dir: 'packages/utils',
      entry: 'packages/utils/dist/missing-entry.d.ts',
    };
    expect(() => validateTargets(rootDir, [missingEntryTarget])).toThrowError(
      /Entry declaration file not found for @skyra-tech-platform\/utils/
    );
  });

  it('extractAPI correctly parses exported definitions deterministically', () => {
    const utilsTarget = TARGETS.find(t => t.packageId === '@skyra-tech-platform/utils')!;
    const project = new Project();
    project.addSourceFileAtPath(path.resolve(rootDir, utilsTarget.entry));

    const apis = extractAPI(project, utilsTarget, rootDir);
    expect(Object.keys(apis).length).toBeGreaterThan(0);
    // Keys must be alphabetically sorted
    const keys = Object.keys(apis);
    const sortedKeys = [...keys].sort();
    expect(keys).toEqual(sortedKeys);
  });
});
