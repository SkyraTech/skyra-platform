import { docsRegistry } from './registry';
import type { PackageMetadata, RuntimeCategory, CapabilityMetadata } from './metadata';

// Import authoritative package manifests — machine-derived, never manually duplicated.
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

// ---------------------------------------------------------------------------
// Runtime classification — authored once, based on actual package architecture
// ---------------------------------------------------------------------------
const runtimeMap: Record<string, RuntimeCategory> = {
  '@skyra/app-shell':    'react-browser',
  '@skyra/data-export':  'react-browser',
  '@skyra/data-table':   'react-browser',
  '@skyra/design-tokens':'design-tokens',
  '@skyra/dialogs':      'react-browser',
  '@skyra/dynamic-form': 'react-browser',
  '@skyra/qr':           'mixed',          // core=runtime-neutral, react=react-browser
  '@skyra/ui':           'react-browser',
  '@skyra/utils':        'runtime-neutral',
  '@skyra/validation':   'runtime-neutral',
};

// ---------------------------------------------------------------------------
// Capability metadata — authored descriptions; machine data stays in package.json
// ---------------------------------------------------------------------------
const capabilityDefinitions: Omit<CapabilityMetadata, 'apis'>[] = [
  // @skyra/app-shell
  {
    id: 'app-shell/layout',
    packageId: '@skyra/app-shell',
    name: 'Application Shell Layout',
    exportPath: '@skyra/app-shell',
    runtime: 'react-browser',
    description: 'Provides the core ApplicationShell, Sidebar, Header, MainContent, and navigation primitives for building an application-level layout scaffold.',
    usageNote: "import { ApplicationShell, Sidebar, Header, MainContent } from '@skyra/app-shell';",
    limitations: ['Requires a React 18+ host application.', 'Does not provide routing — integrate with your router of choice.'],
    status: 'stable',
  },

  // @skyra/data-export
  {
    id: 'data-export/csv',
    packageId: '@skyra/data-export',
    name: 'CSV Export',
    exportPath: '@skyra/data-export',
    runtime: 'react-browser',
    description: 'Exports tabular data to comma-separated value files, consumable in Excel, Google Sheets, and other tools.',
    usageNote: "import { exportToCSV } from '@skyra/data-export';",
    status: 'stable',
  },
  {
    id: 'data-export/excel',
    packageId: '@skyra/data-export',
    name: 'Excel Export',
    exportPath: '@skyra/data-export',
    runtime: 'react-browser',
    description: 'Exports tabular data to .xlsx format using the configured spreadsheet adapter.',
    usageNote: "import { exportToExcel } from '@skyra/data-export';",
    status: 'stable',
  },

  // @skyra/data-table
  {
    id: 'data-table/dynamic',
    packageId: '@skyra/data-table',
    name: 'Dynamic Data Table',
    exportPath: '@skyra/data-table',
    runtime: 'react-browser',
    description: 'Enterprise-grade, accessible, and responsive data table with sorting, pagination, filtering, and column configuration.',
    usageNote: "import { DataTable } from '@skyra/data-table';",
    status: 'stable',
  },

  // @skyra/design-tokens
  {
    id: 'design-tokens/tokens',
    packageId: '@skyra/design-tokens',
    name: 'Design Tokens',
    exportPath: '@skyra/design-tokens',
    runtime: 'design-tokens',
    description: 'CSS custom properties and JavaScript token constants that define the Skyra Platform visual foundation: color, typography, spacing, radius, and shadow.',
    usageNote: "import '@skyra/design-tokens/tokens.css';",
    limitations: ['Tokens must be imported before any @skyra component styles.'],
    status: 'stable',
  },

  // @skyra/dialogs
  {
    id: 'dialogs/core',
    packageId: '@skyra/dialogs',
    name: 'Dialogs & Overlays',
    exportPath: '@skyra/dialogs',
    runtime: 'react-browser',
    description: 'Accessible modal dialogs, confirmation sheets, and overlay primitives built on platform design tokens.',
    usageNote: "import { Dialog, DialogContent, DialogHeader } from '@skyra/dialogs';",
    status: 'stable',
  },

  // @skyra/dynamic-form
  {
    id: 'dynamic-form/core',
    packageId: '@skyra/dynamic-form',
    name: 'Dynamic Form Engine',
    exportPath: '@skyra/dynamic-form',
    runtime: 'react-browser',
    description: 'Schema-driven form engine with validation, conditional fields, multi-step support, and full accessibility.',
    usageNote: "import { DynamicForm } from '@skyra/dynamic-form';",
    status: 'stable',
  },

  // @skyra/qr — core/react separation per Phase 9.3
  {
    id: 'qr/core',
    packageId: '@skyra/qr',
    name: 'QR Core',
    exportPath: '@skyra/qr/core',
    runtime: 'runtime-neutral',
    description: 'Runtime-neutral QR matrix generation and SVG rendering engine. Safe for Node.js, backend services, and non-React environments. Does not require React or react-dom.',
    usageNote: "import { generateQRCode, renderToSVGString } from '@skyra/qr/core';",
    limitations: ['No UI component provided — use @skyra/qr/react for React rendering.'],
    status: 'stable',
    related: ['qr/react'],
  },
  {
    id: 'qr/react',
    packageId: '@skyra/qr',
    name: 'QR React',
    exportPath: '@skyra/qr/react',
    runtime: 'react-browser',
    description: 'React component adapter for QR code rendering. Wraps the runtime-neutral core and exposes an accessible, responsive SVG QR Code component.',
    usageNote: "import { QRCode } from '@skyra/qr/react';",
    limitations: ['Requires React 18+ as a peer dependency.'],
    status: 'stable',
    related: ['qr/core'],
  },

  // @skyra/ui
  {
    id: 'ui/components',
    packageId: '@skyra/ui',
    name: 'UI Primitives',
    exportPath: '@skyra/ui',
    runtime: 'react-browser',
    description: 'Core accessible UI primitives: Button, Badge, Card, Avatar, Input, Select, Checkbox, Radio, Switch, Tabs, Tooltip, Popover, and more.',
    usageNote: "import { Button, Card, Badge } from '@skyra/ui';",
    status: 'stable',
  },

  // @skyra/utils
  {
    id: 'utils/core',
    packageId: '@skyra/utils',
    name: 'Utilities',
    exportPath: '@skyra/utils',
    runtime: 'runtime-neutral',
    description: 'Runtime-neutral utility helpers for date formatting, class name composition, string manipulation, and common type guards. Safe for Node.js and browser environments.',
    usageNote: "import { formatDate, cn } from '@skyra/utils';",
    status: 'stable',
  },

  // @skyra/validation
  {
    id: 'validation/core',
    packageId: '@skyra/validation',
    name: 'Validation',
    exportPath: '@skyra/validation',
    runtime: 'runtime-neutral',
    description: 'Runtime-neutral schema validation primitives for forms, API inputs, and data pipelines. Reusable across React, Node.js, and service environments.',
    usageNote: "import { validate, required, minLength } from '@skyra/validation';",
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

  const packages = [
    appShellPkg, dataExportPkg, dataTablePkg, designTokensPkg,
    dialogsPkg, dynamicFormPkg, qrPkg, uiPkg, utilsPkg, validationPkg,
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
    docsRegistry.registerCapability({ ...cap, apis: [] });
  });

  // Register Extracted APIs
  try {
    const extractedApis = require('./data/apis.json');
    extractedApis.forEach((api: any) => {
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
}
