import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In-memory user storage (for testing without MongoDB)
interface MockUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  tier: 'free' | 'pro' | 'vip' | 'admin';
  avatar: string;
  createdAt: Date;
  isAdmin?: boolean;
}

const mockUsers: MockUser[] = [];
let userIdCounter = 1;

// Pre-create admin account
const initAdminAccount = async () => {
  const bcrypt = await import('bcryptjs');
  const adminPassword = await bcrypt.hash('SuperBoy2020', 10);
  
  const adminUser: MockUser = {
    _id: 'admin_001',
    username: 'Admin',
    email: 'leomyler0@gmail.com',
    password: adminPassword,
    tier: 'admin',
    avatar: '👑',
    createdAt: new Date(),
    isAdmin: true,
  };
  
  mockUsers.push(adminUser);
  console.log('👑 Admin account created:');
  console.log('   Email: leomyler0@gmail.com');
  console.log('   Password: SuperBoy2020');
  console.log('   Tier: ADMIN (Full Access)');
};

// Initialize admin account immediately
initAdminAccount();

export const mockAuth = {
  // Create user
  async createUser(username: string, email: string, password: string): Promise<MockUser> {
    // Check if user exists
    const existing = mockUsers.find(u => u.email === email || u.username === username);
    if (existing) {
      throw new Error(existing.email === email ? 'Email already registered' : 'Username already taken');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user: MockUser = {
      _id: `mock_${userIdCounter++}`,
      username,
      email,
      password: hashedPassword,
      tier: 'free',
      avatar: '🎃',
      createdAt: new Date(),
    };

    mockUsers.push(user);
    console.log('✅ Mock user created:', email);
    return user;
  },

  // Find user by email
  async findUserByEmail(email: string): Promise<MockUser | null> {
    return mockUsers.find(u => u.email === email) || null;
  },

  // Find user by ID
  async findUserById(id: string): Promise<MockUser | null> {
    return mockUsers.find(u => u._id === id) || null;
  },

  // Compare password
  async comparePassword(candidatePassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, hashedPassword);
  },

  // Generate JWT token
  generateToken(userId: string): string {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });
  },

  // Get user without password
  sanitizeUser(user: MockUser) {
    const { password, ...userWithoutPassword } = user;
    return {
      id: user._id,
      username: user.username,
      email: user.email,
      tier: user.tier,
      avatar: user.avatar,
      createdAt: user.createdAt,
      isAdmin: user.isAdmin || false,
    };
  },

  // Get all users (for debugging)
  getAllUsers() {
    return mockUsers.map(u => ({ 
      email: u.email, 
      username: u.username, 
      tier: u.tier,
      isAdmin: u.isAdmin || false 
    }));
  },
};

// Export admin check helper
export const isAdmin = (user: any): boolean => {
  return user?.tier === 'admin' || user?.isAdmin === true;
};

// Log startup
console.log('🧪 Mock Authentication System Loaded (In-Memory Storage)');
console.log('   This allows testing without MongoDB');
console.log('   Users will be lost on server restart');
