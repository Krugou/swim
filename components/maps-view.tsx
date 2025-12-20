'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { swimmingHallData } from '@/lib/swimming-halls-data';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./map-content'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted">
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  ),
});

interface MapsViewProps {
  onClose: () => void;
}

export function MapsView({ onClose }: MapsViewProps) {
  const t = useTranslations('navigation');
  const tMaps = useTranslations('maps');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="fixed inset-4 sm:inset-8 md:inset-16 bg-background border rounded-lg shadow-lg flex flex-col overflow-hidden"
      >
        <div className="flex items-center justify-between p-4 border-b bg-card">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">{tMaps('title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={t('back')}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 relative">
          <MapComponent halls={swimmingHallData} userLocation={userLocation} />
        </div>
      </motion.div>
    </motion.div>
  );
}
