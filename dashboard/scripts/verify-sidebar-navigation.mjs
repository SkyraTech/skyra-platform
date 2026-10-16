import assert from 'node:assert/strict';
import { chromium, expect } from '@playwright/test';

assert.ok(process.env.DASHBOARD_BASE_URL, 'Set DASHBOARD_BASE_URL to an explicit test server');
const base = new URL(process.env.DASHBOARD_BASE_URL);
assert.equal(base.pathname, '/');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1536, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
const sidebar = page.locator('.skyra-sidebar-navigation');
const docs = page.getByRole('region', { name: 'Developer Documentation', exact: true });
const visit = async route => {
  const response = await page.goto(new URL(route, base).href, { waitUntil: 'domcontentloaded' });
  assert.equal(response.status(), 200, route);
  assert.equal(new URL(page.url()).pathname, route);
  await expect(page.locator('h1').first()).toBeVisible();
  await page.waitForFunction(() => {
    const button = document.querySelector('.skyra-sidebar-section-header');
    return button && Object.keys(button).some(key => key.startsWith('__reactProps'));
  });
};
const active = async href => {
  await expect(sidebar.locator('a[data-active="true"]')).toHaveCount(1);
  await expect(sidebar.locator('a[data-active="true"]')).toHaveAttribute('href', href);
};

try {
  await visit('/components');
  const links = await sidebar.locator('a').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  assert.equal(links.length, 12);
  assert.equal(new Set(links).size, links.length);
  await expect(docs.locator('a')).toHaveText(['Components', 'Design System', 'Design Tokens', 'Utility Functions', 'Validation Schemas', 'Data Export Docs']);
  await expect(page.locator('h2')).toHaveText(['Basic Controls', 'Selection', 'Navigation', 'Layout', 'Forms', 'Feedback', 'Data Display', 'Disclosure', 'Overlays', 'Documents', 'Utilities']);
  await expect(page.getByRole('region', { name: 'Playground & Workbenches', exact: true }).locator('a')).toHaveText('UI Playground');
  await expect(page.getByRole('region', { name: 'Quality Tools', exact: true }).locator('a')).toHaveText(['Accessibility Studio', 'Viewport Studio']);
  console.log('PASS: distinct sidebar destinations, precise labels and intact Components categories');

  for (const [route, href] of [
    ['/overview', '/overview'], ['/packages', '/packages'], ['/releases', '/releases'],
    ['/components', '/components'], ['/design-system', '/design-system'], ['/docs/design-tokens', '/docs/design-tokens'],
    ['/docs/utils', '/docs/utils'], ['/docs/validation', '/docs/validation'], ['/docs/data-export', '/docs/data-export'],
    ['/ui-components', '/ui-components'], ['/accessibility', '/accessibility'], ['/responsive', '/responsive'],
    ['/components/utilities/qr', '/components'], ['/components/forms/dynamic-form', '/components'],
    ['/packages/utils', '/packages'], ['/ui-components/popover', '/ui-components'],
  ]) {
    await visit(route); await active(href);
  }
  console.log('PASS: all 12 retained destinations and four nested routes; exactly one correct active link');

  await visit('/components');
  const header = page.getByRole('button', { name: 'Developer Documentation', exact: true });
  await header.focus(); await page.keyboard.press('Enter');
  await expect(header).toHaveAttribute('aria-expanded', 'false');
  await expect(docs).toBeHidden();
  await page.keyboard.press('Space');
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  const utilityLink = docs.getByRole('link', { name: 'Utility Functions', exact: true });
  await utilityLink.focus();
  await page.keyboard.press('Tab');
  await expect(docs.getByRole('link', { name: 'Validation Schemas', exact: true })).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(utilityLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(new URL('/docs/utils', base).href);
  await active('/docs/utils');
  await expect(page.locator('section#currency')).toBeVisible();
  await expect(page.locator('section#shortcut')).toBeVisible();
  console.log('PASS: keyboard section disclosure and utility-reference navigation');

  await header.click();
  await expect(header).toHaveAttribute('aria-expanded', 'false');
  await visit('/docs/validation');
  await expect(header).toHaveAttribute('aria-expanded', 'true');
  await active('/docs/validation');
  console.log('PASS: active documentation section remains expanded on direct nested navigation');

  await page.setViewportSize({ width: 375, height: 812 });
  await visit('/components');
  await page.getByRole('button', { name: 'Toggle Sidebar', exact: true }).click();
  await expect(page.locator('skyra-tech-app-shell')).toHaveAttribute('mobile-open');
  await docs.getByRole('link', { name: 'Utility Functions', exact: true }).click();
  await expect(page).toHaveURL(new URL('/docs/utils', base).href);
  await expect(page.locator('skyra-tech-app-shell')).not.toHaveAttribute('mobile-open');
  console.log('PASS: mobile drawer opens and closes after navigation');

  assert.deepEqual(errors, []);
  console.log('PASS: no browser runtime errors');
} finally {
  await browser.close();
}
