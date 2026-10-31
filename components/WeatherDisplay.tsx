'use client';

import { useEffect, useState } from 'react';
import {
  fetchWeatherData,
  getWeatherIcon,
  getWeatherConditionKey,
  type WeatherData,
} from '@/lib/weather-service';
import { useTranslations } from 'next-intl';

interface WeatherDisplayProps {
  latitude: number;
  longitude: number;
  label?: string | undefined;
  large?: boolean;
}

export const WeatherDisplay = ({
  latitude,
  longitude,
  label,
  large = false,
}: WeatherDisplayProps) => {
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
  const condition = t(`conditions.${getWeatherConditionKey(weather.symbolCode)}`);
  const temperature = `${Math.round(weather.temperature)}°C`;
  const rain =
    weather.precipitation !== undefined && weather.precipitation > 0
      ? `${t('precipitation')} ${weather.precipitation} mm`
      : null;

  if (large) {
    return (
      <div className="flex flex-col items-center gap-1" data-testid="weather-text">
        {label ? <span className="text-lg font-medium opacity-90">{label}</span> : null}
        <p className="text-3xl font-bold sm:text-5xl">
          <span aria-hidden="true">{icon}</span> {condition}, {temperature}
        </p>
        {rain ? <p className="text-xl sm:text-3xl">{rain}</p> : null}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      {label ? <span className="font-medium">{label}:</span> : null}
      <span className="text-base" aria-hidden="true">
        {icon}
      </span>
      <span className="font-semibold">
        {condition}, {temperature}
      </span>
      {rain ? <span>{rain}</span> : null}
    </div>
  );
};
