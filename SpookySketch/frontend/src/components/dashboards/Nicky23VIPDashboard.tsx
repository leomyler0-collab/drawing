'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Palette, Crown, Trash2, Edit, Eye, Calendar, TrendingUp, 
  Download, Share2, Layers, Sparkles, Users, Star, Infinity as InfinityIcon,
  Globe, Lock as LockIcon, Zap, Heart, Award, Gift, Wand2, Gem, Rocket
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { handleVisibilityToggle } from '@/utils/visibilityHandler';
import { User, Drawing, Stats, DashboardProps } from '@/types';

interface Nicky23VIPDashboardProps extends DashboardProps {
  user: User;
  drawings: Drawing[];
  stats: Stats | null;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

export default function Nicky23VIPDashboard({ user, drawings, stats, onDelete, onUpdate }: Nicky23VIPDashboardProps) {
  const handleToggleVisibility = async (drawingId: string, currentStatus: boolean) => {
    await handleVisibilityToggle({
      drawingId,
      currentStatus,
      userId: user.id,
      onSuccess: onUpdate,
      source: 'Nicky23VIP'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-900/10 via-purple-900/10 to-pink-900/10">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Diamond Elite Nicky23 Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-2xl mb-8"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20"></div>
            <div className="relative spooky-card border-2 border-cyan-500/50 bg-gradient-to-r from-cyan-900/30 via-purple-900/30 to-pink-900/30">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-7xl relative">
                    💎
                    <div className="absolute -top-3 -right-3 animate-pulse">
                      <Gem className="text-cyan-400" size={24} />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Nicky23&apos;s Diamond Studio
                    </h1>
                    <p className="text-gray-300 text-lg">{user.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                        <Gem size={22} className="animate-bounce" />
                        DIAMOND VIP ELITE
                      </div>
                      <span className="px-3 py-1 bg-gradient-to-r from-cyan-500/30 to-pink-500/30 rounded-full text-xs border border-cyan-500/50 animate-pulse">
                        💎 ULTIMATE POWER
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Link href="/studio">
                    <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 transition-all font-bold text-lg shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105 transform">
                      <Rocket className="inline mr-2" size={22} />
                      Create Magic
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Diamond Elite Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="spooky-card bg-gradient-to-r from-cyan-900/20 via-purple-900/20 to-pink-900/10 border-2 border-cyan-500/50 mb-8"
          >
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
                <Gem className="text-cyan-400 animate-pulse" size={24} />
                Your Diamond Elite Powers
                <Gem className="text-cyan-400 animate-pulse" size={24} />
              </h3>
              <p className="text-gray-400">Unleash your unlimited creative potential</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-cyan-500/20 to-cyan-500/10 rounded-xl border border-cyan-500/30 hover:scale-105 transition-transform">
                <InfinityIcon size={28} className="text-cyan-400" />
                <span className="font-semibold text-cyan-300">∞ Everything</span>
                <span className="text-xs text-gray-400">No boundaries</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500/20 to-purple-500/10 rounded-xl border border-purple-500/30 hover:scale-105 transition-transform">
                <Rocket size={28} className="text-purple-400" />
                <span className="font-semibold text-purple-300">Lightning Fast</span>
                <span className="text-xs text-gray-400">Instant access</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-pink-500/20 to-pink-500/10 rounded-xl border border-pink-500/30 hover:scale-105 transition-transform">
                <Wand2 size={28} className="text-pink-400" />
                <span className="font-semibold text-pink-300">Pro Tools</span>
                <span className="text-xs text-gray-400">Premium suite</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-cyan-500/20 to-purple-500/10 rounded-xl border border-cyan-500/30 hover:scale-105 transition-transform">
                <Star size={28} className="text-cyan-400" />
                <span className="font-semibold text-cyan-300">VIP Status</span>
                <span className="text-xs text-gray-400">Elite access</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl border border-purple-500/30 hover:scale-105 transition-transform">
                <Award size={28} className="text-purple-400" />
                <span className="font-semibold text-purple-300">Premium</span>
                <span className="text-xs text-gray-400">Best quality</span>
              </div>
            </div>
          </motion.div>

          {/* Advanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="spooky-card bg-gradient-to-br from-cyan-500/10 to-cyan-900/20 border-2 border-cyan-500/40 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Artwork Count</p>
                  <p className="text-3xl font-bold text-cyan-400">{drawings.length}</p>
                  <p className="text-xs text-gray-500 mt-1">∞ Unlimited storage</p>
                </div>
                <Layers className="text-cyan-500" size={40} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="spooky-card bg-gradient-to-br from-purple-500/10 to-purple-900/20 border-2 border-purple-500/40 hover:border-purple-500/60 transition-all hover:shadow-lg hover:shadow-purple-500/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Views</p>
                  <p className="text-3xl font-bold text-purple-400">{stats?.totalViews || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Viewers amazed!</p>
                </div>
                <Eye className="text-purple-500" size={40} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="spooky-card bg-gradient-to-br from-pink-500/10 to-pink-900/20 border-2 border-pink-500/40 hover:border-pink-500/60 transition-all hover:shadow-lg hover:shadow-pink-500/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Fan Likes</p>
                  <p className="text-3xl font-bold text-pink-400">{stats?.totalLikes || 0}</p>
                  <p className="text-xs text-gray-500 mt-1">Community loves you!</p>
                </div>
                <Heart className="text-pink-500" size={40} />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35 }}
              className="spooky-card bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 border-2 border-cyan-500/40 hover:border-cyan-500/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Gallery Shares</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
                    {drawings.filter(d => d.isPublic).length}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Public artworks</p>
                </div>
                <Globe className="text-cyan-500" size={40} />
              </div>
            </motion.div>
          </div>

          {/* Gallery Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
              Your Diamond Art Collection 💎
            </h2>

            {drawings.length === 0 ? (
              <div className="spooky-card text-center py-16 bg-gradient-to-br from-cyan-900/10 to-pink-900/10 border-2 border-cyan-500/30">
                <div className="text-6xl mb-4">💎✨</div>
                <h3 className="text-xl font-bold mb-2 text-cyan-400">Your Diamond Canvas Awaits!</h3>
                <p className="text-gray-400 mb-6">Time to create something extraordinary</p>
                <Link href="/studio">
                  <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg hover:from-cyan-600 hover:to-pink-600 transition-all font-semibold">
                    <Rocket className="inline mr-2" size={18} />
                    Start Creating
                  </button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {drawings.map((drawing, index) => (
                  <motion.div
                    key={drawing.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    className="spooky-card group hover:scale-105 transition-all duration-300 border-2 border-cyan-500/30 hover:border-cyan-500/60 bg-gradient-to-br from-cyan-900/10 to-pink-900/10 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    <div className="relative aspect-square mb-3 rounded-lg overflow-hidden bg-spooky-bg border border-cyan-500/20">
                      {drawing.thumbnail ? (
                        <img
                          src={drawing.thumbnail}
                          alt={drawing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-500/10 to-pink-500/10">
                          <Palette className="text-cyan-500/50" size={48} />
                        </div>
                      )}
                      <div className="absolute top-2 right-2 flex gap-2">
                        {drawing.isPublic ? (
                          <Globe className="text-green-400 bg-black/60 p-1.5 rounded-full" size={24} />
                        ) : (
                          <LockIcon className="text-gray-400 bg-black/60 p-1.5 rounded-full" size={24} />
                        )}
                      </div>
                    </div>

                    <h3 className="font-semibold mb-2 text-cyan-300 truncate">{drawing.title}</h3>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Eye size={14} /> {drawing.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <Heart size={14} /> {drawing.likes}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/studio/${drawing.id}`} className="flex-1">
                        <button className="w-full px-3 py-2 bg-gradient-to-r from-cyan-500 to-pink-500 text-white rounded-lg hover:from-cyan-600 hover:to-pink-600 transition-all text-sm font-semibold">
                          <Edit size={14} className="inline mr-1" />
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => drawing.id && handleToggleVisibility(drawing.id, drawing.isPublic || false)}
                        className="px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                        title={drawing.isPublic ? 'Make Private' : 'Make Public'}
                      >
                        {drawing.isPublic ? <LockIcon size={14} /> : <Globe size={14} />}
                      </button>
                      <button
                        onClick={() => drawing.id && onDelete(drawing.id)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
