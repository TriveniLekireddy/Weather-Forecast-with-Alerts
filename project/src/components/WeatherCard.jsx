import React, { useContext } from 'react';
import { WeatherContext } from '../contexts/WeatherContext';
import ForecastChart from './ForecastChart';

const WeatherCard = () => {
  const { currentWeather, forecast, loading, error } = useContext(WeatherContext);

  if (loading) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Loading weather data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-10">
        {error}
      </div>
    );
  }

  if (!currentWeather || !forecast) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-10">
        Weather data not available.
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
          {currentWeather.name}, {currentWeather.sys.country}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {currentWeather.weather[0].description}
        </p>
        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mt-2">
          {Math.round(currentWeather.main.temp)}°C
        </p>
      </div>

      {/* 🔥 Safe ForecastChart Rendering */}
      <ForecastChart forecast={forecast} />
    </div>
  );
};

export default WeatherCard;
