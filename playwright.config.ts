import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Phase 11.1
 * Covers: Visual regression, accessibility, responsive design, dark mode, reduced motion.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [
    ['html'],
    ['list']
  ],
  use: {
    baseURL: 'http://localhost:3006',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: {
    // strict threshold for visual regressions
    toHaveScreenshot: { maxDiffPixelRatio: 0.01 },
  },

  projects: [
    {
      name: 'desktop-light',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        colorScheme: 'light',
      },
    },
    {
      name: 'desktop-dark',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 800 },
        colorScheme: 'dark',
      },
    },
    {
      name: 'mobile-320-light',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 320, height: 568 },
        colorScheme: 'light',
      },
    },
    {
      name: 'tablet-768-dark',
      use: {
        ...devices['iPad Mini'],
        viewport: { width: 768, height: 1024 },
        colorScheme: 'dark',
      },
    },
    {
      name: 'desktop-reduced-motion',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1024, height: 768 },
        colorScheme: 'light',
        reducedMotion: 'reduce',
      },
    }
  ],

  webServer: {
    command: 'pnpm --filter dashboard start --port 3006',
    url: 'http://localhost:3006',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});