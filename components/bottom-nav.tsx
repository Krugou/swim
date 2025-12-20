'use client';

import { Calendar, TrendingUp, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface BottomNavProps {
  onCalendarClick: () => void;
  onChartsClick: () => void;
  onBestOptionClick: () => void;
}

export function BottomNav({ onCalendarClick, onChartsClick, onBestOptionClick }: BottomNavProps) {
  const tNav = useTranslations('navigation');
  const tAccessibility = useTranslations('accessibility');

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 border-t shadow-lg sm:hidden"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-around h-16 px-4">
        <button
          onClick={onBestOptionClick}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-2 px-3 rounded-lg hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={tAccessibility('findBestOptions')}
        >
          <Sparkles className="h-5 w-5 text-green-600 dark:text-green-400" aria-hidden="true" />
          <span className="text-xs font-medium">{tNav('best')}</span>
        </button>

        <button
          onClick={onCalendarClick}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-2 px-3 rounded-lg hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={tAccessibility('openCalendar')}
        >
          <Calendar className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">{tNav('calendar')}</span>
        </button>

        <button
          onClick={onChartsClick}
          className="flex flex-col items-center justify-center flex-1 gap-1 py-2 px-3 rounded-lg hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={tAccessibility('openStats')}
        >
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
          <span className="text-xs font-medium">{tNav('stats')}</span>
        </button>
      </div>
    </motion.nav>
  );
}
