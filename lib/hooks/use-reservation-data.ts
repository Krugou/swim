'use client';

import { useQuery } from '@tanstack/react-query';

export interface ReservationData {
  start: string;
  end: string;
  title: string;
  eventTypeColor?: string;
  eventBorderColor?: string;
  id?: number;
  resourceID?: number;
  editable?: boolean;
  isOwn?: boolean;
  eventID?: number;
}

export interface ReservationDetails {
  organization: string;
  resourceName: string;
  timeRange: string;
}

export interface ReservationStatus {
  hasReservationInNext1Hour: boolean;
  hasReservationInNext2Hours: boolean;
  hasReservationInNext3Hours: boolean;
  hasReservationInNext4Hours: boolean;
  hasReservationInNext5Hours: boolean;
  hasReservationInNext6Hours: boolean;
  hasFreeReservation: boolean;
  isLoading: boolean;
  upcomingReservations?: ReservationDetails[];
  nextAvailableSlot?: string;
  currentReservationEnd?: string;
  currentReservationDuration?: number;
  isCurrentlyFreePractice?: boolean;
  error?: string;
  dataUpdatedAt?: number;
}

// Type for the result of analyzeReservations (without loading/error states)
export interface AnalyzedReservationData {
  hasReservationInNext1Hour: boolean;
  hasReservationInNext2Hours: boolean;
  hasReservationInNext3Hours: boolean;
  hasReservationInNext4Hours: boolean;
  hasReservationInNext5Hours: boolean;
  hasReservationInNext6Hours: boolean;
  hasFreeReservation: boolean;
  upcomingReservations?: ReservationDetails[];
  nextAvailableSlot?: string | undefined;
  currentReservationEnd?: string | undefined;
  currentReservationDuration?: number | undefined;
  isCurrentlyFreePractice?: boolean | undefined;
}

// Constants
const FREE_PRACTICE_TEXT = 'Vapaaharjoitte';
const FOUR_HOURS_IN_SECONDS = 4 * 60 * 60;

// Helper functions
const getTimeWindow = (): { start: number; end: number } => {
  const nowInSeconds = Math.floor(Date.now() / 1000);
  return {
    start: nowInSeconds - FOUR_HOURS_IN_SECONDS,
    end: nowInSeconds + FOUR_HOURS_IN_SECONDS,
  };
};

const buildProxyUrl = (resourceId: string, timeWindow: { start: number; end: number }): string => {
  const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${resourceId}&start=${timeWindow.start}&end=${timeWindow.end}&_=${timeWindow.start}`;
  return `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;
};

// Parse reservation title to extract organization and resource details
const parseReservationTitle = (title: string): ReservationDetails => {
  const parts = title.split('  ').filter((part) => part.trim());

  let organization = 'Unknown';
  let resourceName = 'Unknown';
  let timeRange = '';

  if (parts.length >= 2 && parts[1]) {
    organization = parts[1].trim();
  }

  for (const part of parts) {
    if (part.includes(',')) {
      const resourcePart = part.split(',').slice(1).join(',').trim();
      if (resourcePart) {
        resourceName = resourcePart;
        break;
      }
    }
  }

  const lastPart = parts[parts.length - 1];
  if (lastPart && lastPart.includes('-')) {
    timeRange = lastPart.trim();
  }

  return { organization, resourceName, timeRange };
};

export const analyzeReservations = (data: ReservationData[]): AnalyzedReservationData => {
  const currentTime = new Date();
  const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
  const twoHoursFromNow = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
  const threeHoursFromNow = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);
  const fourHoursFromNow = new Date(currentTime.getTime() + 4 * 60 * 60 * 1000);
  const fiveHoursFromNow = new Date(currentTime.getTime() + 5 * 60 * 60 * 1000);
  const sixHoursFromNow = new Date(currentTime.getTime() + 6 * 60 * 60 * 1000);

  let hasReservationInNext1Hour = false;
  let hasReservationInNext2Hours = false;
  let hasReservationInNext3Hours = false;
  let hasReservationInNext4Hours = false;
  let hasReservationInNext5Hours = false;
  let hasReservationInNext6Hours = false;
  let hasFreeReservation = false;
  const upcomingReservations: ReservationDetails[] = [];
  let nextAvailableSlot: string | undefined;
  let currentReservationEnd: string | undefined;
  let currentReservationDuration: number | undefined;
  let isCurrentlyFreePractice = false;

  const sortedData = [...data].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );

  const currentReservation = sortedData.find((reservation) => {
    const reservationStart = new Date(reservation.start);
    const reservationEnd = new Date(reservation.end);
    return reservationStart <= currentTime && reservationEnd > currentTime;
  });

  if (currentReservation) {
    const reservationEnd = new Date(currentReservation.end);
    const minutesRemaining = Math.floor(
      (reservationEnd.getTime() - currentTime.getTime()) / (60 * 1000)
    );

    const hours = reservationEnd.getHours().toString().padStart(2, '0');
    const minutes = reservationEnd.getMinutes().toString().padStart(2, '0');
    currentReservationEnd = `${hours}:${minutes}`;
    currentReservationDuration = minutesRemaining;
    isCurrentlyFreePractice = currentReservation.title.includes(FREE_PRACTICE_TEXT);
  }

  sortedData.forEach((reservation) => {
    const reservationStart = new Date(reservation.start);
    const reservationEnd = new Date(reservation.end);

    if (reservationStart <= oneHourFromNow && reservationEnd > currentTime) {
      hasReservationInNext1Hour = true;
    }

    if (reservationStart <= twoHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext2Hours = true;
    }

    if (reservationStart <= threeHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext3Hours = true;
    }

    if (reservationStart <= fourHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext4Hours = true;
    }

    if (reservationStart <= fiveHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext5Hours = true;
    }

    if (reservationStart <= sixHoursFromNow && reservationEnd > currentTime) {
      hasReservationInNext6Hours = true;
    }

    if (reservation.title.includes(FREE_PRACTICE_TEXT)) {
      hasFreeReservation = true;
    }

    if (
      reservationStart > currentTime &&
      reservationStart <= sixHoursFromNow &&
      upcomingReservations.length < 3
    ) {
      upcomingReservations.push(parseReservationTitle(reservation.title));
    }
  });

  if (sortedData.length > 0) {
    const firstFutureReservation = sortedData.find((r) => new Date(r.start) > currentTime);
    if (firstFutureReservation) {
      const minutesUntil = Math.floor(
        (new Date(firstFutureReservation.start).getTime() - currentTime.getTime()) / (60 * 1000)
      );
      if (minutesUntil > 15) {
        nextAvailableSlot = `${minutesUntil} min`;
      }
    }
  }

  return {
    hasReservationInNext1Hour,
    hasReservationInNext2Hours,
    hasReservationInNext3Hours,
    hasReservationInNext4Hours,
    hasReservationInNext5Hours,
    hasReservationInNext6Hours,
    hasFreeReservation,
    upcomingReservations,
    nextAvailableSlot,
    currentReservationEnd,
    currentReservationDuration,
    isCurrentlyFreePractice,
  };
};

export const fetchReservationData = async (resourceId: string): Promise<ReservationData[]> => {
  const timeWindow = getTimeWindow();
  const proxyUrl = buildProxyUrl(resourceId, timeWindow);

  const response = await fetch(proxyUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch reservation data: ${response.statusText}`);
  }

  return response.json();
};

export function useReservationData(resourceId: string) {
  return useQuery({
    queryKey: ['reservations', resourceId],
    queryFn: () => fetchReservationData(resourceId),
    select: (data) => analyzeReservations(data),
  });
}

// Hook for multiple resources (combines all resource data for a hall)
export function useMultipleReservationData(resourceIds: string[]) {
  const queries = resourceIds.map((id) =>
    useQuery({
      queryKey: ['reservations', id],
      queryFn: () => fetchReservationData(id),
    })
  );

  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error;
  const dataUpdatedAt = Math.min(...queries.map((q) => q.dataUpdatedAt || Date.now()));

  // Combine all reservation data
  const allReservations = queries.flatMap((q) => q.data || []);

  if (isLoading) {
    return {
      isLoading: true,
      error: undefined,
      data: undefined,
      dataUpdatedAt: undefined,
    };
  }

  if (error) {
    return {
      isLoading: false,
      error: error instanceof Error ? error.message : 'Failed to fetch reservations',
      data: undefined,
      dataUpdatedAt,
    };
  }

  return {
    isLoading: false,
    error: undefined,
    data: analyzeReservations(allReservations),
    dataUpdatedAt,
  };
}
