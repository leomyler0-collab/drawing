'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeConfig } from '@/config/themes';
import { Menu, X, Ghost, User, LogOut, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const config = getThemeConfig(theme);

  return (
    <nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg border-b"
      style={{
        backgroundColor: `${config.colors.cardBg}cc`,
        borderBottomColor: config.colors.border,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-3xl md:text-4xl"
            >
              {config.emoji}
            </motion.span>
            <span 
              className="text-xl md:text-2xl lg:text-3xl font-bold"
              style={{
                fontFamily: config.font.headingFamily,
                ...(theme === 'christmas' ? {
                  background: 'repeating-linear-gradient(45deg, #FFFFFF 0px, #FFFFFF 8px, #C41E3A 8px, #C41E3A 16px)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: 'drop-shadow(0 2px 4px rgba(196, 30, 58, 0.5))',
                } : {
                  background: `linear-gradient(135deg, ${config.colors.primary}, ${config.colors.secondary})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: `drop-shadow(0 2px 4px ${config.colors.primary}66)`,
                })
              }}
            >
              {config.title}
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/studio" 
              className="transition-colors"
              style={{
                color: config.colors.textSecondary,
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
            >
              <Palette className="inline mr-1" size={18} />
              Studio
            </Link>
            <Link 
              href="/gallery" 
              className="transition-colors"
              style={{ color: config.colors.textSecondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
            >
              Gallery
            </Link>
            <Link 
              href="/pricing" 
              className="transition-colors"
              style={{ color: config.colors.textSecondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
            >
              Pricing
            </Link>
            <Link 
              href="/about" 
              className="transition-colors"
              style={{ color: config.colors.textSecondary }}
              onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
              onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
            >
              About
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <button 
                    className="px-4 py-2 rounded-lg border transition-all"
                    style={{
                      borderColor: config.colors.primary,
                      color: config.colors.primary,
                    }}
                  >
                    <User className="inline mr-1" size={18} />
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: `${config.colors.error}33`,
                    color: config.colors.error,
                  }}
                >
                  <LogOut className="inline mr-1" size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <button 
                    className="px-4 py-2 rounded-lg border transition-all"
                    style={{
                      borderColor: config.colors.primary,
                      color: config.colors.primary,
                    }}
                  >
                    Login
                  </button>
                </Link>
                <Link href="/signup">
                  <button className="spooky-btn">Sign Up</button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
            style={{ color: config.colors.primary }}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pb-4 space-y-3"
            >
              <Link 
                href="/studio" 
                className="block py-2 transition-colors"
                style={{ color: config.colors.textSecondary }}
                onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
              >
                Studio
              </Link>
              <Link 
                href="/gallery" 
                className="block py-2 transition-colors"
                style={{ color: config.colors.textSecondary }}
                onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
              >
                Gallery
              </Link>
              <Link 
                href="/pricing" 
                className="block py-2 transition-colors"
                style={{ color: config.colors.textSecondary }}
                onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
              >
                Pricing
              </Link>
              <Link 
                href="/about" 
                className="block py-2 transition-colors"
                style={{ color: config.colors.textSecondary }}
                onMouseEnter={(e) => e.currentTarget.style.color = config.colors.primary}
                onMouseLeave={(e) => e.currentTarget.style.color = config.colors.textSecondary}
              >
                About
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="block py-2">
                    <button 
                      className="w-full px-4 py-2 rounded-lg border transition-all"
                      style={{
                        borderColor: config.colors.primary,
                        color: config.colors.primary,
                      }}
                    >
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 rounded-lg transition-all"
                    style={{
                      backgroundColor: `${config.colors.error}33`,
                      color: config.colors.error,
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <button 
                      className="w-full px-4 py-2 rounded-lg border transition-all"
                      style={{
                        borderColor: config.colors.primary,
                        color: config.colors.primary,
                      }}
                    >
                      Login
                    </button>
                  </Link>
                  <Link href="/signup" className="block">
                    <button className="w-full spooky-btn">Sign Up</button>
                  </Link>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
