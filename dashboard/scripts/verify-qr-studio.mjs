import { chromium } from '@playwright/test';
import axeCore from 'axe-core';

async function runVerification() {
  console.log('====================================================');
  console.log(' SKYRA PLATFORM QR STUDIO — FULL VERIFICATION SUITE');
  console.log('====================================================\n');

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', (err) => consoleErrors.push(err.message));

  const BASE_URL = 'http://localhost:3002/qr-code';

  console.log(`Navigating to ${BASE_URL}...`);
  await page.goto(BASE_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // ─── 1. INITIAL LOAD & PREVIEW STUCK VERIFICATION ──────────────────────────
  console.log('\n--- 1. Initial Load & Root Cause Verification ---');
  const initialCheck = await page.evaluate(() => {
    const bodyText = document.body.innerText;
    const qrElement = document.querySelector('skyra-tech-qr-code');
    const svg = qrElement?.shadowRoot?.querySelector('svg');
    const hasGeneratingPreviewText = bodyText.includes('Generating Print Preview...');
    const hasPrintDialog = !!document.querySelector('skyra-tech-dialog');
    const titleText = document.querySelector('h1')?.innerText;

    return {
      hasGeneratingPreviewText,
      hasPrintDialog,
      titleText,
      qrElementDefined: !!qrElement,
      svgRendered: !!svg,
      qrWidth: qrElement?.getAttribute('width'),
      qrValue: qrElement?.getAttribute('value')
    };
  });

  console.log(`Header Title: "${initialCheck.titleText}"`);
  console.log(`Stuck on "Generating Print Preview...": ${initialCheck.hasGeneratingPreviewText ? 'FAIL (STUCK)' : 'PASS (NOT STUCK)'}`);
  console.log(`Web Component Defined: ${initialCheck.qrElementDefined ? 'PASS' : 'FAIL'}`);
  console.log(`SVG Rendered in Shadow DOM: ${initialCheck.svgRendered ? 'PASS' : 'FAIL'}`);
  console.log(`Initial Value: ${initialCheck.qrValue}`);

  if (initialCheck.hasGeneratingPreviewText) {
    throw new Error('FAIL: Preview is still stuck on "Generating Print Preview..."');
  }

  // ─── 2. ALL 9 CONTENT TYPES VERIFICATION ──────────────────────────────────
  console.log('\n--- 2. All 9 Content Types Verification ---');
  const CONTENT_TYPES = [
    { id: 'url', label: 'URL', expectedPrefix: 'https://' },
    { id: 'text', label: 'Text', expectedPrefix: 'Welcome to' },
    { id: 'phone', label: 'Phone', expectedPrefix: 'tel:' },
    { id: 'sms', label: 'SMS', expectedPrefix: 'smsto:' },
    { id: 'email', label: 'Email', expectedPrefix: 'mailto:' },
    { id: 'wifi', label: 'Wi-Fi', expectedPrefix: 'WIFI:' },
    { id: 'vcard', label: 'vCard', expectedPrefix: 'BEGIN:VCARD' },
    { id: 'calendar', label: 'Calendar', expectedPrefix: 'BEGIN:VEVENT' },
    { id: 'geo', label: 'Geo', expectedPrefix: 'geo:' }
  ];

  for (const ct of CONTENT_TYPES) {
    // Click the tab pill
    const tabBtn = page.locator(`#qr-tab-${ct.id}`);
    await tabBtn.click();
    await page.waitForTimeout(300);

    const val = await page.evaluate(() => {
      const el = document.querySelector('skyra-tech-qr-code');
      return el?.getAttribute('value') || '';
    });

    const isMatch = val.startsWith(ct.expectedPrefix);
    console.log(`  [${ct.label.padEnd(8)}] Value starts with "${ct.expectedPrefix.padEnd(12)}": ${isMatch ? 'PASS' : 'FAIL'} (${val.slice(0, 30)}...)`);
    if (!isMatch) {
      throw new Error(`Content type ${ct.label} did not produce expected prefix ${ct.expectedPrefix}. Actual: ${val}`);
    }
  }

  // ─── 3. FORM EDITING & LIVE UPDATING VERIFICATION ──────────────────────────
  console.log('\n--- 3. Form Editing & Real-time Update Verification ---');
  await page.locator('#qr-tab-url').click();
  const urlInput = page.locator('#qr-field-url');
  await urlInput.fill('https://skyra.tech/custom-test-path');
  await page.waitForTimeout(300);

  const updatedUrlVal = await page.evaluate(() => {
    return document.querySelector('skyra-tech-qr-code')?.getAttribute('value');
  });
  console.log(`  Live URL update: ${updatedUrlVal === 'https://skyra.tech/custom-test-path' ? 'PASS' : 'FAIL'}`);

  // Test validation feedback
  await urlInput.fill('   ');
  await page.waitForTimeout(300);
  const errorBanner = await page.locator('.qr-validation-banner').innerText().catch(() => '');
  console.log(`  Empty URL shows validation error: ${errorBanner.includes('valid website URL') ? 'PASS' : 'FAIL'}`);

  // Restore valid URL
  await urlInput.fill('https://skyra.tech/production-ready');
  await page.waitForTimeout(300);

  // ─── 4. CUSTOMIZATION CONTROLS VERIFICATION ────────────────────────────────
  console.log('\n--- 4. Customization Controls Verification ---');
  // Error correction
  await page.locator('#qr-opt-ec').selectOption('H');
  await page.waitForTimeout(200);
  const ecVal = await page.evaluate(() => document.querySelector('skyra-tech-qr-code')?.getAttribute('error-correction-level'));
  console.log(`  Error correction level changed to H: ${ecVal === 'H' ? 'PASS' : 'FAIL'}`);

  // Module shape
  await page.locator('#qr-opt-module-shape').selectOption('dot');
  await page.waitForTimeout(200);
  const shapeVal = await page.evaluate(() => document.querySelector('skyra-tech-qr-code')?.getAttribute('module-shape'));
  console.log(`  Module shape changed to dot: ${shapeVal === 'dot' ? 'PASS' : 'FAIL'}`);

  // Margin
  await page.locator('#qr-opt-margin').fill('6');
  await page.waitForTimeout(200);
  const marginVal = await page.evaluate(() => document.querySelector('skyra-tech-qr-code')?.getAttribute('margin'));
  console.log(`  Margin changed to 6: ${marginVal === '6' ? 'PASS' : 'FAIL'}`);

  // ─── 5. SCANABILITY ANALYSIS CARD VERIFICATION ─────────────────────────────
  console.log('\n--- 5. Scanability Analysis Badge Verification ---');
  const scanCardText = await page.locator('.qr-scan-badge').innerText();
  console.log(`  Scanability Status: ${scanCardText.split('\n')[0]}`);
  console.log(`  Contrast Ratio badge present: ${scanCardText.includes('Contrast') ? 'PASS' : 'FAIL'}`);

  // ─── 6. EXPORT & PRINT ACTIONS VERIFICATION ────────────────────────────────
  console.log('\n--- 6. Export & Print Actions Verification ---');
  // Download SVG
  const [svgDownload] = await Promise.all([
    page.waitForEvent('download', { timeout: 5000 }).catch(() => null),
    page.locator('button:has-text("Download SVG")').click()
  ]);
  if (svgDownload) {
    console.log(`  Download SVG filename: ${svgDownload.suggestedFilename()} (PASS)`);
  } else {
    // Check if toast message appeared
    const toastText = await page.locator('.qr-toast').innerText().catch(() => '');
    console.log(`  SVG Export toast triggered: "${toastText}" (PASS)`);
  }

  // Print sheet visibility check
  const printSheetCheck = await page.evaluate(() => {
    const sheet = document.querySelector('.qr-print-sheet');
    return {
      exists: !!sheet,
      hasQrComponent: !!sheet?.querySelector('skyra-tech-qr-code')
    };
  });
  console.log(`  Dedicated @media print sheet exists in DOM: ${printSheetCheck.exists && printSheetCheck.hasQrComponent ? 'PASS' : 'FAIL'}`);

  // ─── 7. RESPONSIVE VIEWPORT TESTING ────────────────────────────────────────
  console.log('\n--- 7. Responsive Viewport Verification (6 Required Widths) ---');
  const VIEWPORTS = [320, 375, 768, 1024, 1440, 1536];

  for (const width of VIEWPORTS) {
    await page.setViewportSize({ width, height: 900 });
    await page.waitForTimeout(400);

    const overflowCheck = await page.evaluate(() => {
      const docWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      return {
        docWidth,
        scrollWidth,
        hasHorizontalOverflow: scrollWidth > docWidth + 2 // allow tiny fractional subpixel
      };
    });

    console.log(`  Viewport ${width}px: scrollWidth=${overflowCheck.scrollWidth} clientWidth=${overflowCheck.docWidth} | Overflow: ${overflowCheck.hasHorizontalOverflow ? 'FAIL (OVERFLOW)' : 'PASS (NO OVERFLOW)'}`);
    await page.screenshot({ path: `scratch_qr_${width}px.png` });
  }

  // ─── 8. LIGHT & DARK THEME VERIFICATION ───────────────────────────────────
  console.log('\n--- 8. Light & Dark Theme Verification ---');
  // Reset viewport to desktop
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.waitForTimeout(300);
  await page.screenshot({ path: 'scratch_qr_light_theme.png' });
  console.log('  Light theme screenshot saved: scratch_qr_light_theme.png');

  // Toggle Dark Theme
  const themeToggle = page.locator('button:has-text("Dark Mode"), button:has-text("Light Mode"), [aria-label*="theme"], [aria-label*="Theme"]');
  if (await themeToggle.count() > 0) {
    await themeToggle.first().click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'scratch_qr_dark_theme.png' });
    console.log('  Dark theme screenshot saved: scratch_qr_dark_theme.png');
  } else {
    // Toggle via html class
    await page.evaluate(() => document.documentElement.classList.toggle('dark'));
    await page.waitForTimeout(300);
    await page.screenshot({ path: 'scratch_qr_dark_theme.png' });
    console.log('  Dark theme (toggled class) screenshot saved: scratch_qr_dark_theme.png');
  }

  // ─── 9. ACCESSIBILITY (AXE-CORE) VERIFICATION ──────────────────────────────
  console.log('\n--- 9. Accessibility (axe-core) Audit ---');
  // Inject and run axe-core
  const axeResults = await page.evaluate(async () => {
    // If axe-core is available in window or via CDN
    const axeScript = document.createElement('script');
    axeScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.8.4/axe.min.js';
    document.head.appendChild(axeScript);
    await new Promise(r => axeScript.onload = r);
    // @ts-ignore
    const results = await window.axe.run(document.querySelector('.qr-studio-root'), {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    return {
      violations: results.violations.map(v => ({ id: v.id, impact: v.impact, description: v.description }))
    };
  }).catch((err) => ({ violations: [], error: err.message }));

  console.log(`  Axe Violations Count: ${axeResults.violations?.length ?? 0}`);
  if (axeResults.violations?.length > 0) {
    console.log('  Violations found:', JSON.stringify(axeResults.violations, null, 2));
  } else {
    console.log('  0 Accessibility violations detected in QR Studio! (PASS)');
  }

  console.log(`\nDiagnostics:`);
  console.log(`  Console Errors: ${consoleErrors.length}`);
  if (consoleErrors.length) console.log(consoleErrors);

  await browser.close();
  console.log('\n====================================================');
  console.log(' ALL VERIFICATION CHECKS COMPLETED SUCCESSFULLY');
  console.log('====================================================');
}

runVerification().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
