import { expect, test } from '@playwright/test';

const nowIso = (offsetMin: number) => new Date(Date.now() + offsetMin * 60000).toISOString();

test('carousel view mode shows best options and auto-advances', async ({ page }) => {
  await page.route('**/proxy.aleksi-nokelainen.workers.dev/**', (route) =>
    route.fulfill({
      json: [
        {
          start: nowIso(-30),
          end: nowIso(90),
          title: 'Espoon kaupunki  Vapaaharjoittelu  Vapaaharjoitte',
        },
      ],
    }),
  );
  await page.route('**/api.met.no/**', (route) => route.fulfill({ status: 500, body: '' }));

  await page.goto('/en/best?view=carousel&interval=3');

  const carousel = page.getByTestId('best-carousel');
  await expect(carousel).toBeVisible();
  const slide = page.getByTestId('carousel-slide');
  await expect(slide).toBeVisible();
  const first = await slide.getByRole('heading', { level: 2 }).innerText();

  await expect
    .poll(
      async () => page.getByTestId('carousel-slide').getByRole('heading', { level: 2 }).innerText(),
      {
        timeout: 10000,
      },
    )
    .not.toBe(first);

  await page.getByRole('button', { name: 'Exit carousel' }).click();
  await expect(page).toHaveURL(/\/en\/best\/?$/);
  await expect(page.getByTestId('best-carousel')).toHaveCount(0);
});
