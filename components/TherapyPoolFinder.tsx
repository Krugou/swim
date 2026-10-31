'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useQueries } from '@tanstack/react-query';
import { Loader2, MapPin, Waves } from 'lucide-react';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { fetchReservationData } from '@/lib/hooks/use-reservation-data';
import { calculateDistance, getUserLocation, type UserLocation } from '@/lib/location-service';
import {
  findNextSlot,
  pickBestCandidate,
  LOOKAHEAD_HOURS,
  type TherapyCandidate,
} from '@/lib/therapy-slot';
import { WeatherDisplay } from '@/components/WeatherDisplay';

const THERAPY_LINK_NAME = 'Terapia-allas';

const therapyPools = swimmingHallData.flatMap((hall) =>
  hall.relatedLinks
    .filter((link) => link.relatedLinkName === THERAPY_LINK_NAME)
    .map((link) => ({
      hallName: hall.swimmingHallName,
      linkName: link.relatedLinkName,
      resourceId: link.url,
      latitude: hall.latitude,
      longitude: hall.longitude,
    })),
);

type GpsState = 'idle' | 'checking' | 'ready' | 'denied';

export const TherapyPoolFinder = () => {
  const t = useTranslations('therapy');
  const tReservation = useTranslations('reservation');
  const locale = useLocale();
  const [active, setActive] = useState(false);
  const [gps, setGps] = useState<GpsState>('idle');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  useEffect(() => {
    if (!active || gps !== 'idle') {
      return;
    }
    setGps('checking');
    getUserLocation()
      .then((loc) => {
        setUserLocation(loc);
        setGps(loc ? 'ready' : 'denied');
      })
      .catch(() => setGps('denied'));
  }, [active, gps]);

  const queries = useQueries({
    queries: therapyPools.map((pool) => ({
      queryKey: ['reservations-ahead', pool.resourceId, LOOKAHEAD_HOURS],
      queryFn: () => fetchReservationData(pool.resourceId, LOOKAHEAD_HOURS),
      enabled: active,
    })),
  });

  const loading = active && (queries.some((q) => q.isLoading) || gps === 'checking');

  const computeBest = (): TherapyCandidate | null => {
    if (!active) {
      return null;
    }
    const now = new Date();
    const candidates: TherapyCandidate[] = [];
    therapyPools.forEach((pool, index) => {
      const data = queries[index]?.data;
      if (!data) {
        return;
      }
      const slot = findNextSlot(data, now);
      if (slot) {
        candidates.push({
          ...slot,
          ...pool,
          distanceKm: userLocation
            ? calculateDistance(
                userLocation.latitude,
                userLocation.longitude,
                pool.latitude,
                pool.longitude,
              )
            : undefined,
        });
      }
    });
    return pickBestCandidate(candidates);
  };
  const best = computeBest();

  const formatTime = (d: Date) =>
    d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="mb-8 rounded-2xl border border-sky-600 bg-sky-50/50 p-6 dark:bg-sky-950/40">
      <h2 className="flex items-center gap-2 text-xl font-bold">
        <Waves className="h-6 w-6 text-primary" aria-hidden="true" />
        {t('title')}
      </h2>
      <p className="mb-4 text-sm text-muted-foreground">{t('subtitle')}</p>

      {!active ? (
        <button
          type="button"
          onClick={() => setActive(true)}
          data-testid="therapy-find"
          className="rounded-xl bg-primary px-5 py-3 font-bold text-primary-foreground hover:bg-primary/90"
        >
          {t('find')}
        </button>
      ) : loading ? (
        <div className="flex items-center gap-3" data-testid="therapy-loading">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span>{gps === 'checking' ? t('gpsChecking') : t('searching')}</span>
        </div>
      ) : (
        <div className="space-y-4" data-testid="therapy-result">
          {gps === 'denied' ? <p className="text-sm text-accent">{t('gpsDenied')}</p> : null}

          {best ? (
            <div className="space-y-3 rounded-xl bg-muted p-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <h3 className="text-lg font-bold leading-tight">{best.hallName}</h3>
                  <p className="text-sm text-muted-foreground">{best.linkName}</p>
                  {best.distanceKm !== undefined ? (
                    <p className="text-sm text-muted-foreground">
                      {t('distance', { km: best.distanceKm.toFixed(1) })}
                    </p>
                  ) : null}
                </div>
              </div>

              <p className="font-semibold">
                {best.kind === 'free-practice' ? '🎉 ' + t('freePractice') : '✓ ' + t('available')}
                {' · '}
                {t('startsAt')} {formatTime(best.start)}
                {best.end ? ` ${t('until')} ${formatTime(best.end)}` : ''}
              </p>

              <div className="space-y-1">
                {userLocation ? (
                  <WeatherDisplay
                    latitude={userLocation.latitude}
                    longitude={userLocation.longitude}
                    label={t('yourLocation')}
                  />
                ) : null}
                <WeatherDisplay
                  latitude={best.latitude}
                  longitude={best.longitude}
                  label={t('hallLocation')}
                />
                <p className="text-xs text-muted-foreground">{t('weatherSource')}</p>
              </div>

              <a
                href={`https://resurssivaraus.espoo.fi/liikunnantilavaraus/haku/?ResourceIDs=${best.resourceId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl bg-primary px-4 py-3 text-center font-bold text-primary-foreground hover:bg-primary/90"
              >
                {tReservation('bookNow')}
              </a>
            </div>
          ) : (
            <p data-testid="therapy-none">{t('none')}</p>
          )}
        </div>
      )}
    </section>
  );
};
