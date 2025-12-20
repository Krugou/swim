export interface CalendarEvent {
  title: string;
  description?: string;
  location?: string;
  startTime: Date;
  endTime: Date;
}

export const exportToCalendar = (event: CalendarEvent): void => {
  // Format dates to iCal format (YYYYMMDDTHHMMSS)
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}`;
  };

  const startTime = formatDate(event.startTime);
  const endTime = formatDate(event.endTime);

  // Create iCal format
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Swimming Halls//EN',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@swimming-halls.app`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    `SUMMARY:${event.title}`,
    event.description ? `DESCRIPTION:${event.description}` : '',
    event.location ? `LOCATION:${event.location}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n');

  // Create blob and download
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `swimming-${Date.now()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// Export next available slot to calendar
export const exportNextFreeSlot = (
  hallName: string,
  linkName: string,
  minutesUntilReservation: number,
  latitude: number,
  longitude: number
): void => {
  const now = new Date();
  const startTime = new Date(now.getTime() + 5 * 60 * 1000); // Start in 5 minutes
  const endTime = new Date(startTime.getTime() + minutesUntilReservation * 60 * 1000);

  exportToCalendar({
    title: `Swimming - ${hallName}`,
    description: `Free time available at ${linkName}. Book your spot!`,
    location: `${hallName}, ${latitude}, ${longitude}`,
    startTime,
    endTime,
  });
};

// Share availability via Web Share API or copy to clipboard
export const shareAvailability = async (
  hallName: string,
  linkName: string,
  resourceId: string,
  isAvailable: boolean
): Promise<boolean> => {
  const url = `https://resurssivaraus.espoo.fi/liikunnantilavaraus/haku/?ResourceIDs=${resourceId}`;
  const status = isAvailable ? 'Available now!' : 'Currently reserved';
  const text = `${hallName} - ${linkName}\n${status}\n\nBook here: ${url}`;

  // Try Web Share API first (mobile)
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${hallName} - Swimming Availability`,
        text,
        url,
      });
      return true;
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
      return false;
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};
