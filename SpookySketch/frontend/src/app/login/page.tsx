'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Ghost } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async () => {
    setEmail('leomyler0@gmail.com');
    setPassword('SuperBoy2020');
    setLoading(true);

    try {
      await login('leomyler0@gmail.com', 'SuperBoy2020');
      router.push('/dashboard');
    } catch (error) {
      console.error('Admin login error:', error);
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

          {/* Admin Quick Login */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-900/20 to-purple-900/20 border border-orange-500/30 rounded-lg">
            <p className="text-sm text-gray-300 mb-3 text-center">
              👑 <strong>Admin Access</strong>
            </p>
            <button
              onClick={handleAdminLogin}
              disabled={loading}
              className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-purple-500 text-white rounded-lg hover:from-orange-600 hover:to-purple-600 transition-all font-semibold disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Quick Admin Login'}
            </button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Email: leomyler0@gmail.com
            </p>
          </div>
        </div>

        <div className="mt-6 text-center space-y-3">
          <Link href="/auth-debug" className="block text-purple-500 hover:text-purple-400 text-sm">
            🔧 Auth Debug Tools
          </Link>
          <Link href="/" className="block text-gray-500 hover:text-gray-400 text-sm">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
