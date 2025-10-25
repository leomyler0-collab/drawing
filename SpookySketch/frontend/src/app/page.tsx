'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brush, Ghost, Sparkles, Users, Crown, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeConfig } from '@/config/themes';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  const config = getThemeConfig(theme);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 pointer-events-none">
          {config.emojis.slice(0, 5).map((emoji, i) => (
            <motion.div
              key={`emoji-${i}`}
              className={`absolute text-${i < 2 ? '6xl' : '5xl'} opacity-20`}
              style={{
                top: `${10 + i * 15}%`,
                left: `${5 + i * 18}%`,
                filter: `drop-shadow(0 0 20px ${config.colors.primary}40)`,
              }}
              animate={{ 
                y: [0, -30, 0],
                x: [0, i % 2 === 0 ? 15 : -15, 0],
                rotate: [0, i * 45, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ 
                duration: 4 + i * 0.5, 
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.3,
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className={`text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r ${config.gradient.from} ${config.gradient.via} ${config.gradient.to} bg-clip-text text-transparent`}
              style={{ fontFamily: config.font.headingFamily }}
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {config.title}
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              style={{ color: config.colors.textSecondary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {config.subtitle}
            </motion.p>
            <motion.div 
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <Link href="/studio">
                <motion.button 
                  className="spooky-btn text-white text-lg px-8 py-4"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Brush className="inline mr-2" size={24} />
                  {config.buttonText}
                </motion.button>
              </Link>
              <Link href="/pricing">
                <motion.button 
                  className="px-8 py-4 rounded-lg font-semibold text-lg border-2 transition-all"
                  style={{
                    borderColor: config.colors.primary,
                    color: config.colors.primary,
                  }}
                  whileHover={{ scale: 1.05, y: -3, borderColor: config.colors.secondary }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Pricing
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-center mb-16"
            style={{ 
              color: config.colors.primary,
              fontFamily: config.font.headingFamily 
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            {theme === 'halloween' ? 'Spooky Features 🕸️' : theme === 'christmas' ? 'Festive Features 🎄' : 'Amazing Features ✨'}
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brush size={40} />}
              title="Advanced Tools"
              description="Professional drawing tools with Halloween-themed brushes, layers, and effects"
            />
            <FeatureCard
              icon={<Users size={40} />}
              title="Real-Time Collaboration"
              description="Draw together with friends in synchronized sessions"
            />
            <FeatureCard
              icon={<Sparkles size={40} />}
              title="Special Effects"
              description="Ghost trails, glowing brushes, and spooky animations"
            />
            <FeatureCard
              icon={<Ghost size={40} />}
              title="Cloud Storage"
              description="Save and access your drawings from anywhere"
            />
            <FeatureCard
              icon={<Crown size={40} />}
              title="Premium Tiers"
              description="Unlock Pro and VIP features for unlimited creativity"
            />
            <FeatureCard
              icon={<Zap size={40} />}
              title="Export & Share"
              description="Download as PNG, JPEG, or SVG. Share to the gallery"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              style={{ 
                color: config.colors.text,
                fontFamily: config.font.headingFamily 
              }}
            >
              {theme === 'halloween' ? 'Ready to Get Spooky? 🎃' : theme === 'christmas' ? 'Ready to Celebrate? 🎄' : 'Ready to Create? 🎆'}
            </motion.h2>
            <p className="text-xl mb-8" style={{ color: config.colors.textSecondary }}>
              {theme === 'halloween' ? 'Join thousands of artists creating spooky masterpieces' : theme === 'christmas' ? 'Join the festive community creating holiday magic' : 'Join the celebration and unleash your creativity'}
            </p>
            <Link href="/signup">
              <motion.button 
                className="spooky-btn text-white text-lg px-10 py-4"
                whileHover={{ scale: 1.08, y: -4 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up Free
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer 
        className="border-t py-8 px-4 text-center"
        style={{ 
          borderTopColor: `${config.colors.border}`,
          color: config.colors.textSecondary 
        }}
      >
        <p>© 2024 {config.title}. All rights reserved. Made with {config.emoji} and 💜</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  const { theme } = useTheme();
  const config = getThemeConfig(theme);
  
  return (
    <motion.div
      className="spooky-card text-center p-6 rounded-xl border"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ 
        y: -8,
        scale: 1.03,
        boxShadow: `0 12px 40px ${config.colors.primary}40`,
      }}
      transition={{ duration: 0.3 }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="mb-4 flex justify-center"
        style={{ color: config.colors.primary }}
        whileHover={{ rotate: 360, scale: 1.2 }}
        transition={{ duration: 0.5 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-xl font-bold mb-2" style={{ color: config.colors.text }}>{title}</h3>
      <p style={{ color: config.colors.textSecondary }}>{description}</p>
    </motion.div>
  );
}
