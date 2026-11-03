import { chromium } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const require = createRequire(path.join(root, 'dashboard', 'package.json'));
const axeCore = require('axe-core');

const BASE_URL = process.env.DASHBOARD_BASE_URL || 'http://localhost:3002';
const screenshotsDir = path.join(root, 'docs', 'dashboard-audit', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1280, height: 800 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const ROUTES = [
  // Platform
  '/overview',
  '/packages',
  '/packages/badge',
  '/packages/drawer',
  '/packages/empty-state',
  '/releases',
  // Documentation
  '/docs/getting-started',
  '/docs/frameworks',
  '/docs/contributing',
  '/components',
  '/design-system',
  '/docs/design-tokens',
  '/docs/utils',
  '/docs/validation',
  '/docs/data-export',
  '/docs/pdf-viewer',
  // Canonical Components
  '/components/basic-controls/badge',
  '/components/basic-controls/button',
  '/components/basic-controls/checkbox',
  '/components/basic-controls/input',
  '/components/basic-controls/radio',
  '/components/basic-controls/switch',
  '/components/basic-controls/textarea',
  '/components/disclosure/accordion',
  '/components/disclosure/collapsible',
  '/components/feedback/empty-state',
  '/components/feedback/loader',
  '/components/feedback/notification',
  '/components/feedback/toast',
  '/components/forms/date-time',
  '/components/forms/dynamic-form',
  '/components/layouts/app-shell',
  '/components/navigation/tabs',
  '/components/overlays/command-palette',
  '/components/overlays/context-menu',
  '/components/overlays/dialog',
  '/components/overlays/drawer',
  '/components/overlays/dropdown-menu',
  '/components/overlays/popover',
  '/components/selection/dynamic-select',
  '/components/utilities/qr',
  // UI Playground & details
  '/ui-components',
  '/ui-components/accordion',
  '/ui-components/breadcrumb',
  '/ui-components/checkbox',
  '/ui-components/collapsible',
  '/ui-components/command-palette',
  '/ui-components/context-menu',
  '/ui-components/date-time',
  '/ui-components/dropdown-menu',
  '/ui-components/dropzone',
  '/ui-components/empty-state',
  '/ui-components/error-state',
  '/ui-components/file-upload',
  '/ui-components/inputs',
  '/ui-components/keyboard-shortcuts',
  '/ui-components/loaders',
  '/ui-components/pagination',
  '/ui-components/popover',
  '/ui-components/radio',
  '/ui-components/select',
  '/ui-components/switch',
  '/ui-components/tabs',
  '/ui-components/tooltip',
  // Workbenches
  '/data-table',
  '/export',
  '/pdf-viewer',
  '/print',
  '/qr-code',
  // Quality tools
  '/accessibility',
  '/responsive',
];

async function runAudit() {
  console.log(`Starting real-browser audit against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });

  const auditResults = {
    testedAt: new Date().toISOString(),
    baseUrl: BASE_URL,
    totalRoutes: ROUTES.length,
    routes: {},
    summary: {
      success: 0,
      failed: 0,
      consoleErrorsTotal: 0,
      axeViolationsTotal: 0,
    }
  };

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  for (const route of ROUTES) {
    const routeUrl = new URL(route, BASE_URL).href;
    const consoleLogs = [];
    const pageErrors = [];

    const onConsole = msg => {
      if (msg.type() === 'error') {
        consoleLogs.push({ type: msg.type(), text: msg.text() });
      }
    };
    const onPageError = err => {
      pageErrors.push(err.message);
    };

    page.on('console', onConsole);
    page.on('pageerror', onPageError);

    const routeData = {
      route,
      status: null,
      title: null,
      customElementsFound: [],
      consoleErrors: [],
      axeViolations: [],
      error: null
    };

    try {
      const response = await page.goto(routeUrl, { waitUntil: 'domcontentloaded', timeout: 15000 });
      routeData.status = response ? response.status() : 'no-response';
      routeData.title = await page.title();

      // Give a little time for hydration
      await page.waitForTimeout(500);

      // Check custom elements in DOM
      const tags = await page.evaluate(() => {
        const all = Array.from(document.querySelectorAll('*')).map(el => el.tagName.toLowerCase());
        return Array.from(new Set(all.filter(t => t.includes('-'))));
      });
      routeData.customElementsFound = tags;

      // Run axe
      try {
        await page.evaluate(axeCore.source);
        const axeResults = await page.evaluate(async () => {
          // @ts-ignore
          return await window.axe.run({
            runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag22aa'] }
          });
        });
        routeData.axeViolations = axeResults.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodesCount: v.nodes.length
        }));
      } catch (axeErr) {
        routeData.axeError = axeErr.message;
      }

      // Take a screenshot of key pages
      const safeName = route.replace(/\//g, '_').replace(/^_/, '') || 'root';
      const screenshotPath = path.join(screenshotsDir, `${safeName}_desktop.png`);
      await page.screenshot({ path: screenshotPath, fullPage: false });

      if (routeData.status === 200) {
        auditResults.summary.success++;
        console.log(`[PASS] ${route} (200) - Elements: [${tags.filter(t => t.startsWith('skyra')).join(', ')}] - Violations: ${routeData.axeViolations.length}`);
      } else {
        auditResults.summary.failed++;
        console.log(`[FAIL] ${route} (${routeData.status})`);
      }
    } catch (err) {
      routeData.error = err.message;
      auditResults.summary.failed++;
      console.log(`[ERROR] ${route}: ${err.message}`);
    }

    routeData.consoleErrors = [...consoleLogs, ...pageErrors.map(e => ({ type: 'uncaught', text: e }))];
    auditResults.summary.consoleErrorsTotal += routeData.consoleErrors.length;
    auditResults.summary.axeViolationsTotal += routeData.axeViolations.length;

    auditResults.routes[route] = routeData;

    page.off('console', onConsole);
    page.off('pageerror', onPageError);
  }

  // Responsive & Theme tests for /components/basic-controls/button and /overview
  console.log('\nTesting responsive viewports and dark mode...');
  const testRoutes = ['/overview', '/components', '/components/basic-controls/button', '/ui-components'];
  for (const r of testRoutes) {
    const safeName = r.replace(/\//g, '_').replace(/^_/, '');
    for (const vp of VIEWPORTS) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(new URL(r, BASE_URL).href, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);
      await page.screenshot({ path: path.join(screenshotsDir, `${safeName}_${vp.name}.png`) });
    }

    // Dark mode
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(screenshotsDir, `${safeName}_dark.png`) });
    await page.evaluate(() => document.documentElement.classList.remove('dark'));
  }

  await browser.close();

  const outputPath = path.join(root, 'docs', 'dashboard-audit', 'browser-audit-results.json');
  fs.writeFileSync(outputPath, JSON.stringify(auditResults, null, 2));
  console.log(`\nAudit finished! Summary:`, auditResults.summary);
  console.log(`Results saved to ${outputPath}`);
}

runAudit().catch(err => {
  console.error('Audit execution error:', err);
  process.exit(1);
});
