import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, LocateIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ForecastChart from './ForecastChart';
import WeatherCard from './WeatherCard';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [unit, setUnit] = useState('metric');
  const [theme, setTheme] = useState('light');
  const [activeMetric, setActiveMetric] = useState('temperature');
  const [showAll, setShowAll] = useState(false);
  const navigate = useNavigate();

  const fetchWeatherData = async (cityName) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Unauthorized! Please login again.');
        navigate('/');
        return;
      }

      const weatherResponse = await axios.get(
        `https://weather-backend-pi-two.vercel.app/api/weather?city=${cityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const forecastResponse = await axios.get(
        `https://weather-backend-pi-two.vercel.app/api/forecast?city=${cityName}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
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
    <div className={`min-h-screen p-6 transition duration-500 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weather App</h1>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700">
            {theme === 'dark' ? <Sun className="text-yellow-400" /> : <Moon className="text-blue-900" />}
          </button>
          <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg">
            Logout
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <div className="flex items-center w-full md:w-[400px] border border-gray-300 dark:border-gray-600 rounded-lg px-3">
          <LocateIcon className="text-gray-500" />
          <input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 bg-transparent outline-none w-full"
          />
        </div>
        <button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
          Search
        </button>
      </div>

      {weather && (
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">{weather.name}, {weather.sys?.country}</h2>
          <p className="capitalize text-lg">{weather.weather?.[0]?.description}</p>
          <p className="text-5xl text-blue-600 font-bold">{Math.round(weather.main?.temp)}°C</p>
        </div>
      )}

      {forecast && (
        <div className={`rounded-2xl p-6 shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg`}>
          <div className="flex flex-wrap justify-center items-center gap-4 mb-6">
            {['temperature', 'humidity', 'wind', 'pressure'].map((metric) => (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  activeMetric === metric
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white'
                }`}
              >
                {metric.charAt(0).toUpperCase() + metric.slice(1)}
              </button>
            ))}
            <label className="flex items-center gap-2">
              <span>Show All</span>
              <input
                type="checkbox"
                checked={showAll}
                onChange={() => setShowAll((prev) => !prev)}
              />
            </label>
          </div>
          <ForecastChart
            forecast={forecast}
            unit={unit}
            theme={theme}
            activeMetric={activeMetric}
            showAll={showAll}
          />
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;













