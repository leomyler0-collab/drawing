/**
 * Sample Data Initializer - Professional Development Tool
 * Creates sample data for testing and demonstration purposes
 * @author Elite Senior Software Engineer
 */

import { localDB } from './localStorageDB';
import { clientAuth } from './clientAuth';

export interface InitializationResult {
  success: boolean;
  usersCreated: number;
  drawingsCreated: number;
  publicDrawings: number;
  errors: string[];
}

/**
 * Initialize sample data for testing
 * Creates demo users and drawings with proper public/private settings
 */
export async function initializeSampleData(): Promise<InitializationResult> {
  const result: InitializationResult = {
    success: true,
    usersCreated: 0,
    drawingsCreated: 0,
    publicDrawings: 0,
    errors: []
  };

  console.log('🚀 [SampleData] Starting sample data initialization...');

  try {
    // Ensure client auth is initialized
    clientAuth.initialize();

    // Create sample users if they don't exist
    const sampleUsers = [
      {
        username: 'DemoUser1',
        email: 'demo1@spookysketch.com',
        password: 'demo123',
        tier: 'free' as const,
        avatar: '🎃'
      },
      {
        username: 'ProArtist',
        email: 'pro@spookysketch.com',
        password: 'demo123',
        tier: 'pro' as const,
        avatar: '🎨'
      },
      {
        username: 'VIPCreator',
        email: 'vip@spookysketch.com',
        password: 'demo123',
        tier: 'vip' as const,
        avatar: '👑'
      }
    ];

    for (const userData of sampleUsers) {
      try {
        const existingUsers = clientAuth.getAllUsers();
        const exists = existingUsers.some(u => u.email === userData.email);
        
        if (!exists) {
          await clientAuth.signup(
            userData.username,
            userData.email,
            userData.password
          );
          
          // Update tier after creation
          const users = clientAuth.getAllUsers();
          const newUser = users.find(u => u.email === userData.email);
          if (newUser && userData.tier !== 'free') {
            await clientAuth.updateProfile(newUser.id, { 
              tier: userData.tier,
              avatar: userData.avatar
            });
          }
          
          result.usersCreated++;
          console.log(`✅ [SampleData] Created user: ${userData.username}`);
        } else {
          console.log(`ℹ️  [SampleData] User already exists: ${userData.username}`);
        }
      } catch (error) {
        console.warn(`⚠️  [SampleData] Error creating user ${userData.username}:`, error);
        result.errors.push(`User ${userData.username}: ${error}`);
      }
    }

    // Create sample drawings
    const getCurrentUserId = () => {
      const users = clientAuth.getAllUsers();
      return users[0]?.id || 'demo_user_001';
    };

    const sampleDrawings = [
      {
        title: '🎃 Happy Halloween Pumpkin',
        isPublic: true,
        thumbnail: createSampleThumbnail('#ff6600'),
      },
      {
        title: '👻 Spooky Ghost',
        isPublic: true,
        thumbnail: createSampleThumbnail('#ffffff'),
      },
      {
        title: '🦇 Flying Bat',
        isPublic: true,
        thumbnail: createSampleThumbnail('#000000'),
      },
      {
        title: '🕷️ Creepy Spider',
        isPublic: false,
        thumbnail: createSampleThumbnail('#8b0000'),
      },
      {
        title: '🌙 Moonlit Night',
        isPublic: true,
        thumbnail: createSampleThumbnail('#1e3a8a'),
      }
    ];

    const userId = getCurrentUserId();

    for (const drawingData of sampleDrawings) {
      try {
        // saveDrawing auto-generates: id, createdAt, updatedAt, views, likes
        localDB.saveDrawing({
          title: drawingData.title,
          thumbnail: drawingData.thumbnail,
          canvasData: drawingData.thumbnail, // Using thumbnail as canvasData for demo
          width: 800,
          height: 600,
          tags: ['demo', 'halloween'],
          isFavorite: false,
          isPublic: drawingData.isPublic,
          userId,
        });

        result.drawingsCreated++;
        if (drawingData.isPublic) {
          result.publicDrawings++;
        }
        
        console.log(`✅ [SampleData] Created drawing: ${drawingData.title} (${drawingData.isPublic ? 'PUBLIC' : 'PRIVATE'})`);
      } catch (error) {
        console.warn(`⚠️  [SampleData] Error creating drawing ${drawingData.title}:`, error);
        result.errors.push(`Drawing ${drawingData.title}: ${error}`);
      }
    }

    console.log('🎉 [SampleData] Initialization complete!');
    console.log(`   📊 Users created: ${result.usersCreated}`);
    console.log(`   🎨 Drawings created: ${result.drawingsCreated}`);
    console.log(`   🌐 Public drawings: ${result.publicDrawings}`);
    
    if (result.errors.length > 0) {
      console.warn(`   ⚠️  Errors: ${result.errors.length}`);
      result.success = false;
    }

    return result;
  } catch (error) {
    console.error('❌ [SampleData] Fatal error during initialization:', error);
    result.success = false;
    result.errors.push(`Fatal: ${error}`);
    return result;
  }
}

/**
 * Create a simple colored thumbnail for demo purposes
 */
function createSampleThumbnail(color: string): string {
  // Create a simple canvas with solid color
  if (typeof window !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 200, 200);
      
      // Add some decorative elements
      ctx.fillStyle = '#ffffff';
      ctx.font = '48px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎃', 100, 100);
      
      return canvas.toDataURL();
    }
  }
  return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}

/**
 * Clear all sample data
 */
export function clearSampleData(): void {
  console.log('🗑️  [SampleData] Clearing sample data...');
  
  // Clear all drawings
  const allDrawings = localDB.getAllDrawings();
  const demoDrawings = allDrawings.filter(d => d.title.includes('demo') || d.title.includes('🎃') || d.title.includes('👻'));
  
  demoDrawings.forEach(drawing => {
    localDB.deleteDrawing(drawing.id);
  });
  
  console.log(`✅ [SampleData] Cleared ${demoDrawings.length} demo drawings`);
}

/**
 * Get sample data statistics
 */
export function getSampleDataStats() {
  const allDrawings = localDB.getAllDrawings();
  const publicDrawings = localDB.getPublicDrawings();
  const users = clientAuth.getAllUsers();
  
  return {
    totalDrawings: allDrawings.length,
    publicDrawings: publicDrawings.length,
    privateDrawings: allDrawings.length - publicDrawings.length,
    totalUsers: users.length,
    adminUsers: users.filter(u => u.tier === 'admin').length,
    vipUsers: users.filter(u => u.tier === 'vip').length,
    proUsers: users.filter(u => u.tier === 'pro').length,
    freeUsers: users.filter(u => u.tier === 'free').length,
  };
}
