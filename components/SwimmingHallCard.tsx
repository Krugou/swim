'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { type RelatedLink } from '@/lib/swimming-halls-data';
import { useTranslations, useLocale } from 'next-intl';
import { RefreshCcw, Info } from 'lucide-react';
import { WeatherDisplay } from '@/components/WeatherDisplay';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { slugify } from '@/lib/slugify';
import { checkIsOpen } from '@/lib/opening-hours';
import { ResourceLink } from '@/components/ResourceLink';
import { toast } from 'sonner';

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
  const tQuickActions = useTranslations('quickActions');
  const tDetails = useTranslations('hallDetails');
  const queryClient = useQueryClient();
  const locale = useLocale();
  const isOpen = checkIsOpen(opening);

  const handleRefreshAll = () => {
    toast.info(tDetails('refreshingData'));
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
      <Card interactive className="h-full">
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
                <Button
                  asChild
                  variant="secondary"
                  size="icon"
                  aria-label={tDetails('viewDetails')}
                  title={tDetails('viewDetails')}
                >
                  <Link href={`/${locale}/hall/${slugify(hallName)}`}>
                    <Info className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="accent"
                  size="icon"
                  onClick={handleRefreshAll}
                  aria-label={tQuickActions('refresh')}
                  title={tQuickActions('refresh')}
                >
                  <RefreshCcw className="h-4 w-4" />
                </Button>
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
