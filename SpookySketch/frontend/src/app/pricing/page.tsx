'use client';

import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Crown, Star, Heart, Palette, Image } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function PricingPage() {
  const features = [
    'Unlimited Drawings',
    'All Drawing Tools',
    'Cloud Storage',
    'Public Gallery Access',
    'Full Canvas Features',
    'Export in Multiple Formats',
    'No Watermarks',
    'Community Features',
    'Real-time Autosave',
    'Unlimited Layers',
    'Advanced Brush Settings',
    'Color Palettes'
  ];

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  const sparkleAnimation = (delay: number) => ({
    scale: [1, 1.5, 1],
    opacity: [0.5, 1, 0.5],
    rotate: [0, 180, 360],
    transition: {
      duration: 2,
      repeat: Infinity,
      delay
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900">
      <Navbar />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <motion.div
              animate={floatingAnimation}
              className="mb-6"
            >
              <div className="relative inline-block">
                <motion.div
                  animate={{
                    rotate: 360,
                  }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 blur-3xl opacity-50"
                >
                  <div className="w-32 h-32 mx-auto bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 rounded-full" />
                </motion.div>
                <Sparkles className="w-24 h-24 text-yellow-400 mx-auto relative z-10" />
              </div>
            </motion.div>

            <motion.h1
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-6xl md:text-7xl font-bold mb-6"
            >
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
                100% FREE
              </span>
            </motion.h1>

            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Everything. Unlimited. Forever.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mb-8"
            >
              No tiers, no limits, no hidden fees. Every single feature is available to everyone, completely free!
            </motion.p>

            {/* Animated badges */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {['No Credit Card', 'No Signup Fees', 'Unlimited Access', 'Always Free'].map((badge, i) => (
                <motion.span
                  key={badge}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                  whileHover={{ scale: 1.1, y: -5 }}
                  className="px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-2 border-green-500/50 rounded-full text-green-300 font-semibold"
                >
                  ✓ {badge}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Main Free Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative max-w-4xl mx-auto"
          >
            {/* Animated background glow */}
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 blur-3xl opacity-30 rounded-3xl"
            />

            {/* Sparkles around card */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                animate={sparkleAnimation(i * 0.2)}
                className="absolute"
                style={{
                  top: `${20 + Math.sin(i * Math.PI / 4) * 40}%`,
                  left: `${50 + Math.cos(i * Math.PI / 4) * 45}%`,
                }}
              >
                <Star className="text-yellow-400" size={20} />
              </motion.div>
            ))}

            <div className="relative spooky-card border-4 border-purple-500/60 hover:border-purple-400 transition-all overflow-hidden">
              {/* Animated gradient overlay */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent"
                style={{ backgroundSize: "200% 200%" }}
              />

              <div className="relative z-10 p-12">
                {/* Header */}
                <div className="text-center mb-12">
                  <motion.div
                    animate={{
                      rotate: [0, 10, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                    }}
                    className="inline-block mb-4"
                  >
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto" />
                  </motion.div>

                  <h3 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    The Only Plan You Need
                  </h3>

                  <div className="flex items-center justify-center gap-3 mb-2">
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400"
                    >
                      $0
                    </motion.span>
                    <span className="text-2xl text-gray-400">/month</span>
                  </div>

                  <p className="text-lg text-gray-300">
                    <strong className="text-green-400">Forever Free</strong> - No catches, no tricks!
                  </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-12">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.05 }}
                      whileHover={{ scale: 1.05, x: 5 }}
                      className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg hover:bg-green-500/20 transition-all"
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <Check className="text-green-400 flex-shrink-0" size={24} />
                      </motion.div>
                      <span className="text-white font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(168, 85, 247, 0.6)" }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-all shadow-lg shadow-purple-500/50"
                    >
                      <Sparkles className="inline mr-2" size={20} />
                      Get Started Free
                    </motion.button>
                  </Link>

                  <Link href="/gallery">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full sm:w-auto px-8 py-4 border-2 border-purple-500 text-purple-300 rounded-xl font-bold text-lg hover:bg-purple-500/20 transition-all"
                    >
                      <Palette className="inline mr-2" size={20} />
                      Explore Gallery
                    </motion.button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Why Free Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-20 text-center max-w-3xl mx-auto"
          >
            <motion.div
              animate={floatingAnimation}
              className="mb-6"
            >
              <Heart className="w-16 h-16 text-pink-400 mx-auto" />
            </motion.div>

            <h2 className="text-3xl font-bold text-white mb-4">Why Is Everything Free?</h2>
            <p className="text-lg text-gray-300 mb-6">
              We believe creativity should be accessible to everyone. No paywalls, no premium features, 
              no limitations. SpookySketch is built for artists, by artists, with love and passion. ❤️
            </p>

            <div className="grid md:grid-cols-3 gap-6 mt-10">
              {[
                { icon: Palette, title: 'For Artists', desc: 'Made by creators for creators' },
                { icon: Heart, title: 'Community First', desc: 'Built with love, not profit' },
                { icon: Zap, title: 'No Barriers', desc: 'Everyone deserves great tools' },
              ].map((item, i) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1 }}
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="spooky-card p-6 text-center hover:border-purple-500/50 transition-all"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <item.icon className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
