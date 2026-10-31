import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const locales = ['fi', 'en', 'sv'] as const;
const paths = ['', '/about', '/best', '/trends', '/hall/matinkyln-uimahalli'] as const;
const themes = ['light', 'dark'] as const;

const nowIso = (offsetMin: number) => new Date(Date.now() + offsetMin * 60000).toISOString();

for (const theme of themes) {
  for (const locale of locales) {
    for (const path of paths) {
      test(`a11y: /${locale}${path} (${theme})`, async ({ page }) => {
        await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
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
        await page.route('**/api.met.no/**', (route) =>
          route.fulfill({
            json: {
              properties: {
                timeseries: [
                  {
                    time: nowIso(0),
                    data: {
                      instant: { details: { air_temperature: 8, wind_speed: 2 } },
                      next_1_hours: { summary: { symbol_code: 'cloudy' } },
                    },
                  },
                ],
              },
            },
          }),
        );

        await page.goto(`/${locale}${path}`);
        await page.locator('h1').first().waitFor();
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(1500);

        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        expect(
          results.violations.map(
            (v) =>
              `${v.id} (${v.impact}): ${v.nodes.length} nodes, e.g. ${v.nodes
                .slice(0, 3)
                .map((n) => `${n.target.join(' ')} ${n.failureSummary?.split('\n')[1] ?? ''}`)
                .join(' | ')}`,
          ),
        ).toEqual([]);
      });
    }
  }
}
