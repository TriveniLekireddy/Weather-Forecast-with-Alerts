import React, { useContext } from 'react';
import WeatherCard from './WeatherCard';
import ForecastChart from './ForecastChart'; // ✅ Keep this
import { ThemeContext } from '../contexts/ThemeContext';

const WeatherDashboard = ({ currentWeather, forecast }) => {
  const { theme } = useContext(ThemeContext);

  return (
    <div className={`min-h-screen py-10 px-4 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="max-w-6xl mx-auto space-y-12">

        {/* Current Weather */}
        <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg rounded-2xl p-6 shadow-xl`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Current Weather
          </h2>
          <WeatherCard weather={currentWeather} />
        </div>

        {/* 5-Day Forecast Chart */}
        <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg rounded-2xl p-6 shadow-xl`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            5-Day Forecast
          </h2>
          <ForecastChart forecast={forecast} />
        </div>

      </div>
    </div>
  );
};

export default WeatherDashboard;







