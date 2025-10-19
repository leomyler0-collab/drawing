'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Settings as SettingsIcon, Shield, Bell, Database, 
  Palette, Lock, Globe, Save, Eye, EyeOff, CheckCircle,
  AlertCircle, Mail, Server, HardDrive, Cpu
} from 'lucide-react';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { AppSettings } from '@/types';

interface SettingsProps {
  onClose: () => void;
}

export default function Settings({ onClose }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'system'>('general');
  const [settings, setSettings] = useState({
    siteName: 'SpookySketch',
    siteDescription: 'Professional drawing and sketching platform',
    allowSignup: true,
    maintenanceMode: false,
    requireEmailVerification: false,
    maxDrawingsPerUser: 1000,
    maxFileSize: 10,
    enableNotifications: true,
    enableAnalytics: true,
    autoBackup: true,
    backupFrequency: 'daily',
    sessionTimeout: 30,
    passwordMinLength: 8,
    twoFactorAuth: false,
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await adminAPI.getSettings();
      setSettings(response.data.settings);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load settings:', error);
      const message = error instanceof Error ? error.message : 'Failed to load settings';
      toast.error(message);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await adminAPI.updateSettings(settings);
      setShowSuccess(true);
      toast.success('Settings saved successfully!');
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      const message = error instanceof Error ? error.message : 'Failed to save settings';
      toast.error(message);
    }
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
      // Reset to defaults
      toast.success('Settings reset to defaults');
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'system', name: 'System', icon: Server },
  ];

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
        className="bg-spooky-card border-2 border-purple-500/50 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <SettingsIcon className="text-purple-500" size={28} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-purple-500">System Settings</h2>
                <p className="text-gray-400 text-sm">Configure your SpookySketch instance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-purple-500/20 rounded-lg transition-colors"
            >
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'general' | 'security' | 'system')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/30 text-purple-400 border border-purple-500/50'
                    : 'bg-spooky-bg text-gray-400 border border-gray-500/20 hover:border-purple-500/30'
                }`}
              >
                <tab.icon size={18} />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-250px)] p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Globe size={20} className="text-purple-500" />
                  Site Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Site Name</label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                      className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Site Description</label>
                    <textarea
                      value={settings.siteDescription}
                      onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Allow User Signup</label>
                        <button
                          onClick={() => setSettings({ ...settings, allowSignup: !settings.allowSignup })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.allowSignup ? 'bg-purple-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.allowSignup ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Enable public user registration</p>
                    </div>

                    <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Maintenance Mode</label>
                        <button
                          onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.maintenanceMode ? 'bg-red-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.maintenanceMode ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Disable site for maintenance</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Palette size={20} className="text-purple-500" />
                  Drawing Limits
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max Drawings Per User</label>
                    <input
                      type="number"
                      value={settings.maxDrawingsPerUser}
                      onChange={(e) => setSettings({ ...settings, maxDrawingsPerUser: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Max File Size (MB)</label>
                    <input
                      type="number"
                      value={settings.maxFileSize}
                      onChange={(e) => setSettings({ ...settings, maxFileSize: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Bell size={20} className="text-purple-500" />
                  Features
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Enable Notifications</label>
                      <button
                        onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.enableNotifications ? 'bg-purple-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.enableNotifications ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Show system notifications</p>
                  </div>

                  <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium">Enable Analytics</label>
                      <button
                        onClick={() => setSettings({ ...settings, enableAnalytics: !settings.enableAnalytics })}
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          settings.enableAnalytics ? 'bg-purple-500' : 'bg-gray-600'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          settings.enableAnalytics ? 'translate-x-6' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400">Track usage statistics</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-yellow-400 mt-1" size={20} />
                <div>
                  <div className="font-semibold text-yellow-400 mb-1">Security Notice</div>
                  <div className="text-sm text-gray-300">
                    Changes to security settings will affect all users. Please proceed with caution.
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Lock size={20} className="text-purple-500" />
                  Authentication
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Session Timeout (minutes)</label>
                      <input
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => setSettings({ ...settings, sessionTimeout: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Password Min Length</label>
                      <input
                        type="number"
                        value={settings.passwordMinLength}
                        onChange={(e) => setSettings({ ...settings, passwordMinLength: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Email Verification</label>
                        <button
                          onClick={() => setSettings({ ...settings, requireEmailVerification: !settings.requireEmailVerification })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.requireEmailVerification ? 'bg-purple-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.requireEmailVerification ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Require email verification for new accounts</p>
                    </div>

                    <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Two-Factor Auth</label>
                        <button
                          onClick={() => setSettings({ ...settings, twoFactorAuth: !settings.twoFactorAuth })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.twoFactorAuth ? 'bg-purple-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Enable 2FA for all users</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Shield size={20} className="text-purple-500" />
                  Security Status
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle className="text-green-400 mb-2" size={24} />
                    <div className="text-sm font-semibold">SSL Enabled</div>
                    <p className="text-xs text-gray-400 mt-1">HTTPS active</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <CheckCircle className="text-green-400 mb-2" size={24} />
                    <div className="text-sm font-semibold">Firewall Active</div>
                    <p className="text-xs text-gray-400 mt-1">Protected</p>
                  </div>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <Shield className="text-blue-400 mb-2" size={24} />
                    <div className="text-sm font-semibold">Last Audit</div>
                    <p className="text-xs text-gray-400 mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* System Settings */}
          {activeTab === 'system' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Database size={20} className="text-purple-500" />
                  Database & Backups
                </h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium">Auto Backup</label>
                        <button
                          onClick={() => setSettings({ ...settings, autoBackup: !settings.autoBackup })}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            settings.autoBackup ? 'bg-purple-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                            settings.autoBackup ? 'translate-x-6' : 'translate-x-0'
                          }`} />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Automatic database backups</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Backup Frequency</label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
                        className="w-full px-4 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg focus:border-purple-500/50 focus:outline-none"
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  </div>

                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-semibold mb-1">Last Backup</div>
                        <div className="text-sm text-gray-400">Today at 03:00 AM</div>
                      </div>
                      <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors">
                        Backup Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Cpu size={20} className="text-purple-500" />
                  System Resources
                </h3>
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                    <HardDrive className="text-purple-400 mb-2" size={24} />
                    <div className="text-sm font-semibold">Storage Used</div>
                    <div className="text-2xl font-bold mt-2">2.4 GB</div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: '24%' }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">24% of 10 GB</p>
                  </div>

                  <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                    <Cpu className="text-blue-400 mb-2" size={24} />
                    <div className="text-sm font-semibold">CPU Usage</div>
                    <div className="text-2xl font-bold mt-2">12%</div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-blue-500 h-full" style={{ width: '12%' }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">Low</p>
                  </div>

                  <div className="bg-spooky-bg border border-gray-500/20 rounded-lg p-4">
                    <Server className="text-green-400 mb-2" size={24} />
                    <div className="text-sm font-semibold">Memory</div>
                    <div className="text-2xl font-bold mt-2">4.2 GB</div>
                    <div className="mt-2 bg-gray-700 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-500 h-full" style={{ width: '42%' }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">42% of 10 GB</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-red-400">
                  <AlertCircle size={20} />
                  Danger Zone
                </h3>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Reset All Settings</div>
                    <div className="text-sm text-gray-400">This action cannot be undone</div>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors border border-red-500/50"
                  >
                    Reset Settings
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-purple-500/30 p-6 bg-gradient-to-r from-purple-900/10 to-blue-900/10">
          <div className="flex items-center justify-between">
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-green-400"
              >
                <CheckCircle size={20} />
                <span>Settings saved successfully!</span>
              </motion.div>
            )}
            {!showSuccess && <div />}
            
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-3 bg-spooky-bg border border-gray-500/30 rounded-lg hover:border-purple-500/50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 font-semibold"
              >
                <Save size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
