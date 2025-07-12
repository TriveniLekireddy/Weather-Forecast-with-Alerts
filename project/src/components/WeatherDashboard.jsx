import React, { useState, useEffect } from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import WeatherCard from './WeatherCard';
import ForecastChart from './ForecastChart';
import CurrentWeatherChart from './CurrentWeatherChart';
import AlertPanel from './AlertPanel';
import SearchBar from './SearchBar';
import { LogOut, Sun, Moon, Settings, MapPin } from 'lucide-react';

const WeatherDashboard = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { 
    currentWeather, 
    forecast, 
    alerts, 
    loading, 
    error, 
    fetchWeatherData,
    fetchWeatherByCoordinates
  } = useWeather();

  const [showSettings, setShowSettings] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {
    if (!currentWeather) {
      fetchWeatherData('New York');
    }
  }, [currentWeather, fetchWeatherData]);

  const handleSearch = (city) => fetchWeatherData(city);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported.');
      return;
    }
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        fetchWeatherByCoordinates(coords.latitude, coords.longitude);
        setLocationLoading(false);
      },
      (error) => {
        console.error('Location error:', error);
        alert('Unable to get your location.');
        setLocationLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  };

  const activeAlerts = alerts.filter(alert => !alert.dismissed);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'} transition-colors`}>
      
      {/* Header */}
      <header className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg border-b ${theme === 'dark' ? 'border-gray-700' : 'border-white/20'} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Weather App</h1>
              <div className="flex items-center space-x-2">
                <SearchBar onSearch={handleSearch} />
                <button
                  onClick={handleGetCurrentLocation}
                  disabled={locationLoading}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors disabled:opacity-50`}
                  title="Get current location weather"
                >
                  <MapPin className={`w-5 h-5 ${locationLoading ? 'animate-pulse' : ''}`} />
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} transition-colors`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-700'}`}>{user?.username}</span>
                <button
                  onClick={logout}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-red-700 hover:bg-red-600 text-white' : 'bg-red-100 hover:bg-red-200 text-red-700'} transition-colors`}
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeAlerts.length > 0 && <AlertPanel alerts={activeAlerts} />}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className={`${theme === 'dark' ? 'bg-red-900/50 border-red-700' : 'bg-red-100 border-red-400'} border rounded-xl p-4`}>
            <p className={`${theme === 'dark' ? 'text-red-200' : 'text-red-700'}`}>Error: {error}</p>
          </div>
        ) : (
          <>
            {currentWeather && (
              <>
                <WeatherCard weather={currentWeather} />
                <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg rounded-2xl p-6 shadow-xl`}>
                  <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>Current Weather Chart</h2>
                  <CurrentWeatherChart weather={currentWeather} />
                </div>
              </>
            )}
            {forecast && (
              <div className={`${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'} backdrop-blur-lg rounded-2xl p-6 shadow-xl`}>
                <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>5-Day Forecast</h2>
                <ForecastChart forecast={forecast} />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard;

