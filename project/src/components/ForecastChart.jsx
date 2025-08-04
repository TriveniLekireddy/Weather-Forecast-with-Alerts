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
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [showAll, setShowAll] = useState(false);

  if (!forecast || !forecast.list || !Array.isArray(forecast.list)) {
    return <p className="text-center text-gray-500 dark:text-gray-400">No forecast data available</p>;
  }

  const processedData = forecast.list.map(item => ({
    time: new Date(item.dt * 1000).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }),
    temp: item.main.temp,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed,
    pressure: item.main.pressure
  }));

  const getMetricDataset = () => {
    switch (selectedMetric) {
      case 'temperature':
        return [{
          label: 'Temperature (°C)',
          data: processedData.map(item => item.temp),
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.1)',
          fill: chartType === 'line',
          type: chartType,
          yAxisID: 'y'
        }];
      case 'humidity':
        return [{
          label: 'Humidity (%)',
          data: processedData.map(item => item.humidity),
          borderColor: 'rgb(34, 197, 94)',
          backgroundColor: chartType === 'bar' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.1)',
          fill: false,
          type: chartType,
          yAxisID: 'y1'
        }];
      case 'wind':
        return [{
          label: 'Wind Speed (km/h)',
          data: processedData.map(item => item.windSpeed),
          borderColor: 'rgb(239, 68, 68)',
          backgroundColor: chartType === 'bar' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.1)',
          fill: false,
          type: chartType,
          yAxisID: 'y1'
        }];
      case 'pressure':
        return [{
          label: 'Pressure (hPa)',
          data: processedData.map(item => item.pressure),
          borderColor: 'rgb(168, 85, 247)',
          backgroundColor: chartType === 'bar' ? 'rgba(168, 85, 247, 0.7)' : 'rgba(168, 85, 247, 0.1)',
          fill: false,
          type: chartType,
          yAxisID: 'y1'
        }];
      default:
        return [];
    }
  };

  const chartData = {
    labels: processedData.map(item => item.time),
    datasets: showAll
      ? [
          {
            label: 'Temperature (°C)',
            data: processedData.map(item => item.temp),
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.7)' : 'rgba(59, 130, 246, 0.1)',
            fill: chartType === 'line',
            type: chartType,
            yAxisID: 'y'
          },
          {
            label: 'Humidity (%)',
            data: processedData.map(item => item.humidity),
            borderColor: 'rgb(34, 197, 94)',
            backgroundColor: chartType === 'bar' ? 'rgba(34, 197, 94, 0.7)' : 'rgba(34, 197, 94, 0.1)',
            fill: false,
            type: chartType,
            yAxisID: 'y1'
          },
          {
            label: 'Wind Speed (km/h)',
            data: processedData.map(item => item.windSpeed),
            borderColor: 'rgb(239, 68, 68)',
            backgroundColor: chartType === 'bar' ? 'rgba(239, 68, 68, 0.7)' : 'rgba(239, 68, 68, 0.1)',
            fill: false,
            type: chartType,
            yAxisID: 'y1'
          },
          {
            label: 'Pressure (hPa)',
            data: processedData.map(item => item.pressure),
            borderColor: 'rgb(168, 85, 247)',
            backgroundColor: chartType === 'bar' ? 'rgba(168, 85, 247, 0.7)' : 'rgba(168, 85, 247, 0.1)',
            fill: false,
            type: chartType,
            yAxisID: 'y1'
          }
        ]
      : getMetricDataset()
  };

  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false
    },
    stacked: false,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#fff' : '#000'
        }
      },
      title: {
        display: true,
        text: 'Forecast Data',
        color: theme === 'dark' ? '#fff' : '#000'
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000'
        }
      },
      y: {
        type: 'linear',
        position: 'left',
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000'
        },
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: theme === 'dark' ? '#fff' : '#000'
        }
      },
      y1: {
        type: 'linear',
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: theme === 'dark' ? '#fff' : '#000'
        }
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="space-x-3">
          {!showAll && ['temperature', 'humidity', 'wind', 'pressure'].map(metric => (
            <button
              key={metric}
              className={`px-3 py-1 rounded text-sm font-medium ${
                selectedMetric === metric
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
              }`}
              onClick={() => setSelectedMetric(metric)}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Show All</span>
          <input
            type="checkbox"
            checked={showAll}
            onChange={() => setShowAll(!showAll)}
            className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
          />
        </div>
      </div>
      {chartType === 'line' ? (
        <Line options={chartOptions} data={chartData} />
      ) : (
        <Bar options={chartOptions} data={chartData} />
      )}
    </div>
  );
};

export default ForecastChart;



