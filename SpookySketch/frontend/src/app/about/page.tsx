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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              About SpookySketch 🎃
            </h1>
            <p className="text-xl text-gray-400">
              A professional drawing platform built with passion and creativity
            </p>
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

          {/* Developer Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="spooky-card mb-8 bg-gradient-to-r from-orange-900/20 to-red-900/20 border-2 border-orange-500/50"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-orange-500/20 rounded-full">
                  <Code className="text-orange-500" size={48} />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">Meet the Developer</h2>
            </div>

            <div className="bg-spooky-bg rounded-xl p-6 border border-orange-500/30">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-6xl">👨‍💻</div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 text-orange-400">Jayden Mbaria</h3>
                  <p className="text-lg text-purple-400 mb-3">Owner • Founder • Developer</p>
                  <p className="text-gray-300 mb-4">
                    Full-stack developer passionate about creating beautiful, functional web applications. 
                    Built SpookySketch from the ground up using modern technologies including Next.js, 
                    React, TypeScript, Node.js, MongoDB, and real-time collaboration features.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/50">
                      Next.js
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/50">
                      TypeScript
                    </span>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/50">
                      MongoDB
                    </span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/50">
                      Node.js
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Special Thanks - Steff */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="spooky-card mb-8 bg-gradient-to-r from-pink-900/20 to-purple-900/20 border-2 border-pink-500/50"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-pink-500/20 rounded-full">
                  <Heart className="text-pink-500" size={48} />
                </div>
              </div>
              <h2 className="text-3xl font-bold mb-2">Special Thanks</h2>
            </div>

            <div className="bg-spooky-bg rounded-xl p-6 border border-pink-500/30">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="text-6xl">💝</div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-2 text-pink-400">Steff</h3>
                  <p className="text-lg text-purple-400 mb-3">Wife • Inspiration • Biggest Supporter</p>
                  <p className="text-gray-300 mb-4">
                    My beloved wife and the driving force behind this project. Her unwavering support, 
                    encouragement, and belief in me made SpookySketch possible. Through countless late 
                    nights of coding and debugging, she was always there with motivation, love, and understanding. 
                    This project is as much hers as it is mine. Thank you for being my rock and my inspiration. ❤️
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    <span className="px-3 py-1 bg-pink-500/20 text-pink-400 rounded-full text-sm border border-pink-500/50">
                      💕 Motivation
                    </span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm border border-purple-500/50">
                      ✨ Inspiration
                    </span>
                    <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/50">
                      ❤️ Love
                    </span>
                    <span className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm border border-orange-500/50">
                      🌟 Support
                    </span>
                  </div>
                </div>
              </div>
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-center spooky-card bg-gradient-to-r from-orange-900/20 via-purple-900/20 to-pink-900/20 border-2 border-purple-500/50"
          >
            <h2 className="text-3xl font-bold mb-4">Start Creating Today! 🎨</h2>
            <p className="text-gray-300 mb-6">
              Join our community of artists and bring your imagination to life
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/signup">
                <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-purple-500 text-white hover:from-orange-600 hover:to-purple-600 transition-all font-semibold text-lg">
                  Sign Up Free
                </button>
              </Link>
              <Link href="/gallery">
                <button className="px-8 py-4 rounded-lg border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10 transition-all font-semibold text-lg">
                  Explore Gallery
                </button>
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
      whileHover={{ scale: 1.02, y: -5 }}
      className="spooky-card bg-gradient-to-br from-purple-900/10 to-transparent hover:border-purple-500/50 transition-all"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-bold mb-2">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
      </div>
    </motion.div>
  );
}

function TechBadge({ name, color }: { name: string; color: string }) {
  return (
    <div className={`text-center p-4 rounded-lg bg-gradient-to-r ${color} bg-opacity-10 border border-white/10 hover:border-white/30 transition-all`}>
      <span className="font-semibold text-white">{name}</span>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="spooky-card text-center border-purple-500/30 bg-purple-900/10"
    >
      <div className="text-3xl font-bold text-purple-400 mb-1">{value}</div>
      <div className="text-sm text-gray-400">{label}</div>
    </motion.div>
  );
}
