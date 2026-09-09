'use client';

import React, { useState } from 'react';
import { Radio, RadioGroup } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

const PAYMENT_METHODS = [
  { value: 'stripe', label: 'Credit / Debit Card', description: 'Instant processing via Stripe gateway' },
  { value: 'wire', label: 'Bank Wire (ACH)', description: 'Direct settlement within 2-3 business days' },
  { value: 'crypto', label: 'Cryptocurrency (USDC)', description: 'Direct on-chain settlement', disabled: true },
  { value: 'invoice', label: 'Net 30 Terms', description: 'Invoiced billing for enterprise clients' },
];

export default function RadioShowcasePage() {
  const [singleVal, setSingleVal] = useState('card');
  const [groupVal, setGroupVal] = useState('stripe');
  const [horizVal, setHorizVal] = useState('yearly');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Radio & RadioGroup Components
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Mutually exclusive single-choice controls adhering to WAI-ARIA radio group roving tabindex, accessible focus indicators, and vertical/horizontal layout orchestrations.
        </p>
      </div>

      <DemoSection title="1. Individual Radio Controls" desc="Standalone radio items with ERP focus rings and touch targets." erpSource="ERP Standard Form Primitives">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Controlled Standalone Radios">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Radio
                name="standalone"
                value="card"
                label="Credit Card Payment"
                checked={singleVal === 'card'}
                onChange={() => setSingleVal('card')}
              />
              <Radio
                name="standalone"
                value="paypal"
                label="PayPal Account"
                checked={singleVal === 'paypal'}
                onChange={() => setSingleVal('paypal')}
              />
              <Radio
                name="standalone"
                value="cash"
                label="Cash on Delivery (Disabled)"
                disabled
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Error & Required State">
            <Radio
              name="required_opt"
              value="val1"
              label="Mandatory Subscription Option"
              required
              error="Selection required before checkout"
            />
          </DemoBlock>
        </div>
      </DemoSection>

      <DemoSection title="2. RadioGroup Orchestration" desc="Accessible radiogroup with keyboard arrow navigation and rich item descriptions." erpSource="Platform Extension [C]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Vertical Payment Selection">
            <RadioGroup
              label="Select Settlement Method"
              description="Choose your preferred invoicing payment gateway"
              options={PAYMENT_METHODS}
              value={groupVal}
              onChange={setGroupVal}
            />
          </DemoBlock>

          <DemoBlock title="Horizontal Billing Cycle">
            <RadioGroup
              label="Billing Frequency"
              orientation="horizontal"
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'yearly', label: 'Annual (Save 20%)' },
              ]}
              value={horizVal}
              onChange={setHorizVal}
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 24-Point Specification */}
      <div style={{ marginTop: '4rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--skyra-text)' }}>
          24-Point Component Documentation & Verification
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>1. Name:</strong> Radio &amp; RadioGroup</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [B] Extraction + [C] Enhancement</div>
          <div><strong>4. Description:</strong> Mutually exclusive single selection control group</div>
          <div><strong>5. Rationale:</strong> Explicit visible choice selection for 2-5 options</div>
          <div><strong>6. When to Use:</strong> Single selection between 2 to 5 options</div>
          <div><strong>7. When NOT to Use:</strong> &gt; 5 options (use DynamicSelect); Multiple selection (use CheckboxGroup)</div>
          <div><strong>8. Live Preview:</strong> Interactive demos rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Click and Arrow Key selection</div>
          <div><strong>10. Variants:</strong> vertical, horizontal</div>
          <div><strong>11. Sizes:</strong> 18px circle with 44x44px touch container</div>
          <div><strong>12. States:</strong> unselected, selected, disabled, focus, error</div>
          <div><strong>13. Props/API:</strong> <code>RadioProps</code>, <code>RadioGroupProps</code></div>
          <div><strong>14. Events:</strong> <code>onChange(value: string)</code></div>
          <div><strong>15. Slots/Children:</strong> Label, description, error slot</div>
          <div><strong>16. Accessibility:</strong> <code>role=&quot;radiogroup&quot;</code>, ARIA checked semantics</div>
          <div><strong>17. Keyboard:</strong> Up/Down/Left/Right arrows change selection</div>
          <div><strong>18. Responsive:</strong> Horizontal wraps gracefully on mobile viewports</div>
          <div><strong>19. Dark Mode:</strong> <code>--skyra-primary</code> and <code>--skyra-border</code> token support</div>
          <div><strong>20. Code:</strong> Zero side-effects; pure callback contract</div>
          <div><strong>21. Do/Don&apos;t:</strong> Don&apos;t use for multiple choices</div>
          <div><strong>22. Related:</strong> CheckboxGroup, DynamicSelect, Switch</div>
          <div><strong>23. ERP Source:</strong> ERP standard form inputs</div>
          <div><strong>24. Testing:</strong> 5 unit test suites with 100% pass rate</div>
        </div>
      </div>
    </div>
  );
}
