import { Locator } from '@playwright/test';
import { MenuPage } from '../pages/MenuPage';

export class MenuSteps {
  constructor(private readonly menuPage: MenuPage) {}

  async goto() {
    await this.menuPage.page.addInitScript(() => localStorage.clear());
    await this.menuPage.page.goto('/');
    await this.menuPage.menuItems.first().waitFor();
  }

  getQuantityDisplay(index: number): Locator {
    return this.menuPage.menuItems.nth(index).locator('.quantity-display');
  }

  async incrementItem(index: number) {
    await this.menuPage.menuItems.nth(index).getByRole('button', { name: '+' }).click();
  }

  async decrementItem(index: number) {
    await this.menuPage.menuItems.nth(index).getByRole('button', { name: '−' }).click();
  }
}
