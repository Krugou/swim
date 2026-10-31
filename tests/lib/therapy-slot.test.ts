import { describe, expect, it } from 'vitest';
import type { ReservationData } from '@/lib/hooks/use-reservation-data';
import { findNextSlot, pickBestCandidate, type TherapyCandidate } from '@/lib/therapy-slot';

const now = new Date('2025-01-01T10:00:00.000Z');
const at = (h: number, m = 0) => new Date(now.getTime() + (h * 60 + m) * 60000).toISOString();
const res = (startH: number, endH: number, title = 'Seura'): ReservationData => ({
  start: at(startH),
  end: at(endH),
  title,
});

describe('findNextSlot', () => {
  it('returns a free slot at now+2h when nothing is booked', () => {
    const slot = findNextSlot([], now);
    expect(slot?.kind).toBe('available');
    expect(slot?.start.toISOString()).toBe(at(2));
  });

  it('skips reservations covering the 2h mark', () => {
    const slot = findNextSlot([res(1, 3)], now);
    expect(slot?.start.toISOString()).toBe(at(3));
  });

  it('ignores gaps shorter than 30 minutes', () => {
    const slot = findNextSlot([res(1, 3), res(3.25, 5)], now);
    expect(slot?.start.toISOString()).toBe(at(5));
  });

  it('prefers free practice and clamps start to now+2h', () => {
    const slot = findNextSlot([res(1, 4, 'Vapaaharjoittelu')], now);
    expect(slot?.kind).toBe('free-practice');
    expect(slot?.start.toISOString()).toBe(at(2));
  });

  it('returns null when booked through the lookahead window', () => {
    expect(findNextSlot([res(1, 12)], now)).toBeNull();
  });
});

describe('pickBestCandidate', () => {
  const base = { hallName: 'h', linkName: 'l', resourceId: '1', latitude: 0, longitude: 0 };
  const cand = (
    kind: TherapyCandidate['kind'],
    startH: number,
    distanceKm: number,
  ): TherapyCandidate => ({
    ...base,
    kind,
    start: new Date(at(startH)),
    end: null,
    distanceKm,
  });

  it('prefers free practice, then earliest, then nearest', () => {
    expect(pickBestCandidate([cand('available', 2, 1), cand('free-practice', 4, 9)])?.kind).toBe(
      'free-practice',
    );
    expect(pickBestCandidate([cand('available', 3, 1), cand('available', 2, 9)])?.distanceKm).toBe(
      9,
    );
    expect(pickBestCandidate([cand('available', 2, 5), cand('available', 2, 1)])?.distanceKm).toBe(
      1,
    );
    expect(pickBestCandidate([])).toBeNull();
  });
});
