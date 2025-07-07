import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WeatherProvider } from './contexts/WeatherContext';
import { ThemeProvider } from './contexts/ThemeContext';
import AuthForm from './components/AuthForm';
import WeatherDashboard from './components/WeatherDashboard';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="text-center text-white mt-10">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WeatherProvider>
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <WeatherDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </WeatherProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
