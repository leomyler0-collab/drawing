import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { authenticate, AuthRequest } from '../middleware/auth';
import { mockAuth } from '../mockAuth';
import mongoose from 'mongoose';

const router = express.Router();

// Check if MongoDB is connected
const isMongoConnected = () => mongoose.connection.readyState === 1;

// Sign Up
router.post(
  '/signup',
  [
    body('username').isLength({ min: 3, max: 30 }).trim(),
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { username, email, password } = req.body;

      if (isMongoConnected()) {
        // Use MongoDB
        const existingUser = await User.findOne({
          $or: [{ email }, { username }],
        });

        if (existingUser) {
          return res.status(400).json({
            error: existingUser.email === email
              ? 'Email already registered'
              : 'Username already taken',
          });
        }

        const user = new User({
          username,
          email,
          password,
          tier: 'free',
        });

        await user.save();

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '30d' }
        );

        res.status(201).json({
          message: 'User created successfully',
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            tier: user.tier,
            avatar: user.avatar,
          },
        });
      } else {
        // Use Mock Authentication
        const user = await mockAuth.createUser(username, email, password);
        const token = mockAuth.generateToken(user._id);

        res.status(201).json({
          message: 'User created successfully (Mock Mode)',
          token,
          user: mockAuth.sanitizeUser(user),
        });
      }
    } catch (error: any) {
      console.error('Signup error:', error);
      res.status(500).json({ error: error.message || 'Server error during signup' });
    }
  }
);

// Login
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      if (isMongoConnected()) {
        // Use MongoDB
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '30d' }
        );

        res.json({
          message: 'Login successful',
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            tier: user.tier,
            avatar: user.avatar,
          },
        });
      } else {
        // Use Mock Authentication
        const user = await mockAuth.findUserByEmail(email);
        if (!user) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await mockAuth.comparePassword(password, user.password);
        if (!isMatch) {
          return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = mockAuth.generateToken(user._id);

        res.json({
          message: 'Login successful (Mock Mode)',
          token,
          user: mockAuth.sanitizeUser(user),
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: 'Server error during login' });
    }
  }
);

// Get current user
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  try {
    if (isMongoConnected()) {
      const user = req.user!;
      res.json({
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          tier: user.tier,
          avatar: user.avatar,
          createdAt: user.createdAt,
        },
      });
    } else {
      // Mock mode
      const user = await mockAuth.findUserById(req.userId!);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json({
        user: mockAuth.sanitizeUser(user),
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout
router.post('/logout', authenticate, async (req: AuthRequest, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

// Debug endpoint - get all users (only in development)
if (process.env.NODE_ENV === 'development') {
  router.get('/debug/users', (req: Request, res: Response) => {
    if (isMongoConnected()) {
      res.json({ message: 'Using MongoDB - use MongoDB Compass to view users' });
    } else {
      res.json({ users: mockAuth.getAllUsers() });
    }
  });
}

export default router;
