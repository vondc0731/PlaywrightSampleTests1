import { test, expect, chromium } from '@playwright/test';

async function captureStep(page: any, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
  await test.info().attach(name, {
    path: `test-results/screenshots/${name}.png`,
    contentType: 'image/png',
  });
}

test('Record at Cursor Test', { tag: ['@PlaywrightSampleTest'] }, async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
  });

  try {
    const context = await browser.newContext({
      userAgent:
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    });

    const page = await context.newPage();
    await page.goto('https://www.google.com/', { waitUntil: 'networkidle' });
    await captureStep(page, '01_google_home');

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
    await captureStep(page, '02_google_search_filled');
    await page.getByRole('combobox', { name: 'Search' }).press('Enter');

    await page.waitForTimeout(2500);
    await captureStep(page, '03_google_results');

    // Click on playlist
    await page.getByRole('link', { name: 'Playwright by Testers Talk' }).first().click();
    await captureStep(page, '04_playwright_youtube_page');

    // Validate the title of the page
    await expect(page).toHaveTitle(/Playwright by Testers Talk/i);
    await captureStep(page, '05_validation_result');

    await expect(page.getByRole('link', { name: /Playwright Tutorial Full/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Playwright API Testing/i }).first()).toBeVisible();
    await expect(page.getByText(/Playwright Tutorial Full Course/i).first()).toBeVisible();
    await expect(page.getByText(/Playwright API Testing Tutorial/i).first()).toBeVisible();
  } finally {
    await browser.close();
  }
});