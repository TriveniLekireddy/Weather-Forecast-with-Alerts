import express from 'express';
import axios from 'axios';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Get current weather
router.get('/current/:city', optionalAuth, async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Weather API key not configured' 
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Weather API error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        message: 'City not found' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to fetch weather data',
      error: error.response?.data?.message || 'Weather service unavailable'
    });
  }
});

// Get weather forecast
router.get('/forecast/:city', optionalAuth, async (req, res) => {
  try {
    const { city } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Weather API key not configured' 
      });
    }

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Forecast API error:', error.response?.data || error.message);
    
    if (error.response?.status === 404) {
      return res.status(404).json({ 
        message: 'City not found' 
      });
    }

    res.status(500).json({ 
      message: 'Failed to fetch forecast data',
      error: error.response?.data?.message || 'Weather service unavailable'
    });
  }
});

// Get weather by coordinates
router.get('/coordinates/:lat/:lon', optionalAuth, async (req, res) => {
  try {
    const { lat, lon } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Weather API key not configured' 
      });
    }

    const [currentResponse, forecastResponse] = await Promise.all([
      axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      ),
      axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
      )
    ]);

    res.json({
      success: true,
      data: {
        current: currentResponse.data,
        forecast: forecastResponse.data
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Coordinates weather API error:', error.response?.data || error.message);
    
    res.status(500).json({ 
      message: 'Failed to fetch weather data for coordinates',
      error: error.response?.data?.message || 'Weather service unavailable'
    });
  }
});

// Search cities
router.get('/search/:query', optionalAuth, async (req, res) => {
  try {
    const { query } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        message: 'Weather API key not configured' 
      });
    }

    const response = await axios.get(
      `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
    );

    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('City search API error:', error.response?.data || error.message);
    
    res.status(500).json({ 
      message: 'Failed to search cities',
      error: error.response?.data?.message || 'Search service unavailable'
    });
  }
});

export default router;