'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { reservationUrl, type RelatedLink } from '@/lib/swimming-halls-data';

interface ReservationData {
  start: string;
  end: string;
  title: string;
}

interface ReservationStatus {
  hasReservationInNext1Hour: boolean;
  hasReservationInNext2Hours: boolean;
  hasReservationInNext3Hours: boolean;
  hasFreeReservation: boolean;
}

interface SwimmingHallCardProps {
  hallName: string;
  links: RelatedLink[];
}

export function SwimmingHallCard({ hallName, links }: SwimmingHallCardProps) {
  const [linkStatuses, setLinkStatuses] = useState<Map<string, ReservationStatus>>(new Map());

  useEffect(() => {
    const fourHoursBeforeNow = Math.floor(Date.now() / 1000 - 4 * 60 * 60);
    const fourHoursFromNow = Math.floor(Date.now() / 1000 + 4 * 60 * 60);

    links.forEach((link) => {
      const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${link.url}&start=${fourHoursBeforeNow}&end=${fourHoursFromNow}&_=${fourHoursBeforeNow}`;
      const proxyUrl = `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;

      fetch(proxyUrl)
        .then((response) => response.json())
        .then((data: ReservationData[]) => {
          const currentTime = new Date();
          const oneHourFromNow = new Date(currentTime.getTime() + 60 * 60 * 1000);
          const twoHoursFromNow = new Date(currentTime.getTime() + 2 * 60 * 60 * 1000);
          const threeHoursFromNow = new Date(currentTime.getTime() + 3 * 60 * 60 * 1000);

          let hasReservationInNext1Hour = false;
          let hasReservationInNext2Hours = false;
          let hasReservationInNext3Hours = false;
          let hasFreeReservation = false;

          data.forEach((reservation) => {
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

            if (reservation.title.includes('Vapaaharjoitte')) {
              hasFreeReservation = true;
            }
          });

          setLinkStatuses((prev) => {
            const newMap = new Map(prev);
            newMap.set(link.url, {
              hasReservationInNext1Hour,
              hasReservationInNext2Hours,
              hasReservationInNext3Hours,
              hasFreeReservation,
            });
            return newMap;
          });
        })
        .catch((error) => console.error('Error:', error));
    });
  }, [links]);

  const getLinkClassName = (status?: ReservationStatus) => {
    if (!status) return 'bg-blue-500 hover:bg-blue-700';
    if (status.hasFreeReservation) return 'bg-green-500 hover:bg-green-700';
    if (status.hasReservationInNext1Hour) return 'bg-red-500 hover:bg-red-700';
    return 'bg-green-500 hover:bg-green-700';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-blue-500">{hallName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {links.map((link) => {
            const fourHoursBeforeNow = Math.floor(Date.now() / 1000 - 4 * 60 * 60);
            const fourHoursFromNow = Math.floor(Date.now() / 1000 + 4 * 60 * 60);
            const cityUrl = `https://resurssivaraus.espoo.fi/Tailored/prime_product_intranet/espoo/web/Calendar/ReservationData.aspx?resourceid%5B%5D=${link.url}&start=${fourHoursBeforeNow}&end=${fourHoursFromNow}&_=${fourHoursBeforeNow}`;
            const proxyUrl = `https://proxy.aleksi-nokelainen.workers.dev/?url=${encodeURIComponent(cityUrl)}`;
            const status = linkStatuses.get(link.url);

            return (
              <li key={link.url} className="flex space-x-2">
                <a
                  href={reservationUrl + link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  {link.relatedLinkName}
                </a>
                <a
                  href={proxyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block text-white font-bold py-2 px-4 rounded transition-colors ${getLinkClassName(status)}`}
                >
                  R
                  <div className="flex flex-row inline-block ml-2">
                    <span
                      className={`inline-block h-3 w-3 bg-red-800 rounded-full mx-0.5 ${
                        status?.hasReservationInNext1Hour && !status?.hasFreeReservation
                          ? 'visible'
                          : 'invisible'
                      }`}
                    />
                    <span
                      className={`inline-block h-3 w-3 bg-red-800 rounded-full mx-0.5 ${
                        status?.hasReservationInNext2Hours && !status?.hasFreeReservation
                          ? 'visible'
                          : 'invisible'
                      }`}
                    />
                    <span
                      className={`inline-block h-3 w-3 bg-red-800 rounded-full mx-0.5 ${
                        status?.hasReservationInNext3Hours && !status?.hasFreeReservation
                          ? 'visible'
                          : 'invisible'
                      }`}
                    />
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
