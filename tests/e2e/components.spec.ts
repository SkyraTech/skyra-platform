import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

const testPages = [
  { path: '/packages/ui', name: 'ui-overview' },
  { path: '/packages/data-table', name: 'data-table' },
  { path: '/packages/dynamic-form', name: 'dynamic-form' },
  { path: '/packages/dialogs', name: 'dialogs' },
  { path: '/packages/app-shell', name: 'app-shell' },
  { path: '/packages/qr', name: 'qr' },
];

test.describe('Platform Component Visual and A11y Tests', () => {
  for (const pageInfo of testPages) {
    test(`${pageInfo.name} visual and a11y`, async ({ page }) => {
      // Navigate to the component page on the dashboard
      await page.goto(pageInfo.path);
      
      // Wait for network idle and fonts to load to ensure determinism
      await page.waitForLoadState('networkidle');
      await page.evaluate(() => document.fonts.ready);
      
      // Accessibility Check
      await injectAxe(page);
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: { html: true }
      });
      
      // Visual Regression Check
      await expect(page).toHaveScreenshot(`${pageInfo.name}.png`, { fullPage: true });
    });
  }
});
