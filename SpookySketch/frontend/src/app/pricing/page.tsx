'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Check, Sparkles, Crown, Zap } from 'lucide-react';
import Navbar from '@/components/Navbar';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function PricingPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpgrade = async (tier: 'pro' | 'vip') => {
    if (!user) {
      toast.error('Please login first');
      return;
    }

    // Admin already has full access
    if (user.tier === 'admin') {
      toast.success('You already have full access as an admin! 🛡️');
      return;
    }

    setLoading(tier);

    try {
      const token = Cookies.get('token');
      const response = await axios.post(
        `${API_URL}/api/subscription/create-checkout-session`,
        { tier },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to create checkout session');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-purple-500 bg-clip-text text-transparent">
                Choose Your Plan 🎃
              </h1>
              <p className="text-xl text-gray-400">
                Unlock your full creative potential with our premium tiers
              </p>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Tier */}
            <PricingCard
              title="Free"
              price="$0"
              period="forever"
              icon={<Sparkles size={40} />}
              features={[
                '1 saved drawing',
                'Basic brushes',
                'Standard canvas',
                'Export as PNG',
                'Community gallery access',
              ]}
              buttonText="Current Plan"
              buttonDisabled={user?.tier === 'free'}
              popular={false}
            />

            {/* Pro Tier */}
            <PricingCard
              title="Pro"
              price="$4.99"
              period="/month"
              icon={<Zap size={40} />}
              features={[
                '50 saved drawings',
                'Advanced brushes & tools',
                'Layer system',
                'Cloud storage',
                'Export as PNG, JPEG, SVG',
                'Priority support',
                'No watermarks',
              ]}
              buttonText={
                user?.tier === 'admin' ? 'Admin Has Full Access ✓' :
                user?.tier === 'pro' ? 'Current Plan' : 
                'Upgrade to Pro'
              }
              buttonDisabled={user?.tier === 'pro' || user?.tier === 'admin' || user?.tier === 'vip'}
              buttonAction={() => handleUpgrade('pro')}
              loading={loading === 'pro'}
              popular={true}
            />

            {/* VIP Tier */}
            <PricingCard
              title="VIP"
              price="$9.99"
              period="/month"
              icon={<Crown size={40} />}
              features={[
                'Unlimited drawings',
                'All Pro features',
                'Special Halloween brushes',
                'Real-time collaboration',
                'Priority server access',
                'Early access to new features',
                'VIP badge',
                'Exclusive templates',
              ]}
              buttonText={
                user?.tier === 'admin' ? 'Admin Has Full Access ✓' :
                user?.tier === 'vip' ? 'Current Plan' : 
                'Upgrade to VIP'
              }
              buttonDisabled={user?.tier === 'vip' || user?.tier === 'admin'}
              buttonAction={() => handleUpgrade('vip')}
              loading={loading === 'vip'}
              popular={false}
              gradient={true}
            />
          </div>

          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-10 text-orange-500">
              Frequently Asked Questions 👻
            </h2>
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <FAQItem
                question="Can I cancel anytime?"
                answer="Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period."
              />
              <FAQItem
                question="Do you offer refunds?"
                answer="We offer a 7-day money-back guarantee if you're not satisfied with your subscription."
              />
              <FAQItem
                question="Can I upgrade from Pro to VIP?"
                answer="Absolutely! You can upgrade at any time and only pay the prorated difference."
              />
              <FAQItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards through Stripe, including Visa, Mastercard, and American Express."
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PricingCard({
  title,
  price,
  period,
  icon,
  features,
  buttonText,
  buttonDisabled,
  buttonAction,
  loading,
  popular,
  gradient,
}: {
  title: string;
  price: string;
  period: string;
  icon: React.ReactNode;
  features: string[];
  buttonText: string;
  buttonDisabled?: boolean;
  buttonAction?: () => void;
  loading?: boolean;
  popular?: boolean;
  gradient?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      className={`spooky-card relative ${popular ? 'ring-2 ring-orange-500' : ''} ${
        gradient ? 'bg-gradient-to-br from-purple-900/20 to-orange-900/20' : ''
      }`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold">
          MOST POPULAR
        </div>
      )}

      <div className="text-center mb-6">
        <div className="text-orange-500 mb-3 flex justify-center">{icon}</div>
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <div className="text-4xl font-bold text-white mb-1">
          {price}
          <span className="text-lg text-gray-400">{period}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-2 text-gray-300">
            <Check size={20} className="text-orange-500 flex-shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={buttonAction}
        disabled={buttonDisabled || loading}
        className={`w-full spooky-btn ${
          buttonDisabled ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <div className="loading-spinner mr-2" style={{ width: 20, height: 20 }}></div>
            Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>
    </motion.div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="spooky-card">
      <h4 className="font-bold text-lg mb-2 text-orange-500">{question}</h4>
      <p className="text-gray-400">{answer}</p>
    </div>
  );
}
