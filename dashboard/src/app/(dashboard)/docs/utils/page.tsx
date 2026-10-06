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
  { id: 'overview',       label: 'Overview' },
  { id: 'installation',   label: 'Installation' },
  { id: 'currency',       label: 'Currency' },
  { id: 'date',           label: 'Date & Time' },
  { id: 'string',         label: 'String' },
  { id: 'shortcut',       label: 'Keyboard Shortcuts' },
  { id: 'command',        label: 'Command Search' },
];

const API_TABLE_STYLE: React.CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '0.8125rem',
  marginTop: '1rem',
};

const TH_STYLE: React.CSSProperties = {
  textAlign: 'left',
  padding: '0.625rem 1rem',
  color: 'var(--skyra-text-muted)',
  fontFamily: 'var(--skyra-font-body)',
  fontWeight: 600,
  fontSize: '0.75rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  background: 'var(--skyra-bg-muted)',
  borderBottom: '1px solid var(--skyra-border)',
};

const TD_STYLE: React.CSSProperties = {
  padding: '0.625rem 1rem',
  borderBottom: '1px solid var(--skyra-border)',
  color: 'var(--skyra-text-muted)',
  verticalAlign: 'top',
};

const CODE_STYLE: React.CSSProperties = {
  fontFamily: 'var(--skyra-font-mono)',
  color: 'var(--skyra-text)',
  fontSize: '0.8125rem',
};

function ApiTable({ rows }: { rows: { fn: string; signature: string; returns: string; desc: string }[] }) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--skyra-radius-md)', border: '1px solid var(--skyra-border)' }}>
      <table style={API_TABLE_STYLE}>
        <thead>
          <tr>
            <th style={TH_STYLE}>Function</th>
            <th style={TH_STYLE}>Signature</th>
            <th style={TH_STYLE}>Returns</th>
            <th style={TH_STYLE}>Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.fn} style={{ background: i % 2 === 0 ? 'var(--skyra-surface)' : 'var(--skyra-bg-muted)' }}>
              <td style={TD_STYLE}><code style={CODE_STYLE}>{r.fn}</code></td>
              <td style={TD_STYLE}><code style={{ ...CODE_STYLE, fontSize: '0.75rem', color: 'var(--skyra-text-muted)' }}>{r.signature}</code></td>
              <td style={TD_STYLE}><code style={CODE_STYLE}>{r.returns}</code></td>
              <td style={{ ...TD_STYLE, fontFamily: 'var(--skyra-font-body)' }}>{r.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function UtilsDocsPage() {
  return (
    <DocsLayout toc={TOC}>
      <DocsHeader
        title="Utils"
        description="Runtime-neutral utility helpers for currency formatting, date manipulation, string transformation, keyboard shortcut parsing, and command search. Zero DOM, zero React, zero browser dependencies."
        breadcrumbs={[
          { label: 'Packages', href: '/packages' },
          { label: 'utils', href: '/packages/utils' },
          { label: 'Documentation' },
        ]}
        badges={[
          { label: 'stable', variant: 'stable' },
          { label: 'runtime-neutral', variant: 'tech' },
        ]}
      />

      <PackageMeta
        packageName="@skyra-tech-platform/utils"
        type="TypeScript Library"
        version="0.1.0"
      />

      {/* Overview */}
      <section id="overview" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="overview" level={2}>Overview</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          <code>@skyra-tech-platform/utils</code> provides five modules of pure TypeScript utilities:
        </p>
        <ul style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.8, paddingLeft: '1.5rem' }}>
          <li><strong>currency</strong> — locale-aware formatting, money math, and amount-in-words</li>
          <li><strong>date</strong> — format, relative time, date arithmetic</li>
          <li><strong>string</strong> — truncation, slugification, masking, initials</li>
          <li><strong>shortcut</strong> — keyboard shortcut parsing, matching, formatting</li>
          <li><strong>command</strong> — deterministic command palette search with scoring</li>
        </ul>
        <Callout type="info" title="Runtime safe">
          All modules are safe for Node.js, edge runtimes, and future React Native / Expo targets. They have zero external runtime dependencies.
        </Callout>
      </section>

      {/* Installation */}
      <section id="installation" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="installation" level={2}>Installation</HeadingAnchor>
        <CodeBlock language="bash" code={`pnpm add @skyra-tech-platform/utils`} />
      </section>

      {/* Currency */}
      <section id="currency" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="currency" level={2}>Currency</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Locale-aware currency formatting using <code>Intl.NumberFormat</code>. Supports INR, USD, EUR, GBP, AED, and SGD.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { formatCurrency, roundMoney, parseMoney, amountInWords } from '@skyra-tech-platform/utils';

// Format with locale-aware symbol
formatCurrency(1234.5, 'INR')                     // '₹1,234.50'
formatCurrency(9999, 'USD')                        // '$9,999.00'
formatCurrency(9999, 'USD', { compact: true })     // '$10K'
formatCurrency(9999, 'USD', { showSymbol: false }) // '9,999.00'

// Safe money rounding
roundMoney(1.005)           // 1.01
roundMoney(19.995, 2)       // 20.00

// Parse string/number to safe float
parseMoney('₹1,234.50')     // 1234.50
parseMoney('invalid')        // 0
parseMoney(NaN)              // 0

// Amount in words (invoice display)
amountInWords(1234.50, 'INR')
// 'Rupees One Thousand Two Hundred Thirty Four and Fifty Paise Only'`}
        />
        <ApiTable rows={[
          { fn: 'formatCurrency', signature: '(amount, currency?, options?) => string', returns: 'string', desc: 'Formats a number as a locale-aware currency string. currency defaults to INR.' },
          { fn: 'roundMoney', signature: '(amount, decimalPlaces?) => number', returns: 'number', desc: 'Rounds a monetary value to avoid floating-point artifacts. decimalPlaces defaults to 2.' },
          { fn: 'parseMoney', signature: '(value: unknown) => number', returns: 'number', desc: 'Safely parses a string or number to a finite monetary value. Returns 0 for invalid inputs.' },
          { fn: 'amountInWords', signature: '(amount, currency?) => string', returns: 'string', desc: 'Converts a numeric amount to words. Uses Indian numbering (crore/lakh) for INR.' },
        ]} />
        <div style={{ marginTop: '1rem' }}>
          <strong style={{ fontSize: '0.875rem', color: 'var(--skyra-text)', display: 'block', marginBottom: '0.5rem' }}>Supported Currencies</strong>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {['INR (₹)', 'USD ($)', 'EUR (€)', 'GBP (£)', 'AED', 'SGD (S$)'].map(c => (
              <span key={c} style={{ fontSize: '0.8125rem', fontFamily: 'var(--skyra-font-mono)', background: 'var(--skyra-bg-muted)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-sm)', padding: '0.25rem 0.625rem', color: 'var(--skyra-text)' }}>{c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Date */}
      <section id="date" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="date" level={2}>Date & Time</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Date utilities accept <code>Date | string | number</code> as input (<code>DateInput</code> type alias).
        </p>
        <CodeBlock
          language="typescript"
          code={`import {
  formatDate, formatRelativeTime,
  isPast, isToday, addDays,
  startOfDay, toISODate
} from '@skyra-tech-platform/utils';

formatDate('2024-01-15')                              // '15 Jan 2024'
formatDate('2024-01-15', { format: 'long' })          // '15 January 2024'
formatDate('2024-01-15', { format: 'numeric' })       // '15/01/2024'
formatDate('2024-01-15', { includeTime: true })       // '15 Jan 2024, 12:00 AM'

formatRelativeTime(new Date(Date.now() - 60000))      // '1 minute ago'
formatRelativeTime(new Date(Date.now() + 86400000))   // 'in 1 day'

isPast('2020-01-01')      // true
isToday(new Date())       // true

addDays('2024-01-01', 7) // Date: 2024-01-08
startOfDay('2024-01-15') // Date: 2024-01-15T00:00:00.000Z
toISODate(new Date())    // '2024-01-15'`}
        />
        <ApiTable rows={[
          { fn: 'formatDate', signature: '(input, options?) => string', returns: 'string', desc: "Locale-aware date string. format: 'short'|'medium'|'long'|'numeric'. locale defaults to 'en-IN'." },
          { fn: 'formatRelativeTime', signature: '(input, locale?) => string', returns: 'string', desc: "Returns a relative time string e.g. '3 days ago', 'in 2 hours'." },
          { fn: 'isPast', signature: '(input) => boolean', returns: 'boolean', desc: 'Returns true if the date is before now.' },
          { fn: 'isToday', signature: '(input) => boolean', returns: 'boolean', desc: 'Returns true if the date is the current calendar day.' },
          { fn: 'addDays', signature: '(input, days) => Date', returns: 'Date', desc: 'Adds (or subtracts) days from a date. Returns a new Date.' },
          { fn: 'startOfDay', signature: '(input) => Date', returns: 'Date', desc: 'Returns midnight UTC for the given date.' },
          { fn: 'toISODate', signature: '(input) => string', returns: 'string', desc: "Returns YYYY-MM-DD ISO date string, or '' for invalid input." },
        ]} />
      </section>

      {/* String */}
      <section id="string" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="string" level={2}>String</HeadingAnchor>
        <CodeBlock
          language="typescript"
          code={`import {
  truncate, toTitleCase, toSlug,
  getInitials, capitalize, maskString,
  normalizePhone, isValidEmail,
  simpleId, normalizeWhitespace
} from '@skyra-tech-platform/utils';

truncate('Hello World', 8)            // 'Hello...'
truncate('Hello World', 8, '…')       // 'Hello W…'
toTitleCase('hello world')            // 'Hello World'
toSlug('Hello World!')                // 'hello-world'
toSlug('Skyra Platform v2.0')         // 'skyra-platform-v20'
getInitials('Arjun Kumar')            // 'AK'
getInitials('Sita')                   // 'S'
capitalize('hello')                   // 'Hello'
maskString('1234567890', 4)           // '••••••7890'
normalizePhone('+91-98765 43210')     // '9198765432 10'
isValidEmail('a@b.com')              // true
simpleId('btn')                       // 'btn_abc12345'
normalizeWhitespace('  hello   world  ') // 'hello world'`}
        />
        <ApiTable rows={[
          { fn: 'truncate', signature: '(str, maxLength, suffix?) => string', returns: 'string', desc: "Appends suffix (default '...') when str exceeds maxLength." },
          { fn: 'toTitleCase', signature: '(str) => string', returns: 'string', desc: 'Capitalizes first letter of each space-separated word.' },
          { fn: 'toSlug', signature: '(str) => string', returns: 'string', desc: 'URL-safe slug: lowercase, no accents, spaces to hyphens.' },
          { fn: 'getInitials', signature: '(name, maxChars?) => string', returns: 'string', desc: 'Returns up to maxChars initials from a full name. Default 2.' },
          { fn: 'capitalize', signature: '(str) => string', returns: 'string', desc: 'Uppercases first letter, lowercases rest.' },
          { fn: 'maskString', signature: '(str, visibleEnd?, maskChar?) => string', returns: 'string', desc: 'Masks all but the last N characters. Default mask: •.' },
          { fn: 'normalizePhone', signature: '(phone) => string', returns: 'string', desc: 'Strips all non-digit characters from a phone number.' },
          { fn: 'isValidEmail', signature: '(email) => boolean', returns: 'boolean', desc: 'Basic RFC pattern check. For form validation use @skyra-tech-platform/validation.' },
          { fn: 'simpleId', signature: '(prefix?, length?) => string', returns: 'string', desc: 'Generates a short random alphanumeric ID. Not cryptographically secure.' },
          { fn: 'normalizeWhitespace', signature: '(str) => string', returns: 'string', desc: 'Trims and collapses internal whitespace to single spaces.' },
        ]} />
      </section>

      {/* Shortcut */}
      <section id="shortcut" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="shortcut" level={2}>Keyboard Shortcuts</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Parse, normalize, format, and match keyboard shortcuts. The <code>mod</code> modifier maps to <code>Ctrl</code> on Windows/Linux and <code>⌘</code> on macOS.
        </p>
        <CodeBlock
          language="typescript"
          code={`import {
  parseShortcut, matchesShortcut,
  formatShortcut, normalizeShortcutString
} from '@skyra-tech-platform/utils';

const descriptor = parseShortcut('mod+shift+k');
// { raw: 'mod+shift+k', normalized: 'mod+shift+k',
//   ctrlKey: false, metaKey: false, altKey: false, shiftKey: true,
//   isMod: true, key: 'k' }

// Match against a KeyboardEvent
window.addEventListener('keydown', (e) => {
  if (matchesShortcut(e, 'mod+k')) {
    // Cmd+K on Mac, Ctrl+K on Windows
  }
});

// Human-readable display
formatShortcut('mod+shift+k')             // '⌘⇧K' on Mac, 'Ctrl+Shift+K' on Windows
normalizeShortcutString('ctrl+shift+K')   // 'ctrl+shift+k'`}
        />
        <Callout type="info" title="Platform-aware modifier">
          The <code>mod</code> modifier is platform-aware when running in a browser. In Node.js environments, it always resolves to <code>ctrl</code>.
        </Callout>
      </section>

      {/* Command */}
      <section id="command" style={{ marginBottom: '3rem' }}>
        <HeadingAnchor id="command" level={2}>Command Search</HeadingAnchor>
        <p style={{ color: 'var(--skyra-text-muted)', lineHeight: 1.7, marginBottom: '1rem' }}>
          Deterministic fuzzy search for command palette items. Returns scored and sorted results.
        </p>
        <CodeBlock
          language="typescript"
          code={`import { filterCommands, CommandLike } from '@skyra-tech-platform/utils';

interface MyCommand extends CommandLike {
  action: () => void;
}

const commands: MyCommand[] = [
  { id: 'new-invoice', label: 'New Invoice', keywords: ['create', 'bill'], action: () => {} },
  { id: 'settings',   label: 'Settings',     description: 'Open preferences', action: () => {} },
];

filterCommands(commands, 'inv')
// Returns [{ id: 'new-invoice', ...}] — sorted by score

filterCommands(commands, '')
// Returns all visible commands unchanged`}
        />
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.875rem', lineHeight: 1.7, marginTop: '1rem' }}>
          <strong>Scoring rules:</strong> Exact label match → 100 · Label starts with query → 80 · Word starts with query → 60 · Contains substring → 40 · Keyword starts with → 35 · Description contains → 20.
        </p>
        <ApiTable rows={[
          { fn: 'filterCommands', signature: '<T extends CommandLike>(commands: T[], query: string) => T[]', returns: 'T[]', desc: 'Filters and sorts commands by relevance score. Skips hidden commands. Returns all visible commands when query is empty.' },
        ]} />
      </section>

      <div style={{ borderTop: '1px solid var(--skyra-border)', paddingTop: '2rem', marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/packages/utils" style={{ fontSize: '0.875rem', color: 'var(--skyra-text-muted)', textDecoration: 'none' }}>
          ← Package overview
        </Link>
        <Link href="/docs/validation" style={{ fontSize: '0.875rem', color: 'var(--skyra-primary)', textDecoration: 'none' }}>
          Next: Validation →
        </Link>
      </div>
    </DocsLayout>
  );
}
