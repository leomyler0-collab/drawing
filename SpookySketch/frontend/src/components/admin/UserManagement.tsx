'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Filter, MoreVertical, Shield, Crown, 
  Zap, X, Edit, Trash2, Mail, Calendar, Activity,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { User } from '@/types';
import { clientAuth } from '@/utils/clientAuth';

interface UserManagementProps {
  onClose: () => void;
}

export default function UserManagement({ onClose }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showEditTier, setShowEditTier] = useState(false);
  const [newTier, setNewTier] = useState<'free' | 'pro' | 'vip' | 'admin'>('free');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      // Try backend first
      const response = await adminAPI.getAllUsers();
      setUsers(response.data.users);
      console.log('✅ Users loaded from backend');
    } catch (error) {
      // Fallback to localStorage (works in production without backend)
      console.log('⚡ Using localStorage for users (production mode)');
      const localUsers = clientAuth.getAllUsers();
      setUsers(localUsers);
      console.log(`✅ Loaded ${localUsers.length} users from localStorage`);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === 'all' || user.tier === filterTier;
    return matchesSearch && matchesTier;
  });

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'admin': return <Shield size={16} className="text-red-500" />;
      case 'vip': return <Crown size={16} className="text-purple-500" />;
      case 'pro': return <Zap size={16} className="text-orange-500" />;
      default: return null;
    }
  };

  const getTierBadge = (tier: string) => {
    const badges = {
      admin: 'bg-red-500/20 text-red-400 border-red-500/50',
      vip: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      pro: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      free: 'bg-gray-500/20 text-gray-400 border-gray-500/50'
    };
    return badges[tier as keyof typeof badges] || badges.free;
  };

  const handleDeleteUser = async (userId: string, username: string) => {
    if (confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      try {
        // Try backend first
        await adminAPI.deleteUser(userId);
        toast.success(`User "${username}" deleted successfully!`);
        loadUsers();
      } catch (error) {
        // Note: User deletion from localStorage requires backend or manual implementation
        console.warn('Cannot delete users in localStorage-only mode');
        toast.error('User deletion requires backend connection');
      }
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDetails(true);
  };

  const handleEditTier = (user: User) => {
    setSelectedUser(user);
    setNewTier(user.tier);
    setShowEditTier(true);
  };

  const handleUpdateTier = async () => {
    if (!selectedUser) return;

    if (selectedUser.tier === 'admin' && newTier !== 'admin') {
      toast.error('Cannot change admin tier!');
      return;
    }

    const loadingToast = toast.loading(`Updating ${selectedUser.username} to ${newTier.toUpperCase()}...`);

    try {
      // Try backend first
      await adminAPI.updateUserTier(selectedUser.id, newTier);
      
      // Also update localStorage for immediate reflection
      await clientAuth.updateProfile(selectedUser.id, { tier: newTier });
      
      toast.dismiss(loadingToast);
      toast.success(`🎉 Successfully updated ${selectedUser.username} to ${newTier.toUpperCase()} tier!`);
      
      setShowEditTier(false);
      loadUsers();
      
      console.log(`✅ Tier updated: ${selectedUser.username} → ${newTier.toUpperCase()}`);
    } catch (error) {
      // Fallback to localStorage update only
      console.log('⚡ Backend unavailable, using localStorage for tier update');
      try {
        await clientAuth.updateProfile(selectedUser.id, { tier: newTier });
        
        toast.dismiss(loadingToast);
        toast.success(`🎉 Updated ${selectedUser.username} to ${newTier.toUpperCase()} tier!`, {
          icon: '💾',
          duration: 3000
        });
        
        setShowEditTier(false);
        loadUsers();
        
        console.log(`✅ Tier updated (localStorage): ${selectedUser.username} → ${newTier.toUpperCase()}`);
      } catch (localError) {
        console.error('❌ Tier update failed:', localError);
        toast.dismiss(loadingToast);
        toast.error('Failed to update user tier. Please try again.');
      }
    }
  };

  const stats = {
    total: users.length,
    admin: users.filter(u => u.tier === 'admin').length,
    vip: users.filter(u => u.tier === 'vip').length,
    pro: users.filter(u => u.tier === 'pro').length,
    free: users.filter(u => u.tier === 'free').length,
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
        className="bg-spooky-card border-2 border-red-500/50 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-red-900/20 to-purple-900/20 p-6 border-b border-red-500/30">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Users className="text-red-500" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-500">User Management</h2>
                <p className="text-gray-400 text-sm">Manage all system users</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-5 gap-4">
            <div className="bg-spooky-bg p-3 rounded-lg border border-gray-500/20">
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="text-xs text-gray-400">Total Users</div>
            </div>
            <div className="bg-spooky-bg p-3 rounded-lg border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{stats.admin}</div>
              <div className="text-xs text-gray-400">Admins</div>
            </div>
            <div className="bg-spooky-bg p-3 rounded-lg border border-purple-500/30">
              <div className="text-2xl font-bold text-purple-400">{stats.vip}</div>
              <div className="text-xs text-gray-400">VIP</div>
            </div>
            <div className="bg-spooky-bg p-3 rounded-lg border border-orange-500/30">
              <div className="text-2xl font-bold text-orange-400">{stats.pro}</div>
              <div className="text-xs text-gray-400">Pro</div>
            </div>
            <div className="bg-spooky-bg p-3 rounded-lg border border-gray-500/30">
              <div className="text-2xl font-bold text-gray-400">{stats.free}</div>
              <div className="text-xs text-gray-400">Free</div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="p-6 border-b border-gray-500/20">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by username or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-red-500/50 focus:outline-none text-white"
              />
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-red-500/50 focus:outline-none text-white"
            >
              <option value="all">All Tiers</option>
              <option value="admin">Admin</option>
              <option value="vip">VIP</option>
              <option value="pro">Pro</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto max-h-[calc(90vh-400px)] p-6">
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4 hover:border-red-500/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{user.avatar}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{user.username}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs border flex items-center gap-1 ${getTierBadge(user.tier)}`}>
                          {getTierIcon(user.tier)}
                          {user.tier.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {user.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewDetails(user)}
                      className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleEditTier(user)}
                      className="px-3 py-2 bg-purple-500/20 text-purple-400 rounded-lg hover:bg-purple-500/30 transition-colors text-sm"
                    >
                      Edit Tier
                    </button>
                    {user.tier !== 'admin' && (
                      <button
                        onClick={() => handleDeleteUser(user.id, user.username)}
                        className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete user"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Users size={48} className="mx-auto mb-4 opacity-50" />
                <p>No users found matching your criteria</p>
              </div>
            )}
          </div>
        </div>

        {/* Edit Tier Modal */}
        <AnimatePresence>
          {showEditTier && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={() => setShowEditTier(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-spooky-card border-2 border-purple-500/50 rounded-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-purple-500">Edit User Tier</h3>
                  <button
                    onClick={() => setShowEditTier(false)}
                    className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-spooky-bg rounded-lg border border-gray-500/20">
                    <div className="text-3xl">{selectedUser.avatar}</div>
                    <div>
                      <div className="font-bold">{selectedUser.username}</div>
                      <div className="text-sm text-gray-400">{selectedUser.email}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-300">
                      Select New Tier
                    </label>
                    <div className="space-y-4">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
                        <p className="text-sm text-blue-400">
                          💡 Select a new tier for <strong>{selectedUser.username}</strong>
                        </p>
                      </div>

                      <div className="space-y-3">
                        {(['free', 'pro', 'vip', 'admin'] as const).map((tier) => (
                          <label
                            key={tier}
                            className={`flex items-center justify-between gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${ 
                              newTier === tier
                                ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                                : 'border-gray-500/20 hover:border-purple-500/50 hover:bg-purple-500/5'
                            } ${
                              selectedUser.tier === 'admin' && tier !== 'admin'
                                ? 'opacity-50 cursor-not-allowed'
                                : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                name="tier"
                                value={tier}
                                checked={newTier === tier}
                                onChange={(e) => setNewTier(e.target.value as typeof newTier)}
                                disabled={selectedUser.tier === 'admin' && tier !== 'admin'}
                                className="text-purple-500 w-5 h-5"
                              />
                              <div className="flex items-center gap-2">
                                {getTierIcon(tier)}
                                <div>
                                  <div className="font-semibold">{tier.toUpperCase()}</div>
                                  <div className="text-xs text-gray-400">
                                    {tier === 'free' && '10 drawings limit'}
                                    {tier === 'pro' && '50 drawings + features'}
                                    {tier === 'vip' && 'Unlimited + priority'}
                                    {tier === 'admin' && 'Full system access'}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {newTier === tier && (
                              <CheckCircle className="text-purple-500" size={20} />
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedUser.tier === 'admin' && (
                    <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="text-orange-400 mt-0.5" size={16} />
                        <p className="text-xs text-orange-400">
                          Admin account tier cannot be changed.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleUpdateTier}
                      className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                    >
                      Update Tier
                    </button>
                    <button
                      onClick={() => setShowEditTier(false)}
                      className="px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* User Details Modal */}
          {showUserDetails && selectedUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center p-6"
              onClick={() => setShowUserDetails(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-spooky-card border-2 border-red-500/50 rounded-xl max-w-2xl w-full p-6"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-red-500">User Details</h3>
                  <button
                    onClick={() => setShowUserDetails(false)}
                    className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-500/20">
                    <div className="text-5xl">{selectedUser.avatar}</div>
                    <div>
                      <h4 className="text-2xl font-bold">{selectedUser.username}</h4>
                      <p className="text-gray-400">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-spooky-bg p-4 rounded-lg border border-gray-500/20">
                      <div className="text-sm text-gray-400 mb-1">User ID</div>
                      <div className="font-mono text-sm">{selectedUser.id}</div>
                    </div>
                    <div className="bg-spooky-bg p-4 rounded-lg border border-gray-500/20">
                      <div className="text-sm text-gray-400 mb-1">Account Tier</div>
                      <div className="flex items-center gap-2">
                        {getTierIcon(selectedUser.tier)}
                        <span className="font-semibold">{selectedUser.tier.toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="bg-spooky-bg p-4 rounded-lg border border-gray-500/20">
                      <div className="text-sm text-gray-400 mb-1">Created At</div>
                      <div className="text-sm">{selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleString() : 'N/A'}</div>
                    </div>
                    <div className="bg-spooky-bg p-4 rounded-lg border border-gray-500/20">
                      <div className="text-sm text-gray-400 mb-1">Status</div>
                      <div className="flex items-center gap-2 text-green-400">
                        <CheckCircle size={16} />
                        <span className="text-sm">Active</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="text-blue-400 mt-1" size={20} />
                      <div>
                        <div className="font-semibold text-blue-400 mb-1">Account Information</div>
                        <div className="text-sm text-gray-300">
                          This user has been registered since {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'N/A'}.
                          {selectedUser.tier === 'admin' && ' This is an administrator account with full system access.'}
                          {selectedUser.tier === 'vip' && ' This user has VIP privileges with unlimited access.'}
                          {selectedUser.tier === 'pro' && ' This user has Pro features enabled.'}
                          {selectedUser.tier === 'free' && ' This user is on the free tier.'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowUserDetails(false);
                        handleEditTier(selectedUser);
                      }}
                      className="flex-1 px-4 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                    >
                      Edit Tier
                    </button>
                    {selectedUser.tier !== 'admin' && (
                      <button
                        onClick={() => {
                          setShowUserDetails(false);
                          handleDeleteUser(selectedUser.id, selectedUser.username);
                        }}
                        className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold"
                      >
                        Delete User
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
