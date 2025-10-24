'use client';

import { motion } from 'framer-motion';
import { Code, Heart, Sparkles, Palette, Github, Mail, Trophy } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <motion.h1 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text text-transparent"
            >
              About SpookySketch 🎃
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
            >
              A professional drawing platform built with passion and creativity
            </motion.p>
          </motion.div>

          {/* Mission Statement */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="spooky-card mb-8 bg-gradient-to-r from-purple-900/20 to-orange-900/20 border-2 border-purple-500/50"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Sparkles className="text-purple-500" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-3 text-purple-400">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  SpookySketch is designed to provide artists of all skill levels with a powerful, 
                  intuitive digital drawing platform. We believe that creativity should be accessible 
                  to everyone, which is why we offer a feature-rich free tier alongside premium options 
                  for professionals who need advanced capabilities.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-6 text-center">Platform Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard
                icon={<Palette />}
                title="Professional Drawing Tools"
                description="Multiple brush types, layers, custom colors, and advanced canvas controls for creating stunning artwork."
              />
              <FeatureCard
                icon={<Sparkles />}
                title="Tier-Based Access"
                description="Free, Pro, VIP, and Admin tiers with increasing features and storage limits tailored to your needs."
              />
              <FeatureCard
                icon={<Heart />}
                title="Community Gallery"
                description="Share your public drawings with the community, gain likes and views, and discover amazing art from others."
              />
              <FeatureCard
                icon={<Trophy />}
                title="Real-Time Collaboration"
                description="Save your work securely, edit across devices, and showcase your best creations to the world."
              />
            </div>
          </motion.div>

          {/* Developer & Inspiration Section - Side by Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-orange-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Meet the Team ✨
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Jay - Developer */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="spooky-card bg-gradient-to-br from-orange-900/30 to-red-900/20 border-2 border-orange-500/50 hover:border-orange-400/70 hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300"
              >
                <div className="text-center mb-4">
                  <motion.div 
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block p-4 bg-orange-500/20 rounded-full mb-3"
                  >
                    <Code className="text-orange-400" size={40} />
                  </motion.div>
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-2"
                  >
                    👨‍💻
                  </motion.div>
                </div>

                <div className="text-center">
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-3xl font-bold mb-2 text-orange-300"
                  >
                    Jayden Mbaria
                  </motion.h3>
                  <p className="text-lg text-purple-400 mb-4">Owner • Founder • Developer</p>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Full-stack developer with a passion for creating beautiful, functional web applications. 
                    Built SpookySketch from scratch using cutting-edge technologies to deliver an amazing drawing experience.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm border border-blue-500/50"
                    >
                      Next.js
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm border border-purple-500/50"
                    >
                      TypeScript
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm border border-green-500/50"
                    >
                      MongoDB
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      className="px-3 py-1 bg-orange-500/20 text-orange-300 rounded-full text-sm border border-orange-500/50"
                    >
                      Node.js
                    </motion.span>
                  </div>
                </div>
              </motion.div>

              {/* Steff - Inspiration */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="spooky-card bg-gradient-to-br from-pink-900/40 to-purple-900/30 border-2 border-pink-500/60 hover:border-pink-400/80 hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300 relative overflow-hidden"
              >
                {/* Floating hearts background */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        y: [-20, -100],
                        opacity: [0, 0.6, 0],
                        x: [0, (i - 2) * 20]
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        delay: i * 0.8,
                        ease: "easeOut"
                      }}
                      className="absolute bottom-0 text-2xl"
                      style={{ left: `${20 + i * 15}%` }}
                    >
                      ❤️
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mb-4 relative z-10">
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.2, 1],
                      rotate: [0, -5, 5, 0]
                    }}
                    transition={{ 
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="inline-block p-4 bg-pink-500/30 rounded-full mb-3 shadow-lg shadow-pink-500/30"
                  >
                    <Heart className="text-pink-300" size={40} fill="currentColor" />
                  </motion.div>
                  <motion.div 
                    animate={{ 
                      scale: [1, 1.15, 1],
                      rotate: [0, 10, -10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="text-7xl mb-2"
                  >
                    💝
                  </motion.div>
                </div>

                <div className="text-center relative z-10">
                  <motion.h3 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-3xl font-bold mb-2 text-pink-300"
                  >
                    Steff ✨
                  </motion.h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="text-lg text-purple-300 mb-4 font-medium"
                  >
                    Girlfriend • Muse • Biggest Supporter
                  </motion.p>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.9 }}
                    className="text-gray-200 mb-6 leading-relaxed"
                  >
                    My beautiful girlfriend and the heart behind this project. Her endless love, unwavering belief, 
                    and constant encouragement turned late nights into magical moments. Every line of code carries 
                    her inspiration. She's my rock, my joy, and the reason I push harder every day. This project 
                    exists because of her light in my life. Forever grateful for you, my love. 💖
                  </motion.p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      animate={{ 
                        boxShadow: ["0 0 0px rgba(236, 72, 153, 0)", "0 0 20px rgba(236, 72, 153, 0.3)", "0 0 0px rgba(236, 72, 153, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="px-3 py-1 bg-pink-500/30 text-pink-200 rounded-full text-sm border border-pink-400/60 font-medium"
                    >
                      💕 True Love
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      animate={{ 
                        boxShadow: ["0 0 0px rgba(168, 85, 247, 0)", "0 0 20px rgba(168, 85, 247, 0.3)", "0 0 0px rgba(168, 85, 247, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      className="px-3 py-1 bg-purple-500/30 text-purple-200 rounded-full text-sm border border-purple-400/60 font-medium"
                    >
                      ✨ Inspiration
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      animate={{ 
                        boxShadow: ["0 0 0px rgba(239, 68, 68, 0)", "0 0 20px rgba(239, 68, 68, 0.3)", "0 0 0px rgba(239, 68, 68, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                      className="px-3 py-1 bg-red-500/30 text-red-200 rounded-full text-sm border border-red-400/60 font-medium"
                    >
                      ❤️ Forever
                    </motion.span>
                    <motion.span 
                      whileHover={{ scale: 1.15, y: -3 }}
                      animate={{ 
                        boxShadow: ["0 0 0px rgba(251, 146, 60, 0)", "0 0 20px rgba(251, 146, 60, 0.3)", "0 0 0px rgba(251, 146, 60, 0)"]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.9 }}
                      className="px-3 py-1 bg-orange-500/30 text-orange-200 rounded-full text-sm border border-orange-400/60 font-medium"
                    >
                      🌟 My Everything
                    </motion.span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Technology Stack */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="spooky-card mb-8"
          >
            <h2 className="text-2xl font-bold mb-6 text-center">Built With Modern Technology</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <TechBadge name="Next.js 14" color="from-blue-500 to-cyan-500" />
              <TechBadge name="React 18" color="from-cyan-500 to-blue-500" />
              <TechBadge name="TypeScript" color="from-blue-600 to-purple-600" />
              <TechBadge name="Node.js" color="from-green-600 to-emerald-600" />
              <TechBadge name="MongoDB" color="from-green-500 to-teal-500" />
              <TechBadge name="Express" color="from-gray-600 to-gray-700" />
              <TechBadge name="Socket.IO" color="from-purple-500 to-pink-500" />
              <TechBadge name="TailwindCSS" color="from-cyan-400 to-blue-500" />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
          >
            <StatCard label="Lines of Code" value="10,000+" />
            <StatCard label="Components" value="50+" />
            <StatCard label="Features" value="30+" />
            <StatCard label="Hours Built" value="200+" />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="text-center spooky-card bg-gradient-to-r from-orange-900/30 via-purple-900/30 to-pink-900/30 border-2 border-purple-500/60 hover:border-purple-500/80 hover:shadow-2xl hover:shadow-purple-500/30 transition-all"
          >
            <h2 className="text-3xl font-bold mb-4">Start Creating Today! 🎨</h2>
            <p className="text-gray-300 mb-6">
              Join our community of artists and bring your imagination to life
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-purple-500 text-white hover:from-orange-600 hover:to-purple-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold text-lg"
                >
                  Sign Up Free
                </motion.button>
              </Link>
              <Link href="/gallery">
                <motion.button 
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-lg border-2 border-purple-500 text-purple-400 hover:bg-purple-500/20 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/50 transition-all font-semibold text-lg"
                >
                  Explore Gallery
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.05, y: -8 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
      className="spooky-card bg-gradient-to-br from-purple-900/20 to-transparent hover:border-purple-500/60 hover:shadow-lg hover:shadow-purple-500/20 transition-all cursor-pointer"
    >
      <div className="flex items-start gap-4">
        <motion.div 
          whileHover={{ rotate: 360, scale: 1.2 }}
          transition={{ duration: 0.5 }}
          className="p-3 bg-purple-500/20 rounded-lg text-purple-400"
        >
          {icon}
        </motion.div>
        <div>
          <h3 className="text-xl font-bold mb-2 text-purple-200">{title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function TechBadge({ name, color }: { name: string; color: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1, y: -5 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className={`text-center p-4 rounded-lg bg-gradient-to-r ${color} bg-opacity-10 border border-white/10 hover:border-white/40 hover:shadow-lg transition-all cursor-pointer`}
    >
      <span className="font-semibold text-white">{name}</span>
    </motion.div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.1, y: -10 }}
      transition={{ type: "spring", stiffness: 300, damping: 15 }}
      className="spooky-card text-center border-purple-500/30 bg-gradient-to-br from-purple-900/20 to-pink-900/10 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/30 cursor-pointer"
    >
      <motion.div 
        initial={{ scale: 1 }}
        whileHover={{ scale: 1.2 }}
        className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2"
      >
        {value}
      </motion.div>
      <div className="text-sm text-gray-300 font-medium">{label}</div>
    </motion.div>
  );
}
