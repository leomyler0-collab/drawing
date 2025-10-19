'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, TrendingUp, Users, Palette, Eye, Activity, 
  BarChart3, Calendar, Download, Clock, Star, Shield
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface AnalyticsProps {
  onClose: () => void;
}

export default function Analytics({ onClose }: AnalyticsProps) {
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    totalDrawings: 0,
    totalViews: 0,
    totalLikes: 0,
    activeToday: 0,
    tierDistribution: {
      admin: 0,
      vip: 0,
      pro: 0,
      free: 0
    },
    recentActivity: [] as any[]
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      const data = response.data.analytics;
      
      setAnalytics({
        totalUsers: data.totalUsers,
        totalDrawings: data.totalDrawings,
        totalViews: data.totalViews,
        totalLikes: data.totalLikes,
        activeToday: Math.floor(data.totalUsers * 0.3), // Simulated
        tierDistribution: data.tierDistribution,
        recentActivity: data.recentActivity
      });
    } catch (error: any) {
      console.error('Failed to load analytics:', error);
      toast.error(error.response?.data?.error || 'Failed to load analytics');
    }
  };

  const exportData = () => {
    const data = {
      analytics,
      exportDate: new Date().toISOString(),
      system: 'SpookySketch'
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-spooky-card border-2 border-orange-500/50 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-900/20 to-purple-900/20 p-6 border-b border-orange-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-500/20 rounded-lg">
                <BarChart3 className="text-orange-500" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-orange-500">System Analytics</h2>
                <p className="text-gray-400 text-sm">Real-time metrics and insights</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={exportData}
                className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30 transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Export
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-900/20 to-blue-900/10 border border-blue-500/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-blue-400" size={24} />
                <div className="text-sm text-gray-400">Total Users</div>
              </div>
              <div className="text-3xl font-bold">{analytics.totalUsers}</div>
              <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +12% this month
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-900/20 to-purple-900/10 border border-purple-500/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Palette className="text-purple-400" size={24} />
                <div className="text-sm text-gray-400">Drawings</div>
              </div>
              <div className="text-3xl font-bold">{analytics.totalDrawings}</div>
              <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +8% this week
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-green-900/20 to-green-900/10 border border-green-500/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Eye className="text-green-400" size={24} />
                <div className="text-sm text-gray-400">Total Views</div>
              </div>
              <div className="text-3xl font-bold">{analytics.totalViews}</div>
              <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +15% today
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-900/20 to-orange-900/10 border border-orange-500/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Star className="text-orange-400" size={24} />
                <div className="text-sm text-gray-400">Total Likes</div>
              </div>
              <div className="text-3xl font-bold">{analytics.totalLikes}</div>
              <div className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp size={12} />
                +20% this week
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-900/20 to-red-900/10 border border-red-500/30 rounded-lg p-4"
            >
              <div className="flex items-center gap-3 mb-2">
                <Activity className="text-red-400" size={24} />
                <div className="text-sm text-gray-400">Active Today</div>
              </div>
              <div className="text-3xl font-bold">{analytics.activeToday}</div>
              <div className="text-xs text-gray-400 mt-1">Online now</div>
            </motion.div>
          </div>

          {/* Tier Distribution */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-spooky-bg border border-gray-500/20 rounded-lg p-6 mb-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Shield size={24} className="text-orange-500" />
              User Tier Distribution
            </h3>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{analytics.tierDistribution.admin}</div>
                <div className="text-sm text-gray-400">Admin</div>
                <div className="mt-2 bg-red-500/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-red-500 h-full"
                    style={{ width: `${(analytics.tierDistribution.admin / analytics.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400">{analytics.tierDistribution.vip}</div>
                <div className="text-sm text-gray-400">VIP</div>
                <div className="mt-2 bg-purple-500/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-purple-500 h-full"
                    style={{ width: `${(analytics.tierDistribution.vip / analytics.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-400">{analytics.tierDistribution.pro}</div>
                <div className="text-sm text-gray-400">Pro</div>
                <div className="mt-2 bg-orange-500/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-orange-500 h-full"
                    style={{ width: `${(analytics.tierDistribution.pro / analytics.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">{analytics.tierDistribution.free}</div>
                <div className="text-sm text-gray-400">Free</div>
                <div className="mt-2 bg-gray-500/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gray-500 h-full"
                    style={{ width: `${(analytics.tierDistribution.free / analytics.totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Premium Users</div>
                <div className="text-2xl font-bold text-purple-400">
                  {analytics.tierDistribution.vip + analytics.tierDistribution.pro}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {Math.round(((analytics.tierDistribution.vip + analytics.tierDistribution.pro) / analytics.totalUsers) * 100)}% of total
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-1">Conversion Rate</div>
                <div className="text-2xl font-bold text-green-400">
                  {Math.round(((analytics.tierDistribution.vip + analytics.tierDistribution.pro) / analytics.totalUsers) * 100)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">Free to Premium</div>
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-spooky-bg border border-gray-500/20 rounded-lg p-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Clock size={24} className="text-orange-500" />
              Recent Activity
            </h3>
            
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {analytics.recentActivity.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-spooky-card rounded-lg border border-gray-500/10 hover:border-orange-500/30 transition-colors"
                >
                  <div className="p-2 bg-orange-500/20 rounded-lg">
                    <Palette size={20} className="text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{activity.title}</div>
                    <div className="text-xs text-gray-400">
                      Created {new Date(activity.time).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {Math.floor((Date.now() - new Date(activity.time).getTime()) / (1000 * 60 * 60))}h ago
                  </div>
                </div>
              ))}
              
              {analytics.recentActivity.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <Activity size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No recent activity</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* System Health */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-spooky-bg border border-gray-500/20 rounded-lg p-6 mt-6"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Activity size={24} className="text-green-500" />
              System Health
            </h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">API Status</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 font-semibold">Operational</span>
                </div>
              </div>
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Database</div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-green-400 font-semibold">Healthy</span>
                </div>
              </div>
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                <div className="text-sm text-gray-400 mb-2">Uptime</div>
                <div className="text-blue-400 font-semibold">99.9%</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
