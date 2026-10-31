'use client';

import { useQueries } from '@tanstack/react-query';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import {
  fetchReservationData,
  analyzeReservations,
  type ReservationData,
} from '@/lib/hooks/use-reservation-data';
import type { BestOption } from '@/components/BestCarousel';

export const useBestOptions = (): { options: BestOption[]; loading: boolean } => {
  const allResourceIds = swimmingHallData.flatMap((hall) =>
    hall.relatedLinks.map((link) => link.url),
  );

  const queries = useQueries({
    queries: allResourceIds.map((resourceId) => ({
      queryKey: ['reservations', resourceId],
      queryFn: () => fetchReservationData(resourceId),
    })),
  });

  const queryMap = new Map(allResourceIds.map((resourceId, index) => [resourceId, queries[index]]));
  const isScanning = queries.some((q) => q.isLoading || q.isFetching);
  const allDataLoaded = queries.every((q) => q.data || q.error);

  const options: BestOption[] = [];

  if (allDataLoaded) {
    swimmingHallData.forEach((hall) => {
      hall.relatedLinks.forEach((link) => {
        const query = queryMap.get(link.url);
        if (!query?.data) {
          return;
        }
        const status = analyzeReservations(query.data as ReservationData[]);
        const base = {
          hallName: hall.swimmingHallName,
          linkName: link.relatedLinkName,
          resourceId: link.url,
          latitude: hall.latitude,
          longitude: hall.longitude,
        };

        if (status.hasFreeReservation) {
          options.push({ ...base, reason: 'free-practice' });
        } else if (!status.hasReservationInNext1Hour && !status.currentReservationEnd) {
          // "Available now" means currently free AND no upcoming reservation starting soon
          options.push({ ...base, reason: 'available-now' });
        }
      });
    });

    options.sort((a, b) => {
      if (a.reason === 'free-practice' && b.reason !== 'free-practice') {
        return -1;
      }
      if (a.reason !== 'free-practice' && b.reason === 'free-practice') {
        return 1;
      }
      return a.hallName.localeCompare(b.hallName);
    });
  }

  return { options, loading: isScanning && !allDataLoaded };
};
