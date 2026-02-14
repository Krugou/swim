'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('pwa');

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          role="status"
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:bottom-4 md:w-96 z-50 p-4 bg-background border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] rounded-lg flex flex-col gap-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h3 className="font-bold text-lg">{t('installTitle')}</h3>
              <p className="text-sm text-muted-foreground">{t('installDescription')}</p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-foreground hover:text-foreground"
              aria-label={t('dismiss')}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-2 mt-1">
            <Button onClick={handleInstall} className="w-full font-bold" size="sm">
              <Download className="mr-2 h-4 w-4" />
              {t('installButton')}
            </Button>
            <Button
              onClick={handleDismiss}
              variant="outline"
              className="w-full font-bold"
              size="sm"
            >
              {t('maybeLater')}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
