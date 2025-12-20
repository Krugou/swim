'use client';

import { Share2, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { shareAvailability, exportNextFreeSlot } from '@/lib/calendar-export';
import { useReservationData } from '@/lib/hooks/use-reservation-data';
import { reservationUrl } from '@/lib/swimming-halls-data';
import { useState } from 'react';

interface QuickActionsProps {
  hallName: string;
  linkName: string;
  resourceId: string;
  latitude: number;
  longitude: number;
}

export function QuickActions({
  hallName,
  linkName,
  resourceId,
  latitude,
  longitude,
}: QuickActionsProps) {
  const { data: status, isLoading } = useReservationData(resourceId);
  const tQuick = useTranslations('quickActions');
  const tStatus = useTranslations('status');
  const [shareSuccess, setShareSuccess] = useState(false);
  const [calendarSuccess, setCalendarSuccess] = useState(false);

  const isAvailable = status && !status.hasReservationInNext1Hour;
  const hasFreeTime = status?.nextAvailableSlot;

  const handleShare = async () => {
    const success = await shareAvailability(hallName, linkName, resourceId, !!isAvailable);
    if (success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  };

  const handleCalendarExport = () => {
    if (hasFreeTime) {
      const minutes = parseInt(hasFreeTime);
      if (!isNaN(minutes)) {
        exportNextFreeSlot(hallName, linkName, minutes, latitude, longitude);
        setCalendarSuccess(true);
        setTimeout(() => setCalendarSuccess(false), 2000);
      }
    }
  };

  const getStatusBadge = () => {
    if (isLoading) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded-full">
          <Loader2 className="h-3 w-3 animate-spin" />
          {tStatus('loading')}
        </span>
      );
    }
    if (status?.hasFreeReservation) {
      return (
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full animate-pulse">
          🎉 {tStatus('freeReservation')}
        </span>
      );
    }
    if (isAvailable) {
      return (
        <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">
          ✓ {tStatus('available')}
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">
        {tStatus('reserved')}
      </span>
    );
  };

  return (
    <div className="p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{linkName}</h4>
          <div className="mt-1">{getStatusBadge()}</div>
        </div>
        <a
          href={`${reservationUrl}${resourceId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring"
          title={tQuick('viewDetails')}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleShare}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
            shareSuccess
              ? 'bg-green-500 text-white'
              : 'bg-primary/10 hover:bg-primary/20 text-primary'
          }`}
          title={tQuick('share')}
        >
          <Share2 className="h-3.5 w-3.5" />
          {shareSuccess ? tQuick('shared') : tQuick('share')}
        </button>

        {hasFreeTime ? (
          <button
            onClick={handleCalendarExport}
            className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-md transition-colors focus-visible:ring-2 focus-visible:ring-ring ${
              calendarSuccess
                ? 'bg-green-500 text-white'
                : 'bg-primary/10 hover:bg-primary/20 text-primary'
            }`}
            title={tQuick('addToCalendar')}
          >
            <Calendar className="h-3.5 w-3.5" />
            {calendarSuccess ? tQuick('added') : tQuick('addToCalendar')}
          </button>
        ) : null}
      </div>
    </div>
  );
}
