import React from 'react';
import { docsRegistry } from '../../../docs-system/registry';
import { bootstrapRegistry } from '../../../docs-system/bootstrap';
import PackagesClient from './PackagesClient';

// Initialize the registry for SSR/SSG.
bootstrapRegistry();

export const metadata = { title: 'Packages — Skyra Platform' };

export default function PackagesPage() {
  const packages = docsRegistry.getPackages();

  return <PackagesClient initialPackages={packages} />;
}
