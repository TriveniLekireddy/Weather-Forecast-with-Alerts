import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTheme } from '../contexts/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CurrentWeatherChart = ({ weather }) => {
  const { theme } = useTheme();

  if (!weather || !weather.main) {
    return (
      <div className="text-center text-sm text-gray-400 dark:text-gray-500">
        Current weather data not available yet.
      </div>
    );
  }

  const chartData = {
    labels: ['Now'],
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [Math.round(weather.main.temp)],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Humidity (%)',
        data: [weather.main.humidity],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151'
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Temperature (°C)',
          color: theme === 'dark' ? '#e5e7eb' : '#374151'
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151'
        },
        grid: {
          color: theme === 'dark' ? '#374151' : '#e5e7eb'
        }
      },
      y1: {
        position: 'right',
        title: {
          display: true,
          text: 'Humidity (%)',
          color: theme === 'dark' ? '#e5e7eb' : '#374151'
        },
        ticks: {
          color: theme === 'dark' ? '#e5e7eb' : '#374151'
        },
        grid: {
          drawOnChartArea: false
        }
      }
    }
  };

  return (
    <div className="h-72">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default CurrentWeatherChart;
