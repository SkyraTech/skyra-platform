# Skyra Platform — ERP Migration and Adoption Plan

**Version:** 3.0.0 — Platform Governance Expansion
**Date:** September 2026
**Author:** Skyra Tech Architecture Team
**Status:** GOVERNANCE BASELINE — PENDING FORMAL APPROVAL

---

> **NO MIGRATION CODE MAY BE MERGED INTO `skyra-erp`** until all 5 Pre-Migration Gates
> receive formal sign-off. `skyra-erp` remains READ-ONLY until then.

---

## 1. Core Migration Principles

1. **Non-Destructive** — ERP continues building and passing all tests at every commit.
2. **Incremental** — One package adopted at a time in ascending order of complexity.
3. **Visual Fidelity Guaranteed** — Each migration step must produce visually identical ERP output. Differences require documented `[C]` classification and explicit approval.
4. **Mandatory Dashboard Verification** — Every package must be verified in the Platform Dashboard (importing the actual compiled package) before it enters ERP migration.
5. **Atomic and Reversible** — Every migration PR is independent and immediately revertible.
6. **Mobile Behavior Preserved** — Migrated components must pass the full 7-viewport verification matrix (320px, 375px, 640px, 768px, 1024px, 1280px, 1536px) in addition to desktop verification.

---

## 2. What Migration Must Never Do

Migration must NEVER:
- Redesign or visually change ERP without a documented `[C]` classification
- Reduce accessibility (must maintain or improve WCAG 2.1 AA)
- Reduce mobile responsiveness
- Remove existing ERP features or behaviors
- Introduce regressions in dark mode
- Introduce performance regressions

---

## 3. Pre-Migration Gates (Mandatory Sign-Off)

- [ ] **Gate 1: Specification Approval** — Formal sign-off on all 6 platform specs at v2.1.0
- [ ] **Gate 2: Monorepo CI Verified** — All 8 packages build, lint, typecheck, and test cleanly
- [ ] **Gate 3: Test Coverage Met** — ≥95% utils/validation/engine; ≥80% UI; 100% axe-core pass
- [ ] **Gate 4: ERP Visual Baseline Captured** — Screenshot baseline across all ERP screens in light and dark modes at 375px, 768px, and 1280px
- [ ] **Gate 5: Rollback Runbooks Prepared** — Atomic revert procedure verified for each of the 8 migration steps

---

## 4. Eight-Step Package Adoption Sequence

```
Step 1: @skyra/design-tokens
Step 2: @skyra/utils
Step 3: @skyra/validation
Step 4: @skyra/ui
Step 5: @skyra/data-table
Step 6: @skyra/dynamic-form
Step 7: @skyra/dialogs
Step 8: @skyra/invoice
```

---

## 5. Step-by-Step Migration with Dashboard Verification

---

### Step 1: `@skyra/design-tokens` (Very Low Risk)

**What Changes:**
- Install `@skyra/design-tokens` in `skyra-erp`.
- In `src/app/globals.css`, replace local token block with:
  ```css
  @import '@skyra/design-tokens/tokens.css';
  @import '@skyra/design-tokens/tokens.dark.css';
  ```
- Add backward-compatibility aliases: `--primary: var(--skyra-primary)` etc. to prevent breaking existing ERP components that use old names.

**Dashboard Verification:**
- Inspect Design System Browser — all confirmed token values visually match ERP.
- Light/dark toggle verified across all token categories.

**ERP Verification:**
- Screenshot diff vs baseline: zero pixel difference at 375px, 768px, 1280px in light and dark modes.
- Dark mode toggle verified across all ERP dashboard pages.

**Visual Fidelity Check:** If any color differs, halt the PR and investigate.

**Rollback:** Revert `globals.css` import and restore local token block.

---

### Step 2: `@skyra/utils` (Low Risk)

**What Changes:**
- Replace local utility files with imports from `@skyra/utils`:
  - `src/lib/utils/amountInWords.ts` → `import { amountInWords } from '@skyra/utils'`
  - `src/lib/utils/geoUtils.ts` → `import { geoData, getStatesByCountry } from '@skyra/utils'`
  - `src/lib/dialCodes.ts` → `import { dialCodes } from '@skyra/utils'`
- Delete superseded local files after import verification.

**Dashboard Verification:**
- Test `amountInWords` with edge values (Crores, Lakhs, Paise, zero, negative guard) in Utilities Studio.
- Test `formatCurrency` with INR and USD in Utilities Studio.

**ERP Verification:**
- Unit tests confirm identical `amountInWords` output for all edge cases.
- Invoice preview still renders amount-in-words correctly.

**Rollback:** Restore local utility files and revert imports.

---

### Step 3: `@skyra/validation` (Low Risk)

**What Changes:**
- Replace local validation schemas:
  - `src/lib/validations/invoice.ts` → imports from `@skyra/validation`
  - `src/lib/validations/organization.ts` → imports from `@skyra/validation`
  - `src/lib/validations/bank.ts` → imports from `@skyra/validation`

**Dashboard Verification:**
- Test all Zod schemas in Validation Studio with valid and invalid payloads.
- Verify error shape matches ERP API responses.

**ERP Verification:**
- API integration tests confirm identical validation error payloads for invoice creation, GSTIN format, and payment amount.

**Rollback:** Restore local validation files and revert imports.

---

### Step 4: `@skyra/ui` (Medium Risk)

**What Changes** (incremental sub-steps, one component per PR):
1. `Button` — replace all `.btn-primary`, `.btn-orange`, `.btn-outline`, `.btn-ghost` usages
2. `Badge` — replace `.badge-primary`, `.badge-success`, etc.
3. `Input` and `Textarea` — replace `.input-field` usages
4. `CustomSelect` — replace `CustomSelect.tsx` import
5. `PhoneInputField` — replace `PhoneInputField.tsx` import
6. `Card`, `Alert`, `Spinner`, `Divider` — replace utility classes
7. `LogoUploader` — pass Supabase upload logic as `onUpload` callback adapter

**Dashboard Verification:**
- Every component showcase page verified against ERP Reference section.
- All 24 standard showcase page requirements met.
- All 7 verification viewports confirmed (320px, 375px, 640px, 768px, 1024px, 1280px, 1536px).
- Light and dark mode verified.
- Keyboard navigation verified.
- Focus visible rings present (`0 0 0 3px rgba(10,88,202,0.15)`).

**ERP Verification:**
- Visual comparison: platform button must match ERP button — same shadow, gradient, hover lift.
- Screenshot diff vs baseline for every page that contains migrated components.

**Visual Fidelity Gate:** Any unintended visual difference blocks the PR.

**Rollback:** Per-component PR revert.

---

### Step 5: `@skyra/data-table` (Medium Risk)

**What Changes:**
- Replace `src/components/ui/table/DynamicDataTable.tsx` with `import { DynamicDataTable } from '@skyra/data-table'`.
- Remove local `Table.module.css`.

**Dashboard Verification:**
- Test all 9 showcase table designs in Data Table section.
- Mobile scroll behavior verified at 320px and 375px; full 7-viewport matrix (320, 375, 640, 768, 1024, 1280, 1536) confirmed.
- Column visibility, sorting, search, and pagination verified.
- Skeleton shimmer, empty state, and error state verified.

**ERP Verification:**
- Invoices list, Clients list, Bank Accounts list, Expenses list all verified.
- Table card radius matches: `border-radius: var(--radius-xl)` — `[CONFIRMED]`.
- Table header uppercase `0.72rem` text matches — `[CONFIRMED]`.
- Table row hover `background: var(--bg-color)` matches — `[CONFIRMED]`.
- Mobile horizontal scroll still functions.

**Rollback:** Restore local `DynamicDataTable.tsx` and `Table.module.css`.

---

### Step 6: `@skyra/dynamic-form` (Medium Risk)

**What Changes:**
- Replace `src/components/ui/forms/DynamicForm.tsx` with `import { DynamicForm } from '@skyra/dynamic-form'`.
- Remove local `DynamicForm.module.css`.

**Dashboard Verification:**
- All 5 form showcase workflows verified.
- 2-column to 1-column mobile collapse at `≤640px` verified — matches ERP behavior.
- Fieldset card visual matches ERP: `radius-xl`, header with `bg-color` background.
- Danger Zone visual matches ERP: `danger-light` bg, `1px solid var(--danger)`, `radius-xl`.
- Submit button gradient `linear-gradient(135deg, var(--primary) 0%, #0847a8 100%)` matches.

**ERP Verification:**
- Client onboarding form, Organization settings form, Bank account forms all verified.
- Validation error display and loading spinner match ERP behavior.

**Rollback:** Restore local form component and stylesheet.

---

### Step 7: `@skyra/dialogs` (Medium Risk)

**What Changes:**
- Replace `src/components/ui/ConfirmDialog.tsx` with `import { ConfirmDialog } from '@skyra/dialogs'`.
- Replace ad-hoc overlay implementations in `PaymentDrawer`, `TemplateDrawer`, and `SignatureModal` with platform `Modal` and `Drawer`.

**Dashboard Verification:**
- ConfirmDialog variants (danger, warning, primary) verified.
- Focus trap verified — Tab key stays inside open dialog.
- Escape key closes all dialogs and drawers.
- Focus returns to trigger element after close.
- Backdrop: `rgba(0,0,0,0.5) + blur(2px)` — `[CONFIRMED]`.
- Mobile: dialog fits within `320px` viewport.
- Drawer expands to `100vw` on mobile.

**ERP Verification:**
- Delete confirmation dialogs trigger correctly.
- Payment drawer opens, focuses, and closes correctly.
- Template drawer opens with correct content.

**Rollback:** Restore local `ConfirmDialog.tsx` and ad-hoc overlay components.

---

### Step 8: `@skyra/invoice` (High Risk — Most Complex)

**What Changes:**
- `InvoicePreview.tsx` → `import { InvoicePreview } from '@skyra/invoice/components'`
- `LineItemGrid.tsx` → `import { LineItemGrid } from '@skyra/invoice/components'`
- `RecordPaymentModal.tsx` → `import { RecordPaymentModal } from '@skyra/invoice/components'`
- `PaymentDrawer.tsx` → `import { PaymentDrawer } from '@skyra/invoice/components'`
- `StatusBadge.tsx` → `import { InvoiceStatusBadge } from '@skyra/invoice/components'`
- `downloadPDF.ts` → `import { downloadInvoicePDF } from '@skyra/invoice/pdf/client'`
- `generateInvoiceBuffer.ts` → `import { generateInvoicePdfBuffer } from '@skyra/invoice/pdf/server'`
- `InvoiceEmail.tsx` → `import { InvoiceEmail } from '@skyra/invoice/email'`

**Dashboard Verification:**
- 3-pane Invoice Builder tested with all configuration options.
- All 8 configuration-driven invoice showcase designs verified.
- Calculation engine results verified against known ERP test invoices.
- PDF download generates correctly at client-side.
- Email template renders correctly in preview.
- Mobile: Invoice Builder collapses to vertical tabs at `<768px`.

**ERP Verification (End-to-End):**
- Create invoice with multi-line items, mixed tax rates, discount → verify subtotal, GST split, grand total matches database.
- IGST scenario: org state ≠ place of supply → 100% IGST allocation.
- CGST/SGST scenario: org state = place of supply → 50/50 split.
- Record partial payment → verify balanceDue, status = PARTIAL.
- Record full payment → verify balanceDue ≤ 0.009, status = PAID.
- Delete payment → verify atomic reversal of balanceDue and status.
- Download PDF → verify generation completes under 3s for standard invoice.
- Send email → verify PDF buffer attaches correctly.

**Visual Fidelity Gate:**
- Invoice preview A4 layout matches pre-migration baseline pixel-for-pixel.

**Rollback:** Restore full local invoice component directory as a single atomic revert.

---

## 6. ERP Assets That Never Move to Platform

```
src/lib/prisma.ts              — Database ORM client instance
src/lib/auth.ts                — NextAuth configuration and session handlers
src/lib/permissions.ts         — Role-Based Access Control rules
src/lib/supabaseStorage.ts     — Supabase storage bucket integration
src/middleware.ts              — Next.js route authentication guard
src/app/api/**                 — All server-side API route handlers
src/app/dashboard/**           — Dashboard layout, navigation, and page routes
src/types/next-auth.d.ts       — NextAuth session type augmentations
```

---

## 7. Migration Quality Checklist (Per Package)

Before any migration PR is merged:

- [ ] Platform package installed and building in ERP
- [ ] Dashboard showcase page verified (real package, not mocked)
- [ ] All documented variants and states verified in dashboard
- [ ] Light mode visual match vs ERP baseline (screenshot diff)
- [ ] Dark mode visual match vs ERP baseline (screenshot diff)
- [ ] All 7 viewports verified (320px, 375px, 640px, 768px, 1024px, 1280px, 1536px)
- [ ] Keyboard navigation verified
- [ ] Accessibility (no new axe-core violations)
- [ ] All existing ERP tests still passing
- [ ] Rollback procedure tested in a branch before merge

---

## 8. Second-Product Onboarding Guide

When bootstrapping a new Skyra product (CRM, Billing):

```bash
pnpm add @skyra/design-tokens @skyra/utils @skyra/validation @skyra/ui @skyra/data-table @skyra/dynamic-form @skyra/dialogs
# Add @skyra/invoice only if invoice functionality is required
```

Root layout stylesheet:
```css
@import '@skyra/design-tokens/tokens.css';
@import '@skyra/design-tokens/tokens.dark.css';
```

Root layout HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

Then:
1. Build product-specific Next.js API routes, Prisma schema, and auth.
2. Connect platform components via callback adapter props.
3. Zero copy-paste of platform source files — ever.
4. Missing generic capabilities are contributed back to `skyra-platform` via PR.

---

*End of ERP Migration and Adoption Plan v2.1.0 — Awaiting formal approval.*


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

## 10. Platform-First Migration Governance

ERP migration must not be treated as the definition of Platform correctness. The Platform must first meet its own release gates, documentation requirements, package boundaries, and style-isolation requirements before an ERP adoption step is approved.

### Required Pre-Migration Platform Gates

- Stable package/API status is explicitly documented.
- Dashboard documentation exists and imports the actual compiled package.
- Responsive seven-viewport verification passes.
- Light/dark and reduced-motion behavior passes where applicable.
- Accessibility validation passes.
- No global styling leakage is introduced into the consuming application.
- Package boundary and dependency checks pass.
- Changelog and migration guidance exist for consumer-visible changes.
- Rollback procedure is documented.

### Global CSS Migration Rule

The previous migration concept of replacing ERP global token blocks with a Platform import must be revisited carefully. Platform token consumption must not result in uncontrolled global styling. If compatibility aliases are required inside ERP, they belong to the ERP migration adapter/compatibility layer and must be intentionally scoped and documented.

### Future Product Onboarding

The same migration governance applies to every future Skyra application. A new product should consume stable Platform packages through versioned dependencies rather than copying Platform source code. Product-specific styles remain product-owned.
