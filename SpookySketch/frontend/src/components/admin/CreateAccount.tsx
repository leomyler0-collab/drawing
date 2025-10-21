'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, UserPlus, Shield, Crown, Zap, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface CreateAccountProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function CreateAccount({ onClose, onSuccess }: CreateAccountProps) {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    tier: 'free' as 'free' | 'pro' | 'vip' | 'admin',
    avatar: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tierOptions = [
    {
      value: 'free',
      label: 'Free',
      icon: <User size={20} />,
      color: 'gray',
      description: '10 drawings limit'
    },
    {
      value: 'pro',
      label: 'Pro',
      icon: <Zap size={20} />,
      color: 'orange',
      description: '50 drawings + features'
    },
    {
      value: 'vip',
      label: 'VIP',
      icon: <Crown size={20} />,
      color: 'purple',
      description: 'Unlimited + priority'
    },
    {
      value: 'admin',
      label: 'Admin',
      icon: <Shield size={20} />,
      color: 'red',
      description: 'Full system access'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.email || !formData.password) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(`Creating ${formData.tier.toUpperCase()} account...`);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/create-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success(`✅ ${data.message}`, {
          duration: 4000
        });
        
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.dismiss(loadingToast);
        toast.error(`❌ ${data.error || 'Failed to create account'}`);
      }
    } catch (error: any) {
      console.error('Create account error:', error);
      toast.dismiss(loadingToast);
      toast.error('❌ Failed to create account. Check your connection.');
    } finally {
      setIsSubmitting(false);
    }
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
        className="bg-spooky-card border-2 border-purple-500/50 rounded-xl max-w-2xl w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <UserPlus className="text-purple-500" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-purple-500">Create New Account</h2>
              <p className="text-gray-400 text-sm">Add a user with custom tier</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none text-white"
              placeholder="Enter username"
              required
              minLength={3}
              maxLength={30}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none text-white"
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none text-white"
              placeholder="Enter password"
              required
              minLength={4}
            />
          </div>

          {/* Avatar (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300">
              Avatar (Optional)
            </label>
            <input
              type="text"
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none text-white"
              placeholder="Enter emoji (e.g., 👑, 💎, 🎨)"
              maxLength={2}
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty for auto-selection based on tier</p>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300">
              Account Tier <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {tierOptions.map((tier) => (
                <label
                  key={tier.value}
                  className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.tier === tier.value
                      ? `border-${tier.color}-500 bg-${tier.color}-500/10 shadow-lg shadow-${tier.color}-500/20`
                      : 'border-gray-500/20 hover:border-purple-500/50 hover:bg-purple-500/5'
                  }`}
                >
                  <input
                    type="radio"
                    name="tier"
                    value={tier.value}
                    checked={formData.tier === tier.value}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="hidden"
                  />
                  <div className={`text-${tier.color}-500`}>{tier.icon}</div>
                  <div className="flex-1">
                    <div className="font-semibold">{tier.label}</div>
                    <div className="text-xs text-gray-400">{tier.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
