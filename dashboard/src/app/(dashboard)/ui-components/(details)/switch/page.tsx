'use client';

import React, { useState } from 'react';
import '@skyra-tech-platform/switch';
import { DemoSection, DemoBlock } from '@/components/demos/DemoSection';

export default function SwitchShowcasePage() {
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [compactChecked, setCompactChecked] = useState(true);
  const [labeledChecked, setLabeledChecked] = useState(true);
  const [iconChecked, setIconChecked] = useState(true);
  const [outlineChecked, setOutlineChecked] = useState(false);

  const [sizeSm, setSizeSm] = useState(true);
  const [sizeMd, setSizeMd] = useState(true);
  const [sizeLg, setSizeLg] = useState(false);

  const [loadingState, setLoadingState] = useState(true);
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState(false);

  return (
    <div className="dash-page" style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', margin: 0 }}>
          Switch & Toggle Showcase
        </h1>
        <p style={{ color: 'var(--skyra-text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
          Framework-independent binary toggle controls supporting 5 visual variants, 3 size scales, spinner thumb loading, disabled, read-only, and error validation states.
        </p>
      </div>

      {/* 1. VARIANTS */}
      <DemoSection
        title="1. Design Variants"
        desc="5 visual styling variants tailored for distinct application contexts and visual density requirements."
        erpSource="@skyra-tech-platform/switch"
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Default & Compact">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <skyra-tech-switch
                label="Default Variant"
                helper-text="Standard switch with ambient hover transition"
                checked={airplaneMode}
                onChange={(e: any) => setAirplaneMode(e.target.checked)}
                suppressHydrationWarning
              />
              <skyra-tech-switch
                label="Compact Variant"
                variant="compact"
                helper-text="Reduced track width for dense data-grid toolbars"
                checked={compactChecked}
                onChange={(e: any) => setCompactChecked(e.target.checked)}
                suppressHydrationWarning
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Labeled & Icon & Outline">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <skyra-tech-switch
                label="Labeled Variant"
                variant="labeled"
                checked={labeledChecked}
                onChange={(e: any) => setLabeledChecked(e.target.checked)}
                suppressHydrationWarning
              />
              <skyra-tech-switch
                label="Icon Variant"
                variant="icon"
                checked={iconChecked}
                onChange={(e: any) => setIconChecked(e.target.checked)}
                suppressHydrationWarning
              />
              <skyra-tech-switch
                label="Outline Variant"
                variant="outline"
                checked={outlineChecked}
                onChange={(e: any) => setOutlineChecked(e.target.checked)}
                suppressHydrationWarning
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 2. SIZES */}
      <DemoSection
        title="2. Size Hierarchy"
        desc="Proportional size tokens ensuring touch-target compliance on mobile while maintaining compact UI density on desktop."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Small (sm)">
            <skyra-tech-switch
              label="Small Toggle (sm)"
              size="sm"
              checked={sizeSm}
              onChange={(e: any) => setSizeSm(e.target.checked)}
              suppressHydrationWarning
            />
          </DemoBlock>

          <DemoBlock title="Medium (md - Default)">
            <skyra-tech-switch
              label="Medium Toggle (md)"
              size="md"
              checked={sizeMd}
              onChange={(e: any) => setSizeMd(e.target.checked)}
              suppressHydrationWarning
            />
          </DemoBlock>

          <DemoBlock title="Large (lg)">
            <skyra-tech-switch
              label="Large Toggle (lg)"
              size="lg"
              checked={sizeLg}
              onChange={(e: any) => setSizeLg(e.target.checked)}
              suppressHydrationWarning
            />
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 3. STATES */}
      <DemoSection
        title="3. Interactive & Validation States"
        desc="States including loading spinners, disabled interaction, read-only display, and form validation error messaging."
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          <DemoBlock title="Loading & Read-Only">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <skyra-tech-switch
                label="Async Operation in Progress"
                loading={loadingState}
                checked={loadingState}
                helper-text="Spinner displayed inside switch thumb"
                suppressHydrationWarning
              />
              <button
                type="button"
                className="arena-control-pill"
                onClick={() => setLoadingState(!loadingState)}
                style={{ alignSelf: 'flex-start', padding: '0.375rem 0.75rem', borderRadius: '6px', border: '1px solid var(--skyra-border)', background: 'var(--skyra-surface)', cursor: 'pointer', fontSize: '0.8125rem' }}
              >
                Toggle Loading State
              </button>
              <skyra-tech-switch
                label="Read-Only Setting"
                readOnly
                checked
                helper-text="Focusable for assistive technology but values are immutable"
                suppressHydrationWarning
              />
            </div>
          </DemoBlock>

          <DemoBlock title="Disabled & Error States">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
              <skyra-tech-switch
                label="Disabled Unchecked"
                disabled
                suppressHydrationWarning
              />
              <skyra-tech-switch
                label="Disabled Checked"
                disabled
                checked
                suppressHydrationWarning
              />
              <skyra-tech-switch
                label="Required Policy Agreement"
                error="You must accept the security policy to proceed."
                suppressHydrationWarning
              />
            </div>
          </DemoBlock>
        </div>
      </DemoSection>

      {/* 4. REAL-WORLD SETTINGS PANEL */}
      <DemoSection
        title="4. Live Settings Panel Example"
        desc="Composite configuration card showcasing realistic application preferences."
      >
        <DemoBlock title="Security Preferences">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '640px' }}>
            <skyra-tech-switch
              label="Enforce Multi-Factor Authentication (MFA)"
              helper-text="Require biometric or TOTP authentication on every session logon"
              checked={twoFactor}
              onChange={(e: any) => setTwoFactor(e.target.checked)}
              suppressHydrationWarning
            />
            <skyra-tech-switch
              label="Automatic Session Timeout (15 mins)"
              helper-text="Automatically terminate background sessions after inactivity"
              checked={sessionTimeout}
              onChange={(e: any) => setSessionTimeout(e.target.checked)}
              suppressHydrationWarning
            />
            <skyra-tech-switch
              label="Enterprise IP Allowlist Restriction"
              helper-text="Locked by organization administrator"
              disabled
              checked
              suppressHydrationWarning
            />
          </div>
        </DemoBlock>
      </DemoSection>
    </div>
  );
}
