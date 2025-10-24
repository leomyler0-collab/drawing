'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Image, Heart, Eye, Trash2, Edit, Lock, Unlock, 
  Plus, Grid, List, TrendingUp, Sparkles, Zap, Star, Crown
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { User } from '@/types';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import Cookies from 'js-cookie';
import { localDB } from '@/utils/localStorageDB';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface UnifiedDashboardProps {
  user: User;
  drawings: any[];
  stats: any;
  onDelete: (id: string) => void;
  onUpdate: () => void;
}

export default function UnifiedDashboard({ user, drawings, stats, onDelete, onUpdate }: UnifiedDashboardProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const handleToggleVisibility = async (drawingId: string, currentVisibility: boolean) => {
    const newVisibility = !currentVisibility;
    const token = Cookies.get('token');
    
    try {
      // Try backend first
      await axios.patch(
        `${API_URL}/api/drawings/${drawingId}/visibility`,
        { isPublic: newVisibility },
        { 
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000
        }
      );
      
      toast.success(newVisibility ? '✅ Drawing is now public!' : '🔒 Drawing is now private');
      
      // Dispatch event for gallery to refresh
      window.dispatchEvent(new CustomEvent('visibilityChanged', { 
        detail: { drawingId, isPublic: newVisibility }
      }));
      
      onUpdate();
    } catch (error) {
      // Fallback to localStorage
      console.log('⚡ Backend unavailable, updating localStorage');
      localDB.toggleVisibility(drawingId, newVisibility);
      
      toast.success(newVisibility ? '✅ Drawing is now public! (local)' : '🔒 Drawing is now private (local)');
      
      // Dispatch event for gallery to refresh
      window.dispatchEvent(new CustomEvent('visibilityChanged', { 
        detail: { drawingId, isPublic: newVisibility }
      }));
      
      onUpdate();
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <Navbar />
      
      <div className="pt-20 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Animated Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="text-center mb-12"
          >
            <motion.div
              animate={floatingAnimation}
              className="inline-block mb-4"
            >
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto" />
            </motion.div>
            
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-6xl font-bold mb-4"
            >
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                Welcome back, {user.username}!
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-gray-300 flex items-center justify-center gap-2"
            >
              <Crown className="text-yellow-400" size={24} />
              <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                Unlimited Everything - Free Forever!
              </span>
              <Crown className="text-yellow-400" size={24} />
            </motion.p>
          </motion.div>

          {/* Animated Stats Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
          >
            {[
              { 
                icon: Image, 
                label: 'Total Drawings', 
                value: stats?.drawingCount || 0, 
                color: 'from-blue-500 to-cyan-500',
                bgGlow: 'shadow-blue-500/50'
              },
              { 
                icon: Unlock, 
                label: 'Public', 
                value: stats?.publicDrawings || 0, 
                color: 'from-green-500 to-emerald-500',
                bgGlow: 'shadow-green-500/50'
              },
              { 
                icon: Heart, 
                label: 'Total Likes', 
                value: stats?.totalLikes || 0, 
                color: 'from-pink-500 to-rose-500',
                bgGlow: 'shadow-pink-500/50'
              },
              { 
                icon: Eye, 
                label: 'Total Views', 
                value: stats?.totalViews || 0, 
                color: 'from-purple-500 to-violet-500',
                bgGlow: 'shadow-purple-500/50'
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
                whileTap={{ scale: 0.95 }}
                className={`relative spooky-card bg-gradient-to-br ${stat.color} bg-opacity-10 border-2 border-opacity-50 hover:border-opacity-80 hover:shadow-2xl ${stat.bgGlow} transition-all cursor-pointer overflow-hidden`}
              >
                {/* Animated background glow */}
                <motion.div
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2
                  }}
                  className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 blur-xl`}
                />
                
                <div className="relative z-10 p-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <stat.icon className="mb-3 text-white" size={32} />
                  </motion.div>
                  <motion.div 
                    className="text-4xl font-bold text-white mb-1"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-200 font-medium">{stat.label}</div>
                </div>
                
                {/* Corner sparkle */}
                <motion.div
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.3
                  }}
                  className="absolute top-2 right-2"
                >
                  <Sparkles className="text-yellow-300" size={16} />
                </motion.div>
              </motion.div>
            ))}
          </motion.div>

          {/* Unlimited Features Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            className="mb-12 relative overflow-hidden"
          >
            <motion.div
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear"
              }}
              className="spooky-card bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-orange-900/40 border-2 border-purple-500/60 hover:border-purple-400 transition-all"
              style={{ backgroundSize: "200% 200%" }}
            >
              <div className="p-8 text-center relative z-10">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="inline-block mb-4"
                >
                  <Zap className="w-12 h-12 text-yellow-400" />
                </motion.div>
                
                <h3 className="text-3xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">
                  🎉 Everything Unlocked Forever!
                </h3>
                
                <div className="flex flex-wrap justify-center gap-4 text-gray-200">
                  {['∞ Unlimited Drawings', '🎨 All Tools', '🌟 All Features', '💾 Cloud Save', '🚀 Fast Export'].map((feature, i) => (
                    <motion.span
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + i * 0.1 }}
                      className="px-4 py-2 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                    >
                      {feature}
                    </motion.span>
                  ))}
                </div>
              </div>
              
              {/* Animated particles */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-20, -100],
                    opacity: [0, 1, 0],
                    x: [0, (i - 2) * 30]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute bottom-0 left-1/2"
                  style={{ left: `${20 + i * 15}%` }}
                >
                  <Star className="text-yellow-400" size={20} />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Action Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
          >
            <div>
              <h2 className="text-3xl font-bold text-white mb-1">Your Drawings</h2>
              <p className="text-gray-400">Create and manage your artwork</p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-spooky-card border border-gray-500/30 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid size={20} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all ${
                    viewMode === 'list' 
                      ? 'bg-purple-500 text-white' 
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List size={20} />
                </motion.button>
              </div>

              {/* Create Button */}
              <Link href="/canvas">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(168, 85, 247, 0.6)" }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  <Plus size={20} />
                  Create New Drawing
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Drawings Grid/List */}
          {drawings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                animate={floatingAnimation}
              >
                <Palette className="w-24 h-24 text-gray-600 mx-auto mb-6" />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-400 mb-3">No drawings yet</h3>
              <p className="text-gray-500 mb-8">Start creating your first masterpiece!</p>
              <Link href="/canvas">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  <Plus className="inline mr-2" size={20} />
                  Create Your First Drawing
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {viewMode === 'grid' ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {drawings.map((drawing, index) => (
                    <motion.div
                      key={drawing._id || drawing.id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ y: -10, transition: { type: "spring", stiffness: 300 } }}
                      className="spooky-card overflow-hidden group hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/20 transition-all"
                    >
                      {/* Thumbnail */}
                      <div className="relative aspect-video bg-gray-800 overflow-hidden">
                        <img
                          src={drawing.thumbnail || '/placeholder.png'}
                          alt={drawing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-2 right-2 flex gap-2">
                            <Link href={`/canvas?id=${drawing._id || drawing.id}`}>
                              <motion.button
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                                className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </motion.button>
                            </Link>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: -5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleToggleVisibility(drawing._id || drawing.id || '', drawing.isPublic || false)}
                              className={`p-2 ${
                                drawing.isPublic 
                                  ? 'bg-green-500 hover:bg-green-600' 
                                  : 'bg-gray-500 hover:bg-gray-600'
                              } rounded-lg text-white transition-colors`}
                              title={drawing.isPublic ? 'Make Private' : 'Make Public'}
                            >
                              {drawing.isPublic ? <Unlock size={16} /> : <Lock size={16} />}
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => onDelete(drawing._id || drawing.id || '')}
                              className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-lg mb-2 text-white truncate">{drawing.title}</h3>
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Heart size={14} className="text-pink-400" />
                            {drawing.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} className="text-blue-400" />
                            {drawing.views || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            {drawing.isPublic ? (
                              <><Unlock size={14} className="text-green-400" /> Public</>
                            ) : (
                              <><Lock size={14} className="text-gray-400" /> Private</>
                            )}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-3"
                >
                  {drawings.map((drawing, index) => (
                    <motion.div
                      key={drawing._id || drawing.id}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 50 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ x: 5 }}
                      className="spooky-card p-4 flex items-center gap-4 hover:border-purple-500/60 transition-all"
                    >
                      <img
                        src={drawing.thumbnail || '/placeholder.png'}
                        alt={drawing.title}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-bold text-white">{drawing.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Heart size={14} className="text-pink-400" /> {drawing.likes || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} className="text-blue-400" /> {drawing.views || 0}
                          </span>
                          <span>
                            {drawing.isPublic ? (
                              <span className="text-green-400">Public</span>
                            ) : (
                              <span className="text-gray-400">Private</span>
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/canvas?id=${drawing._id || drawing.id}`}>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="p-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white"
                          >
                            <Edit size={18} />
                          </motion.button>
                        </Link>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDelete(drawing._id || drawing.id || '')}
                          className="p-2 bg-red-500 hover:bg-red-600 rounded-lg text-white"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
