'use client';

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 3 minutes before considering it stale
      staleTime: 3 * 60 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Automatically refetch data every 3 minutes
      refetchInterval: 3 * 60 * 1000,
      // Refetch on window focus
      refetchOnWindowFocus: true,
      // Retry failed requests
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});
