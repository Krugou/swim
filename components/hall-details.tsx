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
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-7xl">
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

        {/* Content - Structured Card Grid */}
        <div className="p-6 sm:p-10 space-y-10">
          {/* Description Card - Full width focus */}
          <section className="bg-card rounded-2xl border p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <InfoIcon className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">{tDetails('description')}</h2>
            </div>
            <p className="text-muted-foreground text-lg leading-relaxed">{details.description}</p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Address Card */}
            <section className="bg-card rounded-2xl border p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">{tDetails('address')}</h3>
                </div>
                <p className="text-muted-foreground text-lg mb-6">{details.address}</p>
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hall.latitude},${hall.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground rounded-xl font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
              >
                <ExternalLink className="h-4 w-4" />
                {tDetails('getDirections')}
              </a>
            </section>

            {/* Opening Hours Card */}
            <section className="bg-card rounded-2xl border p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-bold">{tDetails('openingHours')}</h3>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">{details.opening}</p>
            </section>

            {/* Contact Card */}
            {details.phone ? (
              <section className="bg-card rounded-2xl border p-6 shadow-sm md:col-span-2">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="h-6 w-6 text-primary" />
                  <h3 className="text-xl font-bold">{tDetails('contact')}</h3>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <a
                    href={`tel:${details.phone}`}
                    className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 hover:scale-105 transition-transform origin-left"
                  >
                    {details.phone}
                  </a>
                  <p className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded-full font-medium">
                    Available for inquiries during opening hours
                  </p>
                </div>
              </section>
            ) : null}

            {/* Facilities Card */}
            <section className="bg-card rounded-2xl border p-6 shadow-sm md:col-span-2">
              <h3 className="text-xl font-bold mb-6">{tDetails('facilities')}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {details.facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-2 px-4 py-3 bg-muted/50 rounded-xl border-l-4 border-l-green-500 font-semibold text-sm shadow-sm"
                  >
                    <span className="text-green-600">✓</span>
                    {facility}
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Resources Section - Grid Layout */}
          <section>
            <h3 className="text-2xl font-bold mb-8 text-center">
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
      </motion.div>
    </div>
  );
}
