'use client';

import React from 'react';
import { DocsLayout } from '../../../../components/docs/DocsLayout';
import { PackageMeta } from '../../../../components/docs/PackageMeta';
import { DocsHeader } from '../../../../components/docs/DocsHeader';
import { CodeBlock } from '../../../../components/docs/CodeBlock';
import { Callout } from '../../../../components/docs/Callout';
import { HeadingAnchor } from '../../../../components/docs/HeadingAnchor';
import Link from 'next/link';

const TOC = [
  { id: 'overview',     label: 'Overview' },
  { id: 'installation', label: 'Installation' },
  { id: 'common',       label: 'Common Schemas' },
  { id: 'org',          label: 'Organisation Schemas' },
  { id: 'usage',        label: 'Usage with React Hook Form' },
];

const TD: React.CSSProperties = {
  padding: '0.625rem 1rem',
  borderBottom: '1px solid var(--skyra-border)',
  color: 'var(--skyra-text-muted)',
  verticalAlign: 'top',
};
const TH: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 1rem',
  background: 'var(--skyra-bg-muted)',
  borderBottom: '1px solid var(--skyra-border)',
  color: 'var(--skyra-text-muted)',
  fontFamily: 'var(--skyra-font-body)',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
};
const MONO: React.CSSProperties = {
  fontFamily: 'var(--skyra-font-mono)',
  fontSize: '0.8125rem',
  color: 'var(--skyra-text)',
};

function SchemaTable({ rows }: { rows: { schema: string; type: string; desc: string }[] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)', marginTop: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
        <thead>
          <tr>
            <th style={TH}>Schema / Export</th>
            <th style={TH}>Zod Type</th>
            <th style={TH}>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.schema} style={{ background: i % 2 === 0 ? 'var(--skyra-surface)' : 'var(--skyra-bg-muted)' }}>
              <td style={TD}><code style={MONO}>{r.schema}</code></td>
              <td style={TD}><code style={{ ...MONO, color: 'var(--skyra-text-muted)' }}>{r.type}</code></td>
              <td style={{ ...TD, fontFamily: 'var(--skyra-font-body)' }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ValidationDocsPage() {
  return (
    <DocsLayout toc={TOC}>
      <DocsHeader
        title="Validation"
        description="Authoritative Zod schemas for the Skyra Platform. Runtime-neutral — zero DOM, zero React, zero browser dependencies. Reusable across React forms, API payloads, and service layers."
        breadcrumbs={[
          { label: 'Packages', href: '/packages' },
          { label: 'validation', href: '/packages/validation' },
          { label: 'Documentation' },
        ]}
        badges={[
          { label: 'stable', variant: 'stable' },
          { label: 'runtime-neutral', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/validation"
        type="TypeScript / Zod"
        version="0.1.0"
      />

      {/* Overview */}
      <section id="overview" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="overview" level={2}>Overview</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          <code>@skyra-tech-platform/validation</code> ships two modules of Zod schemas:
        </p>
        <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
          <li><strong>common</strong> — field-level primitives (email, phone, URL, money amounts, GSTIN, PAN, address)</li>
          <li><strong>org</strong> — document-level schemas (organisation, user profile, client, bank account)</li>
        </ul>
        <Callout type="warning" title="Peer dependency">
          <strong>Peer dependency:</strong> <code>zod ^3.22.0</code> must be installed in the consuming package.
        </Callout>
      </section>

      {/* Installation */}
      <section id="installation" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="installation" level={2}>Installation</HeadingAnchor>
        <CodeBlock language="bash" code={`pnpm add @skyra-tech-platform/validation zod`} />
      </section>

      {/* Common Schemas */}
      <section id="common" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="common" level={2}>Common Schemas</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Field-level primitives exported from <code>@skyra-tech-platform/validation/common</code> (re-exported from the package root).
        </p>
        <CodeBlock
          language="typescript"
          code={`import {
  emailSchema, phoneSchema, urlSchema,
  nameSchema, shortTextSchema, longTextSchema,
  positiveAmountSchema, nonNegativeIntSchema, percentageSchema,
  gstinSchema, panSchema, pinCodeSchema,
  currencyCodeSchema, hexColorSchema, isoDateSchema,
  addressSchema,
  // Type aliases:
  AddressInput
} from '@skyra-tech-platform/validation';

// Parse and validate
emailSchema.parse('user@example.com');      // 'user@example.com' (lowercased + trimmed)
emailSchema.safeParse('not-an-email');       // { success: false, error: ... }

phoneSchema.parse('+91 98765 43210');        // valid
gstinSchema.parse('22AAAAA0000A1Z5');       // valid 15-char GSTIN

// Factory schemas
const titleField = shortTextSchema('Title');   // max 255 chars
const notesField = longTextSchema('Notes', 2000); // max 2000 chars, optional

// Address
const addr: AddressInput = {
  line1: '42 MG Road', city: 'Bangalore',
  state: 'Karnataka', country: 'India', pinCode: '560001',
};
addressSchema.parse(addr); // valid`}
        />
        <SchemaTable rows={[
          { schema: 'emailSchema', type: 'ZodString', desc: 'Valid RFC email, max 254 chars, lowercased and trimmed.' },
          { schema: 'phoneSchema', type: 'ZodString', desc: '7–15 digit phone with optional +, spaces, dashes, parens.' },
          { schema: 'urlSchema', type: 'ZodString (optional)', desc: 'Valid URL or empty string. Max 2048 chars.' },
          { schema: 'nameSchema', type: 'ZodString', desc: 'Non-empty, max 100 chars, trimmed.' },
          { schema: 'shortTextSchema(label)', type: 'ZodString', desc: 'Max 255 chars, trimmed. Factory — accepts optional label.' },
          { schema: 'longTextSchema(label, max)', type: 'ZodString (optional)', desc: 'Max configurable length (default 5000), trimmed, optional.' },
          { schema: 'positiveAmountSchema', type: 'ZodNumber', desc: 'Non-negative finite number (monetary amounts).' },
          { schema: 'nonNegativeIntSchema', type: 'ZodNumber', desc: 'Non-negative whole number.' },
          { schema: 'percentageSchema', type: 'ZodNumber', desc: 'Number between 0 and 100 inclusive.' },
          { schema: 'gstinSchema', type: 'ZodString (optional)', desc: 'Valid 15-character Indian GSTIN or empty string.' },
          { schema: 'panSchema', type: 'ZodString (optional)', desc: 'Valid 10-character Indian PAN or empty string.' },
          { schema: 'pinCodeSchema', type: 'ZodString (optional)', desc: 'Valid 6-digit Indian PIN code or empty string.' },
          { schema: 'currencyCodeSchema', type: "ZodEnum", desc: "One of: 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED' | 'SGD'." },
          { schema: 'hexColorSchema', type: 'ZodString (optional)', desc: 'Valid 3- or 6-character hex color e.g. #FF6B00.' },
          { schema: 'isoDateSchema', type: 'ZodString (optional)', desc: 'YYYY-MM-DD format or empty string.' },
          { schema: 'addressSchema', type: 'ZodObject', desc: 'line1, line2?, city, state, country (all required except line2, pinCode).' },
        ]} />
      </section>

      {/* Org Schemas */}
      <section id="org" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="org" level={2}>Organisation Schemas</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Document-level schemas for cross-product use (ERP, CRM, Billing). Exported from <code>@skyra-tech-platform/validation/org</code>.
        </p>
        <CodeBlock
          language="typescript"
          code={`import {
  orgSchema, OrgInput, OrgUpdateInput,
  userProfileSchema, UserProfileInput,
  clientSchema, ClientInput,
  bankAccountSchema, BankAccountInput,
} from '@skyra-tech-platform/validation';

// Organisation
const org: OrgInput = {
  name: 'Acme Corp',
  email: 'hello@acme.com',
  currency: 'INR',
  gstin: '22AAAAA0000A1Z5',
  // ... other optional fields
};
orgSchema.parse(org);

// Partial update (all fields optional)
const update: OrgUpdateInput = { displayName: 'Acme' };

// User profile
userProfileSchema.parse({ name: 'Arjun', email: 'arjun@acme.com' });

// Client / Contact
clientSchema.parse({ name: 'Client Ltd', currency: 'USD' });

// Bank account (India)
bankAccountSchema.parse({
  bankName: 'HDFC Bank',
  accountName: 'Acme Corp',
  accountNumber: '12345678901234',
  ifscCode: 'HDFC0001234',
});`}
        />
        <SchemaTable rows={[
          { schema: 'orgSchema', type: 'ZodObject → OrgInput', desc: 'Full organisation creation/update schema. name and currency are required.' },
          { schema: 'OrgUpdateInput', type: 'Partial<OrgInput>', desc: 'Partial version of orgSchema — all fields optional for PATCH operations.' },
          { schema: 'userProfileSchema', type: 'ZodObject → UserProfileInput', desc: 'User profile: name (required), email (required), phone?, role?, avatar?.' },
          { schema: 'clientSchema', type: 'ZodObject → ClientInput', desc: 'Client/contact: name (required), email?, phone?, gstin?, pan?, address?, notes?, currency?, paymentTerms?.' },
          { schema: 'bankAccountSchema', type: 'ZodObject → BankAccountInput', desc: 'Bank account: bankName, accountName, accountNumber (required); ifscCode?, upiId?, isDefault?.' },
        ]} />
      </section>

      {/* Usage with RHF */}
      <section id="usage" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="usage" level={2}>Usage with React Hook Form</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          These schemas integrate directly with React Hook Form via <code>@hookform/resolvers/zod</code>:
        </p>
        <CodeBlock
          language="typescript"
          code={`import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { orgSchema, OrgInput } from '@skyra-tech-platform/validation';

function OrgForm() {
  const form = useForm<OrgInput>({
    resolver: zodResolver(orgSchema),
    defaultValues: { name: '', currency: 'INR' },
  });

  return (
    <form onSubmit={form.handleSubmit(console.log)}>
      <input {...form.register('name')} />
      {form.formState.errors.name && (
        <span>{form.formState.errors.name.message}</span>
      )}
      <button type="submit">Save</button>
    </form>
  );
}`}
        />
        <Callout type="info" title="Share validation across the stack">
          The schemas work identically on the server (Node.js API routes) and in the browser. Share validation logic between your frontend forms and your backend handlers without duplication.
        </Callout>
      </section>

      <div style={{ borderTop: '1px solid var(--skyra-border)', paddingTop: '2rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/packages/validation" style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', textDecoration: 'none' }}>
          ← Package overview
        </Link>
        <Link href="/docs/data-export" style={{ fontSize: '0.875rem', color: 'var(--skyra-primary)', textDecoration: 'none' }}>
          Next: Data Export →
        </Link>
      </div>
    </DocsLayout>
  );
}
