import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect
      Cookies.remove('token');
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// API helper functions
export const authAPI = {
  signup: (username: string, email: string, password: string) =>
    api.post('/api/auth/signup', { username, email, password }),
  
  login: (email: string, password: string) =>
    api.post('/api/auth/login', { email, password }),
  
  getMe: () => api.get('/api/auth/me'),
  
  logout: () => api.post('/api/auth/logout'),
};

export const drawingAPI = {
  create: (data: any) => api.post('/api/drawings/create', data),
  
  list: () => api.get('/api/drawings/list'),
  
  get: (id: string) => api.get(`/api/drawings/${id}`),
  
  update: (id: string, data: any) => api.put(`/api/drawings/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/drawings/${id}`),
  
  gallery: (page: number = 1) => api.get(`/api/drawings/gallery/public?page=${page}`),
};

export const userAPI = {
  profile: () => api.get('/api/user/profile'),
  
  updateProfile: (data: any) => api.put('/api/user/profile', data),
  
  stats: () => api.get('/api/user/stats'),
};

export const subscriptionAPI = {
  createCheckout: (tier: 'pro' | 'vip') =>
    api.post('/api/subscription/create-checkout-session', { tier }),
  
  status: () => api.get('/api/subscription/status'),
  
  cancel: () => api.post('/api/subscription/cancel'),
};
