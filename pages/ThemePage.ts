import { Page, Locator } from '@playwright/test';

export class ThemePage {
  readonly page: Page;
  readonly themeToggleButton: Locator;
  readonly html: Locator;

  constructor(page: Page) {
    this.page = page;
    this.themeToggleButton = page.getByRole('button', { name: 'Toggle dark theme' });
    this.html = page.locator('html');
  }

  async goto() {
    await this.page.addInitScript(() => localStorage.clear());
    await this.page.goto('/');
    await this.page.locator('.menu-item').first().waitFor();
  }

  async toggleTheme() {
    await this.themeToggleButton.click();
  }
}
