import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// In-memory alerts storage (replace with database in production)
const userAlerts = new Map();

// Generate weather alerts based on conditions
const generateAlerts = (weatherData, userId) => {
  const alerts = [];
  const current = weatherData.current;
  const forecast = weatherData.forecast;

  // High temperature alert
  if (current.main.temp > 30) {
    alerts.push({
      id: `alert_${Date.now()}_high_temp`,
      userId,
      type: 'high_temp',
      message: `High temperature warning: ${current.main.temp.toFixed(1)}°C in ${current.name}`,
      severity: current.main.temp > 35 ? 'extreme' : 'high',
      timestamp: Date.now(),
      location: current.name,
      dismissed: false,
      data: {
        temperature: current.main.temp,
        threshold: 30
      }
    });
  }

  // Low temperature alert
  if (current.main.temp < -10) {
    alerts.push({
      id: `alert_${Date.now()}_low_temp`,
      userId,
      type: 'low_temp',
      message: `Low temperature warning: ${current.main.temp.toFixed(1)}°C in ${current.name}`,
      severity: current.main.temp < -20 ? 'extreme' : 'high',
      timestamp: Date.now(),
      location: current.name,
      dismissed: false,
      data: {
        temperature: current.main.temp,
        threshold: -10
      }
    });
  }

  // High wind alert
  if (current.wind.speed > 13.9) { // 50 km/h
    alerts.push({
      id: `alert_${Date.now()}_high_wind`,
      userId,
      type: 'high_wind',
      message: `High wind warning: ${(current.wind.speed * 3.6).toFixed(1)} km/h in ${current.name}`,
      severity: current.wind.speed > 20 ? 'extreme' : 'high',
      timestamp: Date.now(),
      location: current.name,
      dismissed: false,
      data: {
        windSpeed: current.wind.speed * 3.6,
        threshold: 50
      }
    });
  }

  // Storm alert
  if (current.weather[0].main === 'Thunderstorm') {
    alerts.push({
      id: `alert_${Date.now()}_storm`,
      userId,
      type: 'storm',
      message: `Thunderstorm warning in ${current.name}`,
      severity: 'high',
      timestamp: Date.now(),
      location: current.name,
      dismissed: false,
      data: {
        weatherCondition: current.weather[0].main,
        description: current.weather[0].description
      }
    });
  }

  // Heavy rain alert
  if (current.weather[0].main === 'Rain' && current.rain && current.rain['1h'] > 10) {
    alerts.push({
      id: `alert_${Date.now()}_heavy_rain`,
      userId,
      type: 'heavy_rain',
      message: `Heavy rain warning: ${current.rain['1h']}mm/h in ${current.name}`,
      severity: 'medium',
      timestamp: Date.now(),
      location: current.name,
      dismissed: false,
      data: {
        rainfall: current.rain['1h'],
        threshold: 10
      }
    });
  }

  return alerts;
};

// Check and create alerts
router.post('/check', authenticateToken, (req, res) => {
  try {
    const { weatherData } = req.body;
    console.log("Weather data received:", JSON.stringify(weatherData, null, 2));
    const userId = req.user.id;

    if (!weatherData || !weatherData.current) {
      return res.status(400).json({ 
        message: 'Weather data required' 
      });
    }

    const newAlerts = generateAlerts(weatherData, userId);
    
    // Get existing alerts for user
    const existingAlerts = userAlerts.get(userId) || [];
    
    // Add new alerts
    const updatedAlerts = [...existingAlerts, ...newAlerts];
    userAlerts.set(userId, updatedAlerts);

    res.json({
      success: true,
      alerts: newAlerts,
      totalAlerts: updatedAlerts.length
    });

  } catch (error) {
    console.error('Alert check error:', error);
    res.status(500).json({ message: 'Failed to check alerts' });
  }
});

// Get user alerts
router.get('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    const alerts = userAlerts.get(userId) || [];
    
    // Filter out dismissed alerts older than 24 hours
    const activeAlerts = alerts.filter(alert => 
      !alert.dismissed || (Date.now() - alert.timestamp) < 24 * 60 * 60 * 1000
    );

    res.json({
      success: true,
      alerts: activeAlerts
    });

  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Failed to fetch alerts' });
  }
});

// Dismiss alert
router.put('/:alertId/dismiss', authenticateToken, (req, res) => {
  try {
    const { alertId } = req.params;
    const userId = req.user.id;
    
    const alerts = userAlerts.get(userId) || [];
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, dismissed: true } : alert
    );
    
    userAlerts.set(userId, updatedAlerts);

    res.json({
      success: true,
      message: 'Alert dismissed successfully'
    });

  } catch (error) {
    console.error('Dismiss alert error:', error);
    res.status(500).json({ message: 'Failed to dismiss alert' });
  }
});

// Clear all alerts
router.delete('/', authenticateToken, (req, res) => {
  try {
    const userId = req.user.id;
    userAlerts.set(userId, []);

    res.json({
      success: true,
      message: 'All alerts cleared successfully'
    });

  } catch (error) {
    console.error('Clear alerts error:', error);
    res.status(500).json({ message: 'Failed to clear alerts' });
  }
});

export default router;