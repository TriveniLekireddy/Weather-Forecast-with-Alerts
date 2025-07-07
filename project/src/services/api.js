const API_BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getAuthToken() {
    return localStorage.getItem('weather_app_token');
  }

  getHeaders(includeAuth = true) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = this.getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const config = {
      method: 'GET',
      headers: this.getHeaders(options.auth !== false),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      const data = isJson ? await response.json() : null;

      if (!response.ok) {
        const message = (data && data.message) || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(message);
      }

      return data;
    } catch (error) {
      console.error(`API request failed [${config.method} ${url}]`, error);
      throw error;
    }
  }

  // ========== AUTH ==========

  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
      auth: false,
    });
  }

  async register(username, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, email, password }),
      auth: false,
    });
  }

  async getCurrentUser() {
    const res = await this.request('/auth/me');
    return res?.user || res; // ✅ handles both wrapped and unwrapped formats
  }

  async updatePreferences(preferences) {
    return this.request('/auth/preferences', {
      method: 'PUT',
      body: JSON.stringify({ preferences }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // ========== WEATHER ==========

  async getCurrentWeather(city) {
    return this.request(`/weather/current/${encodeURIComponent(city)}`, { auth: false });
  }

  async getForecast(city) {
    return this.request(`/weather/forecast/${encodeURIComponent(city)}`, { auth: false });
  }

  async getWeatherByCoordinates(lat, lon) {
    return this.request(`/weather/coordinates/${lat}/${lon}`, { auth: false });
  }

  async searchCities(query) {
    return this.request(`/weather/search/${encodeURIComponent(query)}`, { auth: false });
  }

  // ========== ALERTS ==========

  async checkAlerts(weatherData) {
    return this.request('/alerts/check', {
      method: 'POST',
      body: JSON.stringify({ weatherData }),
    });
  }

  async getAlerts() {
    return this.request('/alerts');
  }

  async dismissAlert(alertId) {
    return this.request(`/alerts/${alertId}/dismiss`, {
      method: 'PUT',
    });
  }

  async clearAllAlerts() {
    return this.request('/alerts', {
      method: 'DELETE',
    });
  }

  // ========== SYSTEM ==========

  async healthCheck() {
    return this.request('/health', { auth: false });
  }
}

export default new ApiService();
