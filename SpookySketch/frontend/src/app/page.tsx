'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Brush, Ghost, Sparkles, Users, Crown, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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
          <motion.div
            className="absolute top-20 left-10 text-6xl opacity-10"
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🎃
          </motion.div>
          <motion.div
            className="absolute top-40 right-20 text-5xl opacity-10"
            animate={{ y: [0, 20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            👻
          </motion.div>
          <motion.div
            className="absolute bottom-20 left-1/4 text-4xl opacity-10"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            🕷️
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-purple-500 to-orange-500 bg-clip-text text-transparent">
              SpookySketch
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Unleash your creativity with our Halloween-themed drawing app.
              Create, collaborate, and share spooky masterpieces! 🎃👻
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/studio">
                <button className="spooky-btn text-white text-lg px-8 py-4">
                  <Brush className="inline mr-2" size={24} />
                  Start Drawing
                </button>
              </Link>
              <Link href="/pricing">
                <button className="px-8 py-4 rounded-lg font-semibold text-lg border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-all">
                  View Pricing
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-orange-500">
            Spooky Features 🕸️
          </h2>
          
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
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Spooky? 🎃
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of artists creating Halloween masterpieces
            </p>
            <Link href="/signup">
              <button className="spooky-btn text-white text-lg px-10 py-4">
                Sign Up Free
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-orange-500/20 py-8 px-4 text-center text-gray-400">
        <p>© 2024 SpookySketch. All rights reserved. Made with 🎃 and 💜</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      className="spooky-card text-center hover:scale-105 transition-transform"
      whileHover={{ y: -5 }}
    >
      <div className="text-orange-500 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}
