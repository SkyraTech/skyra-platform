# Skyra Platform — Reusable Invoice System Specification

**Package:** `@skyra/invoice`
**Version:** 3.0.0 — Platform Governance Expansion
**Date:** September 2026
**Author:** Skyra Tech Architecture Team
**Status:** GOVERNANCE BASELINE — PENDING FORMAL APPROVAL

---

> `@skyra/invoice` is a COMPLETE REUSABLE INVOICE CAPABILITY — not a component collection.
> It encapsulates configuration, data models, validation, pure calculation, rendering,
> PDF generation, email templates, and callback-driven payment UI.

---

## 1. Platform vs Application Boundary

```
+------------------------------------------+------------------------------------------+
| PLATFORM OWNS (@skyra/invoice)           | APPLICATION OWNS                         |
+------------------------------------------+------------------------------------------+
| TypeScript interfaces and Zod schemas    | Prisma ORM schemas and database queries  |
| Pure calculation engine (no side effects)| API route handlers /api/invoices/*       |
| InvoicePreview and LineItemGrid UI       | NextAuth authentication                  |
| Template configuration schemas           | Database transactions ($transaction)     |
| Client PDF download pipeline             | Supabase Storage credentials             |
| Node.js-compatible server-side jsPDF     | Transactional email delivery (Resend)    |
| vector/buffer generator                  | Next.js page routing and app shell       |
| React Email component markup             | Organization and client data persistence |
| Adapter callback prop contracts          | onSubmit / onSuccess / onClose callbacks |
+------------------------------------------+------------------------------------------+
```

---

## 2. Runtime Subpath Exports

| Export | Runtime | Contents |
|---|---|---|
| `@skyra/invoice` | Universal | Types, Zod schemas, calculation engine, InvoiceConfig |
| `@skyra/invoice/components` | Client (Browser/SSR) | InvoicePreview, LineItemGrid, InvoiceStatusBadge, RecordPaymentModal, PaymentDrawer |
| `@skyra/invoice/pdf/client` | Browser only | `downloadInvoicePDF()` — html2canvas + jsPDF |
| `@skyra/invoice/pdf/server` | Node.js only | `generateInvoicePdfBuffer()` — Node.js-compatible server-side jsPDF vector/buffer generator |
| `@skyra/invoice/email` | Node.js only | `InvoiceEmail` React Email component |

---

## 3. 15 Conceptual Subsystems

| # | Subsystem | Classification |
|---|---|---|
| 1 | Invoice Configuration Engine (`InvoiceConfig`) | [B] EXTRACTION + [C] ENHANCEMENT |
| 2 | Invoice Data Model (TypeScript interfaces) | [B] EXTRACTION |
| 3 | Invoice Validation Layer (Zod schemas) | [B] EXTRACTION |
| 4 | Pure Calculation Engine | [B] EXTRACTION |
| 5 | Line Item System (discriminated union) | [A] EXISTING — extracted |
| 6 | Tax and GST Engine | [A] EXISTING — extracted |
| 7 | Discount Engine | [A] EXISTING — extracted |
| 8 | Totals Engine | [A] EXISTING — extracted |
| 9 | Interactive Invoice Builder (3-pane) | [C] ENHANCEMENT |
| 10 | High-Fidelity Invoice Preview (A4 HTML) | [A] EXISTING — extracted |
| 11 | Template Customization Engine | [A] EXISTING — extracted |
| 12 | Payment UI Subsystem (adapter-based) | [B] EXTRACTION |
| 13 | Client-Side PDF Engine | [A] EXISTING — extracted |
| 14 | Node.js-Compatible Server-Side PDF Buffer Generator | [A] EXISTING — extracted |
| 15 | Responsive Email Template | [A] EXISTING — extracted |

---

## 4. Declarative Invoice Configuration (`InvoiceConfig`)

```typescript
export interface InvoiceConfig {
  currency: string;               // default: 'INR'
  currencySymbol: string;         // default: 'Rs.'
  supportedCurrencies: string[];  // e.g. ['INR', 'USD', 'EUR', 'GBP']

  taxEnabled: boolean;
  taxMode: 'GST' | 'VAT' | 'CUSTOM' | 'NONE'; // default: 'GST'
  gstMode: 'AUTO' | 'IGST' | 'CGST_SGST';     // default: 'AUTO'
  availableTaxRates: number[];    // [CONFIRMED] from ERP: [0, 5, 12, 18, 28]

  discountEnabled: boolean;
  discountTypes: ('PERCENTAGE' | 'FIXED')[];

  showHsnColumn: boolean;
  showShippingAddress: boolean;
  showBankDetails: boolean;
  showSignature: boolean;
  showWatermark: boolean;
  showNotes: boolean;
  showTerms: boolean;

  invoiceNumberPrefix: string;    // default: 'INV'
  invoiceNumberPattern: string;

  paymentEnabled: boolean;
  paymentMethods: string[];

  pdfEnabled: boolean;
  pdfFilenamePattern: string;
  emailEnabled: boolean;
}
```

---

## 5. Core TypeScript Data Model

```typescript
export type InvoiceStatus =
  | 'DRAFT' | 'SENT' | 'VIEWED' | 'PARTIAL' | 'PAID' | 'OVERDUE' | 'VOIDED';

export type DiscountType = 'PERCENTAGE' | 'FIXED';

export interface LineItemItem {
  id: string;
  type: 'item';
  description: string;
  hsnSac?: string;
  qty: number;
  rate: number;
  discountAmt: number;
  discountType: DiscountType;
  taxRate: number;
  rowTotal: number;
}

export interface LineItemHeader {
  id: string;
  type: 'header';
  label: string;
  description?: string;
}

export type LineItemRow = LineItemItem | LineItemHeader;

export interface TemplateConfig {
  primaryColor: string;
  showHsnColumn: boolean;
  showShippingAddress: boolean;
  showBankDetails: boolean;
  watermarkText?: string;
  watermarkImageUrl?: string;
  watermarkOpacity: number; // 5 to 100
}

export interface BankDetailsSnapshot {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifscCode: string;
  branchName?: string;
  upiId?: string;
}

export interface InvoicePaymentRow {
  id: string;
  amount: number;
  paymentDate: string;
  method: string;
  reference?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceDetail {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  currency: string;
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  totalAmount: number;
  amountPaid: number;
  balanceDue: number;
  isIgst: boolean;
  notes?: string;
  terms?: string;
  signatureUrl?: string;
  bankDetails?: BankDetailsSnapshot;
  templateConfig: TemplateConfig;
  items: LineItemRow[];
  payments: InvoicePaymentRow[];
  org: InvoiceOrg;
  client: InvoiceClient;
}
```

---

## 6. Confirmed Calculation Engine

Source: `skyra-erp/src/components/invoices/LineItemGrid.tsx`

```
base = quantity × rate

discount = (discountType === 'PERCENTAGE')
           ? base × (discountAmt / 100)
           : discountAmt

taxable = base - discount
tax = taxable × (taxRate / 100)
rowTotal = round2(taxable + tax)

subtotal = sum(qty × rate)  for item rows  [header rows contribute 0]
totalDiscount = sum(discount)
totalTax = sum(tax)
grandTotal = round2(subtotal - totalDiscount + totalTax)
```

**GST Split Logic** (confirmed from ERP API route):
- If `orgState !== clientPlaceOfSupply` → 100% IGST
- If `orgState === clientPlaceOfSupply` → 50% CGST + 50% SGST

**Confirmed ERP Tax Rates** (`[A]`): `[0, 5, 12, 18, 28]`

---

## 7. StatusBadge Ownership

`@skyra/invoice/components` re-exports `InvoiceStatusBadge` — a pre-configured wrapper
around the generic `StatusBadge` from `@skyra/ui`, configured with the
`INVOICE_STATUS_MAP` (confirmed from `StatusBadge.tsx`).

No implementation duplication. `StatusBadge` component lives in `@skyra/ui` only.

---

## 8. Dual PDF Architecture

| Feature | Client PDF | Server PDF |
|---|---|---|
| Export | `@skyra/invoice/pdf/client` | `@skyra/invoice/pdf/server` |
| Runtime | Browser only | Node.js server only |
| Technology | `html2canvas` (scale:2) + `jsPDF` | Node.js-compatible server-side jsPDF vector/buffer generator |
| Use case | User "Download PDF" click | Email attachment binary buffer |
| Output | Browser download file | Node.js `Buffer` |

---

## 9. Payment Business Rules (Confirmed from ERP)

1. Payment amount cannot exceed outstanding `balanceDue`.
2. Payment amount is permanently locked after recording.
3. Deleting a payment atomically updates invoice balance and status (application owns transaction).
4. `VOIDED` and `PAID` invoices cannot accept payments.
5. Status auto-computes: `PAID` when `balanceDue ≤ 0.009`, else `PARTIAL`.

```typescript
export interface RecordPaymentModalProps {
  isOpen: boolean;
  invoice: InvoiceDetail;
  onClose: () => void;
  onSuccess: () => void;
  onSubmit: (data: {
    amount: number;
    paymentDate: string;
    method: string;
    reference?: string;
    notes?: string;
  }) => Promise<void>;
}
```

---

## 10. Invoice Responsive Architecture

```
Invoice Data / Model / Config / Calculation
                ↓
      @skyra/invoice (shared engine)
         ↙              ↘
  Print/Desktop        Mobile Presentation
  InvoicePreview       [C] ENHANCEMENT
  A4 794px HTML        Scrollable/scaled mobile viewer
  (print fidelity)     (no compromise to A4 renderer)
```

Mobile invoice considerations:
- A4 `InvoicePreview` is placed inside a horizontally scrollable container on mobile.
- A separate lightweight mobile viewer may be specified for `[C]` enhancement.
- Invoice Builder (3-pane) adapts to a stacked single-column layout on mobile.
- Invoice data, calculations, and config always remain shared.

---

## 11. Eight Configuration-Driven Showcase Designs

All 8 showcase designs are rendered by the single `InvoicePreview` component,
driven by different `TemplateConfig` and `InvoiceConfig` values.
They are NOT separate component implementations.

1. **Standard Professional** — Full metadata, bank snapshot, CGST/SGST tax breakdown.
2. **Minimalist Modern** — No HSN, no watermark, clean typography.
3. **Detailed GST Tax Invoice** — Place of Supply, GSTINs, HSN/SAC, 100% IGST.
4. **Service and Consulting Invoice** — Hourly/daily billing, section grouping headers.
5. **Product and Retail Invoice** — High-density SKU layout, mixed tax rates.
6. **Invoice with Payment Ledger** — Payment history table, balance due, PARTIAL badge.
7. **Watermark and Executive Signature** — Background watermark + signatory block.
8. **Dark Mode Workspace Preview** — Dark application chrome, light A4 document fidelity.

---

## 12. Interactive Invoice Builder (3-Pane)

```
+-----------------------+-------------------+------------------+
| LEFT                  | CENTER            | RIGHT            |
| Configuration Controls| Live A4 Preview   | Computed Summary |
|                       |                   |                  |
| Organization          | InvoicePreview    | JSON State       |
| Customer/Client       | component         | Subtotal         |
| Invoice Number        | rendered in real  | Discount Total   |
| Issue / Due Date      | time from LEFT    | Tax Breakdown    |
| Currency              | panel state       | Grand Total      |
| Tax Mode              |                   | AmountInWords    |
| Tax Rate              |                   | Validation State |
| Discount              |                   |                  |
| Line Items            |                   |                  |
| HSN/SAC               |                   |                  |
| Bank Details          |                   |                  |
| Signature             |                   |                  |
| Watermark             |                   |                  |
| Template / Color      |                   |                  |
| Notes / Terms         |                   |                  |
+-----------------------+-------------------+------------------+
```

On mobile: 3-pane collapses to vertical tabs (Config, Preview, Summary).

---

*End of Reusable Invoice System Specification v2.1.0 — Awaiting formal approval.*


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

## 11. Invoice Package Governance

`@skyra/invoice` follows the same Platform API, security, documentation, styling-isolation, accessibility, responsive, and versioning rules as every other reusable package.

Invoice rendering must not introduce application-global CSS. Print/document styles are scoped to the invoice document and must not alter the consuming application's global page styling.

The package remains callback-driven: persistence, authentication, organization ownership, storage credentials, email delivery, and application transactions remain outside the reusable package.

The Dashboard must document invoice configuration, calculation behavior, UI components, PDF runtimes, payment adapter contracts, accessibility, responsive behavior, and migration/version information when the invoice package becomes active.
