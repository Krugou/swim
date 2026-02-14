'use client';

import { Share2, ExternalLink, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { shareAvailability } from '@/lib/calendar-export';
import { useReservationData } from '@/lib/hooks/use-reservation-data';
import { reservationUrl } from '@/lib/swimming-halls-data';
import { useState } from 'react';

interface QuickActionsProps {
  hallName: string;
  linkName: string;
  resourceId: string;
}

export function QuickActions({ hallName, linkName, resourceId }: QuickActionsProps) {
  const { data: status, isLoading } = useReservationData(resourceId);
  const tQuick = useTranslations('quickActions');
  const tStatus = useTranslations('status');
  const [shareSuccess, setShareSuccess] = useState(false);

  const isAvailable = status && !status.hasReservationInNext1Hour;

  const handleShare = async () => {
    const success = await shareAvailability(hallName, linkName, resourceId, !!isAvailable);
    if (success) {
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
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
        <div className="mt-1 flex items-center gap-2 px-3 py-2 bg-emerald-100 dark:bg-emerald-900 border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
          <span className="text-lg animate-pulse">🎉</span>
          <div className="flex flex-col leading-none">
            <span className="text-[10px] uppercase font-bold text-black dark:text-white tracking-wider">
              {tStatus('freeReservation')}
            </span>
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-100">
              {tStatus('available')}
            </span>
          </div>
        </div>
      );
    }
    if (isAvailable) {
      return (
        <span className="inline-block px-2 py-1 text-xs font-bold uppercase border-2 border-black dark:border-white bg-green-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rounded-md">
          ✓ {tStatus('available')}
        </span>
      );
    }
    return (
      <span className="inline-block px-2 py-1 text-xs font-bold uppercase border-2 border-black dark:border-white bg-red-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rounded-md">
        {tStatus('reserved')}
      </span>
    );
  };

  return (
    <div className="p-3 border-[3px] border-black dark:border-white rounded-lg bg-card shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] transition-all">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{linkName}</h4>
          <div className="mt-1">{getStatusBadge()}</div>
        </div>
        <a
          href={`${reservationUrl}${resourceId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-secondary text-secondary-foreground border-2 border-black dark:border-white rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all"
          title={tQuick('viewDetails')}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleShare}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold uppercase tracking-wider rounded-md border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:translate-y-0 active:shadow-none transition-all ${
            shareSuccess
              ? 'bg-green-500 text-white'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
          title={tQuick('share')}
        >
          <Share2 className="h-3.5 w-3.5" />
          {shareSuccess ? tQuick('shared') : tQuick('share')}
        </button>
      </div>
    </div>
  );
}
