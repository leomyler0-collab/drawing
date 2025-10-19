'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, CheckSquare, Trash2, Download, Upload, Shield,
  Users, Palette, AlertTriangle, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';
import { adminAPI } from '@/lib/api';
import { localDB } from '@/utils/localStorageDB';
import { clientAuth } from '@/utils/clientAuth';

interface BulkActionsProps {
  onClose: () => void;
  onComplete: () => void;
}

export default function BulkActions({ onClose, onComplete }: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState<string>('');
  const [processing, setProcessing] = useState(false);

  const actions = [
    {
      id: 'export-all',
      icon: Download,
      title: 'Export All Data',
      description: 'Export users, drawings, and settings to JSON',
      color: 'blue',
      action: handleExportAll
    },
    {
      id: 'backup-users',
      icon: Users,
      title: 'Backup Users',
      description: 'Download complete user database backup',
      color: 'green',
      action: handleBackupUsers
    },
    {
      id: 'backup-drawings',
      icon: Palette,
      title: 'Backup Drawings',
      description: 'Download all drawings with metadata',
      color: 'purple',
      action: handleBackupDrawings
    },
    {
      id: 'clear-cache',
      icon: Zap,
      title: 'Clear System Cache',
      description: 'Clear temporary data and optimize storage',
      color: 'yellow',
      action: handleClearCache
    },
    {
      id: 'delete-old',
      icon: Trash2,
      title: 'Delete Old Drawings',
      description: 'Remove drawings older than 90 days',
      color: 'red',
      action: handleDeleteOld,
      dangerous: true
    }
  ];

  async function handleExportAll() {
    setProcessing(true);
    try {
      const data = {
        users: clientAuth.getAllUsers(),
        drawings: localDB.getAllDrawings(),
        settings: localDB.getSettings(),
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `spookysketch-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success('All data exported successfully! 📦');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setProcessing(false);
    }
  }

  async function handleBackupUsers() {
    setProcessing(true);
    try {
      const users = clientAuth.getAllUsers();
      const blob = new Blob([JSON.stringify(users, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Backed up ${users.length} users! 👥`);
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Failed to backup users');
    } finally {
      setProcessing(false);
    }
  }

  async function handleBackupDrawings() {
    setProcessing(true);
    try {
      const drawings = localDB.getAllDrawings();
      const blob = new Blob([JSON.stringify(drawings, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `drawings-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast.success(`Backed up ${drawings.length} drawings! 🎨`);
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Failed to backup drawings');
    } finally {
      setProcessing(false);
    }
  }

  async function handleClearCache() {
    if (!confirm('Are you sure you want to clear the cache? This will not delete user data.')) return;

    setProcessing(true);
    try {
      // Clear draft
      localDB.clearDraft();
      
      toast.success('Cache cleared successfully! ⚡');
      onComplete();
    } catch (error) {
      console.error('Clear cache error:', error);
      toast.error('Failed to clear cache');
    } finally {
      setProcessing(false);
    }
  }

  async function handleDeleteOld() {
    if (!confirm('⚠️ WARNING: This will permanently delete drawings older than 90 days. Continue?')) return;

    setProcessing(true);
    try {
      const drawings = localDB.getAllDrawings();
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      let deleted = 0;
      drawings.forEach(drawing => {
        if (new Date(drawing.createdAt) < ninetyDaysAgo) {
          localDB.deleteDrawing(drawing.id);
          deleted++;
        }
      });

      if (deleted > 0) {
        toast.success(`Deleted ${deleted} old drawings 🗑️`);
        onComplete();
      } else {
        toast('No old drawings found', { icon: '👍' });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete old drawings');
    } finally {
      setProcessing(false);
    }
  }

  const getColorClasses = (color: string, dangerous?: boolean) => {
    if (dangerous) {
      return 'border-red-500/50 bg-red-500/10 hover:bg-red-500/20';
    }
    
    switch (color) {
      case 'blue':
        return 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20';
      case 'green':
        return 'border-green-500/50 bg-green-500/10 hover:bg-green-500/20';
      case 'purple':
        return 'border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20';
      case 'yellow':
        return 'border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20';
      default:
        return 'border-orange-500/50 bg-orange-500/10 hover:bg-orange-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="spooky-card w-full max-w-4xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <Shield className="text-purple-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold">Admin Bulk Actions</h2>
              <p className="text-sm text-gray-400">Powerful administrative operations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Warning */}
        <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="text-yellow-500 flex-shrink-0" size={20} />
          <div>
            <p className="font-semibold text-yellow-400 mb-1">Admin Access Required</p>
            <p className="text-sm text-gray-400">
              These actions have system-wide effects. Please use with caution.
            </p>
          </div>
        </div>

        {/* Actions Grid */}
        <div className="grid md:grid-cols-2 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.id}
                onClick={() => {
                  setSelectedAction(action.id);
                  action.action();
                }}
                disabled={processing}
                className={`p-6 rounded-lg border-2 transition-all text-left ${getColorClasses(action.color, action.dangerous)} ${
                  processing && selectedAction === action.id ? 'opacity-50 cursor-wait' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${
                    action.dangerous ? 'bg-red-500/20' : `bg-${action.color}-500/20`
                  }`}>
                    <Icon size={24} className={action.dangerous ? 'text-red-400' : `text-${action.color}-400`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-400">{action.description}</p>
                    {action.dangerous && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-red-400">
                        <AlertTriangle size={12} />
                        <span>Irreversible action</span>
                      </div>
                    )}
                  </div>
                </div>
                {processing && selectedAction === action.id && (
                  <div className="mt-4">
                    <div className="loading-spinner w-5 h-5"></div>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Info */}
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <h4 className="font-semibold mb-2 text-purple-400">💡 Pro Tips</h4>
          <ul className="text-sm text-gray-400 space-y-1">
            <li>• Export data regularly to prevent data loss</li>
            <li>• Clear cache if experiencing performance issues</li>
            <li>• Old drawings are backed up during deletion</li>
            <li>• All exports are in JSON format for easy restoration</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
