'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Menu, X, Ghost, User, LogOut, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-spooky-bg/80 backdrop-blur-lg border-b border-orange-500/20">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-2xl font-bold">
            <motion.span
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              className="text-3xl"
            >
              🎃
            </motion.span>
            <span className="bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
              SpookySketch
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/studio" className="text-gray-300 hover:text-orange-500 transition-colors">
              <Palette className="inline mr-1" size={18} />
              Studio
            </Link>
            <Link href="/gallery" className="text-gray-300 hover:text-orange-500 transition-colors">
              Gallery
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-orange-500 transition-colors">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
              About
            </Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <button className="px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-all">
                    <User className="inline mr-1" size={18} />
                    Dashboard
                  </button>
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-lg bg-red-500/20 text-red-500 hover:bg-red-500/30 transition-all"
                >
                  <LogOut className="inline mr-1" size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <button className="px-4 py-2 rounded-lg border border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-all">
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
            className="md:hidden text-orange-500"
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
              <Link href="/studio" className="block text-gray-300 hover:text-orange-500 py-2">
                Studio
              </Link>
              <Link href="/gallery" className="block text-gray-300 hover:text-orange-500 py-2">
                Gallery
              </Link>
              <Link href="/pricing" className="block text-gray-300 hover:text-orange-500 py-2">
                Pricing
              </Link>
              <Link href="/about" className="block text-gray-300 hover:text-orange-500 py-2">
                About
              </Link>
              
              {user ? (
                <>
                  <Link href="/dashboard" className="block py-2">
                    <button className="w-full px-4 py-2 rounded-lg border border-orange-500 text-orange-500">
                      Dashboard
                    </button>
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full px-4 py-2 rounded-lg bg-red-500/20 text-red-500"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="block">
                    <button className="w-full px-4 py-2 rounded-lg border border-orange-500 text-orange-500">
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
