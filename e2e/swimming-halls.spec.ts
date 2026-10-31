import { expect, test } from '@playwright/test';

test('lists swimming halls and opens a localized hall details page', async ({ page }) => {
  await page.goto('/en');

  await expect(page.getByRole('heading', { name: 'Matinkylän uimahalli' })).toBeVisible();
  await page.getByRole('link', { name: 'View Details' }).first().click();

  await expect(page).toHaveURL(/\/en\/hall\/matinkyln-uimahalli\/?$/);
  await expect(page.getByRole('heading', { name: 'Matinkylän uimahalli' })).toBeVisible();
  await expect(page.getByText('Description', { exact: true })).toBeVisible();
});
