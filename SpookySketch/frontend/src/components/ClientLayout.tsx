'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeConfig } from '@/config/themes';
import ThemeLoadingScreen from './ThemeLoadingScreen';
import ThemeSwitcher from './ThemeSwitcher';

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

      {/* Theme Switcher - always visible for testing */}
      <ThemeSwitcher />

      {/* Theme-aware fog effect */}
      <div 
        className="fog"
        style={{
          background: `linear-gradient(to top, ${config.colors.primary}1A, transparent)`,
          pointerEvents: 'none',
        }}
      />

      {/* Inject global theme styles */}
      <style jsx global>{`
        .spooky-btn {
          background: var(--color-button-bg) !important;
          box-shadow: var(--shadow-button) !important;
          color: var(--color-text) !important;
        }
        
        .spooky-btn:hover {
          background: var(--color-button-hover) !important;
        }
        
        .spooky-card {
          background: var(--color-bg-card) !important;
          border-color: var(--color-border) !important;
          box-shadow: var(--shadow-card) !important;
        }
        
        .spooky-card:hover {
          border-color: var(--color-border-hover) !important;
        }
        
        h1, h2, h3, h4, h5, h6 {
          color: var(--color-text) !important;
        }
        
        p, span, div {
          color: inherit;
        }
        
        input, textarea, select {
          background: var(--color-bg-card) !important;
          border-color: var(--color-border) !important;
          color: var(--color-text) !important;
        }
        
        input:focus, textarea:focus, select:focus {
          border-color: var(--color-primary) !important;
        }
        
        canvas {
          border-color: var(--canvas-border-color) !important;
        }
        
        .glow-orange {
          box-shadow: var(--shadow-glow) !important;
        }
      `}</style>
    </>
  );
}
