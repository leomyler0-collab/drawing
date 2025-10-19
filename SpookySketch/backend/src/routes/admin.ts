import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Drawing from '../models/Drawing';
import { authenticate, requireAdmin, AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Get all users (Admin only)
router.get('/users', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoConnected()) {
      const users = await User.find({}, '-password').sort({ createdAt: -1 });
      
      res.json({
        users: users.map(user => ({
          id: user._id,
          username: user.username,
          email: user.email,
          tier: user.tier,
          avatar: user.avatar,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        })),
      });
    } else {
      res.json({ users: [] });
    }
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get single user details
router.get('/users/:userId', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const user = await User.findById(userId, '-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const drawingCount = await Drawing.countDocuments({ userId: user._id });

    res.json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        drawingCount,
      },
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Update user tier
router.put('/users/:userId/tier', authenticate, requireAdmin, 
  [body('tier').isIn(['free', 'pro', 'vip', 'admin'])],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { userId } = req.params;
      const { tier } = req.body;

      if (!isMongoConnected()) {
        return res.status(503).json({ error: 'Database not connected' });
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { tier },
        { new: true, select: '-password' }
      );

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        message: 'User tier updated successfully',
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          tier: user.tier,
          avatar: user.avatar,
        },
      });
    } catch (error) {
      console.error('Update user tier error:', error);
      res.status(500).json({ error: 'Failed to update user tier' });
    }
  }
);

// Delete user
router.delete('/users/:userId', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { userId } = req.params;

    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deleting admin users
    if (user.tier === 'admin') {
      return res.status(403).json({ error: 'Cannot delete admin users' });
    }

    // Delete user's drawings
    await Drawing.deleteMany({ userId: user._id });

    // Delete user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Get system analytics
router.get('/analytics', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.json({
        analytics: {
          totalUsers: 0,
          totalDrawings: 0,
          totalViews: 0,
          totalLikes: 0,
          tierDistribution: { admin: 0, vip: 0, pro: 0, free: 0 },
          recentActivity: [],
        },
      });
    }

    const totalUsers = await User.countDocuments();
    const totalDrawings = await Drawing.countDocuments();

    const tierDistribution = await User.aggregate([
      { $group: { _id: '$tier', count: { $sum: 1 } } },
    ]);

    const tierCounts = {
      admin: 0,
      vip: 0,
      pro: 0,
      free: 0,
    };

    tierDistribution.forEach((item) => {
      if (item._id in tierCounts) {
        tierCounts[item._id as keyof typeof tierCounts] = item.count;
      }
    });

    const viewsAndLikes = await Drawing.aggregate([
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: '$likes' },
        },
      },
    ]);

    const recentDrawings = await Drawing.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('userId', 'username')
      .lean();

    const recentActivity = recentDrawings.map((drawing: any) => ({
      type: 'drawing',
      title: drawing.title,
      time: drawing.createdAt,
      user: drawing.userId?.username || 'Unknown',
    }));

    res.json({
      analytics: {
        totalUsers,
        totalDrawings,
        totalViews: viewsAndLikes[0]?.totalViews || 0,
        totalLikes: viewsAndLikes[0]?.totalLikes || 0,
        tierDistribution: tierCounts,
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get all drawings (Admin only)
router.get('/drawings', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.json({ drawings: [] });
    }

    const drawings = await Drawing.find()
      .sort({ createdAt: -1 })
      .populate('userId', 'username email')
      .limit(100);

    res.json({
      drawings: drawings.map((drawing: any) => ({
        id: drawing._id,
        title: drawing.title,
        thumbnail: drawing.thumbnail,
        width: drawing.width,
        height: drawing.height,
        likes: drawing.likes,
        views: drawing.views,
        isPublic: drawing.isPublic,
        createdAt: drawing.createdAt,
        user: {
          id: drawing.userId._id,
          username: drawing.userId.username,
          email: drawing.userId.email,
        },
      })),
    });
  } catch (error) {
    console.error('Get all drawings error:', error);
    res.status(500).json({ error: 'Failed to fetch drawings' });
  }
});

// Get system settings
router.get('/settings', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    // In a real app, these would be stored in a database
    const settings = {
      siteName: process.env.SITE_NAME || 'SpookySketch',
      siteDescription: 'Professional drawing and sketching platform',
      allowSignup: true,
      maintenanceMode: false,
      maxDrawingsPerUser: 1000,
      maxFileSize: 10,
      enableNotifications: true,
      enableAnalytics: true,
      sessionTimeout: 30,
      passwordMinLength: 6,
      requireEmailVerification: false,
      twoFactorAuth: false,
      autoBackup: true,
      backupFrequency: 'daily',
    };

    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Update system settings
router.put('/settings', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const settings = req.body;
    
    // In a real app, save to database or config file
    // For now, just acknowledge the update
    
    res.json({
      message: 'Settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
