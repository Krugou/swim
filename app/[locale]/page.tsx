'use client';

import { SwimmingHallCard } from '@/components/swimming-hall-card';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { BestOptionFinder } from '@/components/best-option-finder';
import { CalendarView } from '@/components/calendar-view';
import { ChartsView } from '@/components/charts-view';
import { useTranslations } from 'next-intl';
import { useState, useCallback } from 'react';
import { Calendar, TrendingUp } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const t = useTranslations('app');

  const handleOpenCalendar = useCallback(() => setShowCalendar(true), []);
  const handleCloseCalendar = useCallback(() => setShowCalendar(false), []);
  const handleOpenCharts = useCallback(() => setShowCharts(true), []);
  const handleCloseCharts = useCallback(() => setShowCharts(false), []);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <h1 className="text-base sm:text-lg md:text-xl font-bold text-primary truncate">
            Swimming Halls
          </h1>
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleOpenCalendar}
              className="p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open calendar view"
              title="Calendar View"
            >
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
            <button
              onClick={handleOpenCharts}
              className="p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Open statistics"
              title="Statistics"
            >
              <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
            </button>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </header>
      
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-background to-muted/20">
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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {swimmingHallData.map((hall) => (
              <SwimmingHallCard
                key={hall.swimmingHallName}
                hallName={hall.swimmingHallName}
                links={hall.relatedLinks}
              />
            ))}
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-background/95 backdrop-blur mt-8">
        <div className="container mx-auto px-4 py-4 sm:py-6 sm:px-6 lg:px-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Swimming Hall Schedules. All rights reserved.</p>
        </div>
      </footer>

      <AnimatePresence>
        {showCalendar && <CalendarView onClose={handleCloseCalendar} />}
      </AnimatePresence>

      <AnimatePresence>
        {showCharts && <ChartsView onClose={handleCloseCharts} />}
      </AnimatePresence>
    </>
  );
}
