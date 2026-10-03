import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@skyra/ui',
    '@skyra/design-tokens',
    '@skyra/data-table',
    '@skyra/dynamic-form',
    '@skyra/dialogs',
    '@skyra-tech-platform/switch',
    '@skyra-tech-platform/input',
    '@skyra-tech-platform/textarea',
    '@skyra-tech-platform/checkbox',
    '@skyra-tech-platform/radio',
    '@skyra-tech-platform/button',
    '@skyra-tech-platform/dynamic-select',
  ],
};

export default nextConfig;
