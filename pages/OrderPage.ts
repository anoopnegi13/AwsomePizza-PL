import { Page, Locator } from '@playwright/test';

export class OrderPage {
  readonly page: Page;
  readonly menuItems: Locator;
  readonly totalItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly customerNameInput: Locator;
  readonly placeOrderButton: Locator;
  readonly removeButtons: Locator;
  readonly orderIdInput: Locator;
  readonly orderConfirmation: Locator;
  readonly markAsDeliveringButton: Locator;
  readonly cancelOrderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuItems = page.locator('.menu-item');
    this.totalItems = page.locator('#total-items');
    this.emptyCartMessage = page.getByText('Your cart is empty');
    this.customerNameInput = page.getByPlaceholder('Enter your name');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.removeButtons = page.getByRole('button', { name: 'Remove' });
    this.orderIdInput = page.getByPlaceholder('Enter order ID');
    this.orderConfirmation = page.getByText(/Order placed successfully! Order ID: order-\d+-\d+/);
    this.markAsDeliveringButton = page.getByRole('button', { name: 'Mark as Delivering' });
    this.cancelOrderButton = page.getByRole('button', { name: 'Cancel Order' });
  }

}
