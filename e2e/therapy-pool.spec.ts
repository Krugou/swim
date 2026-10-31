import { expect, test } from '@playwright/test';

test.use({
  permissions: ['geolocation'],
  geolocation: { latitude: 60.1699, longitude: 24.9384 },
});

test('finds next therapy pool slot with user and hall weather', async ({ page }) => {
  await page.route('**/proxy.aleksi-nokelainen.workers.dev/**', (route) =>
    route.fulfill({ json: [] }),
  );
  await page.route('**/api.met.no/**', (route) =>
    route.fulfill({
      json: {
        properties: {
          timeseries: [
            {
              data: {
                instant: { details: { air_temperature: 3.5, wind_speed: 2 } },
                next_1_hours: {
                  summary: { symbol_code: 'cloudy' },
                  details: { precipitation_amount: 0 },
                },
              },
            },
          ],
        },
      },
    }),
  );

  await page.goto('/en/best');
  await page.getByTestId('therapy-find').click();

  const result = page.getByTestId('therapy-result');
  await expect(result).toBeVisible();
  await expect(result.getByText('Your location:')).toBeVisible();
  await expect(result.getByText('Pool location:')).toBeVisible();
});
