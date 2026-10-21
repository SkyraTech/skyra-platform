import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

assert(process.env.DASHBOARD_BASE_URL, 'Set DASHBOARD_BASE_URL');
const base = process.env.DASHBOARD_BASE_URL;
const browser = await chromium.launch();
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const route of ['/docs/pdf-viewer', '/pdf-viewer']) {
    for (const action of ['direct', 'refresh']) {
      const response = action === 'direct' ? await page.goto(new URL(route, base).href) : await page.reload();
      assert.equal(response.status(), 200);
      assert.equal(new URL(page.url()).pathname, route);
      if (route.startsWith('/docs/')) {
        await expect(page.getByRole('heading', { name: 'PDF Viewer', exact: true })).toBeVisible();
        await expect(page.locator('skyra-tech-pdf-viewer')).toHaveCount(0);
        const link = page.getByRole('link', { name: 'Open Interactive Workbench', exact: true }).first();
        await expect(link).toHaveAttribute('href', '/pdf-viewer');
        await link.focus();
        await expect(link).toBeFocused();
      } else {
        await expect(page.locator('skyra-tech-pdf-viewer #pdf-canvas')).toBeVisible({ timeout: 30000 });
        await expect(page.locator('skyra-tech-pdf-viewer .page-info')).toHaveText(/Page\s+1\s+of\s+3/);
      }
      console.log(`PASS ${route} ${action}`);
    }
  }
  await page.goto(new URL('/docs/pdf-viewer', base).href);
  await page.screenshot({ path: '.tmp/f23/docs-light.png', fullPage: true });
  const theme = page.getByRole('button', { name: /Dark Mode/i });
  await theme.click();
  await expect(page.getByRole('button', { name: /Light Mode/i })).toBeVisible();
  await page.screenshot({ path: '.tmp/f23/docs-dark.png', fullPage: true });
  const link = page.getByRole('link', { name: 'Open Interactive Workbench', exact: true }).first();
  await link.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new URL('/pdf-viewer', base).href);
  await expect(page.locator('skyra-tech-pdf-viewer #pdf-canvas')).toBeVisible({ timeout: 30000 });
  await page.goto(new URL('/docs/validation', base).href);
  await expect(page.getByRole('heading', { name: 'Validation', exact: true })).toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(new URL('/docs/pdf-viewer', base).href);
  await expect(page.getByRole('heading', { name: 'PDF Viewer', exact: true })).toBeVisible();
  assert(await page.locator('.pdf-viewer-docs section').first().evaluate(section => section.getBoundingClientRect().width > 250));
  await page.screenshot({ path: '.tmp/f23/docs-mobile.png', fullPage: true });
  assert.deepEqual(errors, []);
  console.log('PASS theme toggle, keyboard Workbench link, existing validation docs, mobile heading and no runtime errors');
} finally { await browser.close(); }
