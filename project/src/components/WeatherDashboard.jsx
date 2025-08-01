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

const CurrentWeatherChart = ({ forecast }) => {
  const { theme } = useTheme();
  const [chartType, setChartType] = useState('line');
  const [selectedMetric, setSelectedMetric] = useState('temp');

  if (!forecast || !forecast.list || !Array.isArray(forecast.list)) return null;

  const today = new Date().toISOString().split('T')[0];

  const todayData = forecast.list.filter(item => item.dt_txt.startsWith(today));

  const labels = todayData.map(item => {
    const time = new Date(item.dt_txt).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
    return time;
  });

  const metricLabels = {
    temp: 'Temperature (°C)',
    humidity: 'Humidity (%)',
    wind: 'Wind Speed (m/s)'
  };

  const metricData = todayData.map(item => {
    if (selectedMetric === 'temp') return item.main.temp;
    if (selectedMetric === 'humidity') return item.main.humidity;
    if (selectedMetric === 'wind') return item.wind.speed;
    return 0;
  });

  const data = {
    labels,
    datasets: [
      {
        label: metricLabels[selectedMetric],
        data: metricData,
        borderColor: '#3b82f6',
        backgroundColor: theme === 'dark' ? '#1e40af' : '#93c5fd',
        fill: true,
        tension: 0.4
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: theme === 'dark' ? 'white' : 'black'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black'
        }
      },
      y: {
        ticks: {
          color: theme === 'dark' ? 'white' : 'black'
        }
      }
    }
  };

  return (
    <div className="p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800 dark:text-white">
        Today's Hourly Forecast
      </h2>

      <div className="flex justify-center gap-4 mb-4">
        <select
          value={selectedMetric}
          onChange={e => setSelectedMetric(e.target.value)}
          className="px-3 py-1 rounded border bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="temp">Temperature</option>
          <option value="humidity">Humidity</option>
          <option value="wind">Wind Speed</option>
        </select>

        <button
          onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
          className="px-4 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Toggle Chart Type
        </button>
      </div>

      {chartType === 'line' ? (
        <Line data={data} options={options} />
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default CurrentWeatherChart;


