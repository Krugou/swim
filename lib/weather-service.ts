export interface WeatherData {
  temperature: number;
  symbolCode: string;
  precipitation?: number;
  windSpeed?: number;
}

interface YrNoTimeSeries {
  time: string;
  data: {
    instant: {
      details: {
        air_temperature: number;
        precipitation_amount?: number;
        wind_speed?: number;
      };
    };
    next_1_hours?: {
      summary: {
        symbol_code: string;
      };
    };
    next_6_hours?: {
      summary: {
        symbol_code: string;
      };
    };
  };
}

interface YrNoResponse {
  properties: {
    timeseries: YrNoTimeSeries[];
  };
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  try {
    const url = `https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${latitude}&lon=${longitude}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SwimmingHallSchedules/1.0 (github.com/Krugou/swim)',
      },
      next: { revalidate: 1800 }, // Cache for 30 minutes
    });

    if (!response.ok) {
      console.error('Weather API error:', response.status);
      return null;
    }

    const data: YrNoResponse = await response.json();
    
    if (!data.properties?.timeseries?.length) {
      return null;
    }

    const current = data.properties.timeseries[0];
    
    if (!current) {
      return null;
    }

    const temperature = current.data.instant.details.air_temperature;
    const symbolCode = 
      current.data.next_1_hours?.summary.symbol_code || 
      current.data.next_6_hours?.summary.symbol_code || 
      'cloudy';
    const precipitation = current.data.instant.details.precipitation_amount;
    const windSpeed = current.data.instant.details.wind_speed;

    const result: WeatherData = {
      temperature,
      symbolCode,
    };

    if (precipitation !== undefined) {
      result.precipitation = precipitation;
    }

    if (windSpeed !== undefined) {
      result.windSpeed = windSpeed;
    }

    return result;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

export function getWeatherIcon(symbolCode: string): string {
  // Map yr.no symbol codes to emoji
  if (symbolCode.includes('clearsky') || symbolCode.includes('fair')) {
    return '☀️';
  }
  if (symbolCode.includes('partlycloudy')) {
    return '⛅';
  }
  if (symbolCode.includes('cloudy')) {
    return '☁️';
  }
  if (symbolCode.includes('rain') || symbolCode.includes('lightrain')) {
    return '🌧️';
  }
  if (symbolCode.includes('heavyrain')) {
    return '⛈️';
  }
  if (symbolCode.includes('snow') || symbolCode.includes('sleet')) {
    return '❄️';
  }
  if (symbolCode.includes('fog')) {
    return '🌫️';
  }
  return '🌤️';
}
