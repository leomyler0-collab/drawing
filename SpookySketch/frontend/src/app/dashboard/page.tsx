'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { localDB } from '@/utils/localStorageDB';
import FreeDashboard from '@/components/dashboards/FreeDashboard';
import ProDashboard from '@/components/dashboards/ProDashboard';
import VipDashboard from '@/components/dashboards/VipDashboard';
import JanetVIPDashboard from '@/components/dashboards/JanetVIPDashboard';
import Nicky23VIPDashboard from '@/components/dashboards/Nicky23VIPDashboard';
import AdminDashboard from '@/components/dashboards/AdminDashboard';
import { clientAuth } from '@/utils/clientAuth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface Drawing {
  _id?: string;
  id?: string;
  title: string;
  thumbnail: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
}

interface Stats {
  drawingCount: number;
  publicDrawings: number;
  totalLikes: number;
  totalViews: number;
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    const token = Cookies.get('token');
    
    // Get user ID from clientAuth to filter drawings per user
    const currentUserId = clientAuth.getCurrentUserId();
    
    try {
      // Try backend first
      const [drawingsRes, statsRes] = await Promise.all([
        axios.get(`${API_URL}/api/drawings/list`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000,
        }),
        axios.get(`${API_URL}/api/user/stats`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 3000,
        }),
      ]);

      setDrawings(drawingsRes.data.drawings);
      setStats(statsRes.data.stats);
    } catch (error) {
      // Gracefully fallback to localStorage
      console.log('⚡ Backend unavailable, using local storage');
      
      // Filter drawings by current user
      const allLocalDrawings = localDB.getAllDrawings();
      const userDrawings = currentUserId 
        ? allLocalDrawings.filter(d => d.userId === currentUserId)
        : allLocalDrawings;
      
      const localDrawings = userDrawings.map(d => ({
        _id: d.id,
        id: d.id,
        title: d.title,
        thumbnail: d.thumbnail,
        likes: d.likes,
        views: d.views,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
        isPublic: d.isPublic || false,
      }));
      
      // Calculate stats for current user only
      const userStats = {
        total: userDrawings.length,
        public: userDrawings.filter(d => d.isPublic).length,
        totalLikes: userDrawings.reduce((sum, d) => sum + d.likes, 0),
        totalViews: userDrawings.reduce((sum, d) => sum + d.views, 0),
      };
      
      setDrawings(localDrawings);
      setStats({
        drawingCount: userStats.total,
        publicDrawings: userStats.public,
        totalLikes: userStats.totalLikes,
        totalViews: userStats.totalViews,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteDrawing = async (id: string) => {
    if (!confirm('Are you sure you want to delete this drawing?')) return;

    const token = Cookies.get('token');
    try {
      // Try backend first
      await axios.delete(`${API_URL}/api/drawings/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      });
      setDrawings(drawings.filter((d) => (d._id || d.id) !== id));
      toast.success('Drawing deleted');
    } catch (error) {
      // Fallback to localStorage
      console.log('⚡ Backend unavailable, deleting from local storage');
      const success = localDB.deleteDrawing(id);
      if (success) {
        setDrawings(drawings.filter((d) => (d._id || d.id) !== id));
        toast.success('Drawing deleted (local)');
        // Refresh data
        fetchData();
      } else {
        toast.error('Failed to delete drawing');
      }
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // Route to tier-specific dashboard
  const dashboardProps = {
    user,
    drawings,
    stats,
    onDelete: deleteDrawing,
    onUpdate: fetchData,
  };

  // Route to custom elite dashboards for special VIP users
  if (user.tier === 'vip') {
    // Janet gets her royal purple/pink dashboard
    if (user.email === 'ronet@gmail.com' || user.username === 'Janet') {
      return <JanetVIPDashboard {...dashboardProps} />;
    }
    // Nicky23 gets diamond cyan/pink dashboard
    if (user.email === 'nicky23@gmail.com' || user.username === 'Nicky23') {
      return <Nicky23VIPDashboard {...dashboardProps} />;
    }
    // Other VIPs get standard VIP dashboard
    return <VipDashboard {...dashboardProps} />;
  }

  switch (user.tier) {
    case 'admin':
      return <AdminDashboard {...dashboardProps} />;
    case 'pro':
      return <ProDashboard {...dashboardProps} />;
    case 'free':
    default:
      return <FreeDashboard {...dashboardProps} />;
  }
}
