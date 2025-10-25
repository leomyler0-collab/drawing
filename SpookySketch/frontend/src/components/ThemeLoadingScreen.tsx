'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeConfig } from '@/config/themes';
import { useEffect, useState } from 'react';

interface ThemeLoadingScreenProps {
  onComplete?: () => void;
  duration?: number;
}

export default function ThemeLoadingScreen({ onComplete, duration = 2000 }: ThemeLoadingScreenProps) {
  const { theme } = useTheme();
  const [show, setShow] = useState(true);
  const config = getThemeConfig(theme);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      if (onComplete) {
        setTimeout(onComplete, 500); // Wait for exit animation
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
          style={{
            background: config.colors.background,
          }}
        >
          {/* Floating Emojis Background */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-6xl opacity-10"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 100,
                }}
                animate={{
                  y: -100,
                  x: Math.random() * window.innerWidth,
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 8 + Math.random() * 4,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'linear',
                }}
              >
                {config.emojis[Math.floor(Math.random() * config.emojis.length)]}
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <div className="relative z-10 text-center px-4">
            {/* Large Theme Emoji */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 15,
                duration: 0.8 
              }}
              className="text-9xl mb-6"
            >
              {config.emoji}
            </motion.div>

            {/* App Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className={`text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r ${config.gradient.from} ${config.gradient.via} ${config.gradient.to} bg-clip-text text-transparent`}
            >
              {config.title}
            </motion.h1>

            {/* Loading Spinner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="flex items-center justify-center gap-3 mt-8"
            >
              <div 
                className="w-3 h-3 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: config.colors.primary,
                  animationDelay: '0ms' 
                }}
              />
              <div 
                className="w-3 h-3 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: config.colors.secondary,
                  animationDelay: '150ms' 
                }}
              />
              <div 
                className="w-3 h-3 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: config.colors.accent,
                  animationDelay: '300ms' 
                }}
              />
            </motion.div>

            {/* Loading Text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="text-gray-400 mt-6 text-lg"
            >
              Loading your creative space...
            </motion.p>
          </div>

          {/* Sparkle Effects */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={`sparkle-${i}`}
                className="absolute"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  scale: 0,
                  opacity: 0,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: 'easeInOut',
                }}
              >
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: config.colors.accent }}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
