import { docsRegistry } from './registry';
import { bootstrapDesignTokens } from './design-metadata';
import { behavioralMetadataMap } from './behavioral-metadata';
import type { PackageMetadata, RuntimeCategory, CapabilityMetadata } from './metadata';

// Import authoritative package manifests — machine-derived, never manually duplicated.
import appShellPkg from '../../../packages/app-shell/package.json';
import dataExportPkg from '../../../packages/data-export/package.json';
import dataTablePkg from '../../../packages/data-table/package.json';
import designTokensPkg from '../../../packages/design-tokens/package.json';
import dialogsPkg from '../../../packages/dialog/package.json';
import dynamicFormPkg from '../../../packages/dynamic-form/package.json';
import qrPkg from '../../../packages/qr/package.json';
import utilsPkg from '../../../packages/utils/package.json';
import validationPkg from '../../../packages/validation/package.json';
import notificationPkg from '../../../packages/notification/package.json';

// ---------------------------------------------------------------------------
// Runtime classification — authored once, based on actual package architecture
// ---------------------------------------------------------------------------
const runtimeMap: Record<string, RuntimeCategory> = {
  '@skyra-tech-platform/app-shell':    'runtime-neutral',
  '@skyra-tech-platform/data-export':  'mixed',
  '@skyra-tech-platform/data-table': 'mixed',
  '@skyra-tech-platform/design-tokens':'design-tokens',
  '@skyra-tech-platform/dialog': 'runtime-neutral',
  '@skyra-tech-platform/dynamic-form': 'mixed',
  '@skyra-tech-platform/qr': 'runtime-neutral',
  '@skyra/ui':           'react-browser',
  '@skyra-tech-platform/utils':        'runtime-neutral',
  '@skyra-tech-platform/validation':   'runtime-neutral',
  '@skyra-tech-platform/notification': 'runtime-neutral',
};

// ---------------------------------------------------------------------------
// Capability metadata — authored descriptions; machine data stays in package.json
// ---------------------------------------------------------------------------
const capabilityDefinitions: Omit<CapabilityMetadata, 'apis'>[] = [
  // @skyra-tech-platform/app-shell
  {
    id: 'app-shell/layout',
    packageId: '@skyra-tech-platform/app-shell',
    name: 'Application Shell Layout',
    exportPath: '@skyra-tech-platform/app-shell',
    runtime: 'runtime-neutral',
    description: 'Framework-agnostic Web Component for building an application-level layout scaffold.',
    usageNote: "import { registerAppShell } from '@skyra-tech-platform/app-shell';\nregisterAppShell();",
    limitations: ['Does not provide routing — integrate with your router of choice.'],
    status: 'stable',
  },

  // @skyra-tech-platform/data-export
  {
    id: 'data-export/csv',
    packageId: '@skyra-tech-platform/data-export',
    name: 'CSV Export',
    exportPath: '@skyra-tech-platform/data-export',
    runtime: 'mixed',
    description: 'Exports tabular data to comma-separated value files. Generates raw strings or triggers browser downloads.',
    usageNote: "import { exportToCSV } from '@skyra-tech-platform/data-export';",
    status: 'stable',
  },
  {
    id: 'data-export/excel',
    packageId: '@skyra-tech-platform/data-export',
    name: 'Excel Export',
    exportPath: '@skyra-tech-platform/data-export',
    runtime: 'mixed',
    description: 'Exports tabular data to .xlsx/.xls format. Generates raw XML strings or triggers browser downloads.',
    usageNote: "import { exportToExcel } from '@skyra-tech-platform/data-export';",
    status: 'stable',
  },

  // @skyra-tech-platform/data-table
  {
    id: 'data-table/dynamic',
    packageId: '@skyra-tech-platform/data-table',
    name: 'Dynamic Data Table',
    exportPath: '@skyra-tech-platform/data-table',
    runtime: 'mixed',
    description: 'Enterprise-grade, accessible, and responsive data table with sorting, pagination, filtering, and column configuration.',
    usageNote: "import '@skyra-tech-platform/data-table';",
    status: 'stable',
  },

  // @skyra-tech-platform/design-tokens
  {
    id: 'design-tokens/tokens',
    packageId: '@skyra-tech-platform/design-tokens',
    name: 'Design Tokens',
    exportPath: '@skyra-tech-platform/design-tokens',
    runtime: 'design-tokens',
    description: 'CSS custom properties and JavaScript token constants that define the Skyra Platform visual foundation: color, typography, spacing, radius, and shadow.',
    usageNote: "import '@skyra-tech-platform/design-tokens/tokens.css';",
    limitations: ['Tokens must be imported before any @skyra component styles.'],
    status: 'stable',
  },

  // @skyra-tech-platform/dialog
  {
    id: 'dialogs/core',
    packageId: '@skyra-tech-platform/dialog',
    name: 'Dialogs & Overlays',
    exportPath: '@skyra-tech-platform/dialog',
    runtime: 'runtime-neutral',
    description: 'Accessible modal dialogs, confirmation sheets, and overlay primitives built on platform design tokens.',
    usageNote: "import '@skyra-tech-platform/dialog';",
    status: 'stable',
  },

  // @skyra-tech-platform/dynamic-form
  {
    id: 'dynamic-form/core',
    packageId: '@skyra-tech-platform/dynamic-form',
    name: 'Dynamic Form Engine',
    exportPath: '@skyra-tech-platform/dynamic-form',
    runtime: 'mixed',
    description: 'Schema-driven form engine with validation, conditional fields, multi-step support, and full accessibility.',
    usageNote: "import '@skyra-tech-platform/dynamic-form';",
    status: 'stable',
  },

  // @skyra-tech-platform/notification
  {
    id: 'notification/core',
    packageId: '@skyra-tech-platform/notification',
    name: 'Notification',
    exportPath: '@skyra-tech-platform/notification',
    runtime: 'runtime-neutral',
    description: 'Framework-agnostic Web Component for semantic notifications and toasts.',
    usageNote: "import '@skyra-tech-platform/notification';",
    status: 'stable',
  },

  // @skyra-tech-platform/toast
  {
    id: 'toast/core',
    packageId: '@skyra-tech-platform/toast',
    name: 'Toast',
    exportPath: '@skyra-tech-platform/toast',
    runtime: 'runtime-neutral',
    description: 'Framework-agnostic imperative Toast API powered by native Custom Elements.',
    usageNote: "import { toast } from '@skyra-tech-platform/toast';\nimport '@skyra-tech-platform/toast';",
    status: 'stable',
  },


  // @skyra-tech-platform/qr
  {
    id: 'qr/core',
    packageId: '@skyra-tech-platform/qr',
    name: 'QR Generation & Web Component',
    exportPath: '@skyra-tech-platform/qr',
    runtime: 'runtime-neutral',
    description: 'Runtime-neutral QR matrix generation, SVG rendering engine, and `<skyra-tech-qr-code>` Web Component wrapper. Framework-agnostic and fully encapsulated.',
    usageNote: "import { generateQRCode, renderToSVGString } from '@skyra-tech-platform/qr';\nimport '@skyra-tech-platform/qr/web-component';",
    status: 'stable',
  },

  // @skyra/ui
  {
    id: 'ui/components',
    packageId: '@skyra/ui',
    name: 'UI Primitives',
    exportPath: '@skyra/ui',
    runtime: 'react-browser',
    description: 'Core accessible UI primitives: Button, Badge, Card, Avatar, Input, Select, Checkbox, Radio, Switch, Tabs, Tooltip, Popover, and more.',
    usageNote: "import { Card, Badge } from '@/components/ui';\nimport '@skyra-tech-platform/button';",
    status: 'stable',
  },

  // @skyra-tech-platform/utils
  {
    id: 'utils/core',
    packageId: '@skyra-tech-platform/utils',
    name: 'Utilities',
    exportPath: '@skyra-tech-platform/utils',
    runtime: 'runtime-neutral',
    description: 'Runtime-neutral utility helpers for date formatting, string manipulation, currency and commands. Safe for Node.js and browser environments.',
    usageNote: "import { formatDate, formatCurrency, toSlug } from '@skyra-tech-platform/utils';",
    status: 'stable',
  },

  // @skyra-tech-platform/validation
  {
    id: 'validation/core',
    packageId: '@skyra-tech-platform/validation',
    name: 'Validation',
    exportPath: '@skyra-tech-platform/validation',
    runtime: 'runtime-neutral',
    description: 'Runtime-neutral schema validation primitives for forms, API inputs, and data pipelines. Reusable across React, Node.js, and service environments.',
    usageNote: "import { emailSchema, orgSchema } from '@skyra-tech-platform/validation';",
    status: 'stable',
  },
];

// ---------------------------------------------------------------------------
// Bootstrap — called once at server render time
// ---------------------------------------------------------------------------
let bootstrapped = false;

export function bootstrapRegistry() {
  if (bootstrapped) return;
  bootstrapped = true;
  
  bootstrapDesignTokens();

  const packages = [
    appShellPkg, dataExportPkg, dataTablePkg, designTokensPkg,
    dialogsPkg, dynamicFormPkg, qrPkg, utilsPkg, validationPkg,
    notificationPkg
  ];

  packages.forEach((pkg) => {
    const id = (pkg as { name: string }).name;
    const exportKeys = (pkg as { exports?: Record<string, unknown> }).exports
      ? Object.keys((pkg as { exports: Record<string, unknown> }).exports)
      : [];

    const peerDeps = (pkg as { peerDependencies?: Record<string, string> }).peerDependencies ?? {};
    const optionalMeta = (pkg as { peerDependenciesMeta?: Record<string, { optional?: boolean }> }).peerDependenciesMeta ?? {};
    const optionalPeers = Object.keys(optionalMeta).filter(k => optionalMeta[k]?.optional);

    const pkgMeta: PackageMetadata = {
      id,
      name: id,
      version: (pkg as { version: string }).version,
      description: (pkg as { description?: string }).description ?? '',
      status: 'stable',
      runtime: runtimeMap[id] ?? 'runtime-neutral',
      dependencies: (pkg as { dependencies?: Record<string, string> }).dependencies ?? {},
      peerDependencies: peerDeps,
      optionalPeerDependencies: optionalPeers,
      exports: exportKeys,
    };

    docsRegistry.registerPackage(pkgMeta);
  });

  // Register authored capability definitions
  capabilityDefinitions.forEach((cap) => {
    docsRegistry.registerCapability({ ...cap, apis: [] });
  });

  // Register Extracted APIs
  try {
    const extractedApis = require('./data/apis.json');
    extractedApis.forEach((api: any) => {
      // Merge authored behavioral metadata
      const behavior = behavioralMetadataMap[api.id];
      if (behavior) {
        Object.assign(api, behavior);
      }

      docsRegistry.registerApi(api);
      
      // Link back to capability
      if (api.capabilityId) {
        const cap = docsRegistry.getCapability(api.capabilityId);
        if (cap) {
          cap.apis.push(api.id);
        }
      }
    });
  } catch (e) {
    console.warn('API metadata not found, skipping Phase 10.3 API registration');
  }

  // Register Examples (Phase 10.4)
  try {
    const examples = require('./data/examples.json');
    examples.forEach((example: any) => {
      docsRegistry.registerExample(example);
    });
  } catch (e) {
    console.warn('Examples metadata not found, skipping Phase 10.4 Example registration');
  }

  // Register Releases (Phase 10.7)
  try {
    const releases = require('./data/releases.json');
    Object.values(releases).forEach((release: any) => {
      docsRegistry.registerRelease(release);
    });
  } catch (e) {
    console.warn('Releases metadata not found, skipping Phase 10.7 Release registration');
  }
}
