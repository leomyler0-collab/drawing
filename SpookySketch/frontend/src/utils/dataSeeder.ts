/**
 * Professional Data Seeder - Elite Implementation
 * Initializes database with sample users and public drawings
 * Ensures community gallery and user management work on all deployments
 */

import { localDB } from './localStorageDB';
import { clientAuth } from './clientAuth';

const SEEDER_FLAG_KEY = 'spookysketch_seeded';
const SEEDER_VERSION = '1.0';

export interface SeedResult {
  success: boolean;
  alreadySeeded: boolean;
  usersCreated: number;
  drawingsCreated: number;
  publicDrawingsCreated: number;
  errors: string[];
}

/**
 * Check if database has been seeded
 */
function isSeeded(): boolean {
  if (typeof window === 'undefined') return false;
  const flag = localStorage.getItem(SEEDER_FLAG_KEY);
  return flag === SEEDER_VERSION;
}

/**
 * Mark database as seeded
 */
function markSeeded(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SEEDER_FLAG_KEY, SEEDER_VERSION);
}

/**
 * Create sample thumbnail with color and emoji
 */
function createThumbnail(color: string, emoji: string): string {
  if (typeof window === 'undefined') {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  }
  
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return '';
    
    // Background
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 400, 400);
    
    // Emoji
    ctx.font = 'bold 120px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, 200, 200);
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, 400, 400);
    
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to create thumbnail:', error);
    return '';
  }
}

/**
 * Seed the database with sample data
 */
export async function seedDatabase(force: boolean = false): Promise<SeedResult> {
  const result: SeedResult = {
    success: true,
    alreadySeeded: false,
    usersCreated: 0,
    drawingsCreated: 0,
    publicDrawingsCreated: 0,
    errors: []
  };

  console.log('🌱 [DataSeeder] Checking database seed status...');

  // Check if already seeded
  if (!force && isSeeded()) {
    console.log('✅ [DataSeeder] Database already seeded');
    result.alreadySeeded = true;
    return result;
  }

  console.log('🚀 [DataSeeder] Starting database seeding...');

  try {
    // Initialize client auth
    clientAuth.initialize();

    // Sample users data
    const sampleUsers = [
      {
        username: 'ArtisticSoul',
        email: 'artist@spooky.com',
        password: 'demo123',
        tier: 'pro' as const,
        avatar: '🎨'
      },
      {
        username: 'GhostPainter',
        email: 'ghost@spooky.com',
        password: 'demo123',
        tier: 'vip' as const,
        avatar: '👻'
      },
      {
        username: 'PumpkinMaster',
        email: 'pumpkin@spooky.com',
        password: 'demo123',
        tier: 'free' as const,
        avatar: '🎃'
      },
      {
        username: 'SpookyCreator',
        email: 'creator@spooky.com',
        password: 'demo123',
        tier: 'pro' as const,
        avatar: '🦇'
      },
      {
        username: 'HauntedArtist',
        email: 'haunted@spooky.com',
        password: 'demo123',
        tier: 'free' as const,
        avatar: '🕷️'
      }
    ];

    // Create users
    const createdUsers: Array<{ id: string; username: string; tier: string }> = [];
    
    for (const userData of sampleUsers) {
      try {
        const existingUsers = clientAuth.getAllUsers();
        const exists = existingUsers.some(u => u.email === userData.email);
        
        if (!exists) {
          const { user } = await clientAuth.signup(
            userData.username,
            userData.email,
            userData.password
          );
          
          // Update tier and avatar
          if (userData.tier !== 'free' || userData.avatar !== '🎃') {
            await clientAuth.updateProfile(user.id, { 
              tier: userData.tier,
              avatar: userData.avatar
            });
          }
          
          createdUsers.push({
            id: user.id,
            username: userData.username,
            tier: userData.tier
          });
          
          result.usersCreated++;
          console.log(`✅ [DataSeeder] Created user: ${userData.username} (${userData.tier})`);
        } else {
          const user = existingUsers.find(u => u.email === userData.email);
          if (user) {
            createdUsers.push({
              id: user.id,
              username: user.username,
              tier: user.tier
            });
          }
          console.log(`ℹ️  [DataSeeder] User already exists: ${userData.username}`);
        }
      } catch (error: any) {
        console.error(`❌ [DataSeeder] Error creating user ${userData.username}:`, error);
        result.errors.push(`User ${userData.username}: ${error.message}`);
      }
    }

    // Sample drawings data
    const sampleDrawings = [
      { title: '🎃 Halloween Pumpkin', emoji: '🎃', color: '#ff6600', isPublic: true, userIndex: 0 },
      { title: '👻 Friendly Ghost', emoji: '👻', color: '#f0f0f0', isPublic: true, userIndex: 1 },
      { title: '🦇 Night Bat', emoji: '🦇', color: '#2d1b4e', isPublic: true, userIndex: 2 },
      { title: '🕷️ Creepy Spider', emoji: '🕷️', color: '#1a1a1a', isPublic: true, userIndex: 3 },
      { title: '🌙 Moonlight Scene', emoji: '🌙', color: '#1e3a8a', isPublic: true, userIndex: 4 },
      { title: '🕸️ Spider Web', emoji: '🕸️', color: '#4a4a4a', isPublic: false, userIndex: 0 },
      { title: '⚰️ Haunted Coffin', emoji: '⚰️', color: '#3d2817', isPublic: true, userIndex: 1 },
      { title: '🧙 Witch Magic', emoji: '🧙', color: '#4b0082', isPublic: true, userIndex: 2 },
      { title: '🎭 Spooky Mask', emoji: '🎭', color: '#dc143c', isPublic: true, userIndex: 3 },
      { title: '🔮 Crystal Ball', emoji: '🔮', color: '#9370db', isPublic: true, userIndex: 4 },
      { title: '💀 Skeleton Head', emoji: '💀', color: '#e5e5e5', isPublic: false, userIndex: 0 },
      { title: '🧛 Vampire Count', emoji: '🧛', color: '#8b0000', isPublic: true, userIndex: 1 },
    ];

    // Create drawings
    for (const drawingData of sampleDrawings) {
      try {
        const user = createdUsers[drawingData.userIndex];
        if (!user) {
          console.warn(`⚠️  [DataSeeder] No user at index ${drawingData.userIndex}`);
          continue;
        }

        const thumbnail = createThumbnail(drawingData.color, drawingData.emoji);
        
        if (thumbnail) {
          localDB.saveDrawing({
            title: drawingData.title,
            thumbnail,
            canvasData: thumbnail,
            width: 400,
            height: 400,
            tags: ['demo', 'halloween', 'community'],
            isFavorite: false,
            isPublic: drawingData.isPublic,
            userId: user.id,
          });

          result.drawingsCreated++;
          if (drawingData.isPublic) {
            result.publicDrawingsCreated++;
          }
          
          console.log(`✅ [DataSeeder] Created drawing: ${drawingData.title} by ${user.username} (${drawingData.isPublic ? 'PUBLIC' : 'PRIVATE'})`);
        }
      } catch (error: any) {
        console.error(`❌ [DataSeeder] Error creating drawing ${drawingData.title}:`, error);
        result.errors.push(`Drawing ${drawingData.title}: ${error.message}`);
      }
    }

    // Mark as seeded
    markSeeded();

    console.log('🎉 [DataSeeder] Database seeding complete!');
    console.log(`   👥 Users created: ${result.usersCreated}`);
    console.log(`   🎨 Drawings created: ${result.drawingsCreated}`);
    console.log(`   🌐 Public drawings: ${result.publicDrawingsCreated}`);

    if (result.errors.length > 0) {
      console.warn(`   ⚠️  Errors: ${result.errors.length}`);
      result.success = false;
    }

    return result;

  } catch (error: any) {
    console.error('❌ [DataSeeder] Fatal error:', error);
    result.success = false;
    result.errors.push(`Fatal: ${error.message}`);
    return result;
  }
}

/**
 * Reset seeder flag (for testing)
 */
export function resetSeederFlag(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SEEDER_FLAG_KEY);
  console.log('🔄 [DataSeeder] Seeder flag reset');
}

/**
 * Get seeding status
 */
export function getSeedStatus() {
  const seeded = isSeeded();
  const users = clientAuth.getAllUsers();
  const allDrawings = localDB.getAllDrawings();
  const publicDrawings = localDB.getPublicDrawings();
  
  return {
    isSeeded: seeded,
    totalUsers: users.length,
    totalDrawings: allDrawings.length,
    publicDrawings: publicDrawings.length,
    usersByTier: users.reduce((acc, u) => {
      acc[u.tier] = (acc[u.tier] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };
}
