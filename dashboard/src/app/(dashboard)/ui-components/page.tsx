import React from 'react';
import { ButtonDemo } from '@/components/demos/ButtonDemo';
import { InputDemo } from '@/components/demos/InputDemo';
import { SelectDemo } from '@/components/demos/SelectDemo';
import { BadgeDemo } from '@/components/demos/BadgeDemo';
import { MiscDemo } from '@/components/demos/MiscDemo';

export const metadata = { title: 'UI Components — Skyra Platform Dashboard' };

export default function UIComponentsPage() {
  return (
    <div className="dash-page">
      <h1 style={{ fontFamily: 'var(--skyra-font-display)', fontWeight: 800, fontSize: '1.75rem', color: 'var(--skyra-text)', marginBottom: '0.5rem' }}>
        UI Components Showcase
      </h1>
      <p style={{ color: 'var(--skyra-text-muted)', marginBottom: '3rem', maxWidth: '800px' }}>
        Interactive gallery of the 14 UI primitives from <code>@skyra/ui</code>. 
        All components are extracted from the ERP to guarantee visual fidelity. 
        They support Light/Dark modes natively via <code>@skyra/design-tokens</code>.
      </p>

      <ButtonDemo />
      <InputDemo />
      <SelectDemo />
      <BadgeDemo />
      <MiscDemo />
    </div>
  );
}
