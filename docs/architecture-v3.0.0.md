# Skyra Platform — Technical Architecture Specification

**Version:** 3.0.0 — Platform Governance Expansion
**Date:** September 2026
**Author:** Skyra Tech Architecture Team
**Status:** GOVERNANCE BASELINE — PENDING FORMAL APPROVAL

---

> **NO IMPLEMENTATION CODE MAY BE CREATED** until this specification receives formal
> approval from the Skyra Tech Engineering Lead.

---

## 1. Governing Architecture Principles

1. **ERP Visual Source of Truth** — Platform components are derived from and visually compatible with `skyra-erp`. The ERP's design language is systematized, not replaced.
2. **Mobile-First** — 320px is the baseline viewport. Components expand to desktop, not the other way around.
3. **Build Shared Semantics, Not Shared Rendering** — Domain types, validation, and calculations are platform-neutral. UI rendering is platform-specific.
4. **One-Way Dependency Flow** — Lower layers never import from higher layers. Zero circular dependencies.
5. **Adapter Pattern** — Platform components expose callback props. Applications own persistence, auth, and API calls.
6. **No DOM in Layer 1** — `@skyra/utils` and `@skyra/validation` contain zero browser/DOM/React/CSS dependencies. Safe for Node.js, edge, and future native mobile.

---

## 2. Three-Layer Platform Model

```
+-------------------------------------------------------------------------------+
| LAYER 3: REUSABLE BUSINESS MODULES                                            |
| @skyra/invoice                                                                |
| - Types, Engine, Config, Line Items, Tax/GST, Preview, PDF, Email, Payments  |
| - [D] Future domain modules when justified by 2+ consuming products           |
+-------------------------------------------------------------------------------+
                               (imports Layer 2 and Layer 1)
+-------------------------------------------------------------------------------+
| LAYER 2: REUSABLE UI SYSTEMS                                                  |
| @skyra/ui            — Primitives (ERP-fidelity + accessibility + mobile)    |
| @skyra/data-table    — DynamicDataTable (client+server, mobile-responsive)    |
| @skyra/dynamic-form  — Schema-Driven DynamicForm (13 field types, mobile-col) |
| @skyra/dialogs       — ConfirmDialog, Modal, Drawer (focus trap, mobile full) |
+-------------------------------------------------------------------------------+
                               (imports Layer 1)
+-------------------------------------------------------------------------------+
| LAYER 1: DESIGN FOUNDATION  (zero DOM/browser/React/CSS dependencies)        |
| @skyra/design-tokens — CSS Custom Properties (--skyra-*), dark mode CSS      |
| @skyra/utils         — Pure TS: amountInWords, formatCurrency, geo, date     |
| @skyra/validation    — Authoritative Zod Schemas                              |
+-------------------------------------------------------------------------------+
                               (consumed by applications)
  +----------------------------+               +---------------------------------+
  | skyra-erp                  |               | skyra-crm (Future)              |
  | Next.js, Prisma, NextAuth  |               | Next.js, Prisma, Auth           |
  +----------------------------+               +---------------------------------+
```

---

## 3. Package Dependency Graph

```
@skyra/design-tokens   @skyra/utils   @skyra/validation (peer: zod)
         |                  |                |
         +------------------+----------------+
                            |
                        @skyra/ui  (peer: react, lucide-react)
                            |
           +----------------+----------------+
           |                |                |
   @skyra/data-table  @skyra/dynamic-form  @skyra/dialogs
           |                |                |
           +----------------+----------------+
                            |
                     @skyra/invoice
```

Dependency matrix:

| Package | design-tokens | utils | validation | ui | External |
|---|---|---|---|---|---|
| `@skyra/design-tokens` | — | — | — | — | none |
| `@skyra/utils` | — | — | — | — | none |
| `@skyra/validation` | — | — | — | — | `zod` (peer) |
| `@skyra/ui` | dep | — | — | — | `react` (peer), `lucide-react` (peer) |
| `@skyra/data-table` | — | — | — | dep | `react` (peer), `lucide-react` (peer) |
| `@skyra/dynamic-form` | — | — | — | dep | `react` (peer), `lucide-react` (peer) |
| `@skyra/dialogs` | — | — | — | dep | `react` (peer), `lucide-react` (peer) |
| `@skyra/invoice` | — | dep | dep | dep | `react` (peer), `jspdf`, `html2canvas`, `@react-email/components`, `nanoid` |

---

## 4. Platform vs Application Boundary

```
+------------------------------------------+------------------------------------------+
| PLATFORM OWNS                            | APPLICATION OWNS                         |
+------------------------------------------+------------------------------------------+
| TypeScript types, interfaces, enums      | Prisma ORM schemas and migrations        |
| Declarative configuration schemas        | API route handlers (/api/*)              |
| Zod validation schemas                   | NextAuth sessions and JWT handling       |
| Pure business calculation engines        | Database transactions and persistence    |
| UI rendering and mobile-first layout     | File storage SDK integrations            |
| Form field schemas and validation UI     | Transactional email sending (Resend)     |
| Dialog focus trapping and state          | RBAC rules and permission enforcement    |
| Invoice HTML template and PDF logic      | Organization switching and multi-tenancy |
| Email template markup (React Email)      | Next.js page routing and app shell       |
| Adapter callback prop contracts          | Concrete onSubmit / onUpload callbacks   |
+------------------------------------------+------------------------------------------+
```

---

## 5. ERP Visual Fidelity Architecture

### 5.1 Confirmed ERP Token Values

Direct inspection of `skyra-erp/src/app/globals.css` and `src/styles/ui.css`:

**CSS Custom Properties in ERP (using `--` prefix without `skyra-`):**
The platform will rename these to `--skyra-*` prefix while preserving the exact values.

| ERP Variable | Value | Light | Dark | Source Line |
|---|---|---|---|---|
| `--primary` | `#0A58CA` | ✓ | unchanged | `globals.css:8` |
| `--primary-hover` | `#0847a8` | ✓ | unchanged | `globals.css:9` |
| `--primary-light` | `rgba(10,88,202,0.1)` | ✓ | `rgba(10,88,202,0.15)` | `globals.css:10,74` |
| `--orange` | `#FF6B00` | ✓ | unchanged | `globals.css:11` |
| `--orange-hover` | `#e05e00` | ✓ | unchanged | `globals.css:12` |
| `--orange-light` | `rgba(255,107,0,0.1)` | ✓ | `rgba(255,107,0,0.15)` | `globals.css:13,75` |
| `--cyan` | `#00A3E0` | ✓ | unchanged | `globals.css:14` |
| `--cyan-light` | `rgba(0,163,224,0.1)` | ✓ | `rgba(0,163,224,0.15)` | `globals.css:15,76` |
| `--navy` | `#002B66` | ✓ | unchanged | `globals.css:16` |
| `--bg-color` | `#F4F7FC` | ✓ | `#0B111E` | `globals.css:19,58` |
| `--card-bg` | `#FFFFFF` | ✓ | `#151D30` | `globals.css:20,59` |
| `--sidebar-bg` | `#002B66` | ✓ | `#0B111E` | `globals.css:21,60` |
| `--sidebar-text` | `rgba(255,255,255,0.75)` | ✓ | `rgba(255,255,255,0.65)` | `globals.css:22,61` |
| `--sidebar-active` | `rgba(255,255,255,0.12)` | ✓ | `rgba(10,88,202,0.25)` | `globals.css:23,62` |
| `--text-main` | `#0f172a` | ✓ | `#f1f5f9` | `globals.css:26,64` |
| `--text-muted` | `#64748b` | ✓ | `#94a3b8` | `globals.css:27,65` |
| `--text-subtle` | `#94a3b8` | ✓ | `#64748b` | `globals.css:28,66` |
| `--border-color` | `#e2e8f0` | ✓ | `rgba(255,255,255,0.08)` | `globals.css:31,68` |
| `--border-focus` | `#0A58CA` | ✓ | unchanged | `globals.css:32,69` |
| `--shadow-sm` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | ✓ | `0 1px 3px rgba(0,0,0,0.4)` | `globals.css:33,70` |
| `--shadow-md` | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | ✓ | `0 4px 12px rgba(0,0,0,0.5)` | `globals.css:34,71` |
| `--shadow-lg` | `0 10px 30px rgba(0,0,0,0.10), 0 4px 10px rgba(0,0,0,0.05)` | ✓ | `0 10px 30px rgba(0,0,0,0.6)` | `globals.css:35,72` |
| `--shadow-glow` | `0 0 0 3px rgba(10,88,202,0.15)` | ✓ | unchanged | `globals.css:36` |
| `--danger` | `#ef4444` | ✓ | unchanged | `globals.css:39` |
| `--danger-light` | `rgba(239,68,68,0.1)` | ✓ | `rgba(239,68,68,0.15)` | `globals.css:40,77` |
| `--success` | `#10b981` | ✓ | unchanged | `globals.css:41` |
| `--success-light` | `rgba(16,185,129,0.1)` | ✓ | `rgba(16,185,129,0.15)` | `globals.css:42,78` |
| `--warning` | `#f59e0b` | ✓ | unchanged | `globals.css:43` |
| `--warning-light` | `rgba(245,158,11,0.1)` | ✓ | unchanged | `globals.css:44` |
| `--radius-sm` | `6px` | ✓ | unchanged | `globals.css:47` |
| `--radius-md` | `10px` | ✓ | unchanged | `globals.css:48` |
| `--radius-lg` | `14px` | ✓ | unchanged | `globals.css:49` |
| `--radius-xl` | `20px` | ✓ | unchanged | `globals.css:50` |

**Platform naming convention**: The platform will prefix all tokens with `--skyra-` for global namespacing.
`--primary` → `--skyra-primary`, `--bg-color` → `--skyra-bg`, etc.

### 5.2 Confirmed ERP Component Visual Patterns

| Component | Confirmed ERP Pattern | Source |
|---|---|---|
| Card container | `border-radius: var(--radius-xl)` = 20px, `1px solid var(--border-color)`, `shadow-sm` | `ui.css:9-14` |
| Form fieldset | `border-radius: var(--radius-xl)`, header has `border-bottom + bg-color` background | `DynamicForm.module.css:14-25` |
| Table card | `border-radius: var(--radius-xl)`, `1px solid var(--border-color)`, `shadow-sm` | `Table.module.css:8-14` |
| Primary button | Solid `#0A58CA`, `box-shadow: 0 2px 8px rgba(10,88,202,0.25)`, `-1px` hover lift | `ui.css:58-67` |
| Submit/action gradient | `linear-gradient(135deg, var(--primary) 0%, #0847a8 100%)` | `DynamicForm.module.css:231`, `Table.module.css:125` |
| Sidebar nav active | `background: rgba(10,88,202,0.35)` + `inset 3px 0 0 var(--primary)` left border | `DashboardLayout.module.css:264-268` |
| Nav active icon | `color: var(--cyan)` | `DashboardLayout.module.css:272` |
| Logo mark | Orange→`#ff8c33` gradient, Outfit 800, 36×36, radius-md, `box-shadow: 0 4px 10px rgba(255,107,0,0.4)` | `DashboardLayout.module.css:47-61` |
| Table header | `0.72rem`, uppercase, `letter-spacing: 0.06em`, `text-muted`, `bg-color` background | `Table.module.css:204-217` |
| Table row hover | `background: var(--bg-color)` | `Table.module.css:245-247` |
| Form focus ring | `0 0 0 3px rgba(10,88,202,0.12)` | `DynamicForm.module.css:97` |
| Error focus ring | `0 0 0 3px rgba(239,68,68,0.10)` | `DynamicForm.module.css:104` |
| Disabled state | `opacity: 0.55; cursor: not-allowed` | `ui.css:151-155` |
| Form label | `0.82rem`, `font-weight: 500`, `text-muted`, uppercase with `letter-spacing: 0.02em` | `ui.css:212-218` |
| Badge shape | `border-radius: 999px` (pill) | `ui.css:266` |
| Skeleton shimmer | `linear-gradient(90deg, bg 25%, border 50%, bg 75%)`, `200%→-200%`, 1.4s | `Table.module.css:341-352` |
| Page content padding | `1.75rem 2rem` desktop, `1.25rem` mobile | `DashboardLayout.module.css:568,606` |
| Body transition | `background-color 0.3s ease, color 0.3s ease` | `globals.css:103` |
| Interaction transition | `all 0.2s ease` | `ui.css:52` |
| Sidebar slide | `0.28s cubic-bezier(0.4,0,0.2,1)` | `DashboardLayout.module.css:23-24` |

---

## 6. Mobile-First Architecture Requirements

### 6.1 Confirmed ERP Mobile Behavior (Source: `DashboardLayout.module.css:582-608`)

```css
/* Confirmed in skyra-erp */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    transform: translateX(-100%);  /* hidden by default */
  }
  .sidebarMobileOpen {
    transform: translateX(0);       /* slides in when toggled */
  }
  .mobileOverlay { display: block; } /* full-screen backdrop */
  .pageContent { padding: 1.25rem; } /* reduced padding */
}
```

### 6.2 Mobile Architecture Requirements for All Layer 2 Components

| Component | Minimum Width | Mobile Strategy |
|---|---|---|
| `Button` | 32px height / 44px touch | `fullWidth` prop expands to 100% |
| `Input` | 100% width | Full width, 44px min touch height |
| `CustomSelect` | 100% width | Full-screen option panel on mobile |
| `DynamicDataTable` | `min-width: 640px` inside `overflow-x: auto` | Horizontal scroll (confirmed ERP) |
| `DynamicForm` | 1-column at `≤640px` | 2-col → 1-col breakpoint (confirmed ERP) |
| `Modal` | `calc(100vw - 2rem)` | Size `sm` min already has `maxWidth: calc(100vw - 2rem)` (confirmed ERP) |
| `Drawer` | `100vw` at `<640px` | Full-screen sheet on mobile `[C]` |
| `InvoicePreview` | A4 (794px) in horizontal scroll wrapper | Separate mobile viewer `[C]` |

---

## 7. Runtime-Safe Invoice Subpath Exports

```json
{
  "exports": {
    ".": { "types": "./dist/index.d.ts", "import": "./dist/index.js" },
    "./components": { "types": "./dist/components/index.d.ts", "import": "./dist/components/index.js" },
    "./pdf/client": { "types": "./dist/pdf/client.d.ts", "import": "./dist/pdf/client.js" },
    "./pdf/server": { "types": "./dist/pdf/server.d.ts", "import": "./dist/pdf/server.js" },
    "./email": { "types": "./dist/email/index.d.ts", "import": "./dist/email/index.js" }
  }
}
```

| Export | Runtime | Contents |
|---|---|---|
| `@skyra/invoice` | Universal | Types, Zod schemas, calculation engine, config |
| `@skyra/invoice/components` | Client | InvoicePreview, LineItemGrid, StatusBadge (via @skyra/ui), RecordPaymentModal, PaymentDrawer |
| `@skyra/invoice/pdf/client` | Browser only | `downloadInvoicePDF()` — html2canvas + jsPDF |
| `@skyra/invoice/pdf/server` | Node.js only | `generateInvoicePdfBuffer()` — Node.js-compatible server-side jsPDF vector/buffer generator |
| `@skyra/invoice/email` | Node.js only | `InvoiceEmail` — @react-email template |

---

## 8. StatusBadge Architecture (Resolved)

| Package | What It Owns |
|---|---|
| `@skyra/ui` | Generic `StatusBadge` — accepts `statusMap: Record<string, {bg, color, border, label}>` + `status: string` + `size` |
| `@skyra/invoice` | `INVOICE_STATUS_MAP` constant + `InvoiceStatusBadge` convenience wrapper (pre-configured generic StatusBadge) |

`@skyra/invoice/components` imports `StatusBadge` from `@skyra/ui`. Zero duplication.

---

## 9. Future Mobile Architecture [D]

```
SKYRA PLATFORM
      |
      +-- SHARED FOUNDATIONS (platform-neutral, no DOM)
      |   @skyra/utils, @skyra/validation, @skyra/invoice (engine)
      |
      +-- WEB RENDERING (current)
      |   @skyra/ui, @skyra/data-table, @skyra/dynamic-form, @skyra/dialogs
      |   → React + Next.js + CSS Custom Properties
      |
      +-- NATIVE MOBILE RENDERING [D] FUTURE
          @skyra/mobile-ui (architecture-approved name TBD)
          → React Native / Expo (technology pending formal approval)
          → Consumes @skyra/utils, @skyra/validation, @skyra/invoice engine
          → Uses JS/TS token objects mapped to React Native StyleSheet
```

---

## 10. Monorepo Directory Structure

```
skyra-platform/
+-- packages/
|   +-- design-tokens/      @skyra/design-tokens
|   +-- utils/              @skyra/utils
|   +-- validation/         @skyra/validation
|   +-- ui/                 @skyra/ui
|   +-- data-table/         @skyra/data-table
|   +-- dynamic-form/       @skyra/dynamic-form
|   +-- dialogs/            @skyra/dialogs
|   +-- invoice/            @skyra/invoice
+-- dashboard/              skyra-platform-dashboard (Next.js 16)
|   +-- app/
|       +-- design-system/
|       +-- ui/
|       +-- data-table/
|       +-- dynamic-form/
|       +-- dialogs/
|       +-- invoice/
|       +-- validation/
|       +-- utilities/
|       +-- accessibility/
|       +-- responsive/     (7-viewport frame studio)
|       +-- docs/
+-- docs/                   Authoritative specifications (v2.1.0)
+-- tooling/
|   +-- tsconfig.base.json
|   +-- eslint.config.js
|   +-- vitest.config.ts
+-- pnpm-workspace.yaml
+-- turbo.json
+-- package.json
```

---

## 11. CI Pipeline Tasks

1. `pnpm lint` — ESLint across all packages and dashboard
2. `pnpm typecheck` — `tsc --noEmit` strict mode
3. `pnpm test:unit` — Vitest unit tests (≥95% utils/validation/engine)
4. `pnpm test:components` — RTL component tests (≥80%)
5. `pnpm test:a11y` — jest-axe accessibility audit (100% pass)
6. `pnpm build` — Bundle all `@skyra/*` packages
7. `pnpm build:dashboard` — Next.js dashboard build verification
8. `pnpm audit:deps` — Zero circular dependency check

---

*End of Technical Architecture Specification v2.1.0 — Awaiting formal approval.*


---

# Platform Governance Expansion — v3.0.0

> This section supersedes conflicting planning assumptions in earlier v2.1.0 material where necessary. It does not remove existing component or domain requirements; it establishes the operating standards required for Skyra Platform to function as a professional, reusable internal platform for Skyra Tech.

## Platform Mission

Skyra Platform is the reusable engineering foundation for Skyra Tech applications. It provides reusable UI, interaction patterns, design semantics, validation, utilities, application-shell infrastructure, accessibility, responsive behavior, documentation, testing, and release governance.

**Core rule:** Build reusable technology once in Skyra Platform and consume it across Skyra applications. Applications own their business/domain logic, persistence, authentication, routing, product workflows, and application-specific behavior.

## Mandatory Platform Standards

1. **Version-controlled platform APIs** — packages and public APIs follow explicit lifecycle states: Experimental → Stable → Deprecated → Removed.
2. **Documented public APIs** — every stable reusable package/component has usage, API, accessibility, responsive, and migration documentation in the Platform Dashboard.
3. **Dashboard as engineering workbench** — the Dashboard is the authoritative interactive documentation and QA surface, not a product/customer dashboard.
4. **Style isolation** — Platform must not inject application-global styling that can unexpectedly alter consuming applications. Component styles are scoped/component-local or explicitly opt-in. Design tokens remain available as a controlled contract.
5. **No global element styling leakage** — Platform packages must not impose selectors such as `body`, `button`, `input`, `h1`, or `*` on consuming applications unless a separately documented, explicitly imported reset/base package is introduced in a future approved change.
6. **Responsive by contract** — reusable elements must remain usable at 320px, 375px, 640px, 768px, 1024px, 1280px, and 1536px unless a component is explicitly documented as viewport-specific.
7. **Accessibility by contract** — keyboard behavior, focus management, semantic structure, ARIA, reduced motion, touch targets, and axe validation are release requirements.
8. **Security by boundary** — reusable packages must not contain credentials, application persistence, auth/session implementation, secret access, or uncontrolled network calls.
9. **Dependency discipline** — lower-level packages cannot import higher-level packages; application packages cannot leak into foundational packages; forbidden dependency rules are CI-enforced.
10. **Strict TypeScript** — public APIs contain no `any`; new `@ts-ignore` and `@ts-nocheck` are prohibited.
11. **Real implementation showcase** — Dashboard examples must import the actual compiled workspace package. No duplicated showcase implementations or mock component copies.
12. **Frozen regression contracts** — completed package behavior must remain protected by tests and regression gates when later phases are implemented.

## Platform Quality Gate

A package or component is not considered release-ready until architecture, API, type safety, tests, accessibility, responsive behavior, light/dark behavior, reduced-motion behavior, documentation, Dashboard integration, and security/package-boundary checks pass.

## Release Lifecycle

Every public package/component must have a lifecycle state, release version, changelog entry, migration guidance for breaking changes, and a documented deprecation path where applicable.

## Documentation Lifecycle

Documentation is versioned with the implementation. The Dashboard must expose the current package API and examples, while repository documentation records architecture, governance, contribution rules, release policy, security, accessibility, responsive standards, and migration guidance.

## Future-Proofing Rule

A capability belongs in Skyra Platform when it is genuinely reusable across multiple Skyra applications or is foundational infrastructure. Product-specific behavior remains in the consuming application. The Platform must not become a shared dumping ground for unrelated business logic.

## Architecture Governance Addendum

### Package Layers

The current platform architecture includes reusable foundations, UI systems, application-shell infrastructure, and justified reusable capabilities such as `@skyra/qr`. The exact package inventory is governed by the repository rather than this document alone; this specification defines dependency direction and ownership.

```text
Layer 0 — Repository / Governance
        ↓
Layer 1 — design-tokens / utils / validation / pure engines
        ↓
Layer 2 — ui / dialogs / data-table / dynamic-form / data-export
        ↓
Layer 2A — app-shell / reusable application infrastructure
        ↓
Layer 3 — justified reusable domain capabilities (for example QR or invoice)
        ↓
Consuming applications: ERP / QR / future Skyra products
```

### Application Isolation

No Platform package may import an application package, application database layer, application route, authentication implementation, or product-specific business workflow. Platform components communicate with applications through typed props, callbacks, adapters, and documented contracts.

### Styling Boundary

`@skyra/design-tokens` defines semantic values and theme contracts, but importing Platform packages must not silently introduce a global CSS reset, global element rules, global typography rules, or global layout rules. Consumers explicitly opt into token styles. Component styling remains isolated.

### Versioned Public Surface

Public exports are treated as API contracts. Breaking changes require a major version or an approved compatibility/deprecation strategy. Internal implementation details are not public API and may change without consumer migration when no public contract is affected.
