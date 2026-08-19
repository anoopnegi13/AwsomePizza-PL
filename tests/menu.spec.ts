import { test, expect, type Page, type Locator } from '@playwright/test';

const MENU_ITEMS = [
  {
    name: 'Margherita Pizza',
    description: 'Classic pizza with fresh tomatoes, mozzarella cheese, and basil',
  },
  {
    name: 'Pepperoni Pizza',
    description: 'Traditional pizza topped with pepperoni and mozzarella cheese',
  },
  {
    name: 'Quattro Stagioni',
    description: 'Four seasons pizza with artichokes, ham, mushrooms, and olives',
  },
  {
    name: 'Vegetarian Delight',
    description: 'Fresh vegetables including bell peppers, onions, mushrooms, and tomatoes',
  },
  {
    name: 'BBQ Chicken Pizza',
    description: 'Grilled chicken with BBQ sauce, red onions, and cilantro',
  },
];

// A pizza card is the container whose direct child is the item's h3 heading.
function getPizzaCard(page: Page, name: string): Locator {
  return page.getByRole('heading', { level: 3, name }).locator('..');
}

test.describe('Menu Display', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('TC-01: menu loads with all items, each showing image, name, description, and a qty stepper at 0', async ({
    page,
  }) => {
    await expect(page.getByRole('heading', { level: 2, name: "Today's Menu" })).toBeVisible();

    for (const item of MENU_ITEMS) {
      const card = getPizzaCard(page, item.name);

      await expect(card.getByRole('img', { name: item.name })).toBeVisible();
      await expect(card.getByRole('heading', { level: 3, name: item.name })).toBeVisible();
      await expect(card.getByText(item.description)).toBeVisible();
      await expect(card.getByRole('button', { name: '−' })).toBeVisible();
      await expect(card.getByRole('button', { name: '+' })).toBeVisible();
      await expect(card.getByText('0', { exact: true })).toBeVisible();
    }
  });

  test('TC-02: pizza images load correctly with no broken images', async ({ page }) => {
    for (const item of MENU_ITEMS) {
      const image = getPizzaCard(page, item.name).getByRole('img', { name: item.name });
      await expect(image).toBeVisible();

      const naturalWidth = await image.evaluate((img: HTMLImageElement) => img.naturalWidth);
      expect(naturalWidth).toBeGreaterThan(0);

      const src = await image.getAttribute('src');
      expect(src).toBeTruthy();
    }
  });

  test('TC-03: quantity stepper defaults to 0 and decrementing has no effect', async ({ page }) => {
    const card = getPizzaCard(page, MENU_ITEMS[0].name);

    await expect(card.getByText('0', { exact: true })).toBeVisible();

    await card.getByRole('button', { name: '−' }).click();

    await expect(card.getByText('0', { exact: true })).toBeVisible();
  });
});
