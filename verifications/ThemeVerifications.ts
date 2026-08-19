import { expect } from '@playwright/test';
import { ThemePage } from '../pages/ThemePage';
import { Verifications } from '../utils/allureUtils';

@Verifications
export class ThemeVerifications {
  constructor(private readonly themePage: ThemePage) {}

  async verifyLightThemeActive() {
    await expect(this.themePage.html).not.toHaveAttribute('data-theme', 'dark');
    await expect(this.themePage.themeToggleButton).toHaveText('🌙');
  }

  async verifyDarkThemeActive() {
    await expect(this.themePage.html).toHaveAttribute('data-theme', 'dark');
    await expect(this.themePage.themeToggleButton).toHaveText('☀️');
  }
}
