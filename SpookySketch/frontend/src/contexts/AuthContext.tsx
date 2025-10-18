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
    // Initialize client auth system (including admin account)
    if (typeof window !== 'undefined') {
      clientAuth.initialize();
    }
    checkAuth();
  }, []);

  const checkAuth = async () => {
    // Always check client-side auth first (works offline)
    const clientUser = clientAuth.getCurrentUser();
    
    if (clientUser) {
      // User has valid client-side session
      setUser(clientUser);
      useClientAuth = true;
      setLoading(false);
      console.log('✅ Restored session for:', clientUser.username);
      return;
    }
    
    // If no client-side session, check cookie for backend auth
    const token = Cookies.get('token');
    if (token) {
      try {
        // Try backend
        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000,
        });
        setUser(response.data.user);
        useClientAuth = false;
      } catch (error) {
        // Backend unavailable, clear invalid token
        console.log('⚡ Backend unavailable');
        Cookies.remove('token');
      }
    }
    
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      // Use client-side auth (no backend required)
      console.log('🔐 Logging in:', email);
      const { token, user: userData } = await clientAuth.login(email, password);
      Cookies.set('token', token, { expires: 30 });
      setUser(userData);
      useClientAuth = true;
      toast.success(`Welcome back, ${userData.username}! 🎃`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Check your email and password.');
      throw error;
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    try {
      // Use client-side auth (no backend required)
      console.log('📝 Creating account:', username, email);
      const { token, user: userData } = await clientAuth.signup(username, email, password);
      Cookies.set('token', token, { expires: 30 });
      setUser(userData);
      useClientAuth = true;
      toast.success(`Account created, ${userData.username}! 🎃`);
    } catch (error: any) {
      console.error('Signup error:', error);
      toast.error(error.message || 'Signup failed. Try a different email or username.');
      throw error;
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
