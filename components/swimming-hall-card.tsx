'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type RelatedLink } from '@/lib/swimming-halls-data';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle, RefreshCcw, Info, ExternalLink } from 'lucide-react';
import { WeatherDisplay } from '@/components/weather-display';
import { useReservationData, type AnalyzedReservationData } from '@/lib/hooks/use-reservation-data';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { slugify } from '@/lib/slugify';

interface SwimmingHallCardProps {
  hallName: string;
  links: RelatedLink[];
  latitude: number;
  longitude: number;
  distance?: number;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

// Constants
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

function ResourceLink({ link }: { link: RelatedLink }) {
  const { data: status, isLoading, error, refetch } = useReservationData(link.url);
  const t = useTranslations('status');
  const tReservation = useTranslations('reservation');
  const tTime = useTranslations('timeIndicators');
  const tErrors = useTranslations('errors');

  const timeWindow = getTimeWindow();
  const proxyUrl = buildProxyUrl(link.url, timeWindow);

  const getStatusBadge = (status?: AnalyzedReservationData) => {
    if (!status || isLoading) return null;
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
    <motion.li
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col gap-2 p-3 bg-muted/30 rounded-lg border border-border"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-sm sm:text-base truncate" title={link.relatedLinkName}>
            {link.relatedLinkName}
          </span>
          <div className="flex items-center gap-2 mt-1">
            {getStatusBadge(status)}
            {status && !status.hasFreeReservation && (
              <svg
                width="34"
                height="16"
                viewBox="0 0 34 16"
                role="status"
                aria-label={getAriaLabel(status, tTime, t)}
              >
                {[
                  status?.hasReservationInNext1Hour,
                  status?.hasReservationInNext2Hours,
                  status?.hasReservationInNext3Hours,
                  status?.hasReservationInNext4Hours,
                  status?.hasReservationInNext5Hours,
                  status?.hasReservationInNext6Hours,
                ].map((isReserved, index) => {
                  const heightPercent = 0.4 + ((index * 7 + 3) % 5) * 0.15;
                  const barHeight = 16 * heightPercent;
                  const y = 16 - barHeight;
                  return (
                    <rect
                      key={index}
                      x={index * 6}
                      y={y}
                      width="4"
                      height={barHeight}
                      className={
                        isReserved
                          ? 'fill-destructive'
                          : 'fill-transparent stroke-black dark:stroke-white stroke-1'
                      }
                      rx="1"
                    >
                      <title>
                        {isReserved ? `Reserved (${index + 1}h)` : `Free (${index + 1}h)`}
                      </title>
                    </rect>
                  );
                })}
              </svg>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            ) : error ? (
              <button
                onClick={() => refetch()}
                className="text-destructive hover:text-destructive/80"
                title={tErrors('retry')}
              >
                <AlertCircle className="h-5 w-5" />
              </button>
            ) : (
              <a
                href={proxyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center justify-center p-2 rounded-md transition-colors ${
                  status?.hasFreeReservation
                    ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400'
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
                title={tReservation('viewReservations')}
              >
                <span className="sr-only">{tReservation('viewReservations')}</span>
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Info Section - Collapsible or just smaller text below if relevant */}
      {(status?.currentReservationEnd ||
        status?.nextAvailableSlot ||
        status?.upcomingReservations?.length) && (
        <div className="text-xs text-muted-foreground border-t border-border/50 pt-2 mt-1">
          {status?.currentReservationEnd && (
            <div className="flex items-center gap-1.5">
              {status.isCurrentlyFreePractice ? '🎉' : '🔒'}
              <span>
                {status.isCurrentlyFreePractice
                  ? tTime('freePracticeUntil')
                  : tTime('reservedUntil')}{' '}
                {status.currentReservationEnd}
              </span>
            </div>
          )}
          {status?.nextAvailableSlot &&
            !status?.currentReservationEnd &&
            !status?.hasReservationInNext1Hour && (
              <div className="flex items-center gap-1.5">
                ⏱️{' '}
                <span>
                  {tTime('freeFor')} {status.nextAvailableSlot}
                </span>
              </div>
            )}
          {status?.upcomingReservations && status.upcomingReservations.length > 0 && (
            <details className="mt-1">
              <summary className="cursor-pointer hover:underline opacity-80">
                {tTime('upcomingReservations')} ({status.upcomingReservations.length})
              </summary>
              <div className="mt-1 pl-2 border-l-2 border-muted space-y-1">
                {status.upcomingReservations.slice(0, 3).map((res, idx) => (
                  <div key={idx} className="truncate" title={res.organization}>
                    {res.organization}
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
    </motion.li>
  );
}

export function SwimmingHallCard({
  hallName,
  links,
  latitude,
  longitude,
  distance,
}: SwimmingHallCardProps) {
  const tLocation = useTranslations('location');
  const tDetails = useTranslations('hallDetails');
  const queryClient = useQueryClient();
  const locale = useLocale();
  // We keep showDetails for potential internal use, but we can also remove it

  const handleRefreshAll = () => {
    links.forEach((link) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', link.url] });
    });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -4 }}
      >
        <Card className="h-full transition-shadow hover:shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-lg sm:text-xl text-primary">{hallName}</CardTitle>
                <div className="flex items-center gap-2">
                  {distance !== undefined ? (
                    <span className="text-sm font-semibold text-primary whitespace-nowrap">
                      📍 {distance.toFixed(1)} km {tLocation('away')}
                    </span>
                  ) : null}
                  <Link
                    href={`/${locale}/hall/${slugify(hallName)}`}
                    className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label={tDetails('viewDetails')}
                    title={tDetails('viewDetails')}
                  >
                    <Info className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={handleRefreshAll}
                    className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    aria-label="Refresh all data"
                    title="Refresh all data"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <WeatherDisplay latitude={latitude} longitude={longitude} />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
              {links.map((link) => (
                <ResourceLink key={link.url} link={link} />
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </>
  );
}

function getAriaLabel(
  status: AnalyzedReservationData | undefined,
  tTime: any,
  tStatus: any
): string {
  if (!status) return '';
  const labels: string[] = [];
  if (status.hasFreeReservation) return tStatus('freeReservation');
  if (status.hasReservationInNext1Hour) labels.push(tTime('nextHour'));
  if (status.hasReservationInNext2Hours) labels.push(tTime('next2Hours'));
  if (status.hasReservationInNext3Hours) labels.push(tTime('next3Hours'));
  if (status.hasReservationInNext4Hours) labels.push(tTime('next4Hours'));
  if (status.hasReservationInNext5Hours) labels.push(tTime('next5Hours'));
  if (status.hasReservationInNext6Hours) labels.push(tTime('next6Hours'));
  return labels.join(', ');
}
