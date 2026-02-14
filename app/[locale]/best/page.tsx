'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { Sparkles, Loader2, MapPin, X } from 'lucide-react';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { useQueries } from '@tanstack/react-query';
import {
  fetchReservationData,
  analyzeReservations,
  type ReservationData,
} from '@/lib/hooks/use-reservation-data';
import Link from 'next/link';

interface BestOption {
  hallName: string;
  linkName: string;
  resourceId: string;
  reason: string;
}

export default function BestOptionsPage() {
  const t = useTranslations('status');
  const tReservation = useTranslations('reservation');
  const tBestOption = useTranslations('bestOption');
  const locale = useLocale();

  // Pre-fetch all data
  const allResourceIds = swimmingHallData.flatMap((hall) =>
    hall.relatedLinks.map((link) => link.url),
  );

  // Auto-trigger queries on mount
  const queries = useQueries({
    queries: allResourceIds.map((resourceId) => ({
      queryKey: ['reservations', resourceId],
      queryFn: () => fetchReservationData(resourceId),
    })),
  });

  // Create a map of resourceId -> query result for easy lookup
  const queryMap = new Map(allResourceIds.map((resourceId, index) => [resourceId, queries[index]]));

  const isScanning = queries.some((q) => q.isLoading || q.isFetching);
  const allDataLoaded = queries.every((q) => q.data || q.error);

  // Calculate best options from the query results
  const bestOptions: BestOption[] = [];

  if (allDataLoaded) {
    swimmingHallData.forEach((hall) => {
      hall.relatedLinks.forEach((link) => {
        const query = queryMap.get(link.url);
        if (query?.data) {
          const status = analyzeReservations(query.data as ReservationData[]);

          if (status.hasFreeReservation) {
            bestOptions.push({
              hallName: hall.swimmingHallName,
              linkName: link.relatedLinkName,
              resourceId: link.url,
              reason: 'free-practice',
            });
          } else if (!status.hasReservationInNext1Hour && !status.currentReservationEnd) {
            // "Available now" means currently free AND no upcoming reservation starting soon
            bestOptions.push({
              hallName: hall.swimmingHallName,
              linkName: link.relatedLinkName,
              resourceId: link.url,
              reason: 'available-now',
            });
          }
        }
      });
    });

    // Sort: free practice first, then by name
    bestOptions.sort((a, b) => {
      if (a.reason === 'free-practice' && b.reason !== 'free-practice') return -1;
      if (a.reason !== 'free-practice' && b.reason === 'free-practice') return 1;
      return a.hallName.localeCompare(b.hallName);
    });
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-green-500" />
            {tBestOption('bestOptionsTitle')}
          </h1>
          <Link
            href={`/${locale}`}
            className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </Link>
        </div>

        {/* Content */}
        {isScanning && !allDataLoaded ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-xl font-medium text-muted-foreground">{tBestOption('searching')}</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {bestOptions.length === 0 ? (
              <div className="col-span-full text-center py-20">
                <p className="text-xl text-muted-foreground">{tBestOption('noSlotsAvailable')}</p>
                <Link
                  href={`/${locale}`}
                  className="mt-6 inline-block px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90"
                >
                  Takaisin etusivulle
                </Link>
              </div>
            ) : (
              bestOptions.map((option, index) => (
                <motion.div
                  key={`${option.hallName}-${option.resourceId}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-6 rounded-2xl border-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] ${
                    option.reason === 'free-practice'
                      ? 'border-green-600 bg-green-50/50 dark:bg-green-950/40'
                      : 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40'
                  }`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-background rounded-full shrink-0 shadow-xs">
                      <MapPin className="h-6 w-6 text-primary" aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-foreground leading-tight mb-1">
                        {option.hallName}
                      </h4>
                      <p className="text-sm font-medium text-muted-foreground">{option.linkName}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    {option.reason === 'free-practice' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-white bg-green-600 rounded-full shadow-xs animate-pulse-glow">
                        🎉 {t('freeReservation')}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-white bg-emerald-600 rounded-full shadow-xs">
                        ✓ {t('available')}
                      </span>
                    )}
                  </div>

                  <a
                    href={`https://resurssivaraus.espoo.fi/liikunnantilavaraus/haku/?ResourceIDs=${option.resourceId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95"
                  >
                    {tReservation('bookNow')}
                  </a>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
