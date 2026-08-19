import { test } from '@playwright/test';
import { ThemePage } from '../pages/ThemePage';
import { ThemeVerifications } from '../verifications/ThemeVerifications';

test.describe('Theme', () => {
  let themePage: ThemePage;
  let themeVerifications: ThemeVerifications;

  test.beforeEach(async ({ page }) => {
    themePage = new ThemePage(page);
    themeVerifications = new ThemeVerifications(themePage);
    await themePage.goto();
  });

  test('toggle dark theme switches theme and updates button icon', async () => {
    await themeVerifications.verifyLightThemeActive();
    await themePage.toggleTheme();
    await themeVerifications.verifyDarkThemeActive();
    await themePage.toggleTheme();
    await themeVerifications.verifyLightThemeActive();
  });
});
