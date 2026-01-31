'use client';

import { motion } from 'framer-motion';
import { X, MapPin, ExternalLink, Phone, Clock, Info as InfoIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { type SwimmingHall } from '@/lib/swimming-halls-data';
import { QuickActions } from './quick-actions';

interface HallDetailsProps {
  hall: SwimmingHall;
  onClose: () => void;
}

// Swimming hall details (you can expand this with real data)
const hallDetails: Record<
  string,
  {
    description: string;
    facilities: string[];
    opening: string;
    phone?: string;
    address: string;
  }
> = {
  'Matinkylän uimahalli': {
    description: 'Modern 50m swimming hall with therapy pool and gym facilities.',
    facilities: ['50m Pool', 'Therapy Pool', 'Gym', 'Sauna', 'Changing Rooms', 'Lockers'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 29400',
    address: 'Säterinkatu 8, 02230 Espoo',
  },
  'Leppävaaran uimahalli': {
    description: 'Large swimming complex with indoor and outdoor pools.',
    facilities: ['Indoor Pool', 'Outdoor Pool (Summer)', 'Therapy Pool', 'Gym', 'Sauna', 'Café'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 28000',
    address: 'Veräjäpellonkatu 30, 02650 Espoo',
  },
  'Espoonlahden uimahalli': {
    description: '50m competition pool with gym facilities.',
    facilities: ['50m Pool', 'Gym', 'Sauna', 'Changing Rooms', 'Lockers'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 27500',
    address: 'Sairaalaportinkatu 1, 02320 Espoo',
  },
  'Keski-Espoon uimahalli': {
    description: 'Swimming hall with therapy pool and gym.',
    facilities: ['Pool', 'Therapy Pool', 'Gym', 'Sauna', 'Changing Rooms'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 26600',
    address: 'Säterinkatu 9, 02650 Espoo',
  },
  'Olari uimahalli': {
    description: 'Neighborhood swimming hall with gym.',
    facilities: ['Pool', 'Gym', 'Sauna', 'Changing Rooms', 'Lockers'],
    opening: 'Mon-Fri: 6:00-21:00, Sat-Sun: 8:00-18:00',
    phone: '+358 9 816 25900',
    address: 'Olarin tennistie 1, 02210 Espoo',
  },
};

export function HallDetails({ hall, onClose }: HallDetailsProps) {
  const t = useTranslations('navigation');
  const tDetails = useTranslations('hallDetails');

  const details = hallDetails[hall.swimmingHallName] || {
    description: 'A swimming hall in Espoo.',
    facilities: ['Pool', 'Changing Rooms'],
    opening: 'Check official website for hours',
    address: 'Espoo, Finland',
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card rounded-xl border shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            {hall.swimmingHallName}
          </h1>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t('back')}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content - Single focused column */}
        <div className="mx-auto max-w-4xl w-full divide-y flex flex-col">
          {/* Main Info */}
          <div className="p-6 sm:p-10 space-y-10">
            {/* Description */}
            <section className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <InfoIcon className="h-8 w-8 text-primary" />
                <h2 className="text-2xl font-semibold">{tDetails('description')}</h2>
              </div>
              <p className="text-muted-foreground text-xl leading-relaxed max-w-3xl mx-auto">
                {details.description}
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
              {/* Address */}
              <section className="bg-muted/30 p-6 rounded-xl border">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">{tDetails('address')}</h3>
                </div>
                <p className="text-muted-foreground text-lg">{details.address}</p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${hall.latitude},${hall.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium hover:bg-primary/20 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  {tDetails('getDirections')}
                </a>
              </section>

              {/* Opening Hours */}
              <section className="bg-muted/30 p-6 rounded-xl border">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">{tDetails('openingHours')}</h3>
                </div>
                <p className="text-muted-foreground text-lg">{details.opening}</p>
              </section>
            </div>

            {/* Phone */}
            {details.phone ? (
              <section className="text-center pt-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-semibold">{tDetails('contact')}</h3>
                </div>
                <a
                  href={`tel:${details.phone}`}
                  className="text-3xl font-bold text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  {details.phone}
                </a>
              </section>
            ) : null}

            {/* Facilities */}
            <section className="pt-6">
              <h3 className="text-xl font-semibold mb-6 text-center">{tDetails('facilities')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {details.facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-muted/50 rounded-xl border text-center"
                  >
                    <span className="text-green-600 font-bold">✓</span>
                    <span className="text-sm font-semibold">{facility}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Resources - Now below and prominently displayed */}
          <div className="bg-muted/20 p-6 sm:p-10">
            <section className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-semibold mb-8 text-center">
                {tDetails('availableResources')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {hall.relatedLinks.map((link) => (
                  <QuickActions
                    key={link.url}
                    hallName={hall.swimmingHallName}
                    linkName={link.relatedLinkName}
                    resourceId={link.url}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
