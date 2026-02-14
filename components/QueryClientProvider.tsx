'use client';

import { QueryClientProvider as TanstackQueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';

export const QueryClientProvider = ({ children }: { children: React.ReactNode }) => (
  <TanstackQueryClientProvider client={queryClient}>{children}</TanstackQueryClientProvider>
);
