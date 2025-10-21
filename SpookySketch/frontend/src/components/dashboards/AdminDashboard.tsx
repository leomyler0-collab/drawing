'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Palette, Crown, Trash2, Edit, Eye, Calendar, TrendingUp, 
  Download, Share2, Layers, Sparkles, Users, Star, Infinity as InfinityIcon,
  Shield, Settings as SettingsIcon, Database, Activity, BarChart3,
  Globe, Lock as LockIcon
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import UserManagement from '@/components/admin/UserManagement';
import Analytics from '@/components/admin/Analytics';
import Settings from '@/components/admin/Settings';
import SystemLogs from '@/components/admin/SystemLogs';
import BulkActions from '@/components/admin/BulkActions';
import CreateAccount from '@/components/admin/CreateAccount';
import { User, Drawing, Stats, DashboardProps } from '@/types';
import { adminAPI } from '@/lib/api';
import { handleVisibilityToggle } from '@/utils/visibilityHandler';

interface AdminDashboardProps extends DashboardProps {
  user: User;
  drawings: Drawing[];
  stats: Stats | null;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

export default function AdminDashboard({ user, drawings, stats, onDelete, onUpdate }: AdminDashboardProps) {
  const [showSystemLogs, setShowSystemLogs] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const handleToggleVisibility = async (drawingId: string, currentStatus: boolean) => {
    await handleVisibilityToggle({
      drawingId,
      currentStatus,
      userId: user.id,
      onSuccess: onUpdate,
      source: 'Admin'
    });
  };
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [adminStats, setAdminStats] = useState({
    totalUsers: 0,
    totalDrawings: 0,
  });

  useEffect(() => {
    loadAdminStats();
  }, []);

  const loadAdminStats = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAdminStats({
        totalUsers: response.data.analytics.totalUsers,
        totalDrawings: response.data.analytics.totalDrawings,
      });
    } catch (error) {
      console.error('Failed to load admin stats:', error);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Admin Profile Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card mb-8 bg-gradient-to-r from-red-900/20 via-purple-900/20 to-orange-900/20 border-2 border-red-500/50"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl relative">
                  {user.avatar}
                  <div className="absolute -top-2 -right-2 text-2xl">
                    <Shield className="text-red-500" />
                  </div>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
                    {user.username}
                  </h1>
                  <p className="text-gray-400">{user.email}</p>
                  <div className="text-lg font-bold text-red-500 flex items-center gap-2">
                    <Shield size={20} />
                    ADMIN TIER
                    <span className="text-xs bg-red-500/20 px-2 py-1 rounded-full">SUPER USER</span>
                    <Crown size={16} className="text-purple-500" />
                    <span className="text-xs text-purple-400">PRO + VIP</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Link href="/studio">
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all font-semibold">
                    <Palette className="inline mr-2" size={18} />
                    New Drawing
                  </button>
                </Link>
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="px-6 py-3 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500/10 transition-all font-semibold"
                >
                  <SettingsIcon className="inline mr-2" size={18} />
                  Admin Panel
                </button>
                <button
                  onClick={() => setShowCreateAccount(true)}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all font-semibold"
                  title="Create account with custom tier"
                >
                  <Crown className="inline mr-2" size={18} />
                  Create Account
                </button>
              </div>
            </div>
          </motion.div>

          {/* Admin Features Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="spooky-card bg-gradient-to-r from-red-900/20 to-purple-900/10 border-2 border-red-500/50 mb-8"
          >
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold mb-2 text-red-500 flex items-center justify-center gap-2">
                <Shield size={20} />
                Admin + Pro + VIP Features
                <Shield size={20} />
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div className="flex items-center gap-2 justify-center p-3 bg-red-500/10 rounded-lg">
                <Shield size={16} className="text-red-500" />
                <span>Full Control</span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 bg-purple-500/10 rounded-lg">
                <InfinityIcon size={16} className="text-purple-500" />
                <span>Unlimited Everything</span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 bg-orange-500/10 rounded-lg">
                <Sparkles size={16} className="text-orange-500" />
                <span>All Brushes</span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 bg-purple-500/10 rounded-lg">
                <Users size={16} className="text-purple-500" />
                <span>User Management</span>
              </div>
              <div className="flex items-center gap-2 justify-center p-3 bg-red-500/10 rounded-lg">
                <Database size={16} className="text-red-500" />
                <span>System Access</span>
              </div>
            </div>
          </motion.div>

          {/* Admin Panel */}
          {showAdminPanel && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="spooky-card mb-8 bg-red-900/10 border-2 border-red-500/30"
            >
              <h3 className="text-xl font-bold mb-4 text-red-500 flex items-center gap-2">
                <Shield size={24} />
                Admin Control Panel
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <AdminControlCard
                  icon={<Users />}
                  title="Users"
                  value={adminStats.totalUsers}
                  description="Total users"
                />
                <AdminControlCard
                  icon={<Palette />}
                  title="All Drawings"
                  value={adminStats.totalDrawings}
                  description="System-wide"
                />
                <AdminControlCard
                  icon={<Activity />}
                  title="Activity"
                  value="Live"
                  description="System status"
                />
                <AdminControlCard
                  icon={<Database />}
                  title="Storage"
                  value="OK"
                  description="Database health"
                />
              </div>
            </motion.div>
          )}

          {/* Admin Stats */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard
                icon={<Palette />}
                label="Your Drawings"
                value={stats.drawingCount}
                sublabel="Unlimited"
              />
              <StatCard icon={<Eye />} label="Total Views" value={stats.totalViews} />
              <StatCard icon={<TrendingUp />} label="Total Likes" value={stats.totalLikes} />
              <StatCard icon={<Calendar />} label="Public" value={stats.publicDrawings} />
            </div>
          )}

          {/* Admin Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <QuickActionCard
              icon={<Palette />}
              title="Create"
              description="New drawing"
              href="/studio"
            />
            <QuickActionCard
              icon={<Sparkles />}
              title="Templates"
              description="All templates"
              href="#"
            />
            <QuickActionCard
              icon={<Download />}
              title="Export"
              description="Batch export"
              onClick={() => setShowBulkActions(true)}
            />
            <QuickActionCard
              icon={<Users />}
              title="Users"
              description="Manage users"
              onClick={() => setShowUserManagement(true)}
            />
            <QuickActionCard
              icon={<BarChart3 />}
              title="Analytics"
              description="System stats"
              onClick={() => setShowAnalytics(true)}
            />
            <QuickActionCard
              icon={<SettingsIcon />}
              title="Settings"
              description="System config"
              onClick={() => setShowSettings(true)}
            />
            <QuickActionCard
              icon={<Activity />}
              title="System Logs"
              description="Activity logs"
              onClick={() => setShowSystemLogs(true)}
            />
            <QuickActionCard
              icon={<Shield />}
              title="Bulk Actions"
              description="Admin tools"
              onClick={() => setShowBulkActions(true)}
            />
          </div>

          {/* Admin Drawings Grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-red-500 flex items-center gap-2">
                <Shield size={28} />
                Your Admin Collection 🎨
              </h2>
              <div className="text-sm text-gray-400">
                {drawings.length} of Unlimited drawings | Full Access
              </div>
            </div>

            {drawings.length === 0 ? (
              <div className="spooky-card text-center py-12 bg-gradient-to-br from-red-900/10 via-purple-900/10 to-orange-900/10">
                <div className="text-6xl mb-4">🛡️</div>
                <h3 className="text-xl font-bold mb-2">No admin drawings yet!</h3>
                <p className="text-gray-400 mb-6">
                  Start creating with unlimited admin privileges
                </p>
                <Link href="/studio">
                  <button className="px-6 py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600 transition-all font-semibold">
                    Create Your First Admin Drawing
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
                    isAdmin={true}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Admin Privileges Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 spooky-card bg-gradient-to-r from-red-900/20 via-purple-900/20 to-orange-900/20 border-2 border-red-500/50"
          >
            <div className="text-center">
              <Shield className="inline text-red-500 mb-2" size={32} />
              <h3 className="text-2xl font-bold mb-2">Admin Access Active 🎃</h3>
              <p className="text-gray-300 mb-4">
                You have unlimited access to all features + Pro + VIP privileges + admin controls
              </p>
              <div className="flex items-center justify-center gap-4 text-sm">
                <span className="bg-red-500/20 px-3 py-1 rounded-full text-red-400">Admin</span>
                <span className="bg-purple-500/20 px-3 py-1 rounded-full text-purple-400">VIP</span>
                <span className="bg-orange-500/20 px-3 py-1 rounded-full text-orange-400">Pro</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Admin Modals */}
      <AnimatePresence>
        {showUserManagement && <UserManagement onClose={() => setShowUserManagement(false)} />}
        {showAnalytics && <Analytics onClose={() => setShowAnalytics(false)} />}
        {showSettings && <Settings onClose={() => setShowSettings(false)} />}
        {showSystemLogs && <SystemLogs onClose={() => setShowSystemLogs(false)} />}
        {showBulkActions && <BulkActions onClose={() => setShowBulkActions(false)} />}
        {showCreateAccount && (
          <CreateAccount
            onClose={() => setShowCreateAccount(false)}
            onSuccess={() => {
              loadAdminStats();
              if (onUpdate) onUpdate();
            }}
          />
        )}
      </AnimatePresence>
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
      className="spooky-card text-center border border-red-500/30 bg-red-900/10"
    >
      <div className="text-red-500 mb-2 flex justify-center">{icon}</div>
      <div className="text-3xl font-bold mb-1">
        {value}
        {sublabel && <span className="text-sm text-red-400 block">{sublabel}</span>}
      </div>
      <div className="text-gray-400 text-sm">{label}</div>
    </motion.div>
  );
}

function AdminControlCard({
  icon,
  title,
  value,
  description
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  description: string;
}) {
  return (
    <div className="p-4 bg-spooky-card rounded-lg border border-red-500/30">
      <div className="text-red-500 mb-2 flex justify-center">{icon}</div>
      <div className="text-2xl font-bold mb-1 text-center">{value}</div>
      <div className="text-sm font-semibold text-center mb-1">{title}</div>
      <div className="text-xs text-gray-500 text-center">{description}</div>
    </div>
  );
}

function QuickActionCard({
  icon,
  title,
  description,
  href,
  onClick
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}) {
  const content = (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="spooky-card text-center cursor-pointer hover:border-red-500/50 transition-all bg-gradient-to-br from-red-900/10 to-transparent"
    >
      <div className="text-red-500 mb-2 flex justify-center">{icon}</div>
      <h3 className="font-bold mb-1">{title}</h3>
      <p className="text-xs text-gray-400">{description}</p>
    </motion.div>
  );

  if (onClick) {
    return (
      <div onClick={onClick}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href || '#'}>
      {content}
    </Link>
  );
}

function DrawingCard({ 
  drawing, 
  onDelete,
  onToggleVisibility,
  isAdmin 
}: { 
  drawing: Drawing; 
  onDelete: () => void;
  onToggleVisibility: () => void;
  isAdmin?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`spooky-card relative group ${isAdmin ? 'border-red-500/30 bg-gradient-to-br from-red-900/10 to-transparent' : ''}`}
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

      {isAdmin && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1">
          <Shield size={12} />
          ADMIN
        </div>
      )}
      <div className="aspect-square rounded-lg overflow-hidden mb-3 bg-spooky-bg border border-red-500/20">
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
          <button className="w-full px-3 py-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 text-red-400 rounded-lg hover:from-red-500/30 hover:to-orange-500/30 transition-all text-sm">
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
