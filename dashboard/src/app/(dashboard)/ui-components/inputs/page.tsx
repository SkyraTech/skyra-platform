'use client';

import React, { useState } from 'react';
import { Input, SearchInput, NumberInput, PasswordInput, Textarea } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';
import { Mail, Globe, Lock } from 'lucide-react';

export default function InputsShowcasePage() {
  const [textVal, setTextVal] = useState('Skyra ERP Integration');
  const [searchVal, setSearchVal] = useState('');
  const [numVal, setNumVal] = useState<number | undefined>(14500);
  const [passVal, setPassVal] = useState('SecretToken2026!');
  const [descVal, setDescVal] = useState('Enterprise Cloud ERP platform UI primitives extension.');

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Text Inputs & Specialized Input System
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Extended input primitives featuring prefix/suffix adornments, clear actions, character limits, password visibility toggles, number steppers, and auto-resizing textareas.
        </p>
      </div>

      <DemoSection title="1. Standard & Adorned Inputs" desc="Standard text inputs with prefix, suffix, clear actions, and character counters." erpSource="ERP Standard Form Inputs">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Prefix & Suffix Adornments">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <Input
                label="Work Email"
                prefix={<Mail size={16} />}
                placeholder="name@company.com"
              />
              <Input
                label="Custom Domain"
                prefix="https://"
                suffix=".skyra.io"
                placeholder="workspace"
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Clear Action & Character Counter">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <Input
                label="Project Title"
                value={textVal}
                onChange={(e) => setTextVal(e.target.value)}
                clearable
                showCount
                maxLength={40}
                description="Clear button appears when input has value"
              />
              <Input
                label="Loading Verification"
                loading
                value="Validating registration domain..."
                readOnly
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      <DemoSection title="2. Specialized Input Primitives" desc="SearchInput with auto-clear, NumberInput with stepper increments, and PasswordInput with reveal toggle." erpSource="Platform Extension [C]">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="SearchInput">
            <SearchInput
              label="Global Enterprise Search"
              placeholder="Search invoices, customers, transactions..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onSearch={(q) => console.log('Search query:', q)}
            />
          </DemoBlock>

          <DemoBlock title="NumberInput">
            <NumberInput
              label="Invoice Subtotal (USD)"
              value={numVal}
              onChange={setNumVal}
              min={0}
              max={1000000}
              step={500}
              prefix="$"
            />
          </DemoBlock>

          <DemoBlock title="PasswordInput">
            <PasswordInput
              label="Account Password"
              value={passVal}
              onChange={(e) => setPassVal(e.target.value)}
              description="Click the eye icon to toggle password visibility"
            />
          </DemoBlock>
        </div>
      </DemoSection>

      <DemoSection title="3. Auto-Resizing Textarea" desc="Multi-line input supporting auto-resize, minRows, maxRows, and character limit indicators." erpSource="ERP Description Inputs">
        <div style={{ width: '100%' }}>
          <DemoBlock title="Auto-Resizing Description Textarea">
            <div style={{ width: '100%' }}>
              <Textarea
                label="Project Scope & Technical Overview"
                placeholder="Type multiple paragraphs to see auto-resize in action..."
                value={descVal}
                onChange={(e) => setDescVal(e.target.value)}
                autoResize
                minRows={3}
                maxRows={8}
                showCount
                maxLength={500}
                description="Automatically expands height as content grows without jumping scrollbars"
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 24-Point Specification */}
      <div style={{ marginTop: '4rem', background: 'var(--skyra-surface)', border: '1px solid var(--skyra-border)', borderRadius: 'var(--skyra-radius-xl)', padding: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--skyra-font-display)', fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--skyra-text)' }}>
          24-Point Component Documentation & Verification
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', fontSize: '0.85rem' }}>
          <div><strong>1. Name:</strong> Input, SearchInput, NumberInput, PasswordInput, Textarea</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [B] Extraction + [C] Enhancement</div>
          <div><strong>4. Description:</strong> Suite of accessible, adorned single &amp; multi-line text controls</div>
          <div><strong>5. Rationale:</strong> Standardized typography, border radius, and ERP focus rings</div>
          <div><strong>6. When to Use:</strong> All user text entry, password, numeric, search inputs</div>
          <div><strong>7. When NOT to Use:</strong> Single selection choices (use DynamicSelect/RadioGroup)</div>
          <div><strong>8. Live Preview:</strong> Interactive demos rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Clear button, stepper arrows, reveal toggle</div>
          <div><strong>10. Variants:</strong> text, search, password, number, textarea</div>
          <div><strong>11. Sizes:</strong> Standard 42px height matching ERP layout grid</div>
          <div><strong>12. States:</strong> normal, hover, focus, disabled, readonly, error, loading</div>
          <div><strong>13. Props/API:</strong> <code>InputProps</code>, <code>TextareaProps</code>, <code>NumberInputProps</code></div>
          <div><strong>14. Events:</strong> <code>onChange</code>, <code>onClear</code>, <code>onSearch</code></div>
          <div><strong>15. Slots/Children:</strong> Prefix, Suffix, Helper text, Error</div>
          <div><strong>16. Accessibility:</strong> Explicit label linking (<code>id</code> / <code>htmlFor</code>), ARIA describedby</div>
          <div><strong>17. Keyboard:</strong> Standard text editing, Enter to submit, Arrow keys in NumberInput</div>
          <div><strong>18. Responsive:</strong> 100% width fluid scaling across all breakpoints</div>
          <div><strong>19. Dark Mode:</strong> <code>--skyra-surface</code>, <code>--skyra-border</code> token alignment</div>
          <div><strong>20. Code:</strong> Zero application persistence or business logic</div>
          <div><strong>21. Do/Don&apos;t:</strong> Don&apos;t hardcode widths; let container dictate dimensions</div>
          <div><strong>22. Related:</strong> DateField, DynamicSelect, DynamicForm</div>
          <div><strong>23. ERP Source:</strong> <code>DynamicForm.module.css</code> &amp; ERP input tokens</div>
          <div><strong>24. Testing:</strong> 6 unit test suites with 100% pass rate</div>
        </div>
      </div>
    </div>
  );
}
