import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import ForecastChart from './ForecastChart';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [theme, setTheme] = useState('light');
  const navigate = useNavigate();

  const fetchWeatherData = async (cityName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized! Please login again.');
        navigate('/');
        return;
      }

      const weatherRes = await axios.get(
        `https://weather-backend-pi-two.vercel.app/api/weather?city=${cityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const forecastRes = await axios.get(
        `https://weather-backend-pi-two.vercel.app/api/forecast?city=${cityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWeather(weatherRes.data);
      setForecast(forecastRes.data);
    } catch (error) {
      toast.error('Failed to fetch weather data');
      console.error(error);
    }
  };

  const handleSearch = () => {
    if (city.trim()) {
      fetchWeatherData(city);
    } else {
      toast.error('Please enter a city name');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  useEffect(() => {
    fetchWeatherData('Kukatpalli');
  }, []);

  return (
    <div className={`min-h-screen px-6 py-4 ${theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-[#f1f5f9] text-black'} transition-colors duration-500`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6 bg-white dark:bg-gray-900 p-4 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Weather App</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-800" />}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="p-2 border border-gray-300 dark:border-gray-600 rounded-lg w-full md:w-96"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
        >
          Search
        </button>
      </div>

      {/* Weather Info */}
      {weather && (
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">
            {weather.name}, {weather.sys.country}
          </h2>
          <p className="capitalize text-lg text-gray-600 dark:text-gray-300">{weather.weather[0].description}</p>
          <p className="text-5xl text-blue-600 font-bold dark:text-blue-400 mt-2">
            {Math.round(weather.main.temp)}°C
          </p>
        </div>
      )}

      {/* Forecast Chart */}
      {forecast && (
        <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg rounded-2xl p-6 shadow-xl mt-6`}>
          <ForecastChart forecast={forecast} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;












