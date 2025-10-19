'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  X, Activity, AlertCircle, CheckCircle, Info, Download,
  Filter, Search, Calendar, User, Database, Settings
} from 'lucide-react';
import toast from 'react-hot-toast';

interface LogEntry {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  action: string;
  user: string;
  details: string;
  timestamp: string;
}

interface SystemLogsProps {
  onClose: () => void;
}

export default function SystemLogs({ onClose }: SystemLogsProps) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filterType, setFilterType] = useState<'all' | 'info' | 'warning' | 'error' | 'success'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = () => {
    // Generate demo logs from localStorage activities
    const demoLogs: LogEntry[] = [
      {
        id: '1',
        type: 'success',
        action: 'User Login',
        user: 'Admin',
        details: 'Admin logged in successfully',
        timestamp: new Date().toISOString()
      },
      {
        id: '2',
        type: 'info',
        action: 'Drawing Created',
        user: 'User123',
        details: 'New drawing "Spooky Scene" created',
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '3',
        type: 'warning',
        action: 'Storage Warning',
        user: 'System',
        details: 'localStorage usage at 75%',
        timestamp: new Date(Date.now() - 7200000).toISOString()
      },
      {
        id: '4',
        type: 'success',
        action: 'User Registration',
        user: 'NewUser456',
        details: 'New user account created',
        timestamp: new Date(Date.now() - 10800000).toISOString()
      },
      {
        id: '5',
        type: 'info',
        action: 'Gallery View',
        user: 'User789',
        details: 'Viewed public gallery',
        timestamp: new Date(Date.now() - 14400000).toISOString()
      }
    ];

    setLogs(demoLogs);
  };

  const filteredLogs = logs.filter(log => {
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSearch = 
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const exportLogs = () => {
    const data = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system-logs-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Logs exported successfully!');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="text-red-400" size={20} />;
      case 'warning':
        return <AlertCircle className="text-yellow-400" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-400" size={20} />;
      default:
        return <Info className="text-blue-400" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      default:
        return 'border-blue-500/30 bg-blue-500/10';
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
        className="spooky-card w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-orange-500/20">
          <div className="flex items-center gap-3">
            <Activity className="text-orange-500" size={28} />
            <div>
              <h2 className="text-2xl font-bold">System Logs</h2>
              <p className="text-sm text-gray-400">Real-time system activity monitoring</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-spooky-bg border border-orange-500/30 rounded-lg focus:border-orange-500 focus:outline-none text-white text-sm"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'info', 'warning', 'error', 'success'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  filterType === type
                    ? 'bg-orange-500 text-white'
                    : 'bg-spooky-bg border border-orange-500/30 text-gray-400 hover:border-orange-500'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Export */}
          <button
            onClick={exportLogs}
            className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 transition-all flex items-center gap-2"
          >
            <Download size={18} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="spooky-card bg-blue-500/10 border border-blue-500/30">
            <div className="flex items-center gap-2 mb-2">
              <Info size={16} className="text-blue-400" />
              <p className="text-sm text-gray-400">Info</p>
            </div>
            <p className="text-2xl font-bold">{logs.filter(l => l.type === 'info').length}</p>
          </div>
          <div className="spooky-card bg-green-500/10 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle size={16} className="text-green-400" />
              <p className="text-sm text-gray-400">Success</p>
            </div>
            <p className="text-2xl font-bold">{logs.filter(l => l.type === 'success').length}</p>
          </div>
          <div className="spooky-card bg-yellow-500/10 border border-yellow-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-yellow-400" />
              <p className="text-sm text-gray-400">Warning</p>
            </div>
            <p className="text-2xl font-bold">{logs.filter(l => l.type === 'warning').length}</p>
          </div>
          <div className="spooky-card bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} className="text-red-400" />
              <p className="text-sm text-gray-400">Error</p>
            </div>
            <p className="text-2xl font-bold">{logs.filter(l => l.type === 'error').length}</p>
          </div>
        </div>

        {/* Logs List */}
        <div className="flex-1 overflow-y-auto space-y-3">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Activity size={48} className="mx-auto mb-4 opacity-50" />
              <p>No logs found</p>
            </div>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className={`p-4 rounded-lg border ${getTypeColor(log.type)} transition-all hover:scale-[1.01]`}
              >
                <div className="flex items-start gap-3">
                  {getIcon(log.type)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold">{log.action}</h4>
                      <span className="text-xs text-gray-400">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{log.details}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {log.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
