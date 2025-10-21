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

// Admin: Delete any public drawing
router.delete('/drawings/:drawingId', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { drawingId } = req.params;

    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const drawing = await Drawing.findByIdAndDelete(drawingId);

    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    res.json({
      message: 'Drawing deleted successfully',
    });
  } catch (error) {
    console.error('Admin delete drawing error:', error);
    res.status(500).json({ error: 'Failed to delete drawing' });
  }
});

// Admin: Update drawing visibility (make public/private)
router.patch('/drawings/:drawingId/visibility', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { drawingId } = req.params;
    const { isPublic } = req.body;

    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({ error: 'isPublic must be a boolean' });
    }

    const drawing = await Drawing.findByIdAndUpdate(
      drawingId,
      { isPublic },
      { new: true }
    );

    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    res.json({
      message: `Drawing is now ${isPublic ? 'public' : 'private'}`,
      drawing: {
        _id: drawing._id,
        isPublic: drawing.isPublic,
      },
    });
  } catch (error) {
    console.error('Admin update visibility error:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

// Admin: Manually adjust likes on any drawing
router.patch('/drawings/:drawingId/likes', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { drawingId } = req.params;
    const { likes } = req.body;

    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (typeof likes !== 'number' || likes < 0) {
      return res.status(400).json({ error: 'Likes must be a non-negative number' });
    }

    const drawing = await Drawing.findByIdAndUpdate(
      drawingId,
      { likes },
      { new: true }
    );

    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    res.json({
      message: 'Likes updated successfully',
      drawing: {
        _id: drawing._id,
        likes: drawing.likes,
      },
    });
  } catch (error) {
    console.error('Admin update likes error:', error);
    res.status(500).json({ error: 'Failed to update likes' });
  }
});

// Admin: Reset views on any drawing
router.patch('/drawings/:drawingId/views', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { drawingId } = req.params;
    const { views } = req.body;

    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    if (typeof views !== 'number' || views < 0) {
      return res.status(400).json({ error: 'Views must be a non-negative number' });
    }

    const drawing = await Drawing.findByIdAndUpdate(
      drawingId,
      { views },
      { new: true }
    );

    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    res.json({
      message: 'Views updated successfully',
      drawing: {
        _id: drawing._id,
        views: drawing.views,
      },
    });
  } catch (error) {
    console.error('Admin update views error:', error);
    res.status(500).json({ error: 'Failed to update views' });
  }
});

// Admin: Create VIP accounts (for deployment)
router.post('/create-vip-accounts', authenticate, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected()) {
      return res.status(503).json({ error: 'Database not connected' });
    }

    const vipAccounts = [
      {
        username: 'Janet',
        email: 'ronet@gmail.com',
        password: 'janet',
        tier: 'vip',
        avatar: '👑'
      },
      {
        username: 'Nicky23',
        email: 'nicky23@gmail.com',
        password: 'maina',
        tier: 'vip',
        avatar: '💎'
      }
    ];

    const results = [];

    for (const account of vipAccounts) {
      // Check if user already exists
      const existingUser = await User.findOne({
        $or: [
          { email: account.email },
          { username: account.username }
        ]
      });

      if (existingUser) {
        // Update to VIP if not already
        if (existingUser.tier !== 'vip') {
          existingUser.tier = 'vip';
          await existingUser.save();
          results.push({
            email: account.email,
            username: account.username,
            status: 'updated_to_vip',
            message: 'Existing user upgraded to VIP'
          });
        } else {
          results.push({
            email: account.email,
            username: account.username,
            status: 'already_vip',
            message: 'User already has VIP tier'
          });
        }
      } else {
        // Create new VIP user
        const newUser = new User({
          username: account.username,
          email: account.email,
          password: account.password, // Will be hashed by pre-save hook
          tier: account.tier,
          avatar: account.avatar,
          isAdmin: false
        });

        await newUser.save();
        results.push({
          email: account.email,
          username: account.username,
          status: 'created',
          message: 'VIP account created successfully'
        });
      }
    }

    res.json({
      message: 'VIP accounts processed successfully',
      results,
      summary: {
        total: results.length,
        created: results.filter(r => r.status === 'created').length,
        updated: results.filter(r => r.status === 'updated_to_vip').length,
        existing: results.filter(r => r.status === 'already_vip').length
      }
    });
  } catch (error: any) {
    console.error('Create VIP accounts error:', error);
    res.status(500).json({ error: error.message || 'Failed to create VIP accounts' });
  }
});

export default router;
