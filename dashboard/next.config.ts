import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@skyra-tech-platform/accordion',
    '@skyra-tech-platform/app-shell',
    '@skyra-tech-platform/badge',
    '@skyra-tech-platform/button',
    '@skyra-tech-platform/checkbox',
    '@skyra-tech-platform/collapsible',
    '@skyra-tech-platform/command-palette',
    '@skyra-tech-platform/context-menu',
    '@skyra-tech-platform/data-export',
    '@skyra-tech-platform/data-table',
    '@skyra-tech-platform/date-time',
    '@skyra-tech-platform/design-tokens',
    '@skyra-tech-platform/dialog',
    '@skyra-tech-platform/drawer',
    '@skyra-tech-platform/dropdown-menu',
    '@skyra-tech-platform/dynamic-form',
    '@skyra-tech-platform/dynamic-select',
    '@skyra-tech-platform/empty-state',
    '@skyra-tech-platform/input',
    '@skyra-tech-platform/loader',
    '@skyra-tech-platform/notification',
    '@skyra-tech-platform/pdf-viewer',
    '@skyra-tech-platform/popover',
    '@skyra-tech-platform/qr',
    '@skyra-tech-platform/radio',
    '@skyra-tech-platform/switch',
    '@skyra-tech-platform/tabs',
    '@skyra-tech-platform/textarea',
    '@skyra-tech-platform/toast',
    '@skyra-tech-platform/utils',
    '@skyra-tech-platform/validation',
  ],
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      {
        source: '/components/qr',
        destination: '/components/utilities/qr',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
