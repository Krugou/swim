'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Loader2, AlertCircle } from 'lucide-react';
import { useReservationData, type AnalyzedReservationData } from '@/lib/hooks/use-reservation-data';
import { type RelatedLink, reservationUrl } from '@/lib/swimming-halls-data';
import { getTimeWindow, buildProxyUrl } from '@/lib/reservation-utils';

interface ResourceLinkProps {
  link: RelatedLink;
  isOpen?: boolean | undefined;
}

export function ResourceLink({ link, isOpen }: ResourceLinkProps) {
  const { data: status, isLoading, error, dataUpdatedAt, refetch } = useReservationData(link.url);
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

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
  const minutesAgo = lastUpdated
    ? Math.floor((Date.now() - lastUpdated.getTime()) / (60 * 1000))
    : null;

  return (
    <motion.li initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-2">
      <div className="flex flex-col gap-1 w-full relative">
        <div className="flex items-center justify-between gap-4">
          <span className="font-bold text-sm sm:text-base leading-tight">
            {link.relatedLinkName}
          </span>
          <a
            href={reservationUrl + link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-1.5 px-3 rounded-md text-xs sm:text-sm transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 border-2 border-primary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] active:translate-x-px active:translate-y-px active:shadow-none"
            aria-label={`${tReservation('bookNow')} - ${link.relatedLinkName}`}
          >
            {tReservation('bookNow')}
          </a>
        </div>
        <AnimatePresence mode="wait">
          {isLoading ? (
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
          ) : error ? (
            <motion.button
              key="error"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => refetch()}
              className="inline-flex items-center justify-center gap-2 w-full h-10 text-white font-bold bg-red-600 hover:bg-red-700 rounded transition-all focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={tErrors('loadingData')}
            >
              <AlertCircle className="h-4 w-4" aria-hidden="true" />
              <span className="text-sm">{tErrors('retry')}</span>
            </motion.button>
          ) : status && !status.hasFreeReservation ? (
            <motion.a
              key="status"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              href={proxyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-start w-full h-auto py-2 px-1 gap-2 overflow-x-auto no-scrollbar"
              aria-label={`${tReservation('viewReservations')} - ${link.relatedLinkName}`}
            >
              {isOpen === false ? (
                <div className="flex items-center justify-center w-full py-1">
                  <span className="font-bold text-muted-foreground text-sm uppercase tracking-wider">
                    {t('closed')}
                  </span>
                </div>
              ) : (
                [
                  status?.hasReservationInNext1Hour,
                  status?.hasReservationInNext2Hours,
                  status?.hasReservationInNext3Hours,
                  status?.hasReservationInNext4Hours,
                  status?.hasReservationInNext5Hours,
                  status?.hasReservationInNext6Hours,
                ].map((isReserved, index) => {
                  const currentHour = new Date().getHours();
                  const displayHour = (currentHour + index + 1) % 24;

                  return (
                    <div
                      key={index}
                      className={`flex flex-col items-center justify-center w-8 h-8 rounded-full border-2 border-black dark:border-white shrink-0 font-bold text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] ${
                        isReserved
                          ? 'bg-destructive text-destructive-foreground'
                          : 'bg-accent text-accent-foreground'
                      }`}
                      title={isReserved ? `Reserved ${displayHour}:00` : `Free ${displayHour}:00`}
                    >
                      {displayHour}
                    </div>
                  );
                })
              )}
            </motion.a>
          ) : null}
        </AnimatePresence>
      </div>
      <div className="sm:ml-2 flex flex-col gap-1 w-full">
        {getStatusBadge(status)}
        {status?.currentReservationEnd && status?.currentReservationDuration !== undefined ? (
          <span className="text-xs text-muted-foreground">
            {status.isCurrentlyFreePractice ? (
              <>
                🎉 {tTime('freePracticeUntil')} {status.currentReservationEnd} (
                {status.currentReservationDuration} {tTime('minutes')})
              </>
            ) : (
              <>
                🔒 {tTime('reservedUntil')} {status.currentReservationEnd} (
                {status.currentReservationDuration} {tTime('minutes')})
              </>
            )}
          </span>
        ) : null}
        {status?.nextAvailableSlot &&
        !status?.hasReservationInNext1Hour &&
        !status?.currentReservationEnd ? (
          <span className="text-xs text-muted-foreground">
            ⏱️ {tTime('freeFor')} {status.nextAvailableSlot}
          </span>
        ) : null}
        {minutesAgo !== null ? (
          <span className="text-xs text-muted-foreground/70 flex items-center gap-1">
            🕐 {tTime('updated')}{' '}
            {minutesAgo === 0 ? tTime('justNow') : `${minutesAgo}m ${tTime('ago')}`}
          </span>
        ) : null}
        {status?.upcomingReservations && status.upcomingReservations.length > 0 ? (
          <details className="text-xs text-muted-foreground mt-1">
            <summary className="cursor-pointer hover:text-foreground transition-colors">
              📋 {tTime('upcomingReservations')} ({status.upcomingReservations.length})
            </summary>
            <div className="mt-2 space-y-2 pl-2 border-l-2 border-muted">
              {status.upcomingReservations.map((res, idx) => (
                <div key={idx} className="text-xs">
                  <div className="font-semibold text-foreground">{res.organization}</div>
                  {res.resourceName !== 'Unknown' ? (
                    <div className="text-muted-foreground">{res.resourceName}</div>
                  ) : null}
                </div>
              ))}
            </div>
          </details>
        ) : null}
      </div>
    </motion.li>
  );
}
