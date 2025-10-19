'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Palette, Crown, Trash2, Edit, Eye, Calendar, TrendingUp, 
  Download, Share2, Layers, Sparkles, Users, Star, Infinity as InfinityIcon,
  Globe, Lock as LockIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import { drawingAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Drawing, Stats, DashboardProps } from '@/types';

interface VipDashboardProps extends DashboardProps {
  user: User;
  drawings: Drawing[];
  stats: Stats | null;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

export default function VipDashboard({ user, drawings, stats, onDelete, onUpdate }: VipDashboardProps) {
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
          {/* VIP Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card mb-8 bg-gradient-to-r from-purple-900/20 to-orange-900/20 border-2 border-purple-500/50"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl relative">
                  {user.avatar}
                  <div className="absolute -top-2 -right-2 text-2xl">
                    <Crown className="text-purple-500" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
                    {user.username}
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="text-lg font-bold text-purple-500 flex items-center gap-2">
                    <Crown size={20} />
                    VIP TIER
                    <span className="text-xs bg-purple-500/20 px-2 py-1 rounded-full">ELITE</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Link href="/studio">
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-orange-500 text-white hover:from-purple-600 hover:to-orange-600 transition-all font-semibold">
                    <Palette className="inline mr-2" size={18} />
                    New VIP Drawing
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* VIP Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card bg-gradient-to-r from-purple-900/20 to-purple-900/10 border-2 border-purple-500/50 mb-8"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2 text-purple-500 flex items-center justify-center gap-2">
                <Sparkles size={20} />
                VIP Exclusive Features
                <Sparkles size={20} />
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2 justify-center p-3 bg-purple-500/10 rounded-lg">
                <InfinityIcon size={16} className="text-purple-500" />
                <span>Unlimited Drawings</span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 bg-purple-500/10 rounded-lg">
                <Sparkles size={16} className="text-purple-500" />
                <span>Special Brushes</span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 bg-purple-500/10 rounded-lg">
                <Users size={16} className="text-purple-500" />
                <span>Collaboration</span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 bg-purple-500/10 rounded-lg">
                <Star size={16} className="text-purple-500" />
                <span>Priority Access</span>
              </div>
            </div>
          </motion.div>

          {/* VIP Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Palette />}
                label="Drawings"
                value={stats.drawingCount}
                sublabel="Unlimited"
              />
              <StatCard icon={<Eye />} label="Total Views" value={stats.totalViews} />
              <StatCard icon={<TrendingUp />} label="Total Likes" value={stats.totalLikes} />
              <StatCard icon={<Calendar />} label="Public" value={stats.publicDrawings} />
            </div>
          )}

          {/* VIP Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <QuickActionCard
              icon={<Palette />}
              title="Create"
              description="New masterpiece"
              href="/studio"
              gradient={true}
            />
            <QuickActionCard
              icon={<Sparkles />}
              title="Templates"
              description="VIP exclusive"
              href="#"
              gradient={true}
            />
            <QuickActionCard
              icon={<Download />}
              title="Export All"
              description="Batch download"
              href="#"
              gradient={true}
            />
            <QuickActionCard
              icon={<Users />}
              title="Collaborate"
              description="Work together"
              href="#"
              gradient={true}
            />
            <QuickActionCard
              icon={<Share2 />}
              title="Publish"
              description="Share globally"
              href="/gallery"
              gradient={true}
            />
          </div>

          {/* VIP Drawings Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-purple-500 flex items-center gap-2">
                <Crown size={28} />
                Your VIP Collection 🎨
              </h2>
              <div className="text-sm text-gray-400">
                {drawings.length} of Unlimited drawings
              </div>
            </div>

            {drawings.length === 0 ? (
              <div className="spooky-card text-center py-12 bg-gradient-to-br from-purple-900/10 to-orange-900/10">
                <div className="text-6xl mb-4">👑</div>
                <h3 className="text-xl font-bold mb-2">No VIP drawings yet!</h3>
                <p className="text-gray-400 mb-6">
                  Start creating unlimited masterpieces with VIP tools
                </p>
                <Link href="/studio">
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-orange-500 text-white hover:from-purple-600 hover:to-orange-600 transition-all font-semibold">
                    Create Your First VIP Drawing
                  </button>
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
                    isVip={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* VIP Perks Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 spooky-card bg-gradient-to-r from-purple-900/20 to-orange-900/20 border-2 border-purple-500/50"
          >
            <div className="text-center">
              <Crown className="inline text-purple-500 mb-2" size={32} />
              <h3 className="text-2xl font-bold mb-2">Thank You for Being VIP! 🎃</h3>
              <p className="text-gray-300 mb-4">
                You have unlimited access to all features, exclusive content, and priority support
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sublabel
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
      className="spooky-card text-center border border-purple-500/30 bg-purple-900/10"
    >
      <div className="text-purple-500 mb-2 flex justify-center">{icon}</div>
      <div className="text-3xl font-bold mb-1">
        {value}
        {sublabel && <span className="text-sm text-purple-400 block">{sublabel}</span>}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  gradient = false
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  gradient?: boolean;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className={`spooky-card text-center cursor-pointer transition-all ${
          gradient ? 'hover:border-purple-500/50 bg-gradient-to-br from-purple-900/10 to-orange-900/10' : ''
        }`}
      >
        <div className="text-purple-500 mb-2 flex justify-center">{icon}</div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </motion.div>
    </Link>
  );
}

function DrawingCard({ 
  drawing, 
  onDelete,
  onToggleVisibility,
  isVip 
}: { 
  drawing: Drawing; 
  onDelete: () => void;
  onToggleVisibility: () => void;
  isVip?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`spooky-card relative group ${isVip ? 'border-purple-500/30 bg-gradient-to-br from-purple-900/10 to-transparent' : ''}`}
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

      {isVip && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
          <Crown size={12} />
          VIP
        </div>
      )}
      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-spooky-bg border border-purple-500/20">
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
          <button className="w-full px-3 py-2 bg-gradient-to-r from-purple-500/20 to-orange-500/20 text-purple-400 rounded-lg hover:from-purple-500/30 hover:to-orange-500/30 transition-all text-sm">
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
