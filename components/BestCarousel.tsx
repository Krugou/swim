'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  X,
} from 'lucide-react';
import { WeatherDisplay } from '@/components/WeatherDisplay';

export interface BestOption {
  hallName: string;
  linkName: string;
  resourceId: string;
  reason: string;
  latitude: number;
  longitude: number;
}

interface BestCarouselProps {
  options: BestOption[];
  loading: boolean;
  intervalSec: number;
  exitHref: string;
}

export const BestCarousel = ({ options, loading, intervalSec, exitHref }: BestCarouselProps) => {
  const t = useTranslations('status');
  const tBest = useTranslations('bestOption');
  const tCarousel = useTranslations('carousel');
  const tWeather = useTranslations('therapy');
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const count = options.length;
  const current = count > 0 ? options[index % count] : undefined;

  const go = useCallback(
    (delta: number) => {
      if (count > 0) {
        setIndex((i) => (i + delta + count) % count);
      }
    },
    [count],
  );

  useEffect(() => {
    if (paused || count < 2) {
      return;
    }
    const id = window.setInterval(() => go(1), intervalSec * 1000);
    return () => window.clearInterval(id);
  }, [paused, count, intervalSec, go, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        go(1);
      } else if (e.key === 'ArrowLeft') {
        go(-1);
      } else if (e.key === ' ') {
        e.preventDefault();
        setPaused((p) => !p);
      } else if (e.key === 'Escape' && !document.fullscreenElement) {
        router.push(exitHref);
      }
    };
    const onFullscreen = () => setIsFullscreen(Boolean(document.fullscreenElement));
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFullscreen);
    };
  }, [go, router, exitHref]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      void document.documentElement.requestFullscreen?.().catch(() => undefined);
    }
  };

  const isFree = current?.reason === 'free-practice';
  const controlClass =
    'rounded-full bg-background/80 p-3 text-foreground shadow-md backdrop-blur transition hover:bg-background focus-visible:ring-2 focus-visible:ring-ring';

  if (!mounted) {
    return null;
  }

  return createPortal(
    <div
      className="fixed left-0 top-0 z-[100] flex h-dvh w-screen max-w-full flex-col overflow-hidden bg-linear-to-br from-primary via-sky-700 to-slate-900 text-white"
      data-testid="best-carousel"
    >
      <div className="flex items-center justify-between p-4 sm:p-6">
        <h1 className="text-xl font-bold sm:text-3xl">{tBest('bestOptionsTitle')}</h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className={controlClass}
            aria-label={paused ? tCarousel('play') : tCarousel('pause')}
          >
            {paused ? <Play className="h-5 w-5" /> : <Pause className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            className={controlClass}
            aria-label={isFullscreen ? tCarousel('exitFullscreen') : tCarousel('fullscreen')}
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={() => router.push(exitHref)}
            className={controlClass}
            aria-label={tCarousel('exit')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-16">
        {loading && count === 0 ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-14 w-14 animate-spin" />
            <p className="text-2xl">{tBest('searching')}</p>
          </div>
        ) : !current ? (
          <p className="text-center text-3xl font-bold" data-testid="carousel-empty">
            {tBest('noSlotsAvailable')}
          </p>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${current.resourceId}-${index}`}
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -120 }}
              transition={{ duration: 0.45 }}
              className="w-full max-w-4xl space-y-6 text-center"
              data-testid="carousel-slide"
            >
              <span
                className={`inline-block rounded-full px-6 py-2 text-lg font-bold sm:text-2xl ${
                  isFree ? 'bg-accent text-accent-foreground' : 'bg-white/20'
                }`}
              >
                {isFree ? `🎉 ${t('freeReservation')}` : `✓ ${t('available')}`}
              </span>
              <h2 className="text-4xl font-bold leading-tight sm:text-7xl">{current.hallName}</h2>
              <p className="text-2xl text-white/80 sm:text-4xl">{current.linkName}</p>
              <div className="flex justify-center text-white">
                <WeatherDisplay
                  latitude={current.latitude}
                  longitude={current.longitude}
                  label={tWeather('hallLocation')}
                  large
                />
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {count > 1 ? (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              className={`${controlClass} absolute left-3 top-1/2 -translate-y-1/2`}
              aria-label={tCarousel('previous')}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              className={`${controlClass} absolute right-3 top-1/2 -translate-y-1/2`}
              aria-label={tCarousel('next')}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        ) : null}
      </div>

      <div className="flex flex-col items-center gap-3 p-4 sm:p-6">
        {count > 1 ? (
          <div className="flex gap-2" role="tablist" aria-label={tCarousel('slides')}>
            {options.map((o, i) => (
              <button
                key={o.resourceId}
                type="button"
                role="tab"
                aria-selected={i === index % count}
                aria-label={`${i + 1} / ${count}`}
                onClick={() => setIndex(i)}
                className={`h-3 rounded-full transition-all ${
                  i === index % count ? 'w-10 bg-white' : 'w-3 bg-white/40'
                }`}
              />
            ))}
          </div>
        ) : null}
        {count > 1 && !paused ? (
          <div className="h-1 w-full max-w-md overflow-hidden rounded-full bg-white/20">
            <motion.div
              key={`${index}-${intervalSec}`}
              className="h-full bg-white"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: intervalSec, ease: 'linear' }}
            />
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
};
