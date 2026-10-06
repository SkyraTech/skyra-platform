import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@skyra/ui',
    '@skyra-tech-platform/design-tokens',
    '@skyra/data-table',
    '@skyra/ui',
    '@skyra-tech-platform/dialog',
    '@skyra-tech-platform/switch',
    '@skyra-tech-platform/input',
    '@skyra-tech-platform/textarea',
    '@skyra-tech-platform/checkbox',
    '@skyra-tech-platform/radio',
    '@skyra-tech-platform/button',
    '@skyra-tech-platform/dynamic-select',
    '@skyra-tech-platform/date-time',
    '@skyra-tech-platform/dynamic-form',
  ],
};

export default nextConfig;
