'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { Theme } from '@/contexts/ThemeContext';
import { getThemeConfig } from '@/config/themes';
import { Settings, X } from 'lucide-react';
import { useState } from 'react';

export default function ThemeSwitcher() {
  const { theme, setTheme, isTestMode, setIsTestMode } = useTheme();
  const [showPanel, setShowPanel] = useState(false);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
    // Reload the page to apply new theme completely
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const toggleTestMode = () => {
    const newMode = !isTestMode;
    setIsTestMode(newMode);
    // Reload to apply changes
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  const themes: Theme[] = ['halloween', 'christmas', 'newyear'];

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowPanel(!showPanel)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-2xl flex items-center justify-center text-white hover:shadow-purple-500/50 transition-all"
        title="Theme Switcher (Test Mode)"
      >
        <Settings size={24} className="animate-spin-slow" />
      </motion.button>

      {/* Theme Switcher Panel */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -20, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 left-6 z-50 bg-gray-900/95 backdrop-blur-xl border-2 border-purple-500/50 rounded-2xl shadow-2xl p-6 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🎨 Theme Switcher
              </h3>
              <button
                onClick={() => setShowPanel(false)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Test Mode Toggle */}
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">Test Mode</p>
                  <p className="text-xs text-gray-400">Manual theme selection</p>
                </div>
                <button
                  onClick={toggleTestMode}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    isTestMode ? 'bg-purple-500' : 'bg-gray-600'
                  }`}
                >
                  <motion.div
                    animate={{ x: isTestMode ? 28 : 4 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-1 w-5 h-5 bg-white rounded-full"
                  />
                </button>
              </div>
              {!isTestMode && (
                <p className="text-xs text-gray-400 mt-2">
                  ℹ️ Automatic theme based on date
                </p>
              )}
            </div>

            {/* Theme Selection */}
            <div className="space-y-3">
              <p className="text-sm text-gray-400 mb-3">
                {isTestMode ? 'Select a theme:' : 'Current theme (auto):'}
              </p>
              {themes.map((themeName) => {
                const config = getThemeConfig(themeName);
                const isActive = theme === themeName;
                
                return (
                  <motion.button
                    key={themeName}
                    onClick={() => isTestMode && handleThemeChange(themeName)}
                    disabled={!isTestMode}
                    whileHover={isTestMode ? { scale: 1.02 } : {}}
                    whileTap={isTestMode ? { scale: 0.98 } : {}}
                    className={`w-full p-4 rounded-xl border-2 transition-all ${
                      isActive
                        ? 'border-purple-500 bg-purple-500/20 shadow-lg shadow-purple-500/30'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    } ${!isTestMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{config.emoji}</span>
                      <div className="text-left flex-1">
                        <p className="font-bold text-white">{config.name}</p>
                        <p className="text-xs text-gray-400">{config.title}</p>
                      </div>
                      {isActive && (
                        <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Info */}
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300">
                💡 <strong>Auto-Theme Schedule:</strong><br />
                🎃 Oct: Halloween<br />
                🎄 Nov-Dec: Christmas<br />
                🎆 Jan: New Year
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
}
