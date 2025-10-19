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
  
  // Public gallery
  gallery: (page: number = 1) => api.get(`/api/drawings/gallery/public?page=${page}`),
  
  // Get single public drawing
  getPublic: (id: string) => api.get(`/api/drawings/public/${id}`),
  
  // Like/Unlike
  like: (id: string) => api.post(`/api/drawings/${id}/like`),
  
  unlike: (id: string) => api.post(`/api/drawings/${id}/unlike`),
  
  // Toggle visibility
  toggleVisibility: (id: string, isPublic: boolean) => 
    api.patch(`/api/drawings/${id}/visibility`, { isPublic }),
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

export const adminAPI = {
  // User Management
  getAllUsers: () => api.get('/api/admin/users'),
  
  getUserDetails: (userId: string) => api.get(`/api/admin/users/${userId}`),
  
  updateUserTier: (userId: string, tier: 'free' | 'pro' | 'vip' | 'admin') =>
    api.put(`/api/admin/users/${userId}/tier`, { tier }),
  
  deleteUser: (userId: string) => api.delete(`/api/admin/users/${userId}`),
  
  // Analytics
  getAnalytics: () => api.get('/api/admin/analytics'),
  
  // Drawings
  getAllDrawings: () => api.get('/api/admin/drawings'),
  
  // Settings
  getSettings: () => api.get('/api/admin/settings'),
  
  updateSettings: (settings: any) => api.put('/api/admin/settings', settings),
  
  // Drawing Management
  deleteDrawing: (drawingId: string) => api.delete(`/api/admin/drawings/${drawingId}`),
  
  updateDrawingVisibility: (drawingId: string, isPublic: boolean) =>
    api.patch(`/api/admin/drawings/${drawingId}/visibility`, { isPublic }),
  
  updateDrawingLikes: (drawingId: string, likes: number) =>
    api.patch(`/api/admin/drawings/${drawingId}/likes`, { likes }),
  
  updateDrawingViews: (drawingId: string, views: number) =>
    api.patch(`/api/admin/drawings/${drawingId}/views`, { views }),
};
