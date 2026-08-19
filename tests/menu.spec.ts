import { test } from '@playwright/test';
import { MenuPage } from '../pages/MenuPage';
import { MenuSteps } from '../steps/MenuSteps';
import { MenuVerifications } from '../verifications/MenuVerifications';

test.describe('Menu', () => {
  let menuPage: MenuPage;
  let menuSteps: MenuSteps;
  let menuVerifications: MenuVerifications;

  test.beforeEach(async ({ page }) => {
    menuPage = new MenuPage(page);
    menuSteps = new MenuSteps(menuPage);
    menuVerifications = new MenuVerifications(menuPage, menuSteps);
    await menuSteps.goto();
  });

  test('page loads with 5 pizza items', async () => {
    await menuVerifications.verifyMenuItemsLoaded();
  });

  test('cart is initially empty', async () => {
    await menuVerifications.verifyCartIsEmpty();
  });

  test('increment quantity increases item count', async () => {
    const quantityDisplay = await menuVerifications.verifyInitialQuantity(0);
    await menuSteps.incrementItem(0);
    await menuVerifications.verifyQuantityHasText(quantityDisplay, '1');
  });

  test('decrement at zero has no effect', async () => {
    const quantityDisplay = await menuVerifications.verifyInitialQuantity(0);
    await menuSteps.decrementItem(0);
    await menuVerifications.verifyQuantityHasText(quantityDisplay, '0');
  });

  test('increment then decrement returns count to zero', async () => {
    const quantityDisplay = await menuVerifications.verifyInitialQuantity(0);
    await menuSteps.incrementItem(0);
    await menuVerifications.verifyQuantityHasText(quantityDisplay, '1');
    await menuSteps.decrementItem(0);
    await menuVerifications.verifyQuantityHasText(quantityDisplay, '0');
  });

  test('cart total reflects added quantities', async () => {
    await menuSteps.incrementItem(0);
    await menuSteps.incrementItem(0);
    await menuSteps.incrementItem(1);
    await menuVerifications.verifyCartTotal('3');
  });
});
