'use client';

import { SwimmingHallCard } from '@/components/swimming-hall-card';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { BestOptionFinder } from '@/components/best-option-finder';
import { NotificationToggle } from '@/components/notification-toggle';
import { BottomNav } from '@/components/bottom-nav';
import { useTranslations, useLocale } from 'next-intl';
import { useState, useCallback, type ReactElement, useMemo } from 'react';
import { Info, MapPin } from 'lucide-react';
import Link from 'next/link';
import { getUserLocation, calculateDistance, type UserLocation } from '@/lib/location-service';

export default function Home(): ReactElement {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationRequesting, setLocationRequesting] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const t = useTranslations('app');
  const tNav = useTranslations('navigation');
  const tLocation = useTranslations('location');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

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

      <BottomNav />
    </>
  );
}
