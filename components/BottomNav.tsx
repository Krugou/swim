'use client';

import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export function BottomNav() {
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
      <div className="flex items-center justify-center h-16 px-4">
        <Button
          onClick={() => {
            const element = document.getElementById('best-option-finder');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          variant="ghost"
          className="flex flex-col items-center justify-center py-2 px-6 h-auto hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={tAccessibility('findBestOptions')}
        >
          <Sparkles
            className="h-5 w-5 text-green-600 dark:text-green-400 mb-1"
            aria-hidden="true"
          />
          <span className="text-xs font-medium">{tNav('best')}</span>
        </Button>
      </div>
    </motion.nav>
  );
}
