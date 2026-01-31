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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed right-0 top-0 bottom-0 w-full sm:w-[500px] bg-background border-l shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h2 className="text-xl font-bold text-foreground">{hall.swimmingHallName}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t('back')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <InfoIcon className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{tDetails('description')}</h3>
              </div>
              <p className="text-muted-foreground">{details.description}</p>
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{tDetails('address')}</h3>
              </div>
              <p className="text-muted-foreground">{details.address}</p>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hall.latitude},${hall.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
              >
                <ExternalLink className="h-4 w-4" />
                {tDetails('getDirections')}
              </a>
            </div>

            {/* Opening Hours */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">{tDetails('openingHours')}</h3>
              </div>
              <p className="text-muted-foreground">{details.opening}</p>
            </div>

            {/* Phone */}
            {details.phone ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="h-5 w-5 text-primary" />
                  <h3 className="text-lg font-semibold">{tDetails('contact')}</h3>
                </div>
                <a
                  href={`tel:${details.phone}`}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {details.phone}
                </a>
              </div>
            ) : null}

            {/* Facilities */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{tDetails('facilities')}</h3>
              <div className="grid grid-cols-2 gap-2">
                {details.facilities.map((facility) => (
                  <div
                    key={facility}
                    className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg"
                  >
                    <span className="text-green-500">✓</span>
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Resources */}
            <div>
              <h3 className="text-lg font-semibold mb-3">{tDetails('availableResources')}</h3>
              <div className="space-y-2">
                {hall.relatedLinks.map((link) => (
                  <QuickActions
                    key={link.url}
                    hallName={hall.swimmingHallName}
                    linkName={link.relatedLinkName}
                    resourceId={link.url}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
