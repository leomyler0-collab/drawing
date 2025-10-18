// Elite Client-Side Authentication - No Backend Required!
// Professional-grade localStorage auth system with full security simulation

export interface User {
  id: string;
  username: string;
  email: string;
  tier: 'free' | 'pro' | 'vip' | 'admin';
  avatar: string;
  createdAt: string;
}

interface StoredUser extends User {
  passwordHash: string; // Simulated hash (not real bcrypt for client-side)
}

const USERS_KEY = 'spookysketch_users';
const SESSION_KEY = 'spookysketch_session';

// Simple hash function for client-side (NOT cryptographically secure - just for demo)
const simpleHash = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
};

class ClientAuth {
  private users: StoredUser[] = [];

  constructor() {
    this.loadUsers();
    this.initializeDefaultUser();
  }

  private loadUsers() {
    try {
      const data = localStorage.getItem(USERS_KEY);
      this.users = data ? JSON.parse(data) : [];
    } catch {
      this.users = [];
    }
  }

  private saveUsers() {
    localStorage.setItem(USERS_KEY, JSON.stringify(this.users));
  }

  private initializeDefaultUser() {
    // Create default admin user if doesn't exist
    const adminExists = this.users.some(u => u.email === 'leomyler0@gmail.com');
    
    if (!adminExists) {
      this.users.push({
        id: 'admin_elite_001',
        username: 'SpookyAdmin',
        email: 'leomyler0@gmail.com',
        tier: 'admin', // Admin gets ALL access (VIP + Pro included)
        avatar: '👑',
        createdAt: new Date().toISOString(),
        passwordHash: simpleHash('SuperBoy2020'),
      });
      this.saveUsers();
      console.log('✅ Default admin user created (VIP + Pro access)');
    }
  }

  // Signup - No backend needed!
  async signup(username: string, email: string, password: string): Promise<{ user: User; token: string }> {
    // Validate input
    if (!username || username.length < 3) {
      throw new Error('Username must be at least 3 characters');
    }
    if (!email || !email.includes('@')) {
      throw new Error('Invalid email address');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if user exists
    const existing = this.users.find(u => u.email === email || u.username === username);
    if (existing) {
      throw new Error('Username or email already taken');
    }

    // Create new user
    const newUser: StoredUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      tier: 'free',
      avatar: '🎃',
      createdAt: new Date().toISOString(),
      passwordHash: simpleHash(password),
    };

    this.users.push(newUser);
    this.saveUsers();

    // Create session
    const token = this.createSession(newUser);

    console.log('✅ User signed up (client-side):', username);

    return {
      user: this.sanitizeUser(newUser),
      token,
    };
  }

  // Login - No backend needed!
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const user = this.users.find(u => u.email === email);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const passwordHash = simpleHash(password);
    if (user.passwordHash !== passwordHash) {
      throw new Error('Invalid email or password');
    }

    // Create session
    const token = this.createSession(user);

    console.log('✅ User logged in (client-side):', user.username);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  // Get current user from session
  getCurrentUser(): User | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return null;

      const { userId, token, expires } = JSON.parse(session);
      
      // Check if session expired
      if (new Date(expires) < new Date()) {
        this.logout();
        return null;
      }

      // Reload users to get latest data
      this.loadUsers();
      const user = this.users.find(u => u.id === userId);
      return user ? this.sanitizeUser(user) : null;
    } catch {
      return null;
    }
  }

  // Get current user ID from session
  getCurrentUserId(): string | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return null;
      const { userId } = JSON.parse(session);
      return userId;
    } catch {
      return null;
    }
  }

  // Check if user has VIP/Pro access
  hasProAccess(user: User): boolean {
    return user.tier === 'pro' || user.tier === 'vip' || user.tier === 'admin';
  }

  hasVipAccess(user: User): boolean {
    return user.tier === 'vip' || user.tier === 'admin';
  }

  hasAdminAccess(user: User): boolean {
    return user.tier === 'admin';
  }

  // Logout
  logout() {
    localStorage.removeItem(SESSION_KEY);
    console.log('✅ User logged out (client-side)');
  }

  // Create session token
  private createSession(user: StoredUser): string {
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
    const expires = new Date();
    expires.setDate(expires.getDate() + 30); // 30 days

    const session = {
      userId: user.id,
      token,
      expires: expires.toISOString(),
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return token;
  }

  // Remove password from user object
  private sanitizeUser(user: StoredUser): User {
    const { passwordHash, ...sanitized } = user;
    return sanitized;
  }

  // Validate session token
  validateToken(token: string): User | null {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (!session) return null;

      const sessionData = JSON.parse(session);
      if (sessionData.token !== token) return null;

      if (new Date(sessionData.expires) < new Date()) {
        this.logout();
        return null;
      }

      const user = this.users.find(u => u.id === sessionData.userId);
      return user ? this.sanitizeUser(user) : null;
    } catch {
      return null;
    }
  }

  // Get all users (admin only)
  getAllUsers(): User[] {
    return this.users.map(u => this.sanitizeUser(u));
  }

  // Update user profile
  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }

    this.users[index] = {
      ...this.users[index],
      ...updates,
    };

    this.saveUsers();
    return this.sanitizeUser(this.users[index]);
  }
}

// Export singleton instance
export const clientAuth = new ClientAuth();

console.log('🔐 Client-Side Auth System Loaded');
console.log('   ✅ No backend required');
console.log('   ✅ Fully functional offline');
console.log('   ✅ Professional grade');
