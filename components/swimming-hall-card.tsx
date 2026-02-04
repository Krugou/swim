'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type RelatedLink } from '@/lib/swimming-halls-data';
import { useTranslations, useLocale } from 'next-intl';
import { RefreshCcw, Info } from 'lucide-react';
import { WeatherDisplay } from '@/components/weather-display';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { slugify } from '@/lib/slugify';
import { checkIsOpen } from '@/lib/opening-hours';
import { ResourceLink } from '@/components/resource-link';

interface SwimmingHallCardProps {
  hallName: string;
  links: RelatedLink[];
  latitude: number;
  longitude: number;
  distance?: number | undefined;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  opening?: string | undefined;
}

export function SwimmingHallCard({
  hallName,
  links,
  latitude,
  longitude,
  distance,
  opening,
}: SwimmingHallCardProps) {
  const tLocation = useTranslations('location');
  const tDetails = useTranslations('hallDetails');
  const queryClient = useQueryClient();
  const locale = useLocale();
  const isOpen = checkIsOpen(opening);

  const handleRefreshAll = () => {
    links.forEach((link) => {
      queryClient.invalidateQueries({ queryKey: ['reservations', link.url] });
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
    >
      <Card className="h-full transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
        <CardHeader>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <CardTitle className="text-lg sm:text-xl text-primary">{hallName}</CardTitle>
              <div className="flex items-center gap-2">
                {distance !== undefined ? (
                  <span className="text-sm font-semibold text-primary whitespace-nowrap">
                    📍 {distance.toFixed(1)} km {tLocation('away')}
                  </span>
                ) : null}
                <Link
                  href={`/${locale}/hall/${slugify(hallName)}`}
                  className="p-2 bg-secondary text-secondary-foreground border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all"
                  aria-label={tDetails('viewDetails')}
                  title={tDetails('viewDetails')}
                >
                  <Info className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleRefreshAll}
                  className="p-2 bg-accent text-accent-foreground border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all"
                  aria-label="Refresh all data"
                  title="Refresh all data"
                >
                  <RefreshCcw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <WeatherDisplay latitude={latitude} longitude={longitude} />
          </div>
        </CardHeader>
        <CardContent>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
            {links.map((link) => (
              <ResourceLink key={link.url} link={link} isOpen={isOpen} />
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
