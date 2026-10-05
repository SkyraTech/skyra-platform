'use client';

import React from 'react';
import { CodeTabs } from './CodeTabs';

interface InstallCommandProps {
  packageName: string;
}

export function InstallCommand({ packageName }: InstallCommandProps) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--skyra-text)', marginBottom: '1rem', letterSpacing: '-0.01em' }}>
        Install
      </h3>
      <CodeTabs 
        tabs={[
          { label: 'npm', code: `npm install ${packageName}`, language: 'bash' },
          { label: 'pnpm', code: `pnpm add ${packageName}`, language: 'bash' },
          { label: 'yarn', code: `yarn add ${packageName}`, language: 'bash' },
          { label: 'bun', code: `bun add ${packageName}`, language: 'bash' },
        ]}
      />
    </div>
  );
}
