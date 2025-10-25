'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeConfig } from '@/config/themes';
import ThemeLoadingScreen from './ThemeLoadingScreen';
import { motion } from 'framer-motion';

interface ClientLayoutProps {
  children: ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const config = getThemeConfig(theme);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      const root = document.documentElement;
      
      // Apply ALL theme colors to CSS variables
      root.style.setProperty('--color-primary', config.colors.primary);
      root.style.setProperty('--color-secondary', config.colors.secondary);
      root.style.setProperty('--color-accent', config.colors.accent);
      root.style.setProperty('--color-text', config.colors.text);
      root.style.setProperty('--color-text-secondary', config.colors.textSecondary);
      root.style.setProperty('--color-border', config.colors.border);
      root.style.setProperty('--color-border-hover', config.colors.borderHover);
      root.style.setProperty('--color-bg-card', config.colors.cardBg);
      root.style.setProperty('--color-button-bg', config.colors.buttonBg);
      root.style.setProperty('--color-button-hover', config.colors.buttonHover);
      root.style.setProperty('--color-success', config.colors.success);
      root.style.setProperty('--color-error', config.colors.error);
      root.style.setProperty('--color-warning', config.colors.warning);
      
      // Apply gradient colors
      root.style.setProperty('--gradient-from', config.colors.primary);
      root.style.setProperty('--gradient-via', config.colors.secondary);
      root.style.setProperty('--gradient-to', config.colors.accent);
      
      // Apply fonts
      root.style.setProperty('--theme-font', config.font.family);
      root.style.setProperty('--theme-heading-font', config.font.headingFamily);
      
      // Apply shadows
      root.style.setProperty('--shadow-glow', config.shadows.glow);
      root.style.setProperty('--shadow-card', config.shadows.card);
      root.style.setProperty('--shadow-button', config.shadows.button);
      
      // Apply canvas theme
      root.style.setProperty('--canvas-brush-color', config.canvasTheme.brushColor);
      root.style.setProperty('--canvas-bg-color', config.canvasTheme.backgroundColor);
      root.style.setProperty('--canvas-border-color', config.canvasTheme.borderColor);
      
      // Apply background gradient to body
      document.body.style.background = config.backgroundGradient;
      document.body.style.fontFamily = config.font.family;
      document.body.style.color = config.colors.text;
      
      // Update scrollbar colors
      const style = document.getElementById('theme-scrollbar-style');
      if (style) {
        style.remove();
      }
      
      const scrollbarStyle = document.createElement('style');
      scrollbarStyle.id = 'theme-scrollbar-style';
      scrollbarStyle.innerHTML = `
        ::-webkit-scrollbar-thumb {
          background: ${config.colors.primary} !important;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${config.colors.secondary} !important;
        }
      `;
      document.head.appendChild(scrollbarStyle);
      
      // Update theme-specific class on body
      document.body.className = document.body.className.replace(/theme-\w+/g, '');
      document.body.classList.add(`theme-${theme}`);
      
      console.log(`🎨 Theme applied: ${config.name}`);
    }
  }, [theme, config, mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      {loading && (
        <ThemeLoadingScreen 
          onComplete={() => setLoading(false)}
          duration={2000}
        />
      )}
      
      <div 
        className={loading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}
        style={{
          fontFamily: config.font.family,
          color: config.colors.text,
        }}
      >
        {children}
      </div>

      {/* Animated floating emojis */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {config.emojis.slice(0, 6).map((emoji, index) => (
          <motion.div
            key={`${theme}-${emoji}-${index}`}
            className="absolute text-4xl opacity-20"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -100,
              rotate: 0,
              scale: 0.5
            }}
            animate={{
              y: window.innerHeight + 100,
              rotate: 360,
              scale: [0.5, 1.2, 0.8, 1],
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Infinity,
              delay: index * 2,
              ease: "linear"
            }}
            style={{
              left: `${(index * 16) % 100}%`,
            }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>

      {/* Animated theme particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`particle-${theme}-${i}`}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              background: i % 2 === 0 ? config.colors.primary : config.colors.secondary,
              opacity: 0.15,
            }}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 8 + Math.random() * 12,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Theme-aware fog effect */}
      <div 
        className="fog"
        style={{
          background: `linear-gradient(to top, ${config.colors.primary}1A, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Inject global theme styles with animations */}
      <style jsx global>{`
        .spooky-btn {
          background: var(--color-button-bg) !important;
          box-shadow: var(--shadow-button) !important;
          color: var(--color-text) !important;
          transition: all 0.3s ease !important;
          transform: translateY(0) !important;
        }
        
        .spooky-btn:hover {
          background: var(--color-button-hover) !important;
          transform: translateY(-2px) scale(1.02) !important;
          box-shadow: 0 8px 25px var(--color-primary)40 !important;
        }
        
        .spooky-btn:active {
          transform: translateY(0) scale(0.98) !important;
        }
        
        .spooky-card {
          background: var(--color-bg-card) !important;
          border-color: var(--color-border) !important;
          box-shadow: var(--shadow-card) !important;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
          transform: translateY(0) !important;
        }
        
        .spooky-card:hover {
          border-color: var(--color-border-hover) !important;
          transform: translateY(-4px) !important;
          box-shadow: 0 12px 40px var(--color-primary)30, var(--shadow-card) !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: var(--color-text) !important;
          transition: color 0.3s ease !important;
        }
        
        p, span, div {
          color: inherit;
          transition: color 0.3s ease;
        }
        
        input, textarea, select {
          background: var(--color-bg-card) !important;
          border-color: var(--color-border) !important;
          color: var(--color-text) !important;
          transition: all 0.3s ease !important;
        }
        
        input:focus, textarea:focus, select:focus {
          border-color: var(--color-primary) !important;
          box-shadow: 0 0 0 3px var(--color-primary)20 !important;
          transform: scale(1.01) !important;
        }
        
        canvas {
          border-color: var(--canvas-border-color) !important;
          transition: border-color 0.3s ease !important;
        }
        
        .glow-orange {
          box-shadow: var(--shadow-glow) !important;
          animation: pulse-glow 3s ease-in-out infinite !important;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        button, a {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
      `}</style>
    </>
  );
}
