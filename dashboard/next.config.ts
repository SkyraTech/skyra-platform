import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@skyra/ui',
    '@skyra/design-tokens',
    '@skyra/data-table',
    '@skyra/dynamic-form',
    '@skyra/dialogs',
  ],
};

export default nextConfig;
