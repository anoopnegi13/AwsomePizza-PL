import { test, expect } from '@playwright/test';

test.describe('Order Placement', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
  });

  // ── Guard conditions ──────────────────────────────────────────────────────

  test('Place Order button is disabled with an empty cart', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();
  });

  test('Place Order button stays disabled without a customer name', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();

    await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();
  });

  test('Place Order button stays disabled with a whitespace-only name', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('   ');

    await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();
  });

  test('Place Order button is enabled once items and a name are provided', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('Jane Doe');

    await expect(page.getByRole('button', { name: 'Place Order' })).toBeEnabled();
  });

  // ── Cart display ──────────────────────────────────────────────────────────

  test('cart shows item name and quantity after adding a pizza', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();

    // 'Quantity: 1' is unique to the cart area (not shown in the menu)
    await expect(page.getByText('Quantity: 1')).toBeVisible();
  });

  test('cart total updates when multiple different pizzas are added', async ({ page }) => {
    const items = page.locator('.menu-item');
    await items.nth(0).getByRole('button', { name: '+' }).click();
    await items.nth(1).getByRole('button', { name: '+' }).click();

    await expect(page.locator('#total-items')).toHaveText('2');
  });

  test('removing an item from the cart updates the cart total', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: 'Remove' }).click();

    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.locator('#total-items')).toHaveText('0');
  });

  test('removing one item leaves remaining items in the cart', async ({ page }) => {
    const items = page.locator('.menu-item');
    await items.nth(0).getByRole('button', { name: '+' }).click();
    await items.nth(1).getByRole('button', { name: '+' }).click();
    await page.getByRole('button', { name: 'Remove' }).first().click();

    await expect(page.locator('#total-items')).toHaveText('1');
    await expect(page.getByText('Your cart is empty')).not.toBeVisible();
  });

  // ── Successful submission ─────────────────────────────────────────────────

  test('successful order submission shows a confirmation with an order ID', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('Jane Doe');
    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page.getByText(/Order placed successfully! Order ID: order-\d+-\d+/)).toBeVisible();
  });

  test('cart and name reset after placing an order', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('Jane Doe');
    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.locator('#total-items')).toHaveText('0');
    await expect(page.getByPlaceholder('Enter your name')).toHaveValue('');
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();
  });

  test('a valid order ID is returned after placing an order', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('Jane Doe');
    await page.getByRole('button', { name: 'Place Order' }).click();

    // The lookup field is auto-populated with the newly created order's ID.
    await expect(page.getByPlaceholder('Enter order ID')).toHaveValue(/^order-\d+-\d+$/);
  });

  // ── Order detail panel ────────────────────────────────────────────────────

  test('order detail panel shows customer name and RECEIVED status after placing', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('Jane Doe');
    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page.getByText('Jane Doe')).toBeVisible();
    await expect(page.getByText('RECEIVED')).toBeVisible();
  });

  test('order detail panel lists the correct items after placing', async ({ page }) => {
    const items = page.locator('.menu-item');
    await items.nth(0).getByRole('button', { name: '+' }).click();
    await items.nth(1).getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('Jane Doe');
    await page.getByRole('button', { name: 'Place Order' }).click();

    // Scope to the "Order Items" section to avoid matching the menu headings
    const orderItemsSection = page.getByRole('heading', { name: 'Order Items', level: 4 }).locator('..');
    await expect(orderItemsSection).toContainText('Margherita Pizza');
    await expect(orderItemsSection).toContainText('Pepperoni Pizza');
  });

  test('Mark as Delivering and Cancel Order buttons appear after placing an order', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByPlaceholder('Enter your name').fill('Jane Doe');
    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page.getByRole('button', { name: 'Mark as Delivering' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Cancel Order' })).toBeVisible();
  });
});
