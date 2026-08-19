import { Page, Locator } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuItems: Locator;
  readonly menuItemImages: Locator;
  readonly totalItems: Locator;
  readonly emptyCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuItems = page.locator('.menu-item');
    this.menuItemImages = page.locator('.menu-item img');
    this.totalItems = page.locator('#total-items');
    this.emptyCart = page.locator('.empty-cart');
  }
}
