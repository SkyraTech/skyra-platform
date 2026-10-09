import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@skyra/ui',
    '@skyra-tech-platform/design-tokens',
    '@skyra/data-table',
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
    '@skyra-tech-platform/tabs',
    '@skyra-tech-platform/toast',
    '@skyra-tech-platform/notification',
    '@skyra-tech-platform/loader',
    '@skyra-tech-platform/accordion',
    '@skyra-tech-platform/collapsible',
  ],
  async redirects() {
    return [
      {
        source: '/ui-components/tabs',
        destination: '/components/navigation/tabs',
        permanent: true,
      },
      {
        source: '/ui-components/accordion',
        destination: '/components/disclosure/accordion',
        permanent: true,
      },
      {
        source: '/ui-components/collapsible',
        destination: '/components/disclosure/collapsible',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
