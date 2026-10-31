import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useReservationData } from '@/lib/hooks/use-reservation-data';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('useReservationData', () => {
  it('fetches a resource and analyzes its upcoming reservations', async () => {
    const now = Date.now();
    const reservations = [
      {
        start: new Date(now + 30 * 60 * 1000).toISOString(),
        end: new Date(now + 90 * 60 * 1000).toISOString(),
        title: 'Espoo  Matinkylä, 50m pool  12:30-13:30',
      },
    ];
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => reservations,
    });
    vi.stubGlobal('fetch', fetchMock);

    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useReservationData('24790'), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(result.current.data?.hasReservationInNext1Hour).toBe(true);
    expect(result.current.data?.upcomingReservations).toHaveLength(1);
    queryClient.clear();
  });
});
