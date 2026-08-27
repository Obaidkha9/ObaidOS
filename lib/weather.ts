export const PORTFOLIO_LOCATION = {
  city: "Jaipur",
  state: "Rajasthan",
  country: "India",
  latitude: 26.9124,
  longitude: 75.7873,
} as const;

export const WEATHER_CACHE_DURATION_MS = 10 * 60 * 1000;

const WEATHER_CACHE_KEY = "obaid-os:portfolio-weather:v1";

export type WeatherIconName =
  | "sun"
  | "moon"
  | "cloudSun"
  | "cloudMoon"
  | "cloud"
  | "rain"
  | "heavyRain"
  | "lightning"
  | "fog"
  | "snow";

export interface PortfolioWeather {
  temperature: number;
  high: number;
  low: number;
  weatherCode: number;
  isDay: boolean;
  condition: string;
  icon: WeatherIconName;
  fetchedAt: number;
}

interface OpenMeteoResponse {
  current?: {
    temperature_2m?: number;
    weather_code?: number;
    is_day?: number;
  };
  daily?: {
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export function weatherCondition(code: number, isDay: boolean): Pick<PortfolioWeather, "condition" | "icon"> {
  if (code === 0) return isDay ? { condition: "Sunny", icon: "sun" } : { condition: "Clear", icon: "moon" };
  if (code === 1) return isDay ? { condition: "Mostly Sunny", icon: "cloudSun" } : { condition: "Mostly Clear", icon: "cloudMoon" };
  if (code === 2) return { condition: "Partly Cloudy", icon: isDay ? "cloudSun" : "cloudMoon" };
  if (code === 3) return { condition: "Overcast", icon: "cloud" };
  if (code === 45) return { condition: "Hazy", icon: "fog" };
  if (code === 48) return { condition: "Fog", icon: "fog" };
  if ([51, 53, 55, 56, 57].includes(code)) return { condition: "Drizzle", icon: "rain" };
  if ([61, 80].includes(code)) return { condition: "Light Rain", icon: "rain" };
  if ([63, 81].includes(code)) return { condition: "Rain", icon: "rain" };
  if ([65, 66, 67, 82].includes(code)) return { condition: "Heavy Rain", icon: "heavyRain" };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { condition: "Snow", icon: "snow" };
  if ([95, 96, 99].includes(code)) return { condition: "Thunderstorm", icon: "lightning" };
  return { condition: "Cloudy", icon: "cloud" };
}

export async function fetchPortfolioWeather(signal?: AbortSignal): Promise<PortfolioWeather> {
  const params = new URLSearchParams({
    latitude: String(PORTFOLIO_LOCATION.latitude),
    longitude: String(PORTFOLIO_LOCATION.longitude),
    current: "temperature_2m,weather_code,is_day",
    daily: "temperature_2m_max,temperature_2m_min",
    temperature_unit: "celsius",
    timezone: "auto",
    forecast_days: "1",
  });

  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params}`, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`Weather request failed with ${response.status}`);

  const payload = (await response.json()) as OpenMeteoResponse;
  const temperature = payload.current?.temperature_2m;
  const weatherCode = payload.current?.weather_code;
  const high = payload.daily?.temperature_2m_max?.[0];
  const low = payload.daily?.temperature_2m_min?.[0];

  if (![temperature, weatherCode, high, low].every((value) => typeof value === "number" && Number.isFinite(value))) {
    throw new Error("Weather response was incomplete");
  }

  const isDay = payload.current?.is_day === 1;
  const mapped = weatherCondition(weatherCode as number, isDay);
  return {
    temperature: Math.round(temperature as number),
    high: Math.round(high as number),
    low: Math.round(low as number),
    weatherCode: weatherCode as number,
    isDay,
    ...mapped,
    fetchedAt: Date.now(),
  };
}

export function readCachedWeather(): PortfolioWeather | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = JSON.parse(window.localStorage.getItem(WEATHER_CACHE_KEY) ?? "null") as PortfolioWeather | null;
    if (!cached || typeof cached.fetchedAt !== "number" || typeof cached.temperature !== "number") return null;
    return cached;
  } catch {
    return null;
  }
}

export function cacheWeather(weather: PortfolioWeather) {
  try {
    window.localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(weather));
  } catch {
    // Storage can be unavailable in private browsing; live weather still works.
  }
}
