// Global Type Definitions for SpookySketch

export type UserTier = 'free' | 'pro' | 'vip' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  tier: UserTier;
  avatar: string;
  createdAt?: string;
  isAdmin?: boolean;
}

export interface Drawing {
  _id?: string;
  id?: string;
  title: string;
  thumbnail: string;
  likes: number;
  views: number;
  createdAt: string;
  updatedAt?: string;
  isPublic?: boolean;
  userId?: string | {
    _id: string;
    username: string;
    avatar: string;
  };
}

export interface Stats {
  drawingCount: number;
  publicDrawings: number;
  totalLikes: number;
  totalViews: number;
}

export interface DashboardProps {
  user: User;
  drawings: Drawing[];
  stats: Stats | null;
  onDelete: (id: string) => void;
  onUpdate?: () => void;
}

export interface AnalyticsData {
  totalUsers: number;
  totalDrawings: number;
  publicDrawings: number;
  tierDistribution: {
    vip: number;
    pro: number;
    free: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    timestamp: string;
  }>;
}

export interface AppSettings {
  siteName: string;
  maintenanceMode: boolean;
  allowSignups: boolean;
  maxFreeDrawings: number;
  maxProDrawings: number;
  maxVipDrawings: number;
  enableGallery: boolean;
  enableComments: boolean;
}

export type Tool = 'brush' | 'eraser' | 'line' | 'circle' | 'rectangle' | 'ghost' | 'pumpkin' | 'fill' | 'eyedropper' | 'spray';
