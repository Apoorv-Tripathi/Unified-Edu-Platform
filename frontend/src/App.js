import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UnifiedEducationInterface from './components/UnifiedEducationInterface';
import { isAuthenticated, logoutUser, validateToken } from './services/api';
import './App.css';

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  // Check authentication AND validate token with backend
  const checkAuth = async () => {
    setLoading(true);

    // First check if token exists in localStorage
    if (!isAuthenticated()) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }

    // Then validate token with backend (catches server restart)
    try {
      const isValid = await validateToken();
      setAuthenticated(isValid);
    } catch (error) {
      console.error('Token validation failed:', error);
      setAuthenticated(false);
      logoutUser();
    }

    setLoading(false);
  };

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    logoutUser();
    setAuthenticated(false);
    // Force redirect to login
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={authenticated ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />}
        />
        <Route
          path="/register"
          element={authenticated ? <Navigate to="/" replace /> : <Register />}
        />
        <Route
          path="/*"
          element={
            authenticated ? (
              <UnifiedEducationInterface onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;