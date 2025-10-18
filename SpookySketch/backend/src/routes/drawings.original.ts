import express, { Response } from 'express';
import { body, validationResult } from 'express-validator';
import Drawing from '../models/Drawing';
import { authenticate, requireTier, AuthRequest } from '../middleware/auth';
import { mockDrawingsDB } from '../mockDrawings';
import mongoose from 'mongoose';

const router = express.Router();

const isMongoConnected = () => mongoose.connection.readyState === 1;

// Get drawing limits based on tier
const getDrawingLimit = (tier: string): number => {
  switch (tier) {
    case 'free':
      return 1;
    case 'pro':
      return 50;
    case 'vip':
      return -1; // unlimited
    default:
      return 1;
  }
};

// Create new drawing
router.post(
  '/create',
  authenticate,
  [
    body('title').trim().isLength({ min: 1, max: 100 }),
    body('canvasData').notEmpty(),
    body('width').isInt({ min: 1 }),
    body('height').isInt({ min: 1 }),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const userId = req.userId!;
      const user = req.user!;

      // Check drawing limit
      const limit = getDrawingLimit(user.tier);
      if (limit !== -1) {
        const count = await Drawing.countDocuments({ userId });
        if (count >= limit) {
          return res.status(403).json({
            error: `Drawing limit reached. Upgrade to Pro or VIP for more storage.`,
            limit,
            current: count,
          });
        }
      }

      const { title, canvasData, width, height, thumbnail, isPublic, tags, layers } = req.body;

      const drawing = new Drawing({
        userId,
        title,
        canvasData,
        width,
        height,
        thumbnail: thumbnail || canvasData,
        isPublic: isPublic || false,
        tags: tags || [],
        layers: layers || [],
      });

      await drawing.save();

      res.status(201).json({
        message: 'Drawing saved successfully',
        drawing: {
          id: drawing._id,
          title: drawing.title,
          thumbnail: drawing.thumbnail,
          createdAt: drawing.createdAt,
        },
      });
    } catch (error) {
      console.error('Create drawing error:', error);
      res.status(500).json({ error: 'Failed to save drawing' });
    }
  }
);

// Get user's drawings
router.get('/list', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const drawings = await Drawing.find({ userId })
      .select('title thumbnail width height isPublic likes views createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ drawings });
  } catch (error) {
    console.error('List drawings error:', error);
    res.status(500).json({ error: 'Failed to fetch drawings' });
  }
});

// Get single drawing
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const drawing = await Drawing.findOne({ _id: id, userId });

    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    res.json({ drawing });
  } catch (error) {
    console.error('Get drawing error:', error);
    res.status(500).json({ error: 'Failed to fetch drawing' });
  }
});

// Update drawing
router.put(
  '/:id',
  authenticate,
  [
    body('title').optional().trim().isLength({ min: 1, max: 100 }),
    body('canvasData').optional().notEmpty(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const userId = req.userId!;
      const updates = req.body;

      const drawing = await Drawing.findOneAndUpdate(
        { _id: id, userId },
        { $set: updates },
        { new: true }
      );

      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      res.json({
        message: 'Drawing updated successfully',
        drawing,
      });
    } catch (error) {
      console.error('Update drawing error:', error);
      res.status(500).json({ error: 'Failed to update drawing' });
    }
  }
);

// Delete drawing
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const drawing = await Drawing.findOneAndDelete({ _id: id, userId });

    if (!drawing) {
      return res.status(404).json({ error: 'Drawing not found' });
    }

    res.json({ message: 'Drawing deleted successfully' });
  } catch (error) {
    console.error('Delete drawing error:', error);
    res.status(500).json({ error: 'Failed to delete drawing' });
  }
});

// Get public gallery
router.get('/gallery/public', async (req, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const drawings = await Drawing.find({ isPublic: true })
      .select('title thumbnail likes views userId createdAt')
      .sort({ likes: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'username avatar');

    const total = await Drawing.countDocuments({ isPublic: true });

    res.json({
      drawings,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

export default router;
