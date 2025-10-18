'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { clientAuth, User as ClientUser } from '@/utils/clientAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
let useClientAuth = false; // Flag for graceful degradation

interface User {
  id: string;
  username: string;
  email: string;
  tier: 'free' | 'pro' | 'vip' | 'admin';
  avatar: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        // Try backend first
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000, // 3 second timeout
        });
        setUser(response.data.user);
        useClientAuth = false;
      } catch (error) {
        // Gracefully fallback to client-side auth
        console.log('⚡ Backend unavailable, using client-side auth');
        useClientAuth = true;
        const clientUser = clientAuth.getCurrentUser();
        if (clientUser) {
          setUser(clientUser);
        } else {
          Cookies.remove('token');
        }
      }
    } else {
      // Check client-side session
      const clientUser = clientAuth.getCurrentUser();
      if (clientUser) {
        setUser(clientUser);
        useClientAuth = true;
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      // Try backend first
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { timeout: 3000 }
      );
      const { token, user: userData } = response.data;
      Cookies.set('token', token, { expires: 30 });
      setUser(userData);
      useClientAuth = false;
      toast.success('Welcome back! 🎃');
    } catch (error: any) {
      // Gracefully fallback to client-side auth
      try {
        console.log('⚡ Backend unavailable, using client-side auth');
        const { token, user: userData } = await clientAuth.login(email, password);
        Cookies.set('token', token, { expires: 30 });
        setUser(userData);
        useClientAuth = true;
        toast.success('Welcome back! 🎃 (Offline Mode)');
      } catch (clientError: any) {
        console.error('Login error:', error);
        toast.error(clientError.message || 'Login failed');
        throw clientError;
      }
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      // Try backend first
      const response = await axios.post(
        `${API_URL}/api/auth/signup`,
        { username, email, password },
        { timeout: 3000 }
      );
      const { token, user: userData } = response.data;
      Cookies.set('token', token, { expires: 30 });
      setUser(userData);
      useClientAuth = false;
      toast.success('Account created! 🎃');
    } catch (error: any) {
      // Gracefully fallback to client-side auth
      try {
        console.log('⚡ Backend unavailable, using client-side auth');
        const { token, user: userData } = await clientAuth.signup(username, email, password);
        Cookies.set('token', token, { expires: 30 });
        setUser(userData);
        useClientAuth = true;
        toast.success('Account created! 🎃 (Offline Mode)');
      } catch (clientError: any) {
        console.error('Signup error:', error);
        toast.error(clientError.message || 'Signup failed');
        throw clientError;
      }
    }
  };

  const logout = () => {
    Cookies.remove('token');
    clientAuth.logout();
    setUser(null);
    toast.success('Logged out successfully');
  };

  const refreshUser = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Failed to refresh user');
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
