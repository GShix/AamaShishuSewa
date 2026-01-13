// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register new user
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.register(userData);
      const { user: newUser, token: newToken } = response.data;

      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update state
      setToken(newToken);
      setUser(newUser);

      return { success: true, user: newUser };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    console.log(email, password)
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.login({ email, password });
      const { user: loggedUser, token: newToken } = response.data;

      // Save to localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(loggedUser));

      // Update state
      setToken(newToken);
      setUser(loggedUser);

      return { success: true, user: loggedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
    setError(null);
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await authAPI.updateProfile(profileData);
      const updatedUser = response.data.user;

      // Update localStorage and state
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true, user: updatedUser };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!token && !!user;

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const value = {
    user,
    token,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated,
    isAdmin,
    setError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;