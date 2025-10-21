'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, UserPlus, Shield, Crown, Zap, User, Mail, Lock, AtSign, Sparkles } from 'lucide-react';
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 30) {
      newErrors.username = 'Username must be less than 30 characters';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, hyphens, and underscores';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 4) {
      newErrors.password = 'Password must be at least 4 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setIsSubmitting(true);
    const loadingToast = toast.loading(`Creating ${formData.tier.toUpperCase()} account...`);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/admin/create-account`, {
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
        toast.success(
          <div className="flex items-center gap-2">
            <span>✅ {data.message}</span>
            <span className="text-xs px-2 py-0.5 bg-green-500/20 rounded-full">Success</span>
          </div>,
          {
            duration: 4000
          }
        );
        
        if (onSuccess) onSuccess();
        onClose();
      } else {
        toast.dismiss(loadingToast);
        toast.error(
          <div className="flex flex-col">
            <span className="font-semibold">Failed to create account</span>
            <span className="text-xs text-gray-400">{data.error || 'Unknown error'}</span>
          </div>,
          {
            duration: 5000
          }
        );
      }
    } catch (error: any) {
      console.error('Create account error:', error);
      toast.dismiss(loadingToast);
      
      // More detailed error message
      const errorMsg = error.message || 'Network error';
      toast.error(
        <div className="flex flex-col">
          <span className="font-semibold">Connection Error</span>
          <span className="text-xs text-gray-400">{errorMsg}</span>
          <span className="text-xs text-gray-500 mt-1">Make sure the backend is running</span>
        </div>,
        {
          duration: 6000
        }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-spooky-card border-2 border-purple-500/50 rounded-xl max-w-2xl w-full p-6 my-8 max-h-[90vh] overflow-y-auto"
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
              <AtSign size={16} />
              Username <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.username}
                onChange={(e) => {
                  setFormData({ ...formData, username: e.target.value });
                  if (errors.username) setErrors({ ...errors, username: '' });
                }}
                className={`w-full px-4 py-3 bg-spooky-bg border rounded-lg focus:outline-none text-white transition-colors ${
                  errors.username ? 'border-red-500/50 focus:border-red-500' : 'border-gray-500/30 focus:border-purple-500/50'
                }`}
                placeholder="e.g., JohnDoe123"
                maxLength={30}
                disabled={isSubmitting}
              />
            </div>
            <AnimatePresence>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-xs mt-1 flex items-center gap-1"
                >
                  ⚠️ {errors.username}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-xs text-gray-500 mt-1">Letters, numbers, hyphens, and underscores only</p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
              <Mail size={16} />
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData({ ...formData, email: e.target.value });
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full px-4 py-3 bg-spooky-bg border rounded-lg focus:outline-none text-white transition-colors ${
                  errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-gray-500/30 focus:border-purple-500/50'
                }`}
                placeholder="user@example.com"
                disabled={isSubmitting}
              />
            </div>
            <AnimatePresence>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-xs mt-1 flex items-center gap-1"
                >
                  ⚠️ {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
              <Lock size={16} />
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`w-full px-4 py-3 bg-spooky-bg border rounded-lg focus:outline-none text-white transition-colors ${
                  errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-gray-500/30 focus:border-purple-500/50'
                }`}
                placeholder="Minimum 4 characters"
                minLength={4}
                disabled={isSubmitting}
              />
            </div>
            <AnimatePresence>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-400 text-xs mt-1 flex items-center gap-1"
                >
                  ⚠️ {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Avatar (Optional) */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-300 flex items-center gap-2">
              <Sparkles size={16} />
              Avatar (Optional)
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="flex-1 px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none text-white text-center text-2xl"
                placeholder="😀"
                maxLength={2}
                disabled={isSubmitting}
              />
              {formData.avatar && (
                <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center justify-center text-2xl">
                  {formData.avatar}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">Leave empty for auto-selection based on tier</p>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="block text-sm font-medium mb-3 text-gray-300 flex items-center gap-2">
              <Crown size={16} />
              Account Tier <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {tierOptions.map((tier) => {
                const isSelected = formData.tier === tier.value;
                const borderColors = {
                  gray: 'border-gray-500',
                  orange: 'border-orange-500',
                  purple: 'border-purple-500',
                  red: 'border-red-500'
                };
                const bgColors = {
                  gray: 'bg-gray-500/10',
                  orange: 'bg-orange-500/10',
                  purple: 'bg-purple-500/10',
                  red: 'bg-red-500/10'
                };
                const textColors = {
                  gray: 'text-gray-400',
                  orange: 'text-orange-400',
                  purple: 'text-purple-400',
                  red: 'text-red-400'
                };
                
                return (
                  <label
                    key={tier.value}
                    className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? `${borderColors[tier.color as keyof typeof borderColors]} ${bgColors[tier.color as keyof typeof bgColors]} shadow-lg`
                        : 'border-gray-500/20 hover:border-purple-500/50 hover:bg-purple-500/5'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <input
                      type="radio"
                      name="tier"
                      value={tier.value}
                      checked={isSelected}
                      onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                      className="hidden"
                      disabled={isSubmitting}
                    />
                    <div className={textColors[tier.color as keyof typeof textColors]}>{tier.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold text-white">{tier.label}</div>
                      <div className="text-xs text-gray-400">{tier.description}</div>
                    </div>
                    {isSelected && <span className="text-green-400">✓</span>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4 border-t border-gray-700/50 mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
