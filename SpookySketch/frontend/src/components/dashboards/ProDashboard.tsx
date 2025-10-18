'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Palette, Crown, Trash2, Edit, Eye, Calendar, TrendingUp, 
  Zap, Download, Share2, Layers 
} from 'lucide-react';
import Navbar from '@/components/Navbar';

interface Drawing {
  _id?: string;
  id?: string;
  title: string;
  thumbnail: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
}

interface Stats {
  drawingCount: number;
  publicDrawings: number;
  totalLikes: number;
  totalViews: number;
}

interface ProDashboardProps {
  user: any;
  drawings: Drawing[];
  stats: Stats | null;
  onDelete: (id: string) => void;
}

export default function ProDashboard({ user, drawings, stats, onDelete }: ProDashboardProps) {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card mb-8 bg-gradient-to-r from-orange-900/10 to-orange-900/5"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{user.avatar}</div>
                <div>
                  <h1 className="text-3xl font-bold">{user.username}</h1>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="text-lg font-bold text-orange-500 flex items-center gap-2">
                    <Zap size={20} />
                    PRO TIER
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
                    Upgrade to VIP
                  </button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Pro Features Notice */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card bg-gradient-to-r from-orange-900/20 to-orange-900/10 border-2 border-orange-500/50 mb-8"
          >
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2 text-orange-500">⚡ PRO Features Unlocked</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mt-4">
                <div className="flex items-center gap-2 justify-center">
                  <Palette size={16} className="text-orange-500" />
                  <span>50 Drawings</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Layers size={16} className="text-orange-500" />
                  <span>Layer System</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Download size={16} className="text-orange-500" />
                  <span>Multi-Format Export</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <Zap size={16} className="text-orange-500" />
                  <span>Advanced Tools</span>
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
                sublabel="/ 50"
              />
              <StatCard icon={<Eye />} label="Total Views" value={stats.totalViews} />
              <StatCard icon={<TrendingUp />} label="Total Likes" value={stats.totalLikes} />
              <StatCard icon={<Calendar />} label="Public" value={stats.publicDrawings} />
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <QuickActionCard
              icon={<Palette />}
              title="Create"
              description="New drawing"
              href="/studio"
            />
            <QuickActionCard
              icon={<Download />}
              title="Export"
              description="Download all"
              href="#"
            />
            <QuickActionCard
              icon={<Share2 />}
              title="Share"
              description="Publish work"
              href="/gallery"
            />
            <QuickActionCard
              icon={<Layers />}
              title="Layers"
              description="Advanced editing"
              href="/studio"
            />
          </div>

          {/* Drawings Grid */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-orange-500">Your Pro Drawings 🎨</h2>

            {drawings.length === 0 ? (
              <div className="spooky-card text-center py-12">
                <div className="text-6xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-2">No drawings yet!</h3>
                <p className="text-gray-400 mb-6">
                  Start creating with your Pro tools
                </p>
                <Link href="/studio">
                  <button className="spooky-btn">Create Your First Pro Drawing</button>
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {drawings.map((drawing) => (
                  <DrawingCard
                    key={drawing._id || drawing.id}
                    drawing={drawing}
                    onDelete={() => onDelete(drawing._id || drawing.id || '')}
                    isPro={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Upgrade Prompt for Pro Users approaching limit */}
          {drawings.length >= 40 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 spooky-card bg-gradient-to-r from-orange-900/20 to-purple-900/20 border-2 border-purple-500/50"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">Approaching Storage Limit! 👑</h3>
                <p className="text-gray-300 mb-4">
                  You&apos;re getting close to 50 drawings. Upgrade to VIP for unlimited storage!
                </p>
                <Link href="/pricing">
                  <button className="spooky-btn">
                    <Crown className="inline mr-2" />
                    Upgrade to VIP
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
      className="spooky-card text-center border border-orange-500/30"
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

function QuickActionCard({
  icon,
  title,
  description,
  href
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="spooky-card text-center cursor-pointer hover:border-orange-500/50 transition-all"
      >
        <div className="text-orange-500 mb-2 flex justify-center">{icon}</div>
        <h3 className="font-bold mb-1">{title}</h3>
        <p className="text-xs text-gray-400">{description}</p>
      </motion.div>
    </Link>
  );
}

function DrawingCard({ 
  drawing, 
  onDelete,
  isPro 
}: { 
  drawing: Drawing; 
  onDelete: () => void;
  isPro?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className={`spooky-card relative group ${isPro ? 'border-orange-500/30' : ''}`}
    >
      {isPro && (
        <div className="absolute -top-2 -right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
          PRO
        </div>
      )}
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
          <Eye className="inline" size={14} /> {drawing.views}
        </span>
        <span>👍 {drawing.likes}</span>
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
