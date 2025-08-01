import React from 'react';
import WeatherCard from './WeatherCard';
import ForecastChart from './ForecastChart';
import { useTheme } from '../contexts/ThemeContext';

const WeatherDashboard = ({ currentWeather, forecast }) => {
  const { theme } = useTheme();

  return (
    <div className={`p-4 transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`}>
      <h1 className="text-3xl font-bold text-center mb-6">Weather Dashboard</h1>

      <div className="mb-6">
        <WeatherCard data={currentWeather} />
      </div>

      <div className="mb-6">
        <ForecastChart forecast={forecast} />
      </div>
    </div>
  );
};

export default WeatherDashboard;








