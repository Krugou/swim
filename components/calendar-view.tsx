'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS, fi, sv } from 'date-fns/locale';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import type { Locale } from '@/lib/i18n/config';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  resource: {
    hallName: string;
    linkName: string;
    isFree: boolean;
  };
}

interface CalendarViewProps {
  onClose: () => void;
}

const locales = {
  en: enUS,
  fi: fi,
  sv: sv,
};

export const CalendarView = React.memo(function CalendarView({ onClose }: CalendarViewProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations('status');
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedHall, setSelectedHall] = useState<string>('all');

  const localizer = useMemo(
    () =>
      dateFnsLocalizer({
        format,
        parse,
        startOfWeek: () => startOfWeek(new Date(), { locale: locales[locale] }),
        getDay,
        locales: { [locale]: locales[locale] },
      }),
    [locale]
  );

  const loadReservations = useCallback(async (hallFilter: string = 'all') => {
    setIsLoading(true);
    const allEvents: CalendarEvent[] = [];

    try {
      const { swimmingHallData } = await import('@/lib/swimming-halls-data');
      const hallsToFetch = hallFilter === 'all' 
        ? swimmingHallData 
        : swimmingHallData.filter(h => h.swimmingHallName === hallFilter);

      const fetchPromises = hallsToFetch.flatMap((hall) =>
        hall.relatedLinks.map(async (link) => {
          const timeWindow = getTimeWindow();
          const proxyUrl = buildProxyUrl(link.url, timeWindow);

          try {
            const response = await fetch(proxyUrl);
            const data = await response.json();

            data.forEach((reservation: any) => {
              allEvents.push({
                title: `${hall.swimmingHallName} - ${link.relatedLinkName}`,
                start: new Date(reservation.start),
                end: new Date(reservation.end),
                resource: {
                  hallName: hall.swimmingHallName,
                  linkName: link.relatedLinkName,
                  isFree: reservation.title?.includes('Vapaaharjoitte') || false,
                },
              });
            });
          } catch (error) {
            console.error('Error fetching reservations:', error);
          }
        })
      );

      await Promise.all(fetchPromises);
      setEvents(allEvents);
    } catch (error) {
      console.error('Error loading reservations:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadReservations(selectedHall);
  }, [loadReservations, selectedHall]);

  const eventStyleGetter = useCallback((event: CalendarEvent) => {
    const isFree = event.resource.isFree;
    return {
      style: {
        backgroundColor: isFree ? '#22c55e' : '#3b82f6',
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: 'none',
        display: 'block',
      },
    };
  }, []);

  const handleSelectHall = useCallback((hall: string) => {
    setSelectedHall(hall);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border rounded-lg shadow-2xl w-full max-w-7xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-6 border-b">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-primary" aria-hidden="true" />
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">
              Reservation Calendar
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-accent transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Close calendar"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="mb-4">
            <label htmlFor="hall-filter" className="block text-sm font-medium mb-2">
              Filter by Swimming Hall:
            </label>
            <select
              id="hall-filter"
              value={selectedHall}
              onChange={(e) => handleSelectHall(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border rounded-md bg-background text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="all">All Halls</option>
              <option value="Matinkylän uimahalli">Matinkylän uimahalli</option>
              <option value="Leppävaaran uimahalli">Leppävaaran uimahalli</option>
              <option value="Espoonlahden uimahalli">Espoonlahden uimahalli</option>
              <option value="Keski-Espoon uimahalli">Keski-Espoon uimahalli</option>
              <option value="Olari uimahalli">Olari uimahalli</option>
            </select>
          </div>

          <div className="flex gap-4 mb-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded" />
              <span>Regular Reservations</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span>Free Practice</span>
            </div>
          </div>

          {isLoading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
                <p className="text-muted-foreground">{t('loading')}</p>
              </div>
            </div>
          ) : (
            <div className="calendar-container" style={{ height: '600px' }}>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: '100%' }}
                eventPropGetter={eventStyleGetter}
                views={['month', 'week', 'day']}
                defaultView="week"
              />
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
});

// Helper functions
const getTimeWindow = (): { start: number; end: number } => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  const sevenDaysInSeconds = 7 * 24 * 60 * 60;
  return {
    start: nowInSeconds - sevenDaysInSeconds,
    end: nowInSeconds + sevenDaysInSeconds,
  };
};

const buildProxyUrl = (resourceId: string, timeWindow: { start: number; end: number }): string => {
  const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${resourceId}&start=${timeWindow.start}&end=${timeWindow.end}&_=${timeWindow.start}`;
  return `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;
};
