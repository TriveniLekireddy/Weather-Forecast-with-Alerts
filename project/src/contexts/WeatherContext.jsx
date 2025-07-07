import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { useAuth } from './AuthContext';
import apiService from '../services/api.js';

// Create context
const WeatherContext = createContext();

// Custom hook to use context
export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export const WeatherProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentLocation, setCurrentLocation] = useState('');

  const sendPushNotification = (alert) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Weather Alert', {
        body: alert.message,
        icon: '/weather-alert-icon.png',
        tag: alert.id
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  };

  const checkAlerts = async (weatherData) => {
    try {
      const generatedAlerts = [];
      const { current, forecast } = weatherData;
      const location = `${current.name}, ${current.sys?.country || ''}`;
      const now = Date.now();

      const temp = current.main.temp;
      const windKmh = current.wind.speed * 3.6;

      if (temp >= 40) {
        generatedAlerts.push({
          id: `high_temp_now_${now}`,
          type: 'high_temp_now',
          severity: 'high',
          message: `🔥 Extreme heat alert! Current temp is ${Math.round(temp)}°C.`,
          timestamp: now,
          location,
          dismissed: false
        });
      }

      if (windKmh >= 50) {
        generatedAlerts.push({
          id: `high_wind_now_${now}`,
          type: 'high_wind_now',
          severity: 'medium',
          message: `💨 High winds currently blowing at ${Math.round(windKmh)} km/h.`,
          timestamp: now,
          location,
          dismissed: false
        });
      }

      if (current.weather.some(w => w.main.toLowerCase().includes('rain'))) {
        generatedAlerts.push({
          id: `rain_now_${now}`,
          type: 'rain_now',
          severity: 'low',
          message: `🌧️ Rain currently detected in ${location}.`,
          timestamp: now,
          location,
          dismissed: false
        });
      }

      forecast.list.forEach((entry) => {
        const entryTime = new Date(entry.dt_txt).getTime();
        const entryTemp = entry.main.temp;
        const entryWindKmh = entry.wind.speed * 3.6;
        const weatherDesc = entry.weather.map(w => w.main.toLowerCase());

        if (entryTemp >= 40) {
          generatedAlerts.push({
            id: `high_temp_forecast_${entry.dt}`,
            type: 'high_temp_forecast',
            severity: 'high',
            message: `🌡️ Forecast: Temp will reach ${Math.round(entryTemp)}°C on ${entry.dt_txt}.`,
            timestamp: entryTime,
            location,
            dismissed: false
          });
        }

        if (entryWindKmh >= 50) {
          generatedAlerts.push({
            id: `high_wind_forecast_${entry.dt}`,
            type: 'high_wind_forecast',
            severity: 'medium',
            message: `🌬️ Forecast: Wind may exceed ${Math.round(entryWindKmh)} km/h on ${entry.dt_txt}.`,
            timestamp: entryTime,
            location,
            dismissed: false
          });
        }

        if (
          weatherDesc.includes('rain') ||
          weatherDesc.includes('storm') ||
          weatherDesc.includes('thunderstorm')
        ) {
          generatedAlerts.push({
            id: `rain_forecast_${entry.dt}`,
            type: 'rain_forecast',
            severity: 'low',
            message: `☔ Forecast: Rain expected on ${entry.dt_txt}.`,
            timestamp: entryTime,
            location,
            dismissed: false
          });
        }
      });

      const backendRes = await apiService.checkAlerts(weatherData);
      const backendAlerts = backendRes.alerts || [];

      const allAlerts = [...generatedAlerts, ...backendAlerts];
      setAlerts(allAlerts);

      allAlerts.forEach(sendPushNotification);
    } catch (err) {
      console.error('Error checking alerts:', err);
    }
  };

  const fetchWeatherData = useCallback(async (city) => {
    setLoading(true);
    setError(null);

    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        apiService.getCurrentWeather(city),
        apiService.getForecast(city)
      ]);

      setCurrentWeather(currentResponse.data);
      setForecast(forecastResponse.data);
      setCurrentLocation(city);

      if (isAuthenticated) {
        await checkAlerts({
          current: currentResponse.data,
          forecast: forecastResponse.data
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWeatherByCoordinates = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.getWeatherByCoordinates(lat, lon);

      setCurrentWeather(response.data.current);
      setForecast(response.data.forecast);
      setCurrentLocation(`${lat}, ${lon}`);

      if (isAuthenticated) {
        await checkAlerts({
          current: response.data.current,
          forecast: response.data.forecast
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Weather API error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const dismissAlert = async (alertId) => {
    try {
      if (isAuthenticated) {
        await apiService.dismissAlert(alertId);
      }
      setAlerts(prev =>
        prev.map(alert =>
          alert.id === alertId ? { ...alert, dismissed: true } : alert
        )
      );
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const clearAllAlerts = async () => {
    try {
      if (isAuthenticated) {
        await apiService.clearAlerts();
      }
      setAlerts([]);
    } catch (error) {
      console.error('Failed to clear alerts:', error);
    }
  };

  const loadUserAlerts = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const response = await apiService.getAlerts();
        setAlerts(response.alerts || []);
      } catch (error) {
        console.error('Failed to load alerts:', error);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadUserAlerts();
    } else {
      setAlerts([]);
    }
  }, [isAuthenticated, loadUserAlerts]);

  return (
    <WeatherContext.Provider
      value={{
        currentWeather,
        forecast,
        alerts,
        loading,
        error,
        currentLocation,
        fetchWeatherData,
        fetchWeatherByCoordinates,
        dismissAlert,
        clearAllAlerts,
        requestNotificationPermission
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

// ✅ Add this line to fix your named import error
export { WeatherContext };
