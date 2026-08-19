import { Locator } from '@playwright/test';
import { OrderPage } from '../pages/OrderPage';

export class OrderSteps {
  constructor(private readonly orderPage: OrderPage) {}

  async goto() {
    await this.orderPage.page.addInitScript(() => localStorage.clear());
    await this.orderPage.page.goto('/');
    await this.orderPage.menuItems.first().waitFor();
  }

  async addItem(index: number) {
    await this.orderPage.menuItems.nth(index).getByRole('button', { name: '+' }).click();
  }

  async fillCustomerName(name: string) {
    await this.orderPage.customerNameInput.fill(name);
  }

  async placeOrder() {
    await this.orderPage.placeOrderButton.click();
  }

  async removeItem(index = 0) {
    await this.orderPage.removeButtons.nth(index).click();
  }

  getOrderItemsSection(): Locator {
    return this.orderPage.page.getByRole('heading', { name: 'Order Items', level: 4 }).locator('..');
  }
}
