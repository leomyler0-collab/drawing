'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Ghost, Shield, Copy } from 'lucide-react';
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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`, { icon: '📋' });
  };

  const useAdminCredentials = () => {
    setEmail('leomyler0@gmail.com');
    setPassword('SuperBoy2020');
    toast.success('Admin credentials filled!', { icon: '👑' });
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

        {/* Admin Credentials Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 bg-gradient-to-r from-red-500/10 to-purple-500/10 border-2 border-red-500/30 rounded-lg p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="text-red-500" size={20} />
            <h3 className="text-sm font-bold text-red-400">Admin Access</h3>
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2 bg-black/30 rounded p-2">
              <div className="flex-1">
                <div className="text-gray-400 text-xs">Email</div>
                <div className="text-white font-mono">leomyler0@gmail.com</div>
              </div>
              <button
                onClick={() => copyToClipboard('leomyler0@gmail.com', 'Email')}
                className="p-1.5 hover:bg-purple-500/20 rounded transition-colors"
                title="Copy email"
              >
                <Copy size={14} className="text-purple-400" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 bg-black/30 rounded p-2">
              <div className="flex-1">
                <div className="text-gray-400 text-xs">Password</div>
                <div className="text-white font-mono">SuperBoy2020</div>
              </div>
              <button
                onClick={() => copyToClipboard('SuperBoy2020', 'Password')}
                className="p-1.5 hover:bg-purple-500/20 rounded transition-colors"
                title="Copy password"
              >
                <Copy size={14} className="text-purple-400" />
              </button>
            </div>

            <button
              onClick={useAdminCredentials}
              className="w-full mt-2 px-4 py-2 bg-gradient-to-r from-red-500 to-purple-500 text-white rounded-lg hover:from-red-600 hover:to-purple-600 transition-all font-semibold text-sm"
            >
              👑 Use Admin Credentials
            </button>
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center">
            Works on all deployments (Netlify, Vercel, Local) 🚀
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
