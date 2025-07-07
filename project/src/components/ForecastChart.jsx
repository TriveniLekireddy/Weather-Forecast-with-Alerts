import React, { useState } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const ForecastChart = ({ forecast }) => {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState('line');

  if (!forecast || !forecast.list || !Array.isArray(forecast.list)) {
    return (
      <div className="text-center text-sm text-gray-400 dark:text-gray-500">
        Forecast data not available yet.
      </div>
    );
  }

  const processedData = forecast.list.slice(0, 24).map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }),
    date: new Date(item.dt * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    }),
    temp: Math.round(item.main.temp),
    humidity: item.main.humidity,
    windSpeed: Math.round(item.wind.speed * 3.6),
    pressure: item.main.pressure
  }));

  const chartData = {
    labels: processedData.map(item => item.time),
    datasets: [
      {
        label: 'Temperature (°C)',
        data: processedData.map(item => item.temp),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.1)',
        fill: chartType === 'line',
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        pointBorderWidth: 2,
        type: chartType
      },
      {
        label: 'Humidity (%)',
        data: processedData.map(item => item.humidity),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: chartType === 'bar' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.1)',
        fill: false,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgb(34, 197, 94)',
        pointBorderColor: theme === 'dark' ? '#1f2937' : '#ffffff',
        pointBorderWidth: 2,
        yAxisID: 'y1',
        type: chartType
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: { size: 14, weight: 500 }
        }
      },
      tooltip: {
        backgroundColor: theme === 'dark' ? 'rgba(17, 24, 39, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        titleColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        bodyColor: theme === 'dark' ? '#e5e7eb' : '#374151',
        borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        callbacks: {
          title: context => {
            const index = context[0].dataIndex;
            return `${processedData[index].date} at ${processedData[index].time}`;
          },
          afterBody: context => {
            const index = context[0].dataIndex;
            return [
              `Wind Speed: ${processedData[index].windSpeed} km/h`,
              `Pressure: ${processedData[index].pressure} hPa`
            ];
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          font: { size: 12 },
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          font: { size: 14, weight: 500 }
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)',
          color: theme === 'dark' ? '#e5e7eb' : '#374151',
          font: { size: 14, weight: 500 }
        },
        grid: { drawOnChartArea: false },
        ticks: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center space-x-3 mb-4">
  <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
    {chartType === 'line' ? 'Line Chart' : 'Bar Chart'}
  </span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={chartType === 'bar'}
      onChange={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
      className="sr-only peer"
    />
    <div
      className={`w-11 h-6 rounded-full peer dark:bg-gray-600 peer-checked:bg-blue-600 transition-colors ${
        theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
      }`}
    ></div>
    <div
      className={`absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${
        chartType === 'bar' ? 'translate-x-5' : ''
      }`}
    ></div>
  </label>
</div>


      <div className="h-96">
        {chartType === 'line' ? (
          <Line data={chartData} options={options} />
        ) : (
          <Bar data={chartData} options={options} />
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {forecast.list.slice(0, 8).map((item, index) => (
          <div
            key={index}
            className={`${
              theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100/50'
            } rounded-xl p-4 text-center`}
          >
            <p
              className={`text-sm ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {new Date(item.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'short',
                hour: '2-digit'
              })}
            </p>
            <img
              src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
              alt={item.weather[0].description}
              className="w-12 h-12 mx-auto"
            />
            <p
              className={`text-lg font-bold ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}
            >
              {Math.round(item.main.temp)}°C
            </p>
            <p
              className={`text-xs ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              {item.weather[0].description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastChart;
