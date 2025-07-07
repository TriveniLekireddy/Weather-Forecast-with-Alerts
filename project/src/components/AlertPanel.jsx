import React from 'react';
import { useWeather } from '../contexts/WeatherContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  AlertTriangle,
  X,
  Wind,
  Thermometer,
  CloudRain,
  CloudLightning,
  Sun
} from 'lucide-react';

const AlertPanel = () => {
  const { alerts, dismissAlert } = useWeather();
  const { theme } = useTheme();

  const getAlertIcon = (type) => {
    if (type.includes('temp')) return <Thermometer className="w-5 h-5" />;
    if (type.includes('wind')) return <Wind className="w-5 h-5" />;
    if (type.includes('rain')) return <CloudRain className="w-5 h-5" />;
    if (type.includes('storm')) return <CloudLightning className="w-5 h-5" />;
    if (type.includes('sun')) return <Sun className="w-5 h-5" />;
    return <AlertTriangle className="w-5 h-5" />;
  };

  const getAlertColor = (severity) => {
    switch (severity) {
      case 'low':
        return theme === 'dark'
          ? 'bg-blue-900/50 border-blue-600 text-blue-200'
          : 'bg-blue-100 border-blue-400 text-blue-800';
      case 'medium':
        return theme === 'dark'
          ? 'bg-yellow-900/50 border-yellow-600 text-yellow-200'
          : 'bg-yellow-100 border-yellow-400 text-yellow-800';
      case 'high':
        return theme === 'dark'
          ? 'bg-orange-900/50 border-orange-600 text-orange-200'
          : 'bg-orange-100 border-orange-400 text-orange-800';
      case 'extreme':
        return theme === 'dark'
          ? 'bg-red-900/50 border-red-600 text-red-200'
          : 'bg-red-100 border-red-400 text-red-800';
      default:
        return theme === 'dark'
          ? 'bg-gray-800/50 border-gray-600 text-gray-200'
          : 'bg-gray-100 border-gray-400 text-gray-800';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      case 'extreme':
        return 'Extreme';
      default:
        return 'Unknown';
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!alerts || alerts.length === 0) return null;

  return (
    <div className={`${
      theme === 'dark' ? 'bg-gray-800/50' : 'bg-white/50'
    } backdrop-blur-lg rounded-2xl p-6 shadow-xl`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-xl font-bold flex items-center space-x-2 ${
          theme === 'dark' ? 'text-white' : 'text-gray-800'
        }`}>
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <span>Weather Alerts ({alerts.length})</span>
        </h2>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border rounded-xl p-4 ${getAlertColor(alert.severity)} transition-all duration-200 hover:shadow-lg`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wide opacity-75">
                      {getSeverityText(alert.severity)}
                    </span>
                    <span className="text-xs opacity-75">
                      {formatTime(alert.timestamp)}
                    </span>
                  </div>
                  <p className="font-medium">{alert.message}</p>
                  <p className="text-sm opacity-75 mt-1">{alert.location}</p>
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertPanel;
