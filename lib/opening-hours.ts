export const checkIsOpen = (opening?: string): boolean => {
  if (!opening) return true; // Default to open if no data

  const now = new Date();
  const day = now.getDay(); // 0 = Sun, 1 = Mon, ...
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  // Normalize mapping: Mon=1, ..., Sun=0.
  const parts = opening.split(',').map((p) => p.trim());

  for (const part of parts) {
    const firstColonIndex = part.indexOf(':');
    if (firstColonIndex === -1) continue;

    const daysStr = part.substring(0, firstColonIndex).trim();
    const timesStr = part.substring(firstColonIndex + 1).trim();

    let appliesToday = false;
    const lowerDays = daysStr.toLowerCase();
    const dayMap: { [key: string]: number } = {
      sun: 0,
      mon: 1,
      tue: 2,
      wed: 3,
      thu: 4,
      fri: 5,
      sat: 6,
    };

    if (lowerDays.includes('-')) {
      const rangeParts = lowerDays.split('-');
      if (rangeParts.length !== 2) continue;

      const startDayPart = rangeParts[0]?.trim().slice(0, 3) || '';
      const endDayPart = rangeParts[1]?.trim().slice(0, 3) || '';

      const start = dayMap[startDayPart];
      const end = dayMap[endDayPart];

      if (start !== undefined && end !== undefined) {
        if (start <= end) {
          if (day >= start && day <= end) appliesToday = true;
        } else {
          if (day >= start || day <= end) appliesToday = true;
        }
      }
    } else {
      // specific day
      const dStr = lowerDays.slice(0, 3);
      if (dStr in dayMap && day === dayMap[dStr]) appliesToday = true;
    }

    if (appliesToday) {
      if (timesStr.toLowerCase() === 'closed') return false;

      const timeRange = timesStr.split('-');
      if (timeRange.length !== 2) continue;

      const startStr = timeRange[0];
      const endStr = timeRange[1];

      if (!startStr || !endStr) continue;

      const startParts = startStr.trim().split(':');
      const endParts = endStr.trim().split(':');

      if (startParts.length < 2 || endParts.length < 2) continue;

      const sh = Number(startParts[0]);
      const sm = Number(startParts[1]);
      const eh = Number(endParts[0]);
      const em = Number(endParts[1]);

      if (isNaN(sh) || isNaN(eh)) continue;

      const startTime = sh * 60 + (isNaN(sm) ? 0 : sm);
      const endTime = eh * 60 + (isNaN(em) ? 0 : em);

      return currentTime >= startTime && currentTime < endTime;
    }
  }

  return false;
};
