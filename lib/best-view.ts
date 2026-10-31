export type BestViewMode = 'list' | 'carousel';

export interface BestViewParams {
  mode: BestViewMode;
  intervalSec: number;
}

export const DEFAULT_INTERVAL_SEC = 8;
export const MIN_INTERVAL_SEC = 3;
export const MAX_INTERVAL_SEC = 60;

interface ParamReader {
  get(name: string): string | null;
}

/** Reads `?view=carousel&interval=<seconds>`; anything else falls back to the list view. */
export const parseBestViewParams = (params: ParamReader | null): BestViewParams => {
  const view = params?.get('view');
  const raw = Number(params?.get('interval'));
  const intervalSec =
    Number.isFinite(raw) && raw > 0
      ? Math.min(MAX_INTERVAL_SEC, Math.max(MIN_INTERVAL_SEC, Math.round(raw)))
      : DEFAULT_INTERVAL_SEC;

  return { mode: view === 'carousel' ? 'carousel' : 'list', intervalSec };
};
