import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import Drawing from '../models/Drawing';
import { authenticate, AuthRequest } from '../middleware/auth';
import { mockDrawingsDB } from '../mockDrawings';
import mongoose from 'mongoose';

const router = express.Router();
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Get user profile
router.get('/profile', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user!;
    const drawingCount = await Drawing.countDocuments({ userId: user._id });

    res.json({
      profile: {
        id: user._id,
        username: user.username,
        email: user.email,
        tier: user.tier,
        avatar: user.avatar,
        createdAt: user.createdAt,
        drawingCount,
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put(
  '/profile',
  authenticate,
  [
    body('username').optional().trim().isLength({ min: 3, max: 30 }),
    body('avatar').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId!;
      const { username, avatar } = req.body;

      const updates: any = {};
      if (username) updates.username = username;
      if (avatar) updates.avatar = avatar;

      // Check if username is taken
      if (username) {
        const existing = await User.findOne({ username, _id: { $ne: userId } });
        if (existing) {
          return res.status(400).json({ error: 'Username already taken' });
        }
      }

      const user = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true });

      res.json({
        message: 'Profile updated successfully',
        user: {
          id: user?._id,
          username: user?.username,
          email: user?.email,
          tier: user?.tier,
          avatar: user?.avatar,
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }
);

// Get user stats
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;

    if (isMongoConnected()) {
      const drawingCount = await Drawing.countDocuments({ userId });
      const publicDrawings = await Drawing.countDocuments({ userId, isPublic: true });
      const totalLikes = await Drawing.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: null, total: { $sum: '$likes' } } },
      ]);
      const totalViews = await Drawing.aggregate([
        { $match: { userId: userId } },
        { $group: { _id: null, total: { $sum: '$views' } } },
      ]);

      res.json({
        stats: {
          drawingCount,
          publicDrawings,
          totalLikes: totalLikes[0]?.total || 0,
          totalViews: totalViews[0]?.total || 0,
        },
      });
    } else {
      const stats = await mockDrawingsDB.getStats(userId);
      res.json({ stats });
    }
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;
