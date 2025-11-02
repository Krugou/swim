'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reservationUrl, type RelatedLink } from '@/lib/swimming-halls-data';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

interface ReservationData {
  start: string;
  end: string;
  title: string;
  eventTypeColor?: string;
  eventBorderColor?: string;
  id?: number;
  resourceID?: number;
  editable?: boolean;
  isOwn?: boolean;
  eventID?: number;
}

interface ReservationDetails {
  organization: string;
  resourceName: string;
  timeRange: string;
}

export interface ReservationStatus {
  hasReservationInNext1Hour: boolean;
  hasReservationInNext2Hours: boolean;
  hasReservationInNext3Hours: boolean;
  hasReservationInNext4Hours: boolean;
  hasReservationInNext5Hours: boolean;
  hasReservationInNext6Hours: boolean;
  hasFreeReservation: boolean;
  isLoading: boolean;
  upcomingReservations?: ReservationDetails[];
  nextAvailableSlot?: string;
}

interface SwimmingHallCardProps {
  hallName: string;
  links: RelatedLink[];
}

// Constants
const FREE_PRACTICE_TEXT = 'Vapaaharjoitte';
const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60;

// Helper functions
const getTimeWindow = (): { start: number; end: number } => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return {
    start: nowInSeconds - FOUR_HOURS_IN_SECONDS,
    end: nowInSeconds + FOUR_HOURS_IN_SECONDS,
  };
};

const buildProxyUrl = (resourceId: string, timeWindow: { start: number; end: number }): string => {
  const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${resourceId}&start=${timeWindow.start}&end=${timeWindow.end}&_=${timeWindow.start}`;
  return `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;
};

// Parse reservation title to extract organization and resource details
// Example title: "Harjoitusvaraus  CETUS ESPOO RY, CETUS ESBO RF  Harjoitusvaraus  Leppävaaran uimahalli, rata 6   17.08.2025 - 30.05.2027"
const parseReservationTitle = (title: string): ReservationDetails => {
  const parts = title.split('  ').filter(part => part.trim());
  
  let organization = 'Unknown';
  let resourceName = 'Unknown';
  let timeRange = '';
  
  // Try to extract organization (usually the second part)
  if (parts.length >= 2) {
    organization = parts[1].trim();
  }
  
  // Try to extract resource name (usually contains the hall name and specific resource)
  for (const part of parts) {
    if (part.includes(',')) {
      const resourcePart = part.split(',').slice(1).join(',').trim();
      if (resourcePart) {
        resourceName = resourcePart;
        break;
      }
    }
  }
  
  // Try to extract time range (usually the last part with dates)
  const lastPart = parts[parts.length - 1];
  if (lastPart && lastPart.includes('-')) {
    timeRange = lastPart.trim();
  }
  
  return { organization, resourceName, timeRange };
};

export function SwimmingHallCard({ hallName, links }: SwimmingHallCardProps) {
  const [linkStatuses, setLinkStatuses] = useState<Map<string, ReservationStatus>>(new Map());
  const t = useTranslations('status');
  const tReservation = useTranslations('reservation');
  const tTime = useTranslations('timeIndicators');

  useEffect(() => {
    const timeWindow = getTimeWindow();

    // Set loading state for all links
    links.forEach((link) => {
      setLinkStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(link.url, {
          hasReservationInNext1Hour: false,
          hasReservationInNext2Hours: false,
          hasReservationInNext3Hours: false,
          hasReservationInNext4Hours: false,
          hasReservationInNext5Hours: false,
          hasReservationInNext6Hours: false,
          hasFreeReservation: false,
          isLoading: true,
        });
        return newMap;
      });
    });

    links.forEach((link) => {
      const proxyUrl = buildProxyUrl(link.url, timeWindow);

      fetch(proxyUrl)
        .then((response) => response.json())
        .then((data: ReservationData[]) => {
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
          const upcomingReservations: ReservationDetails[] = [];
          let nextAvailableSlot: string | undefined;

          // Sort reservations by start time
          const sortedData = [...data].sort((a, b) => 
            new Date(a.start).getTime() - new Date(b.start).getTime()
          );

          sortedData.forEach((reservation) => {
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

            if (reservation.title.includes(FREE_PRACTICE_TEXT)) {
              hasFreeReservation = true;
            }

            // Collect upcoming reservations (next 3 within 6 hours)
            if (reservationStart > currentTime && reservationStart <= sixHoursFromNow && upcomingReservations.length < 3) {
              upcomingReservations.push(parseReservationTitle(reservation.title));
            }
          });

          // Find next available slot (gap between current time and first reservation)
          if (sortedData.length > 0) {
            const firstFutureReservation = sortedData.find(r => new Date(r.start) > currentTime);
            if (firstFutureReservation) {
              const minutesUntil = Math.floor((new Date(firstFutureReservation.start).getTime() - currentTime.getTime()) / (60 * 1000));
              if (minutesUntil > 15) { // Only show if there's at least 15 minutes
                nextAvailableSlot = `${minutesUntil} min`;
              }
            }
          }

          setLinkStatuses((prev) => {
            const newMap = new Map(prev);
            newMap.set(link.url, {
              hasReservationInNext1Hour,
              hasReservationInNext2Hours,
              hasReservationInNext3Hours,
              hasReservationInNext4Hours,
              hasReservationInNext5Hours,
              hasReservationInNext6Hours,
              hasFreeReservation,
              isLoading: false,
              upcomingReservations,
              nextAvailableSlot,
            });
            return newMap;
          });
        })
        .catch((error) => {
          console.error('Error:', error);
          setLinkStatuses((prev) => {
            const newMap = new Map(prev);
            newMap.set(link.url, {
              hasReservationInNext1Hour: false,
              hasReservationInNext2Hours: false,
              hasReservationInNext3Hours: false,
              hasReservationInNext4Hours: false,
              hasReservationInNext5Hours: false,
              hasReservationInNext6Hours: false,
              hasFreeReservation: false,
              isLoading: false,
            });
            return newMap;
          });
        });
    });
  }, [links]);

  const getLinkClassName = (status?: ReservationStatus): string => {
    if (!status || status.isLoading) return 'bg-blue-500 hover:bg-blue-700';
    if (status.hasFreeReservation) return 'bg-green-500 hover:bg-green-700';
    if (status.hasReservationInNext1Hour) return 'bg-red-500 hover:bg-red-700';
    return 'bg-green-500 hover:bg-green-700';
  };

  const getStatusBadge = (status?: ReservationStatus) => {
    if (!status || status.isLoading) return null;
    if (status.hasFreeReservation) {
      return (
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
          {t('freeReservation')}
        </span>
      );
    }
    if (status.hasReservationInNext1Hour) {
      return (
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
          {t('reserved')}
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
        {t('available')}
      </span>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl text-primary">{hallName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3" role="list">
            {links.map((link) => {
              const timeWindow = getTimeWindow();
              const proxyUrl = buildProxyUrl(link.url, timeWindow);
              const status = linkStatuses.get(link.url);

              return (
                <motion.li
                  key={link.url}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col   gap-2"
                >
                  <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
                    <a
                      href={reservationUrl + link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-0 w-full inline-flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-3 sm:px-4 rounded transition-colors text-sm sm:text-base focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      aria-label={`${tReservation('bookNow')} - ${link.relatedLinkName}`}
                    >
                      <span className="truncate">{link.relatedLinkName}</span>
                    </a>
                    <AnimatePresence mode="wait">
                      {status?.isLoading ? (
                        <motion.div
                          key="loading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="inline-flex items-center justify-center w-12 sm:w-14 h-10 bg-muted rounded animate-shimmer"
                        >
                          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                          <span className="sr-only">{t('loading')}</span>
                        </motion.div>
                      ) : (
                        <motion.a
                          key="status"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          href={proxyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-flex items-center justify-center w-full h-10 text-white font-bold rounded transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${getLinkClassName(
                            status
                          )} ${status?.hasFreeReservation ? 'animate-pulse-glow' : ''}`}
                          aria-label={`${tReservation('viewReservations')} - ${link.relatedLinkName}`}
                        >
                          <div
                            className="inline-flex ml-1"
                            role="status"
                            aria-label={getAriaLabel(status, tTime)}
                          >
                            <span
                              className={`inline-block h-2 w-2 sm:h-3 sm:w-3 bg-red-800 rounded-full mx-0.5 ${
                                status?.hasReservationInNext1Hour && !status?.hasFreeReservation
                                  ? 'visible'
                                  : 'invisible'
                              }`}
                              aria-hidden="true"
                            />
                            <span
                              className={`inline-block h-2 w-2 sm:h-3 sm:w-3 bg-red-800 rounded-full mx-0.5 ${
                                status?.hasReservationInNext2Hours && !status?.hasFreeReservation
                                  ? 'visible'
                                  : 'invisible'
                              }`}
                              aria-hidden="true"
                            />
                            <span
                              className={`inline-block h-2 w-2 sm:h-3 sm:w-3 bg-red-800 rounded-full mx-0.5 ${
                                status?.hasReservationInNext3Hours && !status?.hasFreeReservation
                                  ? 'visible'
                                  : 'invisible'
                              }`}
                              aria-hidden="true"
                            />
                            <span
                              className={`inline-block h-2 w-2 sm:h-3 sm:w-3 bg-red-800 rounded-full mx-0.5 ${
                                status?.hasReservationInNext4Hours && !status?.hasFreeReservation
                                  ? 'visible'
                                  : 'invisible'
                              }`}
                              aria-hidden="true"
                            />
                            <span
                              className={`inline-block h-2 w-2 sm:h-3 sm:w-3 bg-red-800 rounded-full mx-0.5 ${
                                status?.hasReservationInNext5Hours && !status?.hasFreeReservation
                                  ? 'visible'
                                  : 'invisible'
                              }`}
                              aria-hidden="true"
                            />
                            <span
                              className={`inline-block h-2 w-2 sm:h-3 sm:w-3 bg-red-800 rounded-full mx-0.5 ${
                                status?.hasReservationInNext6Hours && !status?.hasFreeReservation
                                  ? 'visible'
                                  : 'invisible'
                              }`}
                              aria-hidden="true"
                            />
                          </div>
                        </motion.a>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="sm:ml-2 flex flex-col gap-1 w-full">
                    {getStatusBadge(status)}
                    {status?.nextAvailableSlot && !status?.hasReservationInNext1Hour && (
                      <span className="text-xs text-muted-foreground">
                        ⏱️ Free for {status.nextAvailableSlot}
                      </span>
                    )}
                    {status?.upcomingReservations && status.upcomingReservations.length > 0 && (
                      <details className="text-xs text-muted-foreground mt-1">
                        <summary className="cursor-pointer hover:text-foreground transition-colors">
                          📋 Upcoming reservations ({status.upcomingReservations.length})
                        </summary>
                        <div className="mt-2 space-y-2 pl-2 border-l-2 border-muted">
                          {status.upcomingReservations.map((res, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="font-semibold text-foreground">{res.organization}</div>
                              {res.resourceName !== 'Unknown' && (
                                <div className="text-muted-foreground">{res.resourceName}</div>
                              )}
                            </div>
                          ))}
                        </div>
                      </details>
                    )}
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function getAriaLabel(status: ReservationStatus | undefined, t: any): string {
  if (!status) return '';
  const labels: string[] = [];
  if (status.hasFreeReservation) return 'Free practice available';
  if (status.hasReservationInNext1Hour) labels.push(t('nextHour'));
  if (status.hasReservationInNext2Hours) labels.push(t('next2Hours'));
  if (status.hasReservationInNext3Hours) labels.push(t('next3Hours'));
  if (status.hasReservationInNext4Hours) labels.push(t('next4Hours'));
  if (status.hasReservationInNext5Hours) labels.push(t('next5Hours'));
  if (status.hasReservationInNext6Hours) labels.push(t('next6Hours'));
  return labels.join(', ');
}
