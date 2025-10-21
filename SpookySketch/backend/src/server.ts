import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';

// Import routes
import authRoutes from './routes/auth';
import drawingRoutes from './routes/drawings';
import userRoutes from './routes/user';
import subscriptionRoutes from './routes/subscription';
import adminRoutes from './routes/admin';

// Import socket handler
import { initializeSocketIO } from './socket/socketHandler';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/spookysketch';

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
}));
app.use(compression());
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:54949', 'http://127.0.0.1:54949'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Handle preflight requests
app.options('*', cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:54949', 'http://127.0.0.1:54949'],
  credentials: true,
}));

// Rate limiting (increased for development)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs (high for dev)
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/drawings', drawingRoutes);
app.use('/api/user', userRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SpookySketch API is running 🎃' });
});

// Initialize Socket.IO
initializeSocketIO(io);

// MongoDB Connection with graceful fallback
mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    
    // Auto-create admin user if not exists
    try {
      const User = (await import('./models/User')).default;
      const adminEmail = 'leomyler0@gmail.com';
      const existingAdmin = await User.findOne({ email: adminEmail });
      
      if (!existingAdmin) {
        const adminUser = new User({
          username: 'Admin',
          email: adminEmail,
          password: 'SuperBoy2020',
          tier: 'admin',
          avatar: '👑',
          isAdmin: true,
        });
        await adminUser.save();
        console.log('👑 Admin account auto-created!');
        console.log('   Email: leomyler0@gmail.com');
        console.log('   Password: SuperBoy2020');
      } else if (existingAdmin.tier !== 'admin') {
        existingAdmin.tier = 'admin';
        existingAdmin.isAdmin = true;
        await existingAdmin.save();
        console.log('👑 Admin account updated!');
      } else {
        console.log('👑 Admin account exists and ready!');
      }

      // Auto-create VIP accounts if not exist
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

      for (const account of vipAccounts) {
        const existingVIP = await User.findOne({ email: account.email });
        
        if (!existingVIP) {
          const vipUser = new User({
            username: account.username,
            email: account.email,
            password: account.password,
            tier: account.tier,
            avatar: account.avatar,
            isAdmin: false,
          });
          await vipUser.save();
          console.log(`${account.avatar} VIP account auto-created!`);
          console.log(`   Email: ${account.email}`);
          console.log(`   Password: ${account.password}`);
        } else if (existingVIP.tier !== 'vip') {
          existingVIP.tier = 'vip';
          await existingVIP.save();
          console.log(`${account.avatar} VIP account updated to VIP tier: ${account.email}`);
        } else {
          console.log(`${account.avatar} VIP account exists and ready! (${account.email})`);
        }
      }
    } catch (error) {
      console.warn('⚠️  Could not verify/create admin/VIP accounts:', error);
    }
  })
  .catch((error) => {
    console.warn('⚠️  MongoDB connection failed. Running without database.');
    console.warn('   Some features (saving drawings, auth) will not work.');
    console.warn('   To fix: Install MongoDB or use MongoDB Atlas');
  });

// Start server regardless of MongoDB connection
httpServer.listen(PORT, () => {
  console.log(`🎃 SpookySketch Server running on port ${PORT}`);
  console.log(`🌐 API: http://localhost:${PORT}/api`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

export default app;
