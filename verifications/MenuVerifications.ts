import { expect, Locator } from '@playwright/test';
import { MenuPage } from '../pages/MenuPage';
import { MenuSteps } from '../steps/MenuSteps';
import { Verifications } from '../utils/allureUtils';

@Verifications
export class MenuVerifications {
  constructor(
    private readonly menuPage: MenuPage,
    private readonly menuSteps: MenuSteps,
  ) {}

  async verifyMenuItemsLoaded() {
    await expect(this.menuPage.menuItems).toHaveCount(5);
    const headings = this.menuPage.menuItems.locator('h3');
    await expect(headings).toHaveCount(5);
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible();
      await expect(heading).not.toBeEmpty();
    }
    await expect(this.menuPage.menuItemImages).toHaveCount(5);
  }

  async verifyCartIsEmpty() {
    await expect(this.menuPage.emptyCart).toBeVisible();
    await expect(this.menuPage.totalItems).toHaveText('0');
  }

  async verifyInitialQuantity(index: number): Promise<Locator> {
    const quantityDisplay = this.menuSteps.getQuantityDisplay(index);
    await expect(quantityDisplay).toHaveText('0');
    return quantityDisplay;
  }

  async verifyQuantityHasText(quantityDisplay: Locator, text: string) {
    await expect(quantityDisplay).toHaveText(text);
  }

  async verifyCartTotal(expected: string) {
    await expect(this.menuPage.totalItems).toHaveText(expected);
    await expect(this.menuPage.emptyCart).not.toBeVisible();
  }
}
