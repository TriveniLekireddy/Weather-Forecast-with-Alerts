import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initialize = async () => {
      const token = localStorage.getItem('weather_app_token');
      if (token) {
        try {
          const res = await apiService.getCurrentUser();
          setUser(res); // ✅ Response is now just user object
          setIsAuthenticated(true);
        } catch {
          localStorage.removeItem('weather_app_token');
        }
      }
      setLoading(false);
    };
    initialize();
  }, []);

  const login = async (username, password) => {
    try {
      const res = await apiService.login(username, password);
      localStorage.setItem('weather_app_token', res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Login failed';
      return { success: false, message };
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await apiService.register(username, email, password);
      localStorage.setItem('weather_app_token', res.token);
      setUser(res.user);
      setIsAuthenticated(true);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Registration failed';
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await apiService.logout();
    } finally {
      localStorage.removeItem('weather_app_token');
      setUser(null);
      setIsAuthenticated(false);
      navigate('/auth');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
