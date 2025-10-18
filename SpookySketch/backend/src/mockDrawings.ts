// Mock drawings storage (in-memory for testing without MongoDB)
interface MockDrawing {
  _id: string;
  userId: string;
  title: string;
  canvasData: string;
  thumbnail: string;
  width: number;
  height: number;
  isPublic: boolean;
  tags: string[];
  likes: number;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const mockDrawings: MockDrawing[] = [];
let drawingIdCounter = 1;

export const mockDrawingsDB = {
  // Create drawing
  async create(drawingData: {
    userId: string;
    title: string;
    canvasData: string;
    thumbnail: string;
    width: number;
    height: number;
    isPublic?: boolean;
    tags?: string[];
  }): Promise<MockDrawing> {
    const drawing: MockDrawing = {
      _id: `drawing_${drawingIdCounter++}`,
      userId: drawingData.userId,
      title: drawingData.title,
      canvasData: drawingData.canvasData,
      thumbnail: drawingData.thumbnail || drawingData.canvasData,
      width: drawingData.width,
      height: drawingData.height,
      isPublic: drawingData.isPublic || false,
      tags: drawingData.tags || [],
      likes: 0,
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockDrawings.push(drawing);
    console.log('✅ Drawing saved:', drawing.title);
    return drawing;
  },

  // Get user's drawings
  async findByUserId(userId: string): Promise<MockDrawing[]> {
    return mockDrawings
      .filter(d => d.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Get public drawings
  async findPublic(limit: number = 20): Promise<MockDrawing[]> {
    return mockDrawings
      .filter(d => d.isPublic)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  },

  // Get drawing by ID
  async findById(id: string): Promise<MockDrawing | null> {
    return mockDrawings.find(d => d._id === id) || null;
  },

  // Update drawing
  async update(id: string, updates: Partial<MockDrawing>): Promise<MockDrawing | null> {
    const index = mockDrawings.findIndex(d => d._id === id);
    if (index === -1) return null;

    mockDrawings[index] = {
      ...mockDrawings[index],
      ...updates,
      updatedAt: new Date(),
    };

    return mockDrawings[index];
  },

  // Delete drawing
  async delete(id: string): Promise<boolean> {
    const index = mockDrawings.findIndex(d => d._id === id);
    if (index === -1) return false;

    mockDrawings.splice(index, 1);
    console.log('🗑️ Drawing deleted:', id);
    return true;
  },

  // Count user's drawings
  async countByUserId(userId: string): Promise<number> {
    return mockDrawings.filter(d => d.userId === userId).length;
  },

  // Get user stats
  async getStats(userId: string) {
    const userDrawings = mockDrawings.filter(d => d.userId === userId);
    
    return {
      drawingCount: userDrawings.length,
      publicDrawings: userDrawings.filter(d => d.isPublic).length,
      totalLikes: userDrawings.reduce((sum, d) => sum + d.likes, 0),
      totalViews: userDrawings.reduce((sum, d) => sum + d.views, 0),
    };
  },

  // Like drawing
  async like(id: string): Promise<boolean> {
    const drawing = await this.findById(id);
    if (!drawing) return false;

    drawing.likes++;
    drawing.updatedAt = new Date();
    return true;
  },

  // Increment views
  async incrementViews(id: string): Promise<boolean> {
    const drawing = await this.findById(id);
    if (!drawing) return false;

    drawing.views++;
    return true;
  },

  // Get all drawings (for admin/debug)
  async getAll(): Promise<MockDrawing[]> {
    return [...mockDrawings];
  },
};

console.log('🎨 Mock Drawings System Loaded');
console.log('   Drawings stored in memory');
console.log('   Will persist during server session');
