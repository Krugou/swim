'use client';

import { SwimmingHallCard } from '@/components/swimming-hall-card';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { BestOptionFinder } from '@/components/best-option-finder';
import { CalendarView } from '@/components/calendar-view';
import { ChartsView } from '@/components/charts-view';
import { MapsView } from '@/components/maps-view';
import { NotificationToggle } from '@/components/notification-toggle';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useCallback, type ReactElement, useMemo } from 'react';
import { Calendar, TrendingUp, Info, MapPin, Map } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { getUserLocation, calculateDistance, type UserLocation } from '@/lib/location-service';

export default function Home(): ReactElement {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showMaps, setShowMaps] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationRequesting, setLocationRequesting] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const t = useTranslations('app');
  const tNav = useTranslations('navigation');
  const tLocation = useTranslations('location');
  const tAccessibility = useTranslations('accessibility');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const handleOpenCalendar = useCallback(() => {
    setShowCalendar(true);
  }, []);
  const handleCloseCalendar = useCallback(() => {
    setShowCalendar(false);
  }, []);
  const handleOpenCharts = useCallback(() => {
    setShowCharts(true);
  }, []);
  const handleCloseCharts = useCallback(() => {
    setShowCharts(false);
  }, []);
  const handleOpenMaps = useCallback(() => {
    setShowMaps(true);
  }, []);
  const handleCloseMaps = useCallback(() => {
    setShowMaps(false);
  }, []);

  const handleToggleLocation = useCallback(async () => {
    if (locationEnabled) {
      setLocationEnabled(false);
      setUserLocation(null);
    } else {
      setLocationRequesting(true);
      const location = await getUserLocation();
      setLocationRequesting(false);
      if (location) {
        setUserLocation(location);
        setLocationEnabled(true);
      }
    }
  }, [locationEnabled]);

  const sortedHalls = useMemo(() => {
    if (!userLocation) {
      return swimmingHallData.map((hall) => ({ ...hall, distance: undefined }));
    }

    return [...swimmingHallData]
      .map((hall) => ({
        ...hall,
        distance: calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hall.latitude,
          hall.longitude
        ),
      }))
      .sort((a, b) => (a.distance || 0) - (b.distance || 0));
  }, [userLocation]);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary truncate">
            {tNav('swimmingHalls')}
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationToggle />
            <button
              onClick={handleToggleLocation}
              disabled={locationRequesting}
              className={`p-2 rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
                locationEnabled
                  ? 'bg-green-500/20 hover:bg-green-500/30 text-green-600 dark:text-green-400'
                  : 'hover:bg-accent'
              }`}
              aria-label={locationEnabled ? tLocation('disable') : tLocation('enable')}
              title={locationEnabled ? tLocation('disable') : tLocation('enable')}
            >
              <MapPin
                className={`h-4 w-4 sm:h-5 sm:w-5 ${locationRequesting ? 'animate-pulse' : ''}`}
                aria-hidden="true"
              />
            </button>
            <button
              onClick={handleOpenMaps}
              className="hidden sm:flex p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open Maps"
              title="Maps View"
            >
              <Map className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleOpenCalendar}
              className="hidden sm:flex p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={tAccessibility('openCalendar')}
              title="Calendar View"
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleOpenCharts}
              className="hidden sm:flex p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={tAccessibility('openStats')}
              title="Statistics"
            >
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
            <Link
              href={`/${locale}/about`}
              className="p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={tNav('about')}
              title={tNav('about')}
            >
              <Info className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </Link>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main id="main-content" className="min-h-screen bg-linear-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 sm:px-6 lg:px-8">
          <div className="mb-4 sm:mb-6 md:mb-8 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
              {t('title')}
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              {t('description')}
            </p>
          </div>

          <BestOptionFinder />

          {locationEnabled && userLocation ? (
            <div className="mb-4 text-center">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-300 rounded-full text-sm font-medium">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {tLocation('sortedByDistance')}
              </span>
            </div>
          ) : null}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {sortedHalls.map((hall) => (
              <SwimmingHallCard
                key={hall.swimmingHallName}
                hallName={hall.swimmingHallName}
                links={hall.relatedLinks}
                latitude={hall.latitude}
                longitude={hall.longitude}
                {...(hall.distance !== undefined && { distance: hall.distance })}
              />
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t bg-background/95 backdrop-blur mt-8">
        <div className="container mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8">
          <div className="text-center text-xs sm:text-sm text-muted-foreground">
            <p>
              © {new Date().getFullYear()} {tFooter('copyright')}
            </p>
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showCalendar ? <CalendarView onClose={handleCloseCalendar} /> : null}
      </AnimatePresence>

      <AnimatePresence>
        {showCharts ? <ChartsView onClose={handleCloseCharts} /> : null}
      </AnimatePresence>

      <AnimatePresence>{showMaps ? <MapsView onClose={handleCloseMaps} /> : null}</AnimatePresence>
    </>
  );
}
