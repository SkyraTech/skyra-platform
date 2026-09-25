import { docsRegistry } from './registry';
import type { PackageMetadata } from './metadata';

// In Phase 10.1, we demonstrate the architectural pattern of deriving
// package information from the authoritative workspace package.json files
// rather than manually redefining it here.
import appShellPkg from '../../../packages/app-shell/package.json';
import dataExportPkg from '../../../packages/data-export/package.json';
import dataTablePkg from '../../../packages/data-table/package.json';
import designTokensPkg from '../../../packages/design-tokens/package.json';
import dialogsPkg from '../../../packages/dialogs/package.json';
import dynamicFormPkg from '../../../packages/dynamic-form/package.json';
import qrPkg from '../../../packages/qr/package.json';
import uiPkg from '../../../packages/ui/package.json';
import utilsPkg from '../../../packages/utils/package.json';
import validationPkg from '../../../packages/validation/package.json';

const packages = [
  appShellPkg,
  dataExportPkg,
  dataTablePkg,
  designTokensPkg,
  dialogsPkg,
  dynamicFormPkg,
  qrPkg,
  uiPkg,
  utilsPkg,
  validationPkg
];

/**
 * Bootstraps the registry with initial package definitions read directly
 * from the authoritative package manifests.
 */
export function bootstrapRegistry() {
  packages.forEach((pkg: any) => {
    // We assume default 'stable' unless marked otherwise in the future
    const status = 'stable';
    
    // We safely parse exports
    const exportKeys = pkg.exports ? Object.keys(pkg.exports) : [];

    const pkgMeta: PackageMetadata = {
      id: pkg.name,
      name: pkg.name,
      version: pkg.version,
      description: pkg.description || '',
      status,
      dependencies: pkg.dependencies || {},
      peerDependencies: pkg.peerDependencies || {},
      exports: exportKeys
    };

    docsRegistry.registerPackage(pkgMeta);
  });
}
