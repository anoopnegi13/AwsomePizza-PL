import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
  });

  test('toggle dark theme switches theme and updates button icon', async ({ page }) => {
    const themeBtn = page.getByRole('button', { name: 'Toggle dark theme' });

    await expect(themeBtn).toHaveText('🌙');
    await themeBtn.click();
    await expect(page.locator('body')).toHaveClass(/dark/);
    await expect(themeBtn).toHaveText('☀️');

    await themeBtn.click();
    await expect(page.locator('body')).not.toHaveClass(/dark/);
    await expect(themeBtn).toHaveText('🌙');
  });
});
