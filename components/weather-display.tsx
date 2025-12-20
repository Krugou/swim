'use client';

import { useEffect, useState } from 'react';
import {
  fetchWeatherData,
  getWeatherIcon,
  getWeatherDescription,
  type WeatherData,
} from '@/lib/weather-service';
import { useTranslations } from 'next-intl';

interface WeatherDisplayProps {
  latitude: number;
  longitude: number;
}

export function WeatherDisplay({ latitude, longitude }: WeatherDisplayProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const t = useTranslations('weather');

  useEffect(() => {
    let isMounted = true;

    const loadWeather = async () => {
      setIsLoading(true);
      const data = await fetchWeatherData(latitude, longitude);
      if (isMounted) {
        setWeather(data);
        setIsLoading(false);
      }
    };

    loadWeather();

    return () => {
      isMounted = false;
    };
  }, [latitude, longitude]);

  if (isLoading) {
    return (
      <div className="flex items-center gap-1 text-xs text-muted-foreground">
        <span className="animate-pulse">🌡️</span>
        <span>{t('loading')}</span>
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  const icon = getWeatherIcon(weather.symbolCode);
  const description = getWeatherDescription(weather.symbolCode);

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span className="text-base" role="img" aria-label={description} title={description}>
        {icon}
      </span>
      <span className="font-semibold">{Math.round(weather.temperature)}°C</span>
      {weather.precipitation !== undefined && weather.precipitation > 0 ? (
        <span
          className="text-xs"
          aria-label={`Precipitation: ${weather.precipitation} millimeters`}
        >
          <span role="img" aria-label="precipitation">
            💧
          </span>{' '}
          {weather.precipitation}mm
        </span>
      ) : null}
    </div>
  );
}
