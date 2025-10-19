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
      return 5; // Increased from 1 to 5
    case 'pro':
      return 50;
    case 'vip':
    case 'admin':
      return -1; // unlimited
    default:
      return 5;
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

      if (isMongoConnected()) {
        // MongoDB implementation
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
            _id: drawing._id,
            title: drawing.title,
            thumbnail: drawing.thumbnail,
            createdAt: drawing.createdAt,
          },
        });
      } else {
        // Mock implementation
        const limit = getDrawingLimit(user.tier);
        if (limit !== -1) {
          const count = await mockDrawingsDB.countByUserId(userId);
          if (count >= limit) {
            return res.status(403).json({
              error: `Drawing limit reached (${count}/${limit}). Upgrade to Pro or VIP for more storage.`,
              limit,
              current: count,
            });
          }
        }

        const { title, canvasData, width, height, thumbnail, isPublic, tags } = req.body;

        const drawing = await mockDrawingsDB.create({
          userId,
          title,
          canvasData,
          width,
          height,
          thumbnail: thumbnail || canvasData,
          isPublic: isPublic || false,
          tags: tags || [],
        });

        res.status(201).json({
          message: 'Drawing saved successfully (Mock Mode)',
          drawing: {
            _id: drawing._id,
            title: drawing.title,
            thumbnail: drawing.thumbnail,
            createdAt: drawing.createdAt,
          },
        });
      }
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

    if (isMongoConnected()) {
      const drawings = await Drawing.find({ userId })
        .select('title thumbnail width height isPublic likes views createdAt updatedAt')
        .sort({ updatedAt: -1 });

      res.json({ drawings });
    } else {
      const drawings = await mockDrawingsDB.findByUserId(userId);
      res.json({ drawings });
    }
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

    if (isMongoConnected()) {
      const drawing = await Drawing.findOne({ _id: id, userId });

      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      res.json({ drawing });
    } else {
      const drawing = await mockDrawingsDB.findById(id);

      if (!drawing || drawing.userId !== userId) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      res.json({ drawing });
    }
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

      if (isMongoConnected()) {
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
      } else {
        const drawing = await mockDrawingsDB.findById(id);

        if (!drawing || drawing.userId !== userId) {
          return res.status(404).json({ error: 'Drawing not found' });
        }

        const updated = await mockDrawingsDB.update(id, updates);

        res.json({
          message: 'Drawing updated successfully (Mock Mode)',
          drawing: updated,
        });
      }
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

    if (isMongoConnected()) {
      const drawing = await Drawing.findOneAndDelete({ _id: id, userId });

      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      res.json({ message: 'Drawing deleted successfully' });
    } else {
      const drawing = await mockDrawingsDB.findById(id);

      if (!drawing || drawing.userId !== userId) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      await mockDrawingsDB.delete(id);
      res.json({ message: 'Drawing deleted successfully (Mock Mode)' });
    }
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

    if (isMongoConnected()) {
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
    } else {
      const allDrawings = await mockDrawingsDB.findPublic(limit * page);
      const drawings = allDrawings.slice((page - 1) * limit, page * limit);

      res.json({
        drawings,
        pagination: {
          page,
          limit,
          total: allDrawings.length,
          pages: Math.ceil(allDrawings.length / limit),
        },
      });
    }
  } catch (error) {
    console.error('Gallery error:', error);
    res.status(500).json({ error: 'Failed to fetch gallery' });
  }
});

// Get single public drawing with view tracking
router.get('/public/:id', async (req, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      // Increment view count
      const drawing = await Drawing.findOneAndUpdate(
        { _id: id, isPublic: true },
        { $inc: { views: 1 } },
        { new: true }
      ).populate('userId', 'username avatar tier');

      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found or not public' });
      }

      res.json({ drawing });
    } else {
      const drawing = await mockDrawingsDB.findById(id);
      if (!drawing || !drawing.isPublic) {
        return res.status(404).json({ error: 'Drawing not found or not public' });
      }
      drawing.views = (drawing.views || 0) + 1;
      res.json({ drawing });
    }
  } catch (error) {
    console.error('Get public drawing error:', error);
    res.status(500).json({ error: 'Failed to fetch drawing' });
  }
});

// Like a drawing (authenticated users only)
router.post('/:id/like', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const drawing = await Drawing.findOneAndUpdate(
        { _id: id, isPublic: true },
        { $inc: { likes: 1 } },
        { new: true }
      );

      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found or not public' });
      }

      res.json({
        message: 'Drawing liked!',
        likes: drawing.likes,
      });
    } else {
      const drawing = await mockDrawingsDB.findById(id);
      if (!drawing || !drawing.isPublic) {
        return res.status(404).json({ error: 'Drawing not found or not public' });
      }
      drawing.likes = (drawing.likes || 0) + 1;
      res.json({
        message: 'Drawing liked! (Mock Mode)',
        likes: drawing.likes,
      });
    }
  } catch (error) {
    console.error('Like drawing error:', error);
    res.status(500).json({ error: 'Failed to like drawing' });
  }
});

// Unlike a drawing (authenticated users only)
router.post('/:id/unlike', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (isMongoConnected()) {
      const drawing = await Drawing.findOneAndUpdate(
        { _id: id, isPublic: true },
        { $inc: { likes: -1 } },
        { new: true }
      );

      if (!drawing) {
        return res.status(404).json({ error: 'Drawing not found or not public' });
      }

      // Ensure likes don't go below 0
      if (drawing.likes < 0) {
        drawing.likes = 0;
        await drawing.save();
      }

      res.json({
        message: 'Like removed',
        likes: drawing.likes,
      });
    } else {
      const drawing = await mockDrawingsDB.findById(id);
      if (!drawing || !drawing.isPublic) {
        return res.status(404).json({ error: 'Drawing not found or not public' });
      }
      drawing.likes = Math.max(0, (drawing.likes || 0) - 1);
      res.json({
        message: 'Like removed (Mock Mode)',
        likes: drawing.likes,
      });
    }
  } catch (error) {
    console.error('Unlike drawing error:', error);
    res.status(500).json({ error: 'Failed to unlike drawing' });
  }
});

// Toggle drawing public/private status
router.patch('/:id/visibility', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isPublic } = req.body;
    const userId = req.userId!;

    if (typeof isPublic !== 'boolean') {
      return res.status(400).json({ error: 'isPublic must be a boolean' });
    }

    if (isMongoConnected()) {
      // First find the drawing to verify ownership
      const existingDrawing = await Drawing.findById(id);
      
      if (!existingDrawing) {
        return res.status(404).json({ error: 'Drawing not found' });
      }

      // Check if user owns the drawing (convert both to strings for comparison)
      if (existingDrawing.userId.toString() !== userId.toString()) {
        return res.status(403).json({ error: 'You do not have permission to modify this drawing' });
      }

      // Update the drawing
      existingDrawing.isPublic = isPublic;
      await existingDrawing.save();

      res.json({
        message: `Drawing is now ${isPublic ? 'public' : 'private'}`,
        drawing: {
          _id: existingDrawing._id,
          isPublic: existingDrawing.isPublic,
        },
      });
    } else {
      const drawing = await mockDrawingsDB.findById(id);
      if (!drawing || drawing.userId !== userId) {
        return res.status(404).json({ error: 'Drawing not found' });
      }
      drawing.isPublic = isPublic;
      res.json({
        message: `Drawing is now ${isPublic ? 'public' : 'private'} (Mock Mode)`,
        drawing: {
          _id: drawing._id,
          isPublic: drawing.isPublic,
        },
      });
    }
  } catch (error) {
    console.error('Toggle visibility error:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

export default router;
