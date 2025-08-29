import axios from 'axios';
import toast from 'react-hot-toast';

const RAW_API_URL = process.env.REACT_APP_API_URL || 'https://care-a6rj.onrender.com/api';
// Ensure base URL ends with /api
const API_URL = RAW_API_URL.endsWith('/api')
  ? RAW_API_URL
  : `${RAW_API_URL.replace(/\/+$/, '')}/api`;
export const API_BASE_URL = API_URL;

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
  timeout: 60000 // 60s to tolerate cold starts
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