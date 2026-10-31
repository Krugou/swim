import { afterEach, describe, expect, it, vi } from 'vitest';
import { checkIsOpen } from '@/lib/opening-hours';
import { buildProxyUrl, FOUR_HOURS_IN_SECONDS, getTimeWindow } from '@/lib/reservation-utils';
import { slugify } from '@/lib/slugify';

afterEach(() => {
  vi.useRealTimers();
});

describe('slugify', () => {
  it('creates stable URL slugs from hall names', () => {
    expect(slugify('Matinkylän uimahalli')).toBe('matinkyln-uimahalli');
    expect(slugify('  Espoo   Hall!!  ')).toBe('espoo-hall');
  });
});

describe('checkIsOpen', () => {
  it('checks a weekday schedule at the current local time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 26, 10, 30));

    expect(checkIsOpen('Mon-Fri: 06:00-21:00')).toBe(true);
  });

  it('treats the closing time as exclusive', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 26, 21, 0));

    expect(checkIsOpen('Mon-Fri: 06:00-21:00')).toBe(false);
  });

  it('uses the existing default when opening hours are unavailable', () => {
    expect(checkIsOpen()).toBe(true);
  });
});

describe('reservation time windows', () => {
  it('builds a four-hour window around the current time', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-31T12:00:00.000Z'));
    const now = Math.floor(Date.now() / 1000);

    expect(getTimeWindow()).toEqual({
      start: now - FOUR_HOURS_IN_SECONDS,
      end: now + FOUR_HOURS_IN_SECONDS,
    });
  });

  it('encodes the city reservation URL for the proxy', () => {
    const proxyUrl = new URL(buildProxyUrl('24790', { start: 100, end: 200 }));
    const cityUrl = new URL(proxyUrl.searchParams.get('url') ?? '');

    expect(proxyUrl.origin).toBe('https://proxy.aleksi-nokelainen.workers.dev');
    expect(cityUrl.searchParams.get('resourceid[]')).toBe('24790');
    expect(cityUrl.searchParams.get('start')).toBe('100');
    expect(cityUrl.searchParams.get('end')).toBe('200');
  });
});
