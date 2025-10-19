'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Palette, Crown, Trash2, Edit, Eye, Calendar, TrendingUp, Lock, Globe, Lock as LockIcon } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { drawingAPI } from '@/lib/api';
import toast from 'react-hot-toast';

interface Drawing {
  _id?: string;
  id?: string;
  title: string;
  thumbnail: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
}

interface Stats {
  drawingCount: number;
  publicDrawings: number;
  totalLikes: number;
  totalViews: number;
}

interface FreeDashboardProps {
  user: any;
  drawings: Drawing[];
  stats: Stats | null;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

export default function FreeDashboard({ user, drawings, stats, onDelete, onUpdate }: FreeDashboardProps) {
  const handleToggleVisibility = async (drawingId: string, currentStatus: boolean) => {
    try {
      await drawingAPI.toggleVisibility(drawingId, !currentStatus);
      toast.success(`Drawing is now ${!currentStatus ? 'public' : 'private'}!`);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
      toast.error('Failed to update visibility');
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{user.avatar}</div>
                <div>
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="text-lg font-bold text-gray-400">
                    FREE TIER
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/studio">
                  <button className="spooky-btn">
                    <Palette className="inline mr-2" size={18} />
                    New Drawing
                  </button>
                </Link>
                <Link href="/pricing">
                  <button className="px-6 py-3 rounded-lg border-2 border-purple-500 text-purple-500 hover:bg-purple-500/10 transition-all font-semibold">
                    <Crown className="inline mr-2" size={18} />
                    Upgrade
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Free Tier Limitations Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card bg-gradient-to-r from-orange-900/20 to-yellow-900/20 border-2 border-orange-500/50 mb-8"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">🎃 Free Tier Limitations</h3>
              <p className="text-gray-300 mb-4">
                You&apos;re currently limited to 10 saved drawings. Upgrade to unlock more features!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 justify-center">
                  <Lock size={16} className="text-orange-500" />
                  <span>10 Drawings Max</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Lock size={16} className="text-orange-500" />
                  <span>Basic Brushes</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Lock size={16} className="text-orange-500" />
                  <span>No Layers</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Lock size={16} className="text-orange-500" />
                  <span>PNG Export Only</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Palette />}
                label="Drawings"
                value={stats.drawingCount}
                sublabel="/ 1"
              />
              <StatCard icon={<Eye />} label="Total Views" value={stats.totalViews} />
              <StatCard icon={<TrendingUp />} label="Total Likes" value={stats.totalLikes} />
              <StatCard icon={<Calendar />} label="Public" value={stats.publicDrawings} />
            </div>
          )}

          {/* Drawings Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Your Drawings 🎨</h2>

            {drawings.length === 0 ? (
              <div className="spooky-card text-center py-12">
                <div className="text-6xl mb-4">🎃</div>
                <h3 className="text-xl font-bold mb-2">No drawings yet!</h3>
                <p className="text-gray-400 mb-6">
                  Start creating spooky masterpieces now
                </p>
                <Link href="/studio">
                  <button className="spooky-btn">Create Your First Drawing</button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {drawings.map((drawing) => (
                  <DrawingCard
                    key={drawing._id || drawing.id}
                    drawing={drawing}
                    onDelete={() => onDelete(drawing._id || drawing.id || '')}
                    onToggleVisibility={() => handleToggleVisibility(
                      drawing._id || drawing.id || '', 
                      drawing.isPublic || false
                    )}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Upgrade Prompt */}
          {drawings.length >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 spooky-card bg-gradient-to-r from-orange-900/20 to-purple-900/20 border-2 border-orange-500/50"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Storage Limit Reached! 🎃</h3>
                <p className="text-gray-300 mb-4">
                  Upgrade to Pro or VIP to save more drawings and unlock advanced features
                </p>
                <Link href="/pricing">
                  <button className="spooky-btn">
                    <Crown className="inline mr-2" />
                    View Plans
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sublabel?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="spooky-card text-center"
    >
      <div className="text-orange-500 mb-2 flex justify-center">{icon}</div>
      <div className="text-3xl font-bold mb-1">
        {value}
        {sublabel && <span className="text-lg text-gray-500"> {sublabel}</span>}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
}

function DrawingCard({ 
  drawing, 
  onDelete,
  onToggleVisibility 
}: { 
  drawing: Drawing; 
  onDelete: () => void;
  onToggleVisibility: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="spooky-card relative group"
    >
      {/* Public/Private Badge */}
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={onToggleVisibility}
          className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all ${
            drawing.isPublic 
              ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
              : 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
          }`}
          title={`Click to make ${drawing.isPublic ? 'private' : 'public'}`}
        >
          {drawing.isPublic ? (
            <><Globe size={12} className="inline mr-1" />Public</>
          ) : (
            <><LockIcon size={12} className="inline mr-1" />Private</>
          )}
        </button>
      </div>

      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-spooky-bg">
        <img
          src={drawing.thumbnail}
          alt={drawing.title}
          className="w-full h-full object-cover"
        />
      </div>

      <h3 className="font-bold truncate mb-2">{drawing.title}</h3>

      <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
        <span>
          <Eye className="inline" size={14} /> {drawing.views || 0}
        </span>
        <span>👍 {drawing.likes || 0}</span>
      </div>

      <div className="flex gap-2">
        <Link href={`/studio?edit=${drawing._id || drawing.id}`} className="flex-1">
          <button className="w-full px-3 py-2 bg-orange-500/20 text-orange-500 rounded-lg hover:bg-orange-500/30 transition-all text-sm">
            <Edit className="inline mr-1" size={14} />
            Edit
          </button>
        </Link>
        <button
          onClick={onDelete}
          className="px-3 py-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/30 transition-all text-sm"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        {new Date(drawing.createdAt).toLocaleDateString()}
      </div>
    </motion.div>
  );
}
