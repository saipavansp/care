import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is logged in on mount
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const savedUser = authService.getCurrentUser();
      
      if (token && savedUser) {
        // Verify token is still valid
        try {
          const { valid } = await authService.verifyToken();
          if (valid) {
            setUser(savedUser);
            setIsAuthenticated(true);
          } else {
            // Token invalid: clear only token but keep user for soft fallback
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        } catch {
          // Network issue: keep session based on local storage to prevent logout on refresh
          setUser(savedUser);
          setIsAuthenticated(true);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Login attempt with:', credentials);
      const data = await authService.login(credentials);
      console.log('Login response:', data);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Login successful!');
      return { success: true, data };
    } catch (error) {
      console.error('Login error:', error);
      // Add more detailed error logging
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Register function called with:', userData);
      const data = await authService.register(userData);
      console.log('Registration response:', data);
      setUser(data.user);
      setIsAuthenticated(true);
      toast.success('Registration successful!');
      return { success: true, data };
    } catch (error) {
      console.error('Registration error in context:', error);
      
      // Provide more specific error messages based on the error
      let errorMessage = 'Registration failed';
      
      if (error.response) {
        console.error('Error response in context:', error.response.data);
        // Handle specific error cases
        if (error.response.status === 400) {
          if (error.response.data.message.includes('already exists')) {
            errorMessage = 'This phone number is already registered. Please login instead.';
          } else if (error.response.data.message.includes('validation')) {
            errorMessage = 'Please check your information and try again.';
          } else {
            errorMessage = error.response.data.message || 'Invalid registration data';
          }
        } else if (error.response.status === 429) {
          errorMessage = 'Too many attempts. Please try again later.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.message.includes('timeout') || error.message.includes('aborted')) {
        errorMessage = 'Request timed out. The server might be busy, please try again.';
      }
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};