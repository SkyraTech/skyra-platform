import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

assert.ok(process.env.DASHBOARD_BASE_URL, 'Set DASHBOARD_BASE_URL explicitly');
const base = new URL(process.env.DASHBOARD_BASE_URL);
assert.equal(base.pathname, '/');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.addInitScript(() => {
  window.cataloguePdfPages = [];
  document.addEventListener('skyra-render-complete', event => window.cataloguePdfPages.push(event.detail.page), true);
});

try {
  const response = await page.goto(new URL('/components', base).href, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200);
  await expect(page.locator('h2')).toHaveText(['Basic Controls', 'Selection', 'Navigation', 'Layout', 'Forms', 'Feedback', 'Data Display', 'Disclosure', 'Overlays', 'Documents', 'Utilities']);
  const cardsPerCategory = await page.locator('h2').evaluateAll(headings => headings.map(heading => heading.parentElement.lastElementChild.children.length));
  assert.deepEqual(cardsPerCategory, [6, 1, 1, 1, 2, 3, 1, 2, 5, 1, 1]);
  await expect(page.getByText('Future components', { exact: true })).toHaveCount(0);
  const qr = page.locator('a[href="/components/utilities/qr"]');
  await expect(qr).toContainText('QR Code');
  const pdf = page.locator('a[href="/pdf-viewer"]');
  await expect(pdf).toHaveCount(1);
  await expect(pdf).toContainText('PDF Viewer');
  await expect(pdf).toContainText('stable');
  await expect(pdf).not.toContainText('planned');
  console.log('PASS: 11 categories/24 cards, implemented PDF link/status, unchanged QR and no generic placeholder');

  await page.waitForFunction(() => {
    const heading = document.querySelector('h1');
    return heading && Object.keys(heading).some(key => key.startsWith('__reactFiber'));
  });
  await pdf.focus(); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new URL('/pdf-viewer', base).href);
  const viewer = page.locator('skyra-tech-pdf-viewer');
  await expect(viewer.locator('#pdf-canvas')).toBeVisible({ timeout: 30000 });
  await page.waitForFunction(() => window.cataloguePdfPages.includes(1), {}, { timeout: 30000 });
  await expect(viewer.locator('.page-info')).toHaveText(/Page\s+1\s+of\s+3/);
  assert(await viewer.locator('#pdf-canvas').evaluate(canvas => canvas.width > 0 && canvas.height > 0));
  console.log('PASS: catalogue keyboard navigation opens existing Workbench and PDF.js renders the real three-page sample');

  await viewer.getByRole('button', { name: 'Zoom in', exact: true }).click();
  await expect(viewer.locator('#btn-zoom-reset')).toHaveText('125%');
  await viewer.getByRole('button', { name: 'Next page', exact: true }).click();
  await page.waitForFunction(() => window.cataloguePdfPages.includes(2), {}, { timeout: 30000 });
  await expect(viewer.locator('.page-info')).toHaveText(/Page\s+2\s+of\s+3/);
  await viewer.getByRole('button', { name: 'Previous page', exact: true }).click();
  await expect(viewer.locator('.page-info')).toHaveText(/Page\s+1\s+of\s+3/);
  const downloadPromise = page.waitForEvent('download');
  await viewer.getByRole('button', { name: 'Download document', exact: true }).click();
  assert((await downloadPromise).suggestedFilename().endsWith('.pdf'));
  console.log('PASS: existing PDF Workbench zoom, actual page rendering/navigation and download');

  await page.getByRole('link', { name: 'Back to UI Playground', exact: true }).click();
  await expect(page.locator('.showcase-card')).toHaveCount(26);
  assert.deepEqual(errors, []);
  console.log('PASS: unchanged Playground return route and no browser runtime errors');
} finally {
  await browser.close();
}
