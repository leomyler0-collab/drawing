import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';
import { mockAuth } from '../mockAuth';
import mongoose from 'mongoose';

export interface AuthRequest extends Request {
  user?: IUser | any;
  userId?: string;
}

const isMongoConnected = () => mongoose.connection.readyState === 1;

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    if (isMongoConnected()) {
      // MongoDB authentication
      const user = await User.findById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      req.userId = (user._id as any).toString();
    } else {
      // Mock authentication
      const user = await mockAuth.findUserById(decoded.userId);

      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }

      req.user = user;
      req.userId = user._id;
    }
    
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireTier = (minTier: 'free' | 'pro' | 'vip') => {
  const tierLevels = { free: 0, pro: 1, vip: 2 };
  
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userTierLevel = tierLevels[req.user.tier as 'free' | 'pro' | 'vip'];
    const requiredTierLevel = tierLevels[minTier];

    if (userTierLevel < requiredTierLevel) {
      return res.status(403).json({ 
        error: `This feature requires ${minTier.toUpperCase()} tier or higher`,
        requiredTier: minTier,
        currentTier: req.user.tier,
      });
    }

    next();
  };
};

// Admin-only middleware
export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.user.tier !== 'admin') {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'You do not have permission to access this resource',
    });
  }

  next();
};
