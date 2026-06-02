import React, { useState } from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function WeatherCard({ weather, forecast }) {
  const [showForecast, setShowForecast] = useState(true);

  if (!weather) return null;

  const { temp, humidity, feelsLike, windSpeed, condition, code } = weather;

  // Map WMO codes to Lucide components
  const getWeatherIcon = (weatherCode, sizeClass = "w-10 h-10") => {
    if (weatherCode === 0) {
      return <Sun className={`${sizeClass} text-amber-400 animate-spin`} style={{ animationDuration: '30s' }} />;
    }
    if ([1, 2, 3].includes(weatherCode)) {
      return <CloudSun className={`${sizeClass} text-teal-300 animate-pulse`} />;
    }
    if ([45, 48].includes(weatherCode)) {
      return <Cloud className={`${sizeClass} text-slate-400`} />;
    }
    if ([51, 53, 55].includes(weatherCode)) {
      return <CloudDrizzle className={`${sizeClass} text-cyan-300`} />;
    }
    if ([61, 63, 65, 80, 81, 82].includes(weatherCode)) {
      return <CloudRain className={`${sizeClass} text-cyan-400 animate-bounce`} style={{ animationDuration: '4s' }} />;
    }
    if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
      return <CloudSnow className={`${sizeClass} text-blue-200 animate-pulse`} />;
    }
    if ([95, 96, 99].includes(weatherCode)) {
      return <CloudLightning className={`${sizeClass} text-yellow-400 animate-pulse`} />;
    }
    return <Cloud className={`${sizeClass} text-slate-300`} />;
  };

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 hover:border-white/15 transition duration-300 bg-gradient-to-br from-slate-950/80 to-slate-900/40">
      
      {/* Current Weather Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/5 pb-6">
        
        {/* Left Side: Temperature & Icon */}
        <div className="flex items-center space-x-5 text-center sm:text-left mb-4 sm:mb-0">
          <div className="p-3.5 bg-slate-900/60 rounded-2xl border border-white/5 shadow-inner">
            {getWeatherIcon(code, "w-14 h-14")}
          </div>
          <div>
            <div className="flex items-baseline justify-center sm:justify-start">
              <span className="text-5xl font-black text-white tracking-tighter">{temp}</span>
              <span className="text-2xl font-bold text-teal-400 ml-1">°C</span>
            </div>
            <p className="text-sm font-bold text-teal-300 tracking-wide mt-1 uppercase">{condition}</p>
          </div>
        </div>

        {/* Right Side: Key Parameters Grid */}
        <div className="grid grid-cols-3 gap-4 w-full sm:w-auto">
          {/* Feels Like */}
          <div className="text-center bg-slate-900/40 border border-white/5 rounded-xl px-3 py-2.5 min-w-[75px] shadow-sm">
            <Thermometer className="w-4 h-4 mx-auto text-teal-400 mb-1" />
            <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Feels Like</span>
            <span className="text-sm font-bold text-white block mt-0.5">{feelsLike}°C</span>
          </div>

          {/* Humidity */}
          <div className="text-center bg-slate-900/40 border border-white/5 rounded-xl px-3 py-2.5 min-w-[75px] shadow-sm">
            <Droplets className="w-4 h-4 mx-auto text-cyan-400 mb-1" />
            <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Humidity</span>
            <span className="text-sm font-bold text-white block mt-0.5">{humidity}%</span>
          </div>

          {/* Wind Speed */}
          <div className="text-center bg-slate-900/40 border border-white/5 rounded-xl px-3 py-2.5 min-w-[75px] shadow-sm">
            <Wind className="w-4 h-4 mx-auto text-emerald-400 mb-1" />
            <span className="text-[10px] font-bold text-gray-500 block uppercase tracking-wider">Wind</span>
            <span className="text-sm font-bold text-white block mt-0.5">{windSpeed} km/h</span>
          </div>
        </div>
      </div>

      {/* 5-Day Forecast Toggle Accordion Header */}
      <div 
        onClick={() => setShowForecast(!showForecast)}
        className="flex items-center justify-between pt-5 cursor-pointer select-none group shrink-0"
      >
        <span className="text-sm font-black text-white tracking-wide flex items-center group-hover:text-teal-400 transition-colors">
          5-Day Weather Forecast
        </span>
        <button className="p-1 rounded-lg bg-slate-900/60 border border-white/5 text-gray-400 group-hover:text-white transition">
          {showForecast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Forecast Body */}
      {showForecast && forecast && (
        <div className="grid grid-cols-5 gap-2 sm:gap-3 mt-5 animate-scale-up font-sans">
          {forecast.map((dayForecast, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/30 border border-white/5 hover:border-teal-500/10 rounded-xl py-3 px-1 sm:px-2 text-center transition duration-300 flex flex-col justify-between shadow-sm"
            >
              <span className="text-xs font-bold text-gray-400 block tracking-wide">{dayForecast.day}</span>
              <div className="my-2.5 flex justify-center">
                {getWeatherIcon(dayForecast.code, "w-6 h-6")}
              </div>
              <div className="space-y-0.5 shrink-0">
                <span className="text-xs font-bold text-white block">{dayForecast.tempMax}°</span>
                <span className="text-[10px] font-medium text-gray-500 block">{dayForecast.tempMin}°</span>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
