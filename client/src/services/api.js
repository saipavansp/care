import axios from 'axios';
import toast from 'react-hot-toast';

const API_URL = 'https://care-1-29fz.onrender.com/api';

// List of allowed frontend domains
const ALLOWED_DOMAINS = [
  'https://www.kinpin.in',
  'https://kinpin.in',
  'https://carecap.vercel.app'
];

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    const isAuthFlow = url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/password/');

    if (status === 401 && !isAuthFlow) {
      // Only force-logout for protected API calls, not for auth flows
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    } else {
      toast.error('Something went wrong!');
    }
    return Promise.reject(error);
  }
);

export default api;