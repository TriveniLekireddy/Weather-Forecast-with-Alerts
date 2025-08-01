import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import WeatherChart from './WeatherChart'; // Forecast chart
import WeatherCard from './WeatherCard'; // Current weather summary card

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [unit, setUnit] = useState('metric');
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

      const weatherResponse = await axios.get(`https://weather-backend-pi-two.vercel.app/api/weather?city=${cityName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const forecastResponse = await axios.get(`https://weather-backend-pi-two.vercel.app/api/forecast?city=${cityName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

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
    const savedTheme = localStorage.getItem('weather_app_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const defaultCity = 'Kukatpalli';
    fetchWeatherData(defaultCity);
  }, []);

  useEffect(() => {
    localStorage.setItem('weather_app_theme', theme);
  }, [theme]);

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-colors duration-500`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Weather App</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="text-yellow-500" /> : <Moon className="text-blue-800" />}
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

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

      {weather && <WeatherCard weather={weather} theme={theme} />}
      {forecast && (
        <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg rounded-2xl p-6 shadow-xl mt-6`}>
          <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
            Forecast Chart
          </h2>
          <WeatherChart forecast={forecast} unit={unit} theme={theme} />
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;










