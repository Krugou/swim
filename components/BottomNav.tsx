'use client';

import { Sparkles, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export const BottomNav = () => {
  const tNav = useTranslations('navigation');
  const tAccessibility = useTranslations('accessibility');
  const locale = useLocale();

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 border-t shadow-lg sm:hidden"
      role="navigation"
      aria-label="Bottom navigation"
    >
      <div className="flex items-center justify-center gap-2 h-16 px-4">
        <Button
          asChild
          variant="ghost"
          className="flex flex-col items-center justify-center py-2 px-6 h-auto hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={tAccessibility('findBestOptions')}
        >
          <Link href={`/${locale}/best`}>
            <Sparkles
              className="h-5 w-5 text-green-600 dark:text-green-400 mb-1"
              aria-hidden="true"
            />
            <span className="text-xs font-medium">{tNav('best')}</span>
          </Link>
        </Button>
        <Button
          asChild
          variant="ghost"
          className="flex flex-col items-center justify-center py-2 px-6 h-auto hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={tAccessibility('openStats')}
        >
          <Link href={`/${locale}/trends`}>
            <BarChart3 className="h-5 w-5 text-primary mb-1" aria-hidden="true" />
            <span className="text-xs font-medium">{tNav('trends')}</span>
          </Link>
        </Button>
      </div>
    </motion.nav>
  );
};
