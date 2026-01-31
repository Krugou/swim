'use client';

import { SwimmingHallCard } from '@/components/swimming-hall-card';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { BestOptionFinder } from '@/components/best-option-finder';
import { NotificationToggle } from '@/components/notification-toggle';
import { BottomNav } from '@/components/bottom-nav';
import { useTranslations, useLocale } from 'next-intl';
import { type ReactElement, useMemo } from 'react';
import { Info } from 'lucide-react';
import Link from 'next/link';
export default function Home(): ReactElement {
  const t = useTranslations('app');
  const tNav = useTranslations('navigation');
  const tFooter = useTranslations('footer');
  const locale = useLocale();

  const sortedHalls = useMemo(() => {
    return [...swimmingHallData].map((hall) => ({ ...hall, distance: undefined }));
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary truncate">
            {tNav('swimmingHalls')}
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <NotificationToggle />
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

          <div className="mx-auto max-w-4xl">
            <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-10">
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
