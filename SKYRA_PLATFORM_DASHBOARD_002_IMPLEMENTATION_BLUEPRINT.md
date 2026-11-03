# Skyra Platform — Dashboard Implementation Blueprint
**Milestone:** `SKYRA-PLATFORM-DASHBOARD-002`  
**Execution Target:** Canonical Platform Design System Portal  
**Document ID:** `DASHBOARD-002-IMPLEMENTATION-BLUEPRINT`  
**Status:** Approved for Implementation Planning  

---

## 1. Vision & Architectural Goals

The objective of `DASHBOARD-002` is to transform the Skyra Platform dashboard into a single, authoritative, enterprise-grade design system portal that reflects 100% of the actual packages in `skyra-platform`.

### Core Engineering Principles
1. **Single Source of Truth:** Every displayed component must be imported directly from its canonical workspace package (`@skyra-tech-platform/*`). No mock React substitutes in `dashboard/src/components/ui/` may be used to demonstrate platform capabilities.
2. **Deterministic Metadata Synchronization:** API tables, property definitions, and event payloads must be derived directly from TypeScript declarations and synced via CI checks (`catalog:check`).
3. **Unified Information Architecture:** Eliminate the fractured division between `/components` and `/ui-components`. Unify all component showcases, playgrounds, and documentation into a single, cohesive navigation structure.
4. **Resilient Server-Side Rendering (SSR):** Ensure all Web Components and the App Shell layout safely execute in both Node.js SSR and client hydration contexts.
5. **Interactive Developer Experience:** Provide live property controls (knobs), interactive event logs, copyable code snippets (Web Component, React, and Angular), and WCAG 2.2 AA compliant themes.

---

## 2. Proposed Information Architecture

```text
Skyra Platform Documentation Portal
│
├── Platform
│   ├── Overview                  (/overview)
│   ├── Packages & Status         (/packages)
│   └── Releases & Changelog      (/releases)
│
├── Getting Started
│   ├── Introduction              (/docs/getting-started/introduction)
│   ├── Quick Start & Tokens      (/docs/getting-started/quick-start)
│   ├── Angular Integration       (/docs/getting-started/angular)
│   └── React Integration         (/docs/getting-started/react)
│
├── Design Foundations
│   ├── Brand & Identity          (/design-system/branding)
│   ├── Colors & Surfaces         (/design-system/colors)
│   ├── Typography                (/design-system/typography)
│   ├── Spacing & Grid            (/design-system/spacing)
│   └── Elevation & Radii         (/design-system/elevation)
│
├── Components
│   ├── Basic Controls
│   │   ├── Button                (/components/basic-controls/button)
│   │   ├── Badge                 (/components/basic-controls/badge)            [NEW]
│   │   ├── Checkbox              (/components/basic-controls/checkbox)
│   │   ├── Radio                 (/components/basic-controls/radio)
│   │   ├── Switch                (/components/basic-controls/switch)
│   │   ├── Input                 (/components/basic-controls/input)
│   │   └── Textarea              (/components/basic-controls/textarea)
│   │
│   ├── Disclosure & Layout
│   │   ├── Accordion             (/components/disclosure/accordion)
│   │   ├── Collapsible           (/components/disclosure/collapsible)
│   │   └── App Shell             (/components/layouts/app-shell)
│   │
│   ├── Selection & Forms
│   │   ├── Dynamic Select        (/components/selection/dynamic-select)
│   │   ├── Date & Time Suite     (/components/forms/date-time)
│   │   └── Dynamic Form          (/components/forms/dynamic-form)
│   │
│   ├── Navigation
│   │   └── Tabs                  (/components/navigation/tabs)
│   │
│   ├── Feedback & Status
│   │   ├── Notification          (/components/feedback/notification)
│   │   ├── Toast                 (/components/feedback/toast)
│   │   ├── Empty State           (/components/feedback/empty-state)          [NEW]
│   │   └── Loader System         (/components/feedback/loader)               [NEW CANONICAL]
│   │
│   ├── Overlays & Modals
│   │   ├── Dialog                (/components/overlays/dialog)
│   │   ├── Drawer                (/components/overlays/drawer)               [NEW]
│   │   ├── Popover               (/components/overlays/popover)
│   │   ├── Dropdown Menu         (/components/overlays/dropdown-menu)
│   │   ├── Context Menu          (/components/overlays/context-menu)
│   │   └── Command Palette       (/components/overlays/command-palette)
│   │
│   ├── Data Display & Documents
│   │   ├── Data Table            (/components/data-display/data-table)
│   │   └── PDF Viewer            (/components/data-display/pdf-viewer)
│   │
│   └── Utilities
│       └── QR Code               (/components/utilities/qr)
│
├── Technical Utilities
│   ├── Data Export               (/docs/utilities/data-export)
│   ├── Validation Schemas        (/docs/utilities/validation)
│   └── Helper Functions          (/docs/utilities/utils)
│
└── Quality Studios
    ├── Accessibility Studio      (/accessibility)
    └── Viewport Studio           (/responsive)
```

---

## 3. Detailed Component Implementation Plan

### 3.1 P0 — New & Blocked Components

#### 1. Fix App Shell SSR Blocker (P0)
- **File:** `packages/app-shell/src/skyra-tech-app-shell.ts`
- **Implementation:**
  ```ts
  const BaseClass = typeof HTMLElement !== 'undefined' ? HTMLElement : (class {} as typeof HTMLElement);
  export class SkyraAppShell extends BaseClass { ... }
  ```
- **Configuration:** Add `@skyra-tech-platform/app-shell` to `dashboard/next.config.ts` (`transpilePackages`).

#### 2. Create Drawer Showcase & Documentation Page (P0)
- **Route:** `dashboard/src/app/(dashboard)/components/overlays/drawer/page.tsx`
- **Dependencies:** Add `@skyra-tech-platform/drawer: workspace:*` to `dashboard/package.json`.
- **Target:** Register target in `catalog-targets.ts`:
  ```ts
  {
    packageId: '@skyra-tech-platform/drawer',
    exportPath: '@skyra-tech-platform/drawer',
    capabilityId: 'drawer/core',
    entry: 'packages/drawer/dist/index.d.ts'
  }
  ```
- **Interactive Playground Requirements:**
  - Knobs: `position` (`left`, `right`, `top`, `bottom`), `size` (`sm`, `md`, `lg`, `full`), `backdrop` (`default`, `static`), `title` text.
  - Interactive triggers: "Open Right Drawer", "Open Left Navigation Drawer", "Open Full-Width Drawer".
  - Behavior verification: Focus trapping, `Escape` dismissal, focus restoration to trigger button.
  - API Table: Attributes (`open`, `position`, `size`, `title`, `backdrop`), Events (`open`, `close`), Slots (`header`, `body`/default, `footer`), Methods (`show()`, `close()`).

#### 3. Create Badge Showcase & Documentation Page (P0)
- **Route:** `dashboard/src/app/(dashboard)/components/basic-controls/badge/page.tsx`
- **Dependencies:** Add `@skyra-tech-platform/badge: workspace:*` to `dashboard/package.json`.
- **Target:** Register target in `catalog-targets.ts`:
  ```ts
  {
    packageId: '@skyra-tech-platform/badge',
    exportPath: '@skyra-tech-platform/badge',
    capabilityId: 'badge/core',
    entry: 'packages/badge/dist/index.d.ts'
  }
  ```
- **Interactive Playground Requirements:**
  - Knobs: `variant` (10 variants: primary, secondary, neutral, success, warning, danger, info, orange, cyan, purple), `size` (`sm`, `md`), `dot` (toggle).
  - Live preview grid: Matrix showing all variants with and without dots across both light and dark themes.
  - API Table: Attributes (`variant`, `size`, `dot`), Properties, Slots (`default`).

#### 4. Create Empty State Canonical Page & Repair Legacy Mock (P0)
- **Route:** `dashboard/src/app/(dashboard)/components/feedback/empty-state/page.tsx`
- **Dependencies:** Add `@skyra-tech-platform/empty-state: workspace:*` to `dashboard/package.json`.
- **Target:** Register target in `catalog-targets.ts`:
  ```ts
  {
    packageId: '@skyra-tech-platform/empty-state',
    exportPath: '@skyra-tech-platform/empty-state',
    capabilityId: 'empty-state/core',
    entry: 'packages/empty-state/dist/index.d.ts'
  }
  ```
- **Showcase Content:**
  - Live examples using `<skyra-tech-empty-state>`:
    - Default variant with custom icon slot and action buttons.
    - Card container variant for tables and dashboards.
    - Dashed container variant for document onboarding.
  - API Table: Attributes (`variant`, `headline`, `description`), Slots (`icon`, `headline`, `description`, `default`, `actions`).
  - Repair legacy page: Update `/ui-components/empty-state` to render genuine `<skyra-tech-empty-state>`.

#### 5. Create Canonical Loader System Page (P1)
- **Route:** `dashboard/src/app/(dashboard)/components/feedback/loader/page.tsx`
- **Target:** Points to `@skyra-tech-platform/loader`.
- **Showcase Content:**
  - Live rendering of `<skyra-tech-spinner>`, `<skyra-tech-progress>`, `<skyra-tech-circular-progress>`, and `<skyra-tech-skeleton>` (text, avatar, card, table).
  - API Table: Size variants, indeterminate progress states, animation controls, ARIA progress attributes.

---

## 4. Reusable Component Documentation Page Template

To ensure consistent quality, every component page in `DASHBOARD-002` must conform to the following standardized structure:

```tsx
// Standardized Page Structure Template
export default function ComponentDocPage() {
  return (
    <ComponentDocLayout
      title="Component Name"
      packageId="@skyra-tech-platform/component-name"
      version="0.1.0"
      description="Clear, concise architectural description of component purpose and usage."
      wcTag="skyra-tech-component"
    >
      {/* 1. Interactive Playground */}
      <ComponentPlayground
        defaultProps={{ ... }}
        controls={[ ... ]}
        renderPreview={(props) => (
          <skyra-tech-component {...props} />
        )}
      />

      {/* 2. Installation & Quick Start */}
      <InstallationSection
        packageName="@skyra-tech-platform/component-name"
        snippetHtml={`<skyra-tech-component variant="primary">Label</skyra-tech-component>`}
        snippetReact={`import '@skyra-tech-platform/component-name';\n\n<skyra-tech-component variant="primary">Label</skyra-tech-component>`}
        snippetAngular={`// app.module.ts\nimport { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';\nimport '@skyra-tech-platform/component-name';`}
      />

      {/* 3. Common Use-Case Examples */}
      <ExamplesSection>
        <ExampleBlock title="1. Semantic Variants" ... />
        <ExampleBlock title="2. Sizing & Density" ... />
        <ExampleBlock title="3. States (Disabled, Loading)" ... />
      </ExamplesSection>

      {/* 4. Complete API Specifications */}
      <ApiTablesSection
        attributes={[ ... ]}
        properties={[ ... ]}
        events={[ ... ]}
        slots={[ ... ]}
        methods={[ ... ]}
        cssParts={[ ... ]}
      />

      {/* 5. Accessibility & Keyboard Navigation */}
      <AccessibilitySection
        ariaRoles={[ ... ]}
        keyboardInteractions={[ ... ]}
        screenReaderNotes="..."
      />
    </ComponentDocLayout>
  );
}
```

---

## 5. Source-of-Truth Synchronization Strategy

To guarantee that documentation never drifts from code:
1. **Automated Type Extraction:** Extend `dashboard/scripts/extract-api.ts` to cover all 31 packages.
2. **Pre-commit / CI Extraction Gate:** Run `pnpm catalog:check` as a required step in CI. Any un-extracted changes fail the build.
3. **Automated Documentation Tests:** Enhance `component-catalogue.test.ts` to assert that:
   - Every entry in `pnpm-workspace.yaml` packages has a corresponding documentation route.
   - Every exported custom element is verified in browser test suites.

---

## 6. Implementation Phasing & Complexity

| Phase | Scope | Focus | Complexity | Risk |
| :---: | :--- | :--- | :---: | :---: |
| **Phase 1** | **SSR Blocker & Infrastructure** | Fix `app-shell` SSR guard, update `next.config.ts`, add missing package dependencies to `dashboard/package.json`. | Low (1-2h) | Low |
| **Phase 2** | **New Component Showcases** | Implement `/components/overlays/drawer`, `/components/basic-controls/badge`, and `/components/feedback/empty-state`. | Medium (3-4h) | Low |
| **Phase 3** | **API Sync & Canonical Loader** | Register all targets in `catalog-targets.ts`, run extraction, implement canonical `/components/feedback/loader`. | Medium (2-3h) | Low |
| **Phase 4** | **Unification & Legacy Cleanup** | Reconcile `/components` with `/ui-components`, replace React mocks with Web Components, add redirects. | High (4-6h) | Medium |
| **Phase 5** | **Getting Started & Guides** | Author Quick Start, Angular guide, React guide, Tokens guide. | Medium (3-4h) | Low |
| **Phase 6** | **Accessibility & Quality Pass** | Fix contrast tokens, button names, ARIA roles, re-run full Playwright/axe suite. | Medium (2-3h) | Low |

---

## 7. Acceptance Criteria for DASHBOARD-002

1. All 31 platform packages are navigable in the dashboard.
2. Dedicated pages exist for `Drawer`, `Badge`, `Empty State`, and `Loader`.
3. Zero 500 errors on initial server response across all routes in both `next dev` and `next build`.
4. All component demos render genuine `<skyra-tech-*>` Web Components.
5. All 35+ internal React mocks in `dashboard/src/components/ui/` are eliminated or replaced.
6. `pnpm catalog:check` passes cleanly with all 31 packages indexed.
7. WCAG 2.2 AA zero critical/serious violations on all canonical component pages.

