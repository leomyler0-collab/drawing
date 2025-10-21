'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Ghost, Shield, Crown, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      // Error already handled in AuthContext with toast
      // No need to show another error here
    } finally {
      setLoading(false);
    }
  };

  const quickLogin = async (email: string, password: string, accountName: string) => {
    setLoading(true);
    try {
      await login(email, password);
      toast.success(`Logged in as ${accountName}!`);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Quick login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-6xl mb-4"
          >
            👻
          </motion.div>
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
            Welcome Back!
          </h1>
          <p className="text-gray-400">Enter the spooky realm of creativity</p>
        </div>

        <div className="spooky-card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <Mail className="inline mr-1" size={16} />
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="spooky-input"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                <Lock className="inline mr-1" size={16} />
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="spooky-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full spooky-btn disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <div className="loading-spinner mr-2" style={{ width: 20, height: 20 }}></div>
                  Logging in...
                </span>
              ) : (
                'Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-semibold">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Login Options */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <div className="text-center mb-3">
            <p className="text-sm text-gray-400">Quick Login</p>
          </div>

          {/* Admin Quick Login */}
          <button
            onClick={() => quickLogin('leomyler0@gmail.com', 'SuperBoy2020', 'Admin')}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-red-500/20 to-purple-500/20 border-2 border-red-500/40 text-white rounded-lg hover:from-red-500/30 hover:to-purple-500/30 transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Shield size={18} className="text-red-400" />
            Login as Admin
            <span className="text-xs bg-red-500/30 px-2 py-0.5 rounded-full">🛡️</span>
          </button>

          {/* VIP Account 1 */}
          <button
            onClick={() => quickLogin('ronet@gmail.com', 'janet', 'Janet (VIP)')}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/40 text-white rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Crown size={18} className="text-purple-400" />
            Login as Janet (VIP)
            <span className="text-xs bg-purple-500/30 px-2 py-0.5 rounded-full">👑</span>
          </button>

          {/* VIP Account 2 */}
          <button
            onClick={() => quickLogin('nicky23@gmail.com', 'maina', 'Nicky23 (VIP)')}
            disabled={loading}
            className="w-full px-4 py-3 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/40 text-white rounded-lg hover:from-purple-500/30 hover:to-pink-500/30 transition-all font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Crown size={18} className="text-purple-400" />
            Login as Nicky23 (VIP)
            <span className="text-xs bg-pink-500/30 px-2 py-0.5 rounded-full">💎</span>
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Pre-loaded accounts for testing 🚀
          </p>
        </motion.div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
