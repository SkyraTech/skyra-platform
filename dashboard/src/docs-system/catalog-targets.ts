// Explicit published JavaScript entry points; CSS exports have no named TS API records.
export interface CatalogTarget { packageId: string; exportPath: string; capabilityId: string; entry: string }
export const API_TARGETS: readonly CatalogTarget[] = [
  {
    "packageId": "@skyra-tech-platform/accordion",
    "exportPath": "@skyra-tech-platform/accordion",
    "capabilityId": "accordion/core",
    "entry": "packages/accordion/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/app-shell",
    "exportPath": "@skyra-tech-platform/app-shell",
    "capabilityId": "app-shell/layout",
    "entry": "packages/app-shell/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/button",
    "exportPath": "@skyra-tech-platform/button",
    "capabilityId": "button/core",
    "entry": "packages/button/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/checkbox",
    "exportPath": "@skyra-tech-platform/checkbox",
    "capabilityId": "checkbox/core",
    "entry": "packages/checkbox/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/collapsible",
    "exportPath": "@skyra-tech-platform/collapsible",
    "capabilityId": "collapsible/core",
    "entry": "packages/collapsible/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/command-palette",
    "exportPath": "@skyra-tech-platform/command-palette",
    "capabilityId": "command-palette/palette",
    "entry": "packages/command-palette/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/context-menu",
    "exportPath": "@skyra-tech-platform/context-menu",
    "capabilityId": "context-menu/menu",
    "entry": "packages/context-menu/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/data-export",
    "exportPath": "@skyra-tech-platform/data-export",
    "capabilityId": "data-export/csv",
    "entry": "packages/data-export/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/data-table",
    "exportPath": "@skyra-tech-platform/data-table",
    "capabilityId": "data-table/dynamic",
    "entry": "packages/data-table/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/date-time",
    "exportPath": "@skyra-tech-platform/date-time",
    "capabilityId": "date-time/core",
    "entry": "packages/date-time/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/design-tokens",
    "exportPath": "@skyra-tech-platform/design-tokens",
    "capabilityId": "design-tokens/tokens",
    "entry": "packages/design-tokens/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/dialog",
    "exportPath": "@skyra-tech-platform/dialog",
    "capabilityId": "dialogs/core",
    "entry": "packages/dialog/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/dropdown-menu",
    "exportPath": "@skyra-tech-platform/dropdown-menu",
    "capabilityId": "dropdown-menu/menu",
    "entry": "packages/dropdown-menu/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/dynamic-form",
    "exportPath": "@skyra-tech-platform/dynamic-form",
    "capabilityId": "dynamic-form/core",
    "entry": "packages/dynamic-form/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/dynamic-select",
    "exportPath": "@skyra-tech-platform/dynamic-select",
    "capabilityId": "dynamic-select/core",
    "entry": "packages/dynamic-select/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/input",
    "exportPath": "@skyra-tech-platform/input",
    "capabilityId": "input/core",
    "entry": "packages/input/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/loader",
    "exportPath": "@skyra-tech-platform/loader",
    "capabilityId": "loader/core",
    "entry": "packages/loader/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/notification",
    "exportPath": "@skyra-tech-platform/notification",
    "capabilityId": "notification/core",
    "entry": "packages/notification/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/pdf-viewer",
    "exportPath": "@skyra-tech-platform/pdf-viewer",
    "capabilityId": "pdf-viewer/core",
    "entry": "packages/pdf-viewer/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/popover",
    "exportPath": "@skyra-tech-platform/popover",
    "capabilityId": "popover/overlay",
    "entry": "packages/popover/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/qr",
    "exportPath": "@skyra-tech-platform/qr",
    "capabilityId": "qr/core",
    "entry": "packages/qr/dist/core.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/qr",
    "exportPath": "@skyra-tech-platform/qr/web-component",
    "capabilityId": "qr/web-component",
    "entry": "packages/qr/dist/skyra-tech-qr-code.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/radio",
    "exportPath": "@skyra-tech-platform/radio",
    "capabilityId": "radio/core",
    "entry": "packages/radio/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/switch",
    "exportPath": "@skyra-tech-platform/switch",
    "capabilityId": "switch/core",
    "entry": "packages/switch/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/tabs",
    "exportPath": "@skyra-tech-platform/tabs",
    "capabilityId": "tabs/core",
    "entry": "packages/tabs/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/textarea",
    "exportPath": "@skyra-tech-platform/textarea",
    "capabilityId": "textarea/core",
    "entry": "packages/textarea/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/toast",
    "exportPath": "@skyra-tech-platform/toast",
    "capabilityId": "toast/core",
    "entry": "packages/toast/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/utils",
    "exportPath": "@skyra-tech-platform/utils",
    "capabilityId": "utils/core",
    "entry": "packages/utils/dist/index.d.ts"
  },
  {
    "packageId": "@skyra-tech-platform/validation",
    "exportPath": "@skyra-tech-platform/validation",
    "capabilityId": "validation/core",
    "entry": "packages/validation/dist/index.d.ts"
  }
];
