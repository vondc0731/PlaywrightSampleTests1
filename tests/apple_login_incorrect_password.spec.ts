import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {

  await test.step('Navigating to URL', async () => {
    await page.goto('https://www.apple.com/');
    await page.getByRole('button', { name: 'Shopping Bag' }).click();
    await page.getByRole('link', { name: 'Sign in' }).nth(1).click();
  });

  await test.step('Enter username & password', async () => {
    await page.locator('iframe[name="aid-auth-widget"]').contentFrame().getByRole('textbox', { name: 'Email or Phone Number' }).click();
    await page.locator('iframe[name="aid-auth-widget"]').contentFrame().getByRole('textbox', { name: 'Email or Phone Number' }).fill('von0731@gmail.com');
    await page.locator('iframe[name="aid-auth-widget"]').contentFrame().getByRole('button', { name: 'Continue' }).click();
    await page.locator('iframe[name="aid-auth-widget"]').contentFrame().getByRole('button', { name: 'Continue with Password' }).click();
    await page.locator('iframe[name="aid-auth-widget"]').contentFrame().getByRole('textbox', { name: 'Password' }).fill('incorrectpassw0rd');
  });

  await test.step('Click on sign in', async () => {
    await page.locator('iframe[name="aid-auth-widget"]').contentFrame().getByRole('button', { name: 'Sign In' }).click();
  });

  await test.step('Validate error message', async () => {
    await expect(page.locator('iframe[name="aid-auth-widget"]').contentFrame().locator('#errMsg')).toContainText('Check the account information you entered and try again.');
  });

});