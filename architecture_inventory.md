# Monorepo Architectural Inventory

## 1. Apps & Framework Adapters (React/Next.js permissible)
| Package Path | Package Name | Purpose | Framework Dependency | Status | Target Architecture |
|---|---|---|---|---|---|
| `dashboard/` | `dashboard` | Showcase / QA App | Next.js, React | Compliant | Category D (Application) |
| `packages/app-shell` | `@skyra-tech-platform/app-shell` | Layout Scaffold | React | Compliant | Category C (Adapter) |
| `packages/dialogs` | `@skyra/dialogs` | Dialog Adapters | React | Compliant | Category C (Adapter) |
| `packages/ui` | `@skyra/ui` | UI Adapters | React | Compliant | Category C (Adapter) |

## 2. Pure Framework-Agnostic Utilities (No UI / No React)
| Package Path | Package Name | Purpose | Framework Dependency | Status | Target Architecture |
|---|---|---|---|---|---|
| `packages/data-export` | `@skyra-tech-platform/data-export` | CSV/Excel Export | None | Compliant | Category A (Pure TS) |
| `packages/design-tokens` | `@skyra-tech-platform/design-tokens` | CSS Variables | None | Compliant | Category A (Pure TS) |
| `packages/utils` | `@skyra-tech-platform/utils` | Pure Utilities | None | Compliant | Category A (Pure TS) |
| `packages/validation` | `@skyra-tech-platform/validation` | Zod Validation | None | Compliant | Category A (Pure TS) |

## 3. Compliant Web Components & Logic (`@skyra-tech-platform/*`)
| Package Path | Package Name | Purpose | Framework Dependency | Status | Target Architecture |
|---|---|---|---|---|---|
| `packages/button` | `@skyra-tech-platform/button` | Button Component | None | Compliant | Category B (Web Component) |
| `packages/checkbox` | `@skyra-tech-platform/checkbox` | Checkbox Component | None | Compliant | Category B (Web Component) |
| `packages/data-table` | `@skyra-tech-platform/data-table` | Data Table | None | Compliant | Category B (Web Component) |
| `packages/date-time` | `@skyra-tech-platform/date-time` | Date/Time Logic | None | Compliant | Category B (Web Component) |
| `packages/dialog` | `@skyra-tech-platform/dialog` | Dialog Component | None | Compliant | Category B (Web Component) |
| `packages/dynamic-form` | `@skyra-tech-platform/dynamic-form` | Form Component | None | Compliant | Category B (Web Component) |
| `packages/dynamic-select` | `@skyra-tech-platform/dynamic-select` | Select Component | None | Compliant | Category B (Web Component) |
| `packages/input` | `@skyra-tech-platform/input` | Input Component | None | Compliant | Category B (Web Component) |
| `packages/radio` | `@skyra-tech-platform/radio` | Radio Component | None | Compliant | Category B (Web Component) |
| `packages/switch` | `@skyra-tech-platform/switch` | Switch Component | None | Compliant | Category B (Web Component) |
| `packages/textarea` | `@skyra-tech-platform/textarea` | Textarea Component | None | Compliant | Category B (Web Component) |

## 4. Violations / Packages Requiring Migration
| Package Path | Package Name | Current Issue | Target Architecture |
|---|---|---|---|
| `packages/notification` | `@skyra-tech-platform/notification` | Depends on React | Core -> Category B (`@skyra-tech-platform/notification`), Adapter -> Category C (`@skyra/ui`) |
| `packages/pdf-viewer` | `@skyra-tech-platform/pdf-viewer` | Depends on React | Core -> Category B/A (`@skyra-tech-platform/pdf-viewer`), Adapter -> Category C (`@skyra/ui`) |
| `packages/qr` | `@skyra-tech-platform/qr` | Bundles React inside a single package | Core -> Category A (`@skyra-tech-platform/qr`) |
| `packages/toast` | `@skyra-tech-platform/toast` | Depends on React | Core -> Category B (`@skyra-tech-platform/toast`), Adapter -> Category C (`@skyra/ui`) |
