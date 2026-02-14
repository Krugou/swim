'use client';

import { SwimmingHallCard } from '@/components/SwimmingHallCard';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { NotificationToggle } from '@/components/NotificationToggle';
import { BottomNav } from '@/components/BottomNav';
import { MobileMenu } from '@/components/MobileMenu';
import { useTranslations, useLocale } from 'next-intl';
import { type ReactElement, useMemo, useState } from 'react';
import { Info, Sparkles, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { calculateDistance, getUserLocation, type UserLocation } from '@/lib/location-service';
import { Button, buttonVariants } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { List, Map } from 'lucide-react';
import { slugify } from '@/lib/slugify';

const MapView = dynamic(() => import('@/components/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] bg-muted animate-pulse rounded-lg border-2 border-black dark:border-white flex items-center justify-center">
      Loading Map...
    </div>
  ),
});

const Home = (): ReactElement => {
  const t = useTranslations('app');
  const tNav = useTranslations('navigation');
  const tFooter = useTranslations('footer');
  const tLocation = useTranslations('location');
  const locale = useLocale();

  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const handleToggleLocation = async () => {
    if (userLocation) {
      setUserLocation(null);
      return;
    }

    setIsLocationLoading(true);
    const location = await getUserLocation();
    setIsLocationLoading(false);

    if (location) {
      setUserLocation(location);
    } else {
      // Handle error or denied permission if needed
      // transform error to toast or something? For now silent fail or console
      console.warn('Could not get location');
    }
  };

  const getLocationButtonText = () => {
    if (isLocationLoading) {
      return tLocation('requesting');
    }
    if (userLocation) {
      return tLocation('disable');
    }
    return tLocation('enable');
  };

  const sortedHalls = useMemo(() => {
    if (!userLocation) {
      return [...swimmingHallData].map((hall) => ({ ...hall, distance: undefined }));
    }

    return [...swimmingHallData]
      .map((hall) => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          hall.latitude,
          hall.longitude,
        );
        return { ...hall, distance };
      })
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
            <div className="hidden md:flex items-center gap-1 sm:gap-2">
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
            <MobileMenu />
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

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              href={`/${locale}/best`}
              className={cn(
                buttonVariants({ size: 'lg' }),
                'bg-linear-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105',
              )}
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <span>{t('findBestOptions')}</span>
            </Link>

            <Button
              onClick={handleToggleLocation}
              disabled={isLocationLoading}
              size="lg"
              className={`font-bold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                userLocation
                  ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              {isLocationLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <MapPin className="h-5 w-5" />
              )}
              <span>{getLocationButtonText()}</span>
            </Button>

            <div className="flex items-center bg-muted rounded-lg p-1 border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className={cn(
                  'rounded-md',
                  viewMode === 'list' && 'bg-background border-2 border-black dark:border-white',
                )}
              >
                <List className="h-4 w-4 mr-2" />
                {tNav('list')}
              </Button>
              <Button
                variant={viewMode === 'map' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className={cn(
                  'rounded-md',
                  viewMode === 'map' && 'bg-background border-2 border-black dark:border-white',
                )}
              >
                <Map className="h-4 w-4 mr-2" />
                {tNav('map')}
              </Button>
            </div>
          </div>

          <div className="mx-auto max-w-4xl">
            {viewMode === 'list' ? (
              <>
                {userLocation ? (
                  <div className="mb-4 text-center">
                    <span className="inline-block px-3 py-1 text-xs font-semibold bg-accent text-accent-foreground rounded-full">
                      📍 {tLocation('sortedByDistance')}
                    </span>
                  </div>
                ) : null}
                <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10">
                  {sortedHalls.map((hall) => (
                    <SwimmingHallCard
                      key={hall.swimmingHallName}
                      hallName={hall.swimmingHallName}
                      id={slugify(hall.swimmingHallName)}
                      links={hall.relatedLinks}
                      latitude={hall.latitude}
                      longitude={hall.longitude}
                      opening={hall.opening}
                      distance={hall.distance}
                    />
                  ))}
                </div>
              </>
            ) : (
              <MapView halls={sortedHalls} locale={locale} />
            )}
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
};

export default Home;
