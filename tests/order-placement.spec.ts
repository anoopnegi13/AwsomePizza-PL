import { test, expect } from '@playwright/test';

test.describe('Order Placement', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('/');
    await page.locator('.menu-item').first().waitFor();
  });

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
});
