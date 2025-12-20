'use client';

import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';
import { reservationUrl, type SwimmingHall } from '@/lib/swimming-halls-data';
import { useTranslations } from 'next-intl';

// Fix for default marker icons in Leaflet
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const userIcon = L.icon({
  iconUrl:
    'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);

  return null;
}

interface MapContentProps {
  halls: SwimmingHall[];
  userLocation: { lat: number; lng: number } | null;
}

export default function MapContent({ halls, userLocation }: MapContentProps) {
  const tMaps = useTranslations('maps');

  // Default center (Espoo center)
  const defaultCenter: [number, number] = [60.205, 24.655];
  const center: [number, number] = userLocation
    ? [userLocation.lat, userLocation.lng]
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ width: '100%', height: '100%' }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <MapController center={center} />

      {userLocation ? (
        <>
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="text-center">
                <strong>{tMaps('yourLocation')}</strong>
              </div>
            </Popup>
          </Marker>
          <Circle
            center={[userLocation.lat, userLocation.lng]}
            radius={500}
            pathOptions={{ color: 'blue', fillColor: 'blue', fillOpacity: 0.1 }}
          />
        </>
      ) : null}

      {halls.map((hall) => (
        <Marker key={hall.swimmingHallName} position={[hall.latitude, hall.longitude]} icon={icon}>
          <Popup>
            <div className="p-2">
              <h3 className="font-bold text-lg mb-2">{hall.swimmingHallName}</h3>
              <div className="space-y-1">
                {hall.relatedLinks.map((link) => (
                  <div key={link.url}>
                    <a
                      href={`${reservationUrl}${link.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline block"
                    >
                      {link.relatedLinkName}
                    </a>
                  </div>
                ))}
              </div>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${hall.latitude},${hall.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 block text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold py-1 px-3 rounded"
              >
                {tMaps('getDirections')}
              </a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
