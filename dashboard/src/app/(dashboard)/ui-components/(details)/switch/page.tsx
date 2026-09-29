'use client';

import React, { useState } from 'react';
import { Switch } from '@skyra/ui';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function SwitchShowcasePage() {
  const [swDefault, setSwDefault] = useState(true);
  const [swCompact, setSwCompact] = useState(false);
  const [swLabeled, setSwLabeled] = useState(true);
  const [swIcon, setSwIcon] = useState(true);
  const [swOutline, setSwOutline] = useState(false);

  const [sizeSm, setSizeSm] = useState(true);
  const [sizeMd, setSizeMd] = useState(true);
  const [sizeLg, setSizeLg] = useState(true);

  const [loadingSw, setLoadingSw] = useState(true);
  const [errorSw, setErrorSw] = useState(false);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Switch &amp; Toggle Controls
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Accessible binary on/off switches featuring 5 design variants (default, compact, labeled, icon, outline), 3 sizes (sm, md, lg), loading spinner thumb, error, and disabled states.
        </p>
      </div>

      {/* 1. Design Variants */}
      <DemoSection title="1. Switch Design Variants" desc="Five distinct design variants tailored for forms, compact tables, and enterprise settings." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Default, Compact &amp; Labeled">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Switch
                label="Default Switch"
                description="Standard enterprise toggle with smooth slider animation"
                checked={swDefault}
                onChange={setSwDefault}
                variant="default"
              />
              <Switch
                label="Compact Table Switch"
                description="Minimal footprint optimized for data table cells and dense toolbars"
                checked={swCompact}
                onChange={setSwCompact}
                variant="compact"
              />
              <Switch
                label="Labeled Mode (ON/OFF text inside track)"
                checked={swLabeled}
                onChange={setSwLabeled}
                variant="labeled"
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Icon &amp; Outline Modes">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Switch
                label="Icon Mode (Check / Cross in thumb)"
                description="Visual glyph inside the thumb communicating state (built-in)"
                checked={swIcon}
                onChange={setSwIcon}
                variant="icon"
              />
              <Switch
                label="Outline / Minimal Mode"
                description="Clean bordered style for subtle secondary settings"
                checked={swOutline}
                onChange={setSwOutline}
                variant="outline"
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. Size Hierarchy & States */}
      <DemoSection title="2. Size Hierarchy &amp; Specialized States" desc="Standard sm, md, and lg sizes alongside loading and error feedback states." erpSource="Platform Foundation">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Sizes (sm, md, lg)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Switch label="Small Size (sm)" size="sm" checked={sizeSm} onChange={setSizeSm} />
              <Switch label="Medium Size (md - Standard)" size="md" checked={sizeMd} onChange={setSizeMd} />
              <Switch label="Large Size (lg)" size="lg" checked={sizeLg} onChange={setSizeLg} />
            </div>
          </DemoBlock>

          <DemoBlock title="Loading, Disabled &amp; Error States">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <Switch
                label="Loading / Syncing Switch"
                description="Micro-spinner displayed inside thumb during async transition"
                checked={loadingSw}
                onChange={setLoadingSw}
                loading
              />
              <Switch
                label="Enterprise Audit Logging (Disabled)"
                description="Requires Organization Admin permissions"
                checked={true}
                disabled
              />
              <Switch
                label="Maintenance Bypass"
                checked={errorSw}
                onChange={setErrorSw}
                error="Activating bypass mode violates production compliance rule SEC-402"
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
          <div><strong>1. Name:</strong> Switch</div>
          <div><strong>2. Package:</strong> <code>@skyra/ui</code></div>
          <div><strong>3. Classification:</strong> [C] Platform UI Primitive</div>
          <div><strong>4. Description:</strong> Accessible binary on/off switch with 5 design variants and 3 sizes</div>
          <div><strong>5. Rationale:</strong> Instant setting toggling without requiring form submission</div>
          <div><strong>6. When to Use:</strong> Feature flags, notification preferences, real-time toggles</div>
          <div><strong>7. When NOT to Use:</strong> Multiple selections in forms (use Checkbox / CheckboxGroup)</div>
          <div><strong>8. Live Preview:</strong> Interactive demos rendered above</div>
          <div><strong>9. Interactive Controls:</strong> Click and Spacebar toggle</div>
          <div><strong>10. Variants:</strong> default, compact, labeled, icon, outline</div>
          <div><strong>11. Sizes:</strong> sm (32px track), md (40px track), lg (48px track) with 44px hit targets</div>
          <div><strong>12. States:</strong> on, off, loading, disabled, error, focused</div>
          <div><strong>13. Props/API:</strong> <code>SwitchProps</code></div>
          <div><strong>14. Events:</strong> <code>onChange(checked: boolean)</code></div>
          <div><strong>15. Slots/Children:</strong> Label, description, error message, custom icons</div>
          <div><strong>16. Accessibility:</strong> <code>role=&quot;switch&quot;</code>, <code>aria-checked</code>, label linkage</div>
          <div><strong>17. Keyboard:</strong> Spacebar and Enter to toggle, Tab to focus</div>
          <div><strong>18. Responsive:</strong> Fluid label wrapping preserving switch target position</div>
          <div><strong>19. Dark Mode:</strong> High contrast slider thumb &amp; calibrated active brand background</div>
          <div><strong>20. Code:</strong> Zero application persistence logic</div>
          <div><strong>21. Do/Don&apos;t:</strong> Don&apos;t use as a batch selection checkbox inside tabular grids</div>
          <div><strong>22. Related:</strong> Checkbox, Radio, DynamicSelect</div>
          <div><strong>23. ERP Source:</strong> ERP Settings &amp; Preferences modules</div>
          <div><strong>24. Testing:</strong> 5 unit test suites covering keyboard, variants, and role semantics</div>
        </div>
      </div>
    </div>
  );
}
