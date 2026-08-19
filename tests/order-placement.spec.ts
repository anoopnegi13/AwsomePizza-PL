import { test, expect } from '@playwright/test';
import { OrderPage } from '../pages/OrderPage';
import { OrderSteps } from '../steps/OrderSteps';

test.describe('Order Placement', () => {
  let orderPage: OrderPage;
  let orderSteps: OrderSteps;

  test.beforeEach(async ({ page }) => {
    orderPage = new OrderPage(page);
    orderSteps = new OrderSteps(orderPage);
    await orderSteps.goto();
  });

  // ── Guard conditions ──────────────────────────────────────────────────────

  test('Place Order button is disabled with an empty cart', async () => {
    await expect(orderPage.placeOrderButton).toBeDisabled();
  });

  test('Place Order button stays disabled without a customer name', async () => {
    await orderSteps.addItem(0);

    await expect(orderPage.placeOrderButton).toBeDisabled();
  });

  test('Place Order button stays disabled with a whitespace-only name', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('   ');

    await expect(orderPage.placeOrderButton).toBeDisabled();
  });

  test('Place Order button is enabled once items and a name are provided', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');

    await expect(orderPage.placeOrderButton).toBeEnabled();
  });

  // ── Cart display ──────────────────────────────────────────────────────────

  test('cart shows item name and quantity after adding a pizza', async ({ page }) => {
    await orderSteps.addItem(0);

    // 'Quantity: 1' is unique to the cart area (not shown in the menu)
    await expect(page.getByText('Quantity: 1')).toBeVisible();
  });

  test('cart total updates when multiple different pizzas are added', async () => {
    await orderSteps.addItem(0);
    await orderSteps.addItem(1);

    await expect(orderPage.totalItems).toHaveText('2');
  });

  test('removing an item from the cart updates the cart total', async () => {
    await orderSteps.addItem(0);
    await orderSteps.removeItem(0);

    await expect(orderPage.emptyCartMessage).toBeVisible();
    await expect(orderPage.totalItems).toHaveText('0');
  });

  test('removing one item leaves remaining items in the cart', async () => {
    await orderSteps.addItem(0);
    await orderSteps.addItem(1);
    await orderSteps.removeItem(0);

    await expect(orderPage.totalItems).toHaveText('1');
    await expect(orderPage.emptyCartMessage).not.toBeVisible();
  });

  // ── Successful submission ─────────────────────────────────────────────────

  test('successful order submission shows a confirmation with an order ID', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();

    await expect(orderPage.orderConfirmation).toBeVisible();
  });

  test('cart and name reset after placing an order', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();

    await expect(orderPage.emptyCartMessage).toBeVisible();
    await expect(orderPage.totalItems).toHaveText('0');
    await expect(orderPage.customerNameInput).toHaveValue('');
    await expect(orderPage.placeOrderButton).toBeDisabled();
  });

  test('a valid order ID is returned after placing an order', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();

    // The lookup field is auto-populated with the newly created order's ID.
    await expect(orderPage.orderIdInput).toHaveValue(/^order-\d+-\d+$/);
  });

  // ── Order detail panel ────────────────────────────────────────────────────

  test('order detail panel shows customer name and RECEIVED status after placing', async ({ page }) => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();

    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('RECEIVED')).toBeVisible();
  });

  test('order detail panel lists the correct items after placing', async () => {
    await orderSteps.addItem(0);
    await orderSteps.addItem(1);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();

    // Scope to the "Order Items" section to avoid matching the menu headings
    const orderItemsSection = orderSteps.getOrderItemsSection();
    await expect(orderItemsSection).toContainText('Margherita Pizza');
    await expect(orderItemsSection).toContainText('Pepperoni Pizza');
  });

  test('Mark as Delivering and Cancel Order buttons appear after placing an order', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();

    await expect(orderPage.markAsDeliveringButton).toBeVisible();
    await expect(orderPage.cancelOrderButton).toBeVisible();
  });
});
