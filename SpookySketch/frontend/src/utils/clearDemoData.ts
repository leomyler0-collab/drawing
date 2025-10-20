/**
 * Clear Demo Data Utility
 * Removes all demo users and their associated drawings
 * Keeps only admin account and real users
 */

const USERS_KEY = 'spookysketch_users';
const DRAWINGS_KEY = 'spookysketch_drawings';
const SEEDER_FLAG_KEY = 'spookysketch_seeded';

export interface ClearResult {
  success: boolean;
  usersRemoved: number;
  drawingsRemoved: number;
  usersRemaining: number;
  drawingsRemaining: number;
}

/**
 * Clear all demo users and drawings
 * Keeps admin account and real users (non @spooky.com emails)
 */
export function clearDemoData(): ClearResult {
  const result: ClearResult = {
    success: false,
    usersRemoved: 0,
    drawingsRemoved: 0,
    usersRemaining: 0,
    drawingsRemaining: 0
  };

  if (typeof window === 'undefined') {
    console.error('❌ clearDemoData can only run in browser');
    return result;
  }

  try {
    console.log('🧹 [ClearDemo] Starting cleanup...');

    // Get current data
    const usersData = localStorage.getItem(USERS_KEY);
    const drawingsData = localStorage.getItem(DRAWINGS_KEY);

    if (!usersData) {
      console.log('ℹ️  [ClearDemo] No users found');
      result.success = true;
      return result;
    }

    const allUsers = JSON.parse(usersData);
    const allDrawings = drawingsData ? JSON.parse(drawingsData) : [];

    const initialUserCount = allUsers.length;
    const initialDrawingCount = allDrawings.length;

    // Identify demo users (have @spooky.com emails)
    const demoUsers = allUsers.filter((u: any) => 
      u.email && u.email.endsWith('@spooky.com')
    );
    const demoUserIds = demoUsers.map((u: any) => u.id);

    // Keep only real users (admin + non-@spooky.com emails)
    const realUsers = allUsers.filter((u: any) => 
      u.tier === 'admin' || !u.email || !u.email.endsWith('@spooky.com')
    );

    // Keep only drawings from real users
    const realDrawings = allDrawings.filter((d: any) => 
      !demoUserIds.includes(d.userId)
    );

    // Save cleaned data
    localStorage.setItem(USERS_KEY, JSON.stringify(realUsers));
    localStorage.setItem(DRAWINGS_KEY, JSON.stringify(realDrawings));

    // Reset seeder flag so it won't run again
    localStorage.removeItem(SEEDER_FLAG_KEY);

    result.success = true;
    result.usersRemoved = initialUserCount - realUsers.length;
    result.drawingsRemoved = initialDrawingCount - realDrawings.length;
    result.usersRemaining = realUsers.length;
    result.drawingsRemaining = realDrawings.length;

    console.log('✅ [ClearDemo] Cleanup complete!');
    console.log(`   🗑️  Users removed: ${result.usersRemoved}`);
    console.log(`   🗑️  Drawings removed: ${result.drawingsRemoved}`);
    console.log(`   👥 Users remaining: ${result.usersRemaining}`);
    console.log(`   🎨 Drawings remaining: ${result.drawingsRemaining}`);
    
    if (demoUsers.length > 0) {
      console.log('   Removed users:', demoUsers.map((u: any) => u.username).join(', '));
    }

    return result;

  } catch (error) {
    console.error('❌ [ClearDemo] Error during cleanup:', error);
    result.success = false;
    return result;
  }
}

/**
 * Clear EVERYTHING (reset to factory defaults)
 * Only admin account will remain
 */
export function clearAllData(): ClearResult {
  const result: ClearResult = {
    success: false,
    usersRemoved: 0,
    drawingsRemoved: 0,
    usersRemaining: 0,
    drawingsRemaining: 0
  };

  if (typeof window === 'undefined') {
    console.error('❌ clearAllData can only run in browser');
    return result;
  }

  try {
    console.log('🧹 [ClearAll] Clearing all data...');

    const usersData = localStorage.getItem(USERS_KEY);
    const drawingsData = localStorage.getItem(DRAWINGS_KEY);

    const allUsers = usersData ? JSON.parse(usersData) : [];
    const allDrawings = drawingsData ? JSON.parse(drawingsData) : [];

    // Keep ONLY admin account
    const adminOnly = allUsers.filter((u: any) => u.tier === 'admin');

    localStorage.setItem(USERS_KEY, JSON.stringify(adminOnly));
    localStorage.setItem(DRAWINGS_KEY, JSON.stringify([]));
    localStorage.removeItem(SEEDER_FLAG_KEY);

    result.success = true;
    result.usersRemoved = allUsers.length - adminOnly.length;
    result.drawingsRemoved = allDrawings.length;
    result.usersRemaining = adminOnly.length;
    result.drawingsRemaining = 0;

    console.log('✅ [ClearAll] All data cleared!');
    console.log(`   🗑️  Users removed: ${result.usersRemoved}`);
    console.log(`   🗑️  Drawings removed: ${result.drawingsRemoved}`);
    console.log(`   👥 Admin account remains: ${adminOnly.length}`);

    return result;

  } catch (error) {
    console.error('❌ [ClearAll] Error:', error);
    result.success = false;
    return result;
  }
}

/**
 * Get demo user statistics
 */
export function getDemoStats() {
  if (typeof window === 'undefined') {
    return {
      totalUsers: 0,
      demoUsers: 0,
      realUsers: 0,
      demoDrawings: 0,
      realDrawings: 0
    };
  }

  const usersData = localStorage.getItem(USERS_KEY);
  const drawingsData = localStorage.getItem(DRAWINGS_KEY);

  if (!usersData) {
    return {
      totalUsers: 0,
      demoUsers: 0,
      realUsers: 0,
      demoDrawings: 0,
      realDrawings: 0
    };
  }

  const allUsers = JSON.parse(usersData);
  const allDrawings = drawingsData ? JSON.parse(drawingsData) : [];

  const demoUsers = allUsers.filter((u: any) => 
    u.email && u.email.endsWith('@spooky.com')
  );
  const demoUserIds = demoUsers.map((u: any) => u.id);

  const demoDrawings = allDrawings.filter((d: any) => 
    demoUserIds.includes(d.userId)
  );

  return {
    totalUsers: allUsers.length,
    demoUsers: demoUsers.length,
    realUsers: allUsers.length - demoUsers.length,
    totalDrawings: allDrawings.length,
    demoDrawings: demoDrawings.length,
    realDrawings: allDrawings.length - demoDrawings.length
  };
}
