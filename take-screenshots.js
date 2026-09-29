const { chromium } = require('@playwright/test');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to http://127.0.0.1:3001/dynamic-form...');
  try {
    await page.goto('http://127.0.0.1:3001/dynamic-form', { waitUntil: 'networkidle' });
  } catch (e) {
    console.error('Failed to load page. Is the server running at port 3001?', e);
    await browser.close();
    process.exit(1);
  }

  const takeScreenshot = async (width, height, name) => {
    console.log(`Taking screenshot for ${name} (${width}x${height})...`);
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(1000); // Wait for reflow and animations
    
    // Create artifact path
    const path = `C:\\Users\\VAMSHIKA\\.gemini\\antigravity-ide\\brain\\0e95a19b-f974-4e7d-8cc3-5eb215cee1c5\\${name}.png`;
    await page.screenshot({ path, fullPage: true });
    console.log(`Saved screenshot to ${path}`);
  };

  await takeScreenshot(1280, 800, 'dynamic_form_desktop_1280');
  await takeScreenshot(768, 1024, 'dynamic_form_tablet_768');
  await takeScreenshot(320, 568, 'dynamic_form_mobile_320');

  // Open a dropdown to check clipping
  console.log('Trying to click a select element...');
  try {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.waitForTimeout(500);
    
    // Find any select trigger
    const selectTrigger = await page.locator('button[role="combobox"]').first();
    if (await selectTrigger.count() > 0) {
      await selectTrigger.click();
      await page.waitForTimeout(500);
      const path = `C:\\Users\\VAMSHIKA\\.gemini\\antigravity-ide\\brain\\0e95a19b-f974-4e7d-8cc3-5eb215cee1c5\\dynamic_form_mobile_dropdown_open.png`;
      await page.screenshot({ path, fullPage: true });
      console.log(`Saved dropdown open screenshot to ${path}`);
      
      // Close it
      await page.keyboard.press('Escape');
    }
  } catch (e) {
    console.log('Could not open dropdown', e);
  }

  await browser.close();
  console.log('Done!');
})();
