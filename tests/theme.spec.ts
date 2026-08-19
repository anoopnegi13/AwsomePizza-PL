import { test, expect } from '@playwright/test';
import { ThemePage } from '../pages/ThemePage';

test.describe('Theme', () => {
  let themePage: ThemePage;

  test.beforeEach(async ({ page }) => {
    themePage = new ThemePage(page);
    await themePage.goto();
  });

  test('toggle dark theme switches theme and updates button icon', async () => {
    await expect(themePage.themeToggleButton).toHaveText('🌙');
    await themePage.toggleTheme();
    await expect(themePage.html).toHaveAttribute('data-theme', 'dark');
    await expect(themePage.themeToggleButton).toHaveText('☀️');

    await themePage.toggleTheme();
    await expect(themePage.html).not.toHaveAttribute('data-theme', 'dark');
    await expect(themePage.themeToggleButton).toHaveText('🌙');
  });
});
