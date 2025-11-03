'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Sparkles, Loader2, MapPin } from 'lucide-react';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import type { ReservationStatus } from './swimming-hall-card';

interface BestOption {
  hallName: string;
  linkName: string;
  resourceId: string;
  reason: string;
}

export function BestOptionFinder() {
  const [isSearching, setIsSearching] = useState(false);
  const [bestOptions, setBestOptions] = useState<BestOption[]>([]);
  const [showResults, setShowResults] = useState(false);
  const t = useTranslations('status');
  const tReservation = useTranslations('reservation');
  const tBestOption = useTranslations('bestOption');

  const findBestOptions = async () => {
    setIsSearching(true);
    setShowResults(false);
    const options: BestOption[] = [];

    const fetchPromises = swimmingHallData.flatMap((hall) =>
      hall.relatedLinks.map(async (link) => {
        const timeWindow = getTimeWindow();
        const proxyUrl = buildProxyUrl(link.url, timeWindow);

        try {
          const response = await fetch(proxyUrl);
          const data = await response.json();
          const status = analyzeReservations(data);

          if (status.hasFreeReservation) {
            options.push({
              hallName: hall.swimmingHallName,
              linkName: link.relatedLinkName,
              resourceId: link.url,
              reason: 'free-practice',
            });
          } else if (!status.hasReservationInNext1Hour) {
            options.push({
              hallName: hall.swimmingHallName,
              linkName: link.relatedLinkName,
              resourceId: link.url,
              reason: 'available-now',
            });
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      })
    );

    await Promise.all(fetchPromises);

    // Sort: free practice first, then by name
    options.sort((a, b) => {
      if (a.reason === 'free-practice' && b.reason !== 'free-practice') return -1;
      if (a.reason !== 'free-practice' && b.reason === 'free-practice') return 1;
      return a.hallName.localeCompare(b.hallName);
    });

    setBestOptions(options);
    setIsSearching(false);
    setShowResults(true);
  };

  return (
    <div className="mb-8">
      <div className="text-center">
        <button
          onClick={findBestOptions}
          disabled={isSearching}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          aria-busy={isSearching}
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
                          className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
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

// Helper functions (duplicated from swimming-hall-card.tsx for now)
const getTimeWindow = (): { start: number; end: number } => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60;
  return {
    start: nowInSeconds - FOUR_HOURS_IN_SECONDS,
    end: nowInSeconds + FOUR_HOURS_IN_SECONDS,
  };
};

const buildProxyUrl = (resourceId: string, timeWindow: { start: number; end: number }): string => {
  const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${resourceId}&start=${timeWindow.start}&end=${timeWindow.end}&_=${timeWindow.start}`;
  return `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;
};

const analyzeReservations = (data: any[]): ReservationStatus => {
  const currentTime = new Date();
  const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
  const twoHoursFromNow = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
  const threeHoursFromNow = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
  const fourHoursFromNow = new Date(currentTime.getTime() + 4 * 60 * 60 * 1000);
  const fiveHoursFromNow = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000);
  const sixHoursFromNow = new Date(currentTime.getTime() + 6 * 60 * 60 * 1000);

  let hasReservationInNext1Hour = false;
  let hasReservationInNext2Hours = false;
  let hasReservationInNext3Hours = false;
  let hasReservationInNext4Hours = false;
  let hasReservationInNext5Hours = false;
  let hasReservationInNext6Hours = false;
  let hasFreeReservation = false;

  data.forEach((reservation) => {
    const reservationStart = new Date(reservation.start);
    const reservationEnd = new Date(reservation.end);

    if (reservationStart <= oneHourFromNow && reservationEnd > currentTime) {
      hasReservationInNext1Hour = true;
    }
    if (reservationStart <= twoHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext2Hours = true;
    }
    if (reservationStart <= threeHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext3Hours = true;
    }
    if (reservationStart <= fourHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext4Hours = true;
    }
    if (reservationStart <= fiveHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext5Hours = true;
    }
    if (reservationStart <= sixHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext6Hours = true;
    }
    if (reservation.title && reservation.title.includes('Vapaaharjoitte')) {
      hasFreeReservation = true;
    }
  });

  return {
    hasReservationInNext1Hour,
    hasReservationInNext2Hours,
    hasReservationInNext3Hours,
    hasReservationInNext4Hours,
    hasReservationInNext5Hours,
    hasReservationInNext6Hours,
    hasFreeReservation,
    isLoading: false,
  };
};
