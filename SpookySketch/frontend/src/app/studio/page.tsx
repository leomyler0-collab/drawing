'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import DrawingCanvas from '@/components/DrawingCanvas';
import Toolbar from '@/components/Toolbar';
import LayerPanel from '@/components/LayerPanel';
import { motion } from 'framer-motion';

export default function StudioPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!loading && !user && mounted) {
      router.push('/login');
    }
  }, [user, loading, router, mounted]);

  if (loading || !mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading studio...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col bg-spooky-bg overflow-hidden">
      {/* Header */}
      <header className="bg-spooky-card border-b border-orange-500/20 px-4 py-2 flex items-center justify-between h-12">
        <div className="flex items-center gap-3">
          <motion.span
            animate={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-2xl"
          >
            🎃
          </motion.span>
          <h1 className="text-xl font-bold text-orange-500">SpookySketch Studio</h1>
          <span className="text-xs text-gray-500 hidden md:inline">Ctrl+S to save | Ctrl+Z to undo</span>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-400">
            {user.username} | <span className="text-orange-500 font-semibold">{user.tier.toUpperCase()}</span>
          </span>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-all text-sm"
          >
            Dashboard
          </button>
        </div>
      </header>

      {/* Main Studio */}
      <div className="flex-1 flex overflow-hidden">
        <DrawingCanvas user={user} />
      </div>
    </div>
  );
}
