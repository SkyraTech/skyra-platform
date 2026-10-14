import assert from 'node:assert/strict';
import { chromium, expect as playwrightExpect } from '@playwright/test';
import axe from 'axe-core';

// Explicit server selection: production 3001, dev 3002, workspace Playwright 3006.
// Set DASHBOARD_BASE_URL before invoking this script. It never starts a server or updates snapshots.
assert.ok(process.env.DASHBOARD_BASE_URL, 'Set DASHBOARD_BASE_URL explicitly');
const base = new URL(process.env.DASHBOARD_BASE_URL);
assert.ok(['http:', 'https:'].includes(base.protocol));
assert.equal(base.pathname, '/', 'Use a base URL without a route');
const expect = playwrightExpect.configure({ timeout: 15000 });

async function run() {
  const browser = await chromium.launch();
  const failures = [];
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const check = async (name, action) => {
      try { await action(); console.log(`PASS: ${name}`); }
      catch (error) { failures.push(name); console.error(`FAIL: ${name}\n${error.stack}`); }
    };
    const visit = async route => {
      const response = await page.goto(new URL(route, base).href, { waitUntil: 'load' });
      assert.equal(response?.status(), 200, route);
      assert.equal(new URL(page.url()).pathname, route, `Unexpected redirect: ${route}`);
      await expect(page.locator('h1').first()).toBeVisible();
    };
    const cards = page.locator('.showcase-card');
    const filter = name => page.locator('.filter-pill').filter({ hasText: name });
    const active = page.locator('.skyra-sidebar-item[href="/ui-components"]');
    let routes = [];
    await check('catalogue, actions and sidebar', async () => {
      await visit('/ui-components');
      await expect(page.locator('h1')).toHaveText('UI Component Playground');
      await expect(cards).toHaveCount(27);
      const group = page.getByRole('region', { name: 'Playground & Workbenches', exact: true });
      await expect(group.locator('a')).toHaveCount(1);
      await expect(group.locator('a')).toHaveText('UI Playground');
      await expect(page.locator('.skyra-sidebar-item[href="/components"]')).toBeVisible();
      await expect(active).toHaveAttribute('data-active', 'true');
      for (const card of await cards.all()) {
        const actions = card.locator('.card-actions-bar > *');
        await expect(actions).toHaveCount(2);
        await expect(actions.nth(0)).toHaveText('Docs');
        await expect(actions.nth(1)).toHaveText('Showcase');
        assert.ok((await actions.nth(0).boundingBox()).x < (await actions.nth(1).boundingBox()).x);
      }
      await expect(page.locator('.card-docs-btn[aria-disabled="true"]')).toHaveCount(9);
      await expect(page.locator('.card-showcase-btn[aria-disabled="true"]')).toHaveCount(6);
      for (const disabled of await page.locator('.card-action-disabled').all()) {
        await expect(disabled).toBeVisible();
        assert.equal(await disabled.getAttribute('href'), null);
        assert.equal(await disabled.evaluate(el => el.tabIndex), -1);
        assert.equal(await disabled.evaluate(el => getComputedStyle(el).cursor), 'not-allowed');
        assert.ok(await disabled.evaluate(el => Number(getComputedStyle(el).opacity) < 1));
      }
      routes = await page.locator('.card-actions-bar a').evaluateAll(links => [...new Set(links.map(a => a.getAttribute('href')))]);
      assert.ok(routes.length);
    });
    await check('search, category combinations and keyboard', async () => {
      await visit('/ui-components');
      for (const [name, count] of [['Dedicated Workbenches', 5], ['Interactive Showcases', 16], ['Documentation', 6], ['All', 27]]) {
        await filter(name).click(); await expect(cards).toHaveCount(count);
      }
      const search = page.locator('#playground-search-input');
      await search.fill('tabs'); await expect(cards).toHaveCount(1);
      await filter('Dedicated Workbenches').click(); await expect(cards).toHaveCount(0);
      await page.getByRole('button', { name: 'Reset Filters' }).click(); await expect(cards).toHaveCount(27);
      // Both descriptions mention pagination; this verifies description matching too.
      await search.fill('pagination'); await expect(cards).toHaveCount(2);
      await expect(cards.locator('.card-title')).toHaveText(['Pagination', 'Data Table Grid']);
      await search.fill('');
      await filter('Dedicated Workbenches').focus(); await page.keyboard.press('Enter'); await expect(cards).toHaveCount(5);
    });
    await check('all catalogue routes and documentation breadcrumbs', async () => {
      assert.ok(routes.length, 'Route discovery did not complete');
      for (const route of routes) {
        await visit(route);
        for (const href of await page.locator('nav[aria-label="Breadcrumb"] a').evaluateAll(links => links.map(a => a.getAttribute('href')))) {
          assert.equal((await page.request.get(new URL(href, base).href)).status(), 200, `Breadcrumb: ${href}`);
        }
      }
    });
    for (const [name, route, title, tag] of [
      ['Tabs', '/ui-components/tabs', 'Tabs Component Showcase', 'skyra-tabs'],
      ['Accordion', '/ui-components/accordion', 'Accordion Component Showcase', 'skyra-accordion'],
    ]) await check(`${name} direct/internal links and history`, async () => {
      await visit('/ui-components');
      const card = cards.filter({ has: page.locator('.card-title', { hasText: new RegExp(`^${name}$`) }) });
      await card.getByRole('link', { name: 'Showcase' }).focus(); await page.keyboard.press('Enter');
      await expect(page).toHaveURL(new URL(route, base).href);
      await expect(page.locator('h1')).toHaveText(title);
      await expect(page.locator(tag).first()).toBeVisible();
      await expect(active).toHaveAttribute('data-active', 'true');
      await page.goBack(); await expect(cards).toHaveCount(27);
      await page.goForward(); await expect(page.locator('h1')).toHaveText(title);
      await page.getByRole('link', { name: 'Back to UI Components' }).click(); await expect(cards).toHaveCount(27);
      await visit(route); await expect(page.locator('h1')).toHaveText(title);
    });
    for (const route of ['/qr-code', '/data-table', '/pdf-viewer', '/print', '/export']) await check(`workbench ${route}`, async () => {
      await visit(route); await expect(active).toHaveAttribute('data-active', 'true');
      if (route === '/qr-code') {
        await expect(page.locator('.qr-preview-stage skyra-tech-qr-code svg')).toBeVisible();
        await expect(page.locator('body')).not.toContainText('Generating Print Preview...');
      }
      await page.getByRole('link', { name: 'Back to UI Playground', exact: true }).click(); await expect(cards).toHaveCount(27);
    });
    await check('live arena', async () => {
      await visit('/ui-components');
      await page.getByRole('button', { name: 'Pill Variant', exact: true }).click();
      await expect(page.locator('.arena-render-box skyra-tabs')).toHaveAttribute('variant', 'pill');
      await page.locator('.arena-tab-btn').filter({ hasText: 'Switch' }).click();
      await page.getByRole('button', { name: 'Toggle Switch' }).click();
      await expect(page.locator('.status-indicator')).toContainText('TRUE');
      await page.locator('.arena-tab-btn').filter({ hasText: 'Accordion' }).click();
      await expect(page.locator('.arena-render-box skyra-accordion')).toBeVisible();
    });
    await check('pagination interaction and styling', async () => {
      await visit('/ui-components/pagination');
      const links = page.locator('.skyra-pagination-link');
      await expect(links.first()).toBeVisible();
      assert.notEqual(await links.first().evaluate(el => getComputedStyle(el).borderRadius), '0px');
      await links.filter({ hasText: /^2$/ }).first().click();
      await expect(page.getByText('Active Page:', { exact: false }).first()).toContainText('2 of 5');
    });
    for (const theme of ['light', 'dark']) for (const width of [320, 375, 768, 1024, 1440, 1536]) await check(`${theme} ${width}px layout and axe`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(value => localStorage.setItem('skyra_theme', value), theme);
      await visit('/ui-components');
      await expect(page.locator('html')).toHaveClass(theme === 'dark' ? /dark/ : /^(?!.*\bdark\b).*$/);
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 2), 'Horizontal overflow');
      await page.evaluate(() => document.fonts.ready);
      await page.addScriptTag({ content: axe.source });
      const result = await page.evaluate(async () => window.axe.run(document.querySelector('.qr-playground-root')));
      assert.ok(Array.isArray(result.violations), 'Invalid axe result');
      assert.ok(result.passes.length > 0, 'No axe rules executed');
      assert.deepEqual(result.violations.map(v => ({ id: v.id, nodes: v.nodes.map(n => n.target) })), [], 'Accessibility violations');
    });
    await check('browser runtime errors', async () => assert.deepEqual([...new Set(errors)], []));
    assert.deepEqual(failures, [], `${failures.length} verification groups failed`);
  } finally { await browser.close(); }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
