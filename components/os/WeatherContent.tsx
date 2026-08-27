"use client";

import { useEffect, useRef, useState } from "react";
import {
  PORTFOLIO_LOCATION,
  WEATHER_CACHE_DURATION_MS,
  cacheWeather,
  fetchPortfolioWeather,
  readCachedWeather,
  type PortfolioWeather,
  type WeatherIconName,
} from "@/lib/weather";

function WeatherIcon({ name }: { name?: WeatherIconName }) {
  const common = {
    width: 30,
    height: 30,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: "mb-0.5 text-white",
    "aria-hidden": true,
  };

  if (!name) return <svg {...common} className="mb-0.5 text-white/25"><path d="M7 17h10a4 4 0 0 0 .4-8A6 6 0 0 0 6.2 11 3 3 0 0 0 7 17Z" /></svg>;
  if (name === "sun") return <svg {...common}><circle cx="12" cy="12" r="3.5" /><path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" /></svg>;
  if (name === "moon") return <svg {...common}><path d="M20.2 14.1A8.5 8.5 0 0 1 9.9 3.8 8.5 8.5 0 1 0 20.2 14.1Z" /></svg>;
  if (name === "cloud") return <svg {...common}><path d="M7 18h10a4 4 0 0 0 .4-8A6 6 0 0 0 6.2 12 3 3 0 0 0 7 18Z" /></svg>;
  if (name === "cloudSun") return <svg {...common}><path d="M8 5V3M3.8 6.8 2.4 5.4M12.2 6.8l1.4-1.4M3 11H1M11.5 10a4 4 0 0 0-7.7 1.4" /><path d="M8 19h9a3.5 3.5 0 0 0 .3-7A5.2 5.2 0 0 0 7.6 14 2.6 2.6 0 0 0 8 19Z" /></svg>;
  if (name === "cloudMoon") return <svg {...common}><path d="M11.5 3.5A5 5 0 0 0 16 10a5.5 5.5 0 0 1-7-6.5" /><path d="M8 19h9a3.5 3.5 0 0 0 .3-7A5.2 5.2 0 0 0 7.6 14 2.6 2.6 0 0 0 8 19Z" /></svg>;
  if (name === "rain") return <svg {...common}><path d="M7 15h10a4 4 0 0 0 .4-8A6 6 0 0 0 6.2 9 3 3 0 0 0 7 15Z" /><path d="m8 18-1 2M12 18l-1 2M16 18l-1 2" /></svg>;
  if (name === "heavyRain") return <svg {...common}><path d="M6 14h11a4 4 0 0 0 .4-8A6 6 0 0 0 5.8 8.5 2.8 2.8 0 0 0 6 14Z" /><path d="m7 17-1.5 3M12 17l-1.5 3M17 17l-1.5 3M19 16h3M20 19h2" /></svg>;
  if (name === "lightning") return <svg {...common}><path d="M7 14h10a4 4 0 0 0 .4-8A6 6 0 0 0 6.2 8 3 3 0 0 0 7 14Z" /><path d="m13 15-3 4h3l-2 3" /></svg>;
  if (name === "fog") return <svg {...common}><path d="M7 13h10a4 4 0 0 0 .4-8A6 6 0 0 0 6.2 7 3 3 0 0 0 7 13Z" /><path d="M4 17h16M6 20h12" /></svg>;
  return <svg {...common}><path d="M7 14h10a4 4 0 0 0 .4-8A6 6 0 0 0 6.2 8 3 3 0 0 0 7 14Z" /><path d="M8 17v4M6 19h4M16 17v4M14 19h4M12 16v5M10 18h4" /></svg>;
}

export default function WeatherContent() {
  const [weather, setWeather] = useState<PortfolioWeather | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const hiddenAt = useRef<number | null>(null);
  const requestInFlight = useRef(false);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const cached = readCachedWeather();
    if (cached) {
      queueMicrotask(() => {
        if (active) setWeather((current) => current ?? cached);
      });
    }

    const refresh = async () => {
      if (requestInFlight.current) return;
      requestInFlight.current = true;
      try {
        const next = await fetchPortfolioWeather(controller.signal);
        if (!active) return;
        cacheWeather(next);
        setWeather(next);
        setUnavailable(false);
      } catch {
        if (active && !readCachedWeather()) setUnavailable(true);
      } finally {
        requestInFlight.current = false;
      }
    };

    if (!cached || Date.now() - cached.fetchedAt >= WEATHER_CACHE_DURATION_MS) void refresh();
    const interval = window.setInterval(() => void refresh(), WEATHER_CACHE_DURATION_MS);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") hiddenAt.current = Date.now();
      else if (hiddenAt.current && Date.now() - hiddenAt.current >= WEATHER_CACHE_DURATION_MS) {
        hiddenAt.current = null;
        void refresh();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      active = false;
      controller.abort();
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const condition = weather?.condition ?? (unavailable ? "Weather unavailable" : "Loading...");

  return (
    <div className="flex h-full flex-col justify-between text-white" title="Live Jaipur weather by Open-Meteo">
      <div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-semibold leading-none">{PORTFOLIO_LOCATION.city}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3 10.5l17.5-7.5-7.5 17.5-2.2-7.8z" />
          </svg>
        </div>
        <p className="mt-1 text-2xl font-medium leading-[0.95] tracking-tight">{weather ? `${weather.temperature}°` : "--°"}</p>
      </div>
      <div>
        <WeatherIcon name={weather?.icon} />
        <p className="whitespace-nowrap text-xs font-medium">{condition}</p>
        <p className="text-[11px] font-normal text-white/80">
          {weather ? `H:${weather.high}° L:${weather.low}°` : "H:--° L:--°"}
        </p>
      </div>
    </div>
  );
}
