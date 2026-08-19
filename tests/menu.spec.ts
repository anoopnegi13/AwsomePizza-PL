import { test, expect } from '@playwright/test';
import { MenuPage } from '../pages/MenuPage';
import { MenuSteps } from '../steps/MenuSteps';

test.describe('Menu', () => {
  let menuPage: MenuPage;
  let menuSteps: MenuSteps;

  test.beforeEach(async ({ page }) => {
    menuPage = new MenuPage(page);
    menuSteps = new MenuSteps(menuPage);
    await menuSteps.goto();
  });

  test('page loads with 5 pizza items', async () => {
    await expect(menuPage.menuItems).toHaveCount(5);

    // Each item should have a visible h3 heading
    const headings = menuPage.menuItems.locator('h3');
    await expect(headings).toHaveCount(5);
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible();
      await expect(heading).not.toBeEmpty();
    }

    // Each item should have an image
    await expect(menuPage.menuItemImages).toHaveCount(5);
  });

  test('cart is initially empty', async () => {
    await expect(menuPage.emptyCart).toBeVisible();
    await expect(menuPage.totalItems).toHaveText('0');
  });

  test('increment quantity increases item count', async () => {
    const quantityDisplay = menuSteps.getQuantityDisplay(0);

    await expect(quantityDisplay).toHaveText('0');
    await menuSteps.incrementItem(0);
    await expect(quantityDisplay).toHaveText('1');
  });

  test('decrement at zero has no effect', async () => {
    const quantityDisplay = menuSteps.getQuantityDisplay(0);

    await expect(quantityDisplay).toHaveText('0');
    await menuSteps.decrementItem(0);
    await expect(quantityDisplay).toHaveText('0');
  });

  test('increment then decrement returns count to zero', async () => {
    const quantityDisplay = menuSteps.getQuantityDisplay(0);

    await expect(quantityDisplay).toHaveText('0');
    await menuSteps.incrementItem(0);
    await expect(quantityDisplay).toHaveText('1');
    await menuSteps.decrementItem(0);
    await expect(quantityDisplay).toHaveText('0');
  });

  test('cart total reflects added quantities', async () => {
    await menuSteps.incrementItem(0);
    await menuSteps.incrementItem(0);
    await menuSteps.incrementItem(1);

    await expect(menuPage.totalItems).toHaveText('3');
    await expect(menuPage.emptyCart).not.toBeVisible();
  });
});
