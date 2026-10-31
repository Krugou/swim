import { describe, expect, it } from 'vitest';
import { parseBestViewParams } from '@/lib/best-view';

const params = (query: string) => new URLSearchParams(query);

describe('parseBestViewParams', () => {
  it('defaults to the list view', () => {
    expect(parseBestViewParams(params(''))).toEqual({ mode: 'list', intervalSec: 8 });
    expect(parseBestViewParams(null).mode).toBe('list');
    expect(parseBestViewParams(params('view=other')).mode).toBe('list');
  });

  it('enables carousel mode with a custom interval', () => {
    expect(parseBestViewParams(params('view=carousel&interval=12'))).toEqual({
      mode: 'carousel',
      intervalSec: 12,
    });
  });

  it('clamps and sanitizes the interval', () => {
    expect(parseBestViewParams(params('view=carousel&interval=1')).intervalSec).toBe(3);
    expect(parseBestViewParams(params('view=carousel&interval=999')).intervalSec).toBe(60);
    expect(parseBestViewParams(params('view=carousel&interval=abc')).intervalSec).toBe(8);
    expect(parseBestViewParams(params('view=carousel&interval=-5')).intervalSec).toBe(8);
  });
});
