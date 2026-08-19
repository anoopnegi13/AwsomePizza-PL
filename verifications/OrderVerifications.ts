import { expect } from '@playwright/test';
import { OrderPage } from '../pages/OrderPage';
import { OrderSteps } from '../steps/OrderSteps';

export class OrderVerifications {
  constructor(
    private readonly orderPage: OrderPage,
    private readonly orderSteps: OrderSteps,
  ) {}

  async verifyPlaceOrderDisabled() {
    await expect(this.orderPage.placeOrderButton).toBeDisabled();
  }

  async verifyPlaceOrderEnabled() {
    await expect(this.orderPage.placeOrderButton).toBeEnabled();
  }

  async verifyCartShowsItemQuantity() {
    await expect(this.orderPage.page.getByText('Quantity: 1')).toBeVisible();
  }

  async verifyCartTotal(expected: string) {
    await expect(this.orderPage.totalItems).toHaveText(expected);
  }

  async verifyCartIsEmpty() {
    await expect(this.orderPage.emptyCartMessage).toBeVisible();
    await expect(this.orderPage.totalItems).toHaveText('0');
  }

  async verifyCartIsNotEmpty() {
    await expect(this.orderPage.emptyCartMessage).not.toBeVisible();
  }

  async verifyOrderConfirmationVisible() {
    await expect(this.orderPage.orderConfirmation).toBeVisible();
  }

  async verifyCartResetAfterOrder() {
    await expect(this.orderPage.emptyCartMessage).toBeVisible();
    await expect(this.orderPage.totalItems).toHaveText('0');
    await expect(this.orderPage.customerNameInput).toHaveValue('');
    await expect(this.orderPage.placeOrderButton).toBeDisabled();
  }

  async verifyOrderIdGenerated() {
    await expect(this.orderPage.orderIdInput).toHaveValue(/^order-\d+-\d+$/);
  }

  async verifyOrderDetailPanel(customerName: string) {
    await expect(this.orderPage.page.getByText(customerName)).toBeVisible();
    await expect(this.orderPage.page.getByText('RECEIVED')).toBeVisible();
  }

  async verifyOrderItemsSection(...items: string[]) {
    const orderItemsSection = this.orderSteps.getOrderItemsSection();
    for (const item of items) {
      await expect(orderItemsSection).toContainText(item);
    }
  }

  async verifyOrderActionButtonsVisible() {
    await expect(this.orderPage.markAsDeliveringButton).toBeVisible();
    await expect(this.orderPage.cancelOrderButton).toBeVisible();
  }
}
