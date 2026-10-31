'use client';

import { Suspense } from 'react';
import { useLocale } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { BestCarousel } from '@/components/BestCarousel';
import { useBestOptions } from '@/lib/hooks/use-best-options';
import { parseBestViewParams } from '@/lib/best-view';

interface RunnerProps {
  intervalSec: number;
  exitHref: string;
}

// Mounted only in carousel mode so reservation queries don't run otherwise.
const CarouselRunner = ({ intervalSec, exitHref }: RunnerProps) => {
  const { options, loading } = useBestOptions();
  return (
    <BestCarousel
      options={options}
      loading={loading}
      intervalSec={intervalSec}
      exitHref={exitHref}
    />
  );
};

const Gate = ({ exitPath }: { exitPath: string }) => {
  const locale = useLocale();
  const view = parseBestViewParams(useSearchParams());
  if (view.mode !== 'carousel') {
    return null;
  }
  return <CarouselRunner intervalSec={view.intervalSec} exitHref={`/${locale}${exitPath}`} />;
};

/** Overlays the full-screen carousel on any page when `?view=carousel` is present. */
export const BestCarouselGate = ({ exitPath = '' }: { exitPath?: string }) => (
  <Suspense fallback={null}>
    <Gate exitPath={exitPath} />
  </Suspense>
);
