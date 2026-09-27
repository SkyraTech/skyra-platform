import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Platform Interactive Components', () => {
  test('Search Dialog Keyboard Navigation', async ({ page, isMobile }) => {
    // Skip keyboard shortcut test on mobile since Cmd+K is not applicable
    if (isMobile) return;
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for the fonts to be ready
    await page.evaluate(() => document.fonts.ready);
    
    // Focus body to ensure keyboard events are received
    await page.focus('body');
    
    // Press Cmd+K or Ctrl+K to open search dialog
    const modifier = process.platform === 'darwin' ? 'Meta' : 'Control';
    await page.keyboard.press(`${modifier}+k`);
    
    // Wait for the dialog to be visible
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible();
    
    // Check Accessibility of the open dialog
    await injectAxe(page);
    await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: { html: true }
    });

    // Check Visual Regression
    await expect(page).toHaveScreenshot('search-dialog-open.png');
    
    // Test Escape key
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
