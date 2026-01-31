'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type RelatedLink } from '@/lib/swimming-halls-data';
import { useTranslations } from 'next-intl';
import { RefreshCcw, Info } from 'lucide-react';
import { WeatherDisplay } from '@/components/weather-display';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { slugify } from '@/lib/slugify';
import { checkIsOpen } from '@/lib/opening-hours';
import { ResourceLink } from '@/components/resource-link';

interface SwimmingHallCardProps {
  hallName: string;
  links: RelatedLink[];
  latitude: number;
  longitude: number;
  distance?: number;
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
      <Card className="h-full transition-shadow hover:shadow-lg">
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
                  className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label={tDetails('viewDetails')}
                  title={tDetails('viewDetails')}
                >
                  <Info className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleRefreshAll}
                  className="p-2 hover:bg-muted rounded-full cursor-pointer transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
