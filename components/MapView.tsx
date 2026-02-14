'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { type SwimmingHall } from '@/lib/swimming-halls-data';
import L from 'leaflet';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { slugify } from '@/lib/slugify';

const createNeoIcon = () => {
  return L.divIcon({
    className: 'bg-transparent',
    html: `<div class="w-8 h-8 bg-primary border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,1)] rounded-full flex items-center justify-center transform hover:scale-110 transition-transform cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary-foreground"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface MapViewProps {
  halls: SwimmingHall[];
  locale: string;
}

export default function MapView({ halls, locale }: MapViewProps) {
  const tDetails = useTranslations('details');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[500px] bg-muted animate-pulse rounded-lg border-2 border-black dark:border-white flex items-center justify-center">
        Loading Map...
      </div>
    );
  }

  // Centered roughly on Espoo
  const center: [number, number] = [60.2055, 24.6559];

  return (
    <div className="w-full h-[600px] rounded-lg border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] overflow-hidden relative z-0">
      <MapContainer center={center} zoom={11} scrollWheelZoom={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {halls.map((hall) => {
          const slug = slugify(hall.swimmingHallName);

          return (
            <Marker
              key={hall.swimmingHallName}
              position={[hall.latitude, hall.longitude]}
              icon={createNeoIcon()}
            >
              <Popup className="neo-popup">
                <div className="flex flex-col gap-2 p-1 min-w-[200px]">
                  <h3 className="font-bold text-base">{hall.swimmingHallName}</h3>
                  <p className="text-sm">{hall.address}</p>
                  <Button asChild size="sm" className="mt-2 w-full">
                    <Link href={`/${locale}/hall/${slug}`}>{tDetails('viewDetails')}</Link>
                  </Button>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
