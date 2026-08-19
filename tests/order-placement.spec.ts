import { test } from '@playwright/test';
import { OrderPage } from '../pages/OrderPage';
import { OrderSteps } from '../steps/OrderSteps';
import { OrderVerifications } from '../verifications/OrderVerifications';
import disabledButtonCases from '../data/disabledButtonCases.json';

test.describe('Order Placement', () => {
  let orderPage: OrderPage;
  let orderSteps: OrderSteps;
  let orderVerifications: OrderVerifications;

  test.beforeEach(async ({ page }) => {
    orderPage = new OrderPage(page);
    orderSteps = new OrderSteps(orderPage);
    orderVerifications = new OrderVerifications(orderPage, orderSteps);
    await orderSteps.goto();
  });

  // ── Guard conditions ──────────────────────────────────────────────────────

  for (const { label, addItemIndex, customerName } of disabledButtonCases) {
    test(`Place Order button is disabled — ${label}`, async () => {
      if (addItemIndex !== null) await orderSteps.addItem(addItemIndex);
      if (customerName !== null) await orderSteps.fillCustomerName(customerName);
      await orderVerifications.verifyPlaceOrderDisabled();
    });
  }

  test('Place Order button is enabled once items and a name are provided', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderVerifications.verifyPlaceOrderEnabled();
  });

  // ── Cart display ──────────────────────────────────────────────────────────

  test('cart shows item name and quantity after adding a pizza', async () => {
    await orderSteps.addItem(0);
    await orderVerifications.verifyCartShowsItemQuantity();
  });

  test('cart total updates when multiple different pizzas are added', async () => {
    await orderSteps.addItem(0);
    await orderSteps.addItem(1);
    await orderVerifications.verifyCartTotal('2');
  });

  test('removing an item from the cart updates the cart total', async () => {
    await orderSteps.addItem(0);
    await orderSteps.removeItem(0);
    await orderVerifications.verifyCartIsEmpty();
  });

  test('removing one item leaves remaining items in the cart', async () => {
    await orderSteps.addItem(0);
    await orderSteps.addItem(1);
    await orderSteps.removeItem(0);
    await orderVerifications.verifyCartTotal('1');
    await orderVerifications.verifyCartIsNotEmpty();
  });

  // ── Successful submission ─────────────────────────────────────────────────

  test('successful order submission shows a confirmation with an order ID', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();
    await orderVerifications.verifyOrderConfirmationVisible();
  });

  test('cart and name reset after placing an order', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();
    await orderVerifications.verifyCartResetAfterOrder();
  });

  test('a valid order ID is returned after placing an order', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();
    await orderVerifications.verifyOrderIdGenerated();
  });

  // ── Order detail panel ────────────────────────────────────────────────────

  test('order detail panel shows customer name and RECEIVED status after placing', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();
    await orderVerifications.verifyOrderDetailPanel('Jane Doe');
  });

  test('order detail panel lists the correct items after placing', async () => {
    await orderSteps.addItem(0);
    await orderSteps.addItem(1);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();
    await orderVerifications.verifyOrderItemsSection('Margherita Pizza', 'Pepperoni Pizza');
  });

  test('Mark as Delivering and Cancel Order buttons appear after placing an order', async () => {
    await orderSteps.addItem(0);
    await orderSteps.fillCustomerName('Jane Doe');
    await orderSteps.placeOrder();
    await orderVerifications.verifyOrderActionButtonsVisible();
  });
});
