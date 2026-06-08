import { test, expect, chromium } from '@playwright/test';

test('Google Search', async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  });

  const page = await context.newPage();
  await page.goto('https://www.google.com/', { waitUntil: 'networkidle' });

  // Hide webdriver flag and make the browser appear more human
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  });

  await page.waitForTimeout(1200);

  // Search with keywords
  await page.getByRole('combobox', { name: 'Search' }).fill('playwright by testers talk');
  await page.waitForTimeout(800);
  await page.getByRole('combobox', { name: 'Search' }).press('Enter');

  await page.waitForTimeout(2500);

  // Click on playlist
  await page.getByRole('link', { name: 'Playwright by Testers Talk' }).first().click();

  // Validate the title of the page
  await expect(page).toHaveTitle('Playwright by Testers Talk ✅ - YouTube');

  await browser.close();
});