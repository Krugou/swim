'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles, Loader2, MapPin } from 'lucide-react';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { useQuery } from '@tanstack/react-query';
import {
  fetchReservationData,
  analyzeReservations,
  type ReservationData,
} from '@/lib/hooks/use-reservation-data';

interface BestOption {
  hallName: string;
  linkName: string;
  resourceId: string;
  reason: string;
}

export function BestOptionFinder() {
  const [showResults, setShowResults] = useState(false);
  const t = useTranslations('status');
  const tReservation = useTranslations('reservation');
  const tBestOption = useTranslations('bestOption');

  // Pre-fetch all data
  const allResourceIds = swimmingHallData.flatMap((hall) =>
    hall.relatedLinks.map((link) => link.url)
  );

  const queries = allResourceIds.map((resourceId) =>
    useQuery({
      queryKey: ['reservations', resourceId],
      queryFn: () => fetchReservationData(resourceId),
      enabled: showResults, // Only fetch when user clicks search
    })
  );

  // Create a map of resourceId -> query result for easy lookup
  const queryMap = new Map(allResourceIds.map((resourceId, index) => [resourceId, queries[index]]));

  const isSearching = queries.some((q) => q.isLoading || q.isFetching);
  const allDataLoaded = queries.every((q) => q.data || q.error);

  const findBestOptions = () => {
    setShowResults(true);
    // This will trigger all queries to start fetching
  };

  // Calculate best options from the query results
  const bestOptions: BestOption[] = [];

  if (allDataLoaded && showResults) {
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
          } else if (!status.hasReservationInNext1Hour) {
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
    <div className="mb-8">
      <div className="text-center">
        <button
          onClick={findBestOptions}
          disabled={isSearching}
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-busy={isSearching ? 'true' : 'false'}
        >
          {isSearching ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              <span>{tBestOption('searching')}</span>
            </>
          ) : (
            <>
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <span>{tBestOption('findBestOptions')}</span>
            </>
          )}
        </button>
      </div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <div className="bg-card border rounded-lg p-4 sm:p-6 shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold mb-4 text-foreground flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-green-500" aria-hidden="true" />
                {tBestOption('bestOptionsTitle')}
              </h3>

              {bestOptions.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  {tBestOption('noSlotsAvailable')}
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bestOptions.map((option, index) => (
                    <motion.div
                      key={`${option.hallName}-${option.resourceId}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 ${
                        option.reason === 'free-practice'
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/20'
                          : 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20'
                      }`}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <MapPin
                          className="h-5 w-5 text-primary shrink-0 mt-0.5"
                          aria-hidden="true"
                        />
                        <div>
                          <h4 className="font-bold text-foreground">{option.hallName}</h4>
                          <p className="text-sm text-muted-foreground">{option.linkName}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        {option.reason === 'free-practice' ? (
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-green-600 rounded-full animate-pulse-glow">
                            🎉 {t('freeReservation')}
                          </span>
                        ) : (
                          <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-full">
                            ✓ {t('available')}
                          </span>
                        )}
                      </div>
                      <a
                        href={`https://resurssivaraus.espoo.fi/liikunnantilavaraus/haku/?ResourceIDs=${option.resourceId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 block w-full text-center bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-2 px-4 rounded transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      >
                        {tReservation('bookNow')}
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
