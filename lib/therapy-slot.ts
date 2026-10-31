import { FREE_PRACTICE_TEXT, type ReservationData } from '@/lib/hooks/use-reservation-data';

export const MIN_OFFSET_MS = 2 * 60 * 60 * 1000;
export const LOOKAHEAD_HOURS = 12;
const MIN_FREE_GAP_MS = 30 * 60 * 1000;

export type SlotKind = 'free-practice' | 'available';

export interface TherapySlot {
  kind: SlotKind;
  start: Date;
  end: Date | null;
}

export interface TherapyCandidate extends TherapySlot {
  hallName: string;
  linkName: string;
  resourceId: string;
  latitude: number;
  longitude: number;
  distanceKm?: number | undefined;
}

const isFreePractice = (r: ReservationData): boolean => r.title.includes(FREE_PRACTICE_TEXT);

/**
 * Finds the earliest usable slot starting at or after `now + minOffsetMs`.
 * Free-practice sessions win; otherwise the first gap of at least 30 minutes
 * between regular reservations is returned. Gaps are only trusted within the
 * fetched window (`now + lookaheadHours`).
 */
export const findNextSlot = (
  data: ReservationData[],
  now: Date = new Date(),
  minOffsetMs: number = MIN_OFFSET_MS,
  lookaheadHours: number = LOOKAHEAD_HOURS,
): TherapySlot | null => {
  const target = now.getTime() + minOffsetMs;
  const horizon = now.getTime() + lookaheadHours * 60 * 60 * 1000;

  const items = data
    .map((r) => ({ r, start: new Date(r.start).getTime(), end: new Date(r.end).getTime() }))
    .filter((x) => !Number.isNaN(x.start) && !Number.isNaN(x.end))
    .sort((a, b) => a.start - b.start);

  const free = items.find((x) => isFreePractice(x.r) && x.end > target);
  if (free) {
    return {
      kind: 'free-practice',
      start: new Date(Math.max(free.start, target)),
      end: new Date(free.end),
    };
  }

  const busy = items.filter((x) => !isFreePractice(x.r));
  let cursor = target;
  for (const b of busy) {
    if (b.end <= cursor) {
      continue;
    }
    if (b.start - cursor >= MIN_FREE_GAP_MS) {
      return { kind: 'available', start: new Date(cursor), end: new Date(b.start) };
    }
    cursor = Math.max(cursor, b.end);
  }

  if (cursor + MIN_FREE_GAP_MS <= horizon) {
    return { kind: 'available', start: new Date(cursor), end: null };
  }
  return null;
};

export const pickBestCandidate = (candidates: TherapyCandidate[]): TherapyCandidate | null => {
  const sorted = [...candidates].sort((a, b) => {
    if (a.kind !== b.kind) {
      return a.kind === 'free-practice' ? -1 : 1;
    }
    const diff = a.start.getTime() - b.start.getTime();
    if (diff !== 0) {
      return diff;
    }
    return (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity);
  });
  return sorted[0] ?? null;
};
