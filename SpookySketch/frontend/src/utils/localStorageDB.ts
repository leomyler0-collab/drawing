// Local Storage Database - No tokens required!
// Elite client-side storage system with full functionality

export interface LocalDrawing {
  id: string;
  userId?: string; // User ID for multi-user support
  title: string;
  canvasData: string;
  thumbnail: string;
  width: number;
  height: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  views: number;
  likes: number;
  isFavorite: boolean;
  isPublic: boolean;
}

const STORAGE_KEY = 'spookysketch_drawings';
const FAVORITES_KEY = 'spookysketch_favorites';
const RECENT_COLORS_KEY = 'spookysketch_recent_colors';
const DRAFTS_KEY = 'spookysketch_draft';
const SETTINGS_KEY = 'spookysketch_settings';

class LocalStorageDB {
  // Check if we're in browser environment
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  // Save drawing (no token required!)
  saveDrawing(drawing: Omit<LocalDrawing, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'likes'>): LocalDrawing {
    if (!this.isBrowser()) {
      throw new Error('LocalStorage is only available in browser');
    }
    const drawings = this.getAllDrawings();
    
    const newDrawing: LocalDrawing = {
      ...drawing,
      id: `drawing_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      views: 0,
      likes: 0,
    };

    drawings.push(newDrawing);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings));
    
    console.log('✅ Drawing saved locally:', newDrawing.title);
    return newDrawing;
  }

  // Get all drawings
  getAllDrawings(): LocalDrawing[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get drawings:', error);
      return [];
    }
  }

  // Get single drawing
  getDrawing(id: string): LocalDrawing | null {
    const drawings = this.getAllDrawings();
    return drawings.find(d => d.id === id) || null;
  }

  // Update drawing
  updateDrawing(id: string, updates: Partial<LocalDrawing>): LocalDrawing | null {
    const drawings = this.getAllDrawings();
    const index = drawings.findIndex(d => d.id === id);
    
    if (index === -1) return null;

    drawings[index] = {
      ...drawings[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(drawings));
    return drawings[index];
  }

  // Delete drawing
  deleteDrawing(id: string): boolean {
    const drawings = this.getAllDrawings();
    const filtered = drawings.filter(d => d.id !== id);
    
    if (filtered.length === drawings.length) return false;

    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    console.log('🗑️ Drawing deleted:', id);
    return true;
  }

  // Search drawings
  searchDrawings(query: string): LocalDrawing[] {
    const drawings = this.getAllDrawings();
    const lowerQuery = query.toLowerCase();
    
    return drawings.filter(d => 
      d.title.toLowerCase().includes(lowerQuery) ||
      d.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // Get favorites
  getFavorites(): LocalDrawing[] {
    return this.getAllDrawings().filter(d => d.isFavorite);
  }

  // Toggle favorite
  toggleFavorite(id: string): boolean {
    const drawing = this.getDrawing(id);
    if (!drawing) return false;

    this.updateDrawing(id, { isFavorite: !drawing.isFavorite });
    return !drawing.isFavorite;
  }

  // Like drawing
  likeDrawing(id: string): number {
    const drawing = this.getDrawing(id);
    if (!drawing) return 0;

    const newLikes = drawing.likes + 1;
    this.updateDrawing(id, { likes: newLikes });
    return newLikes;
  }

  // Increment views
  incrementViews(id: string): number {
    const drawing = this.getDrawing(id);
    if (!drawing) return 0;

    const newViews = drawing.views + 1;
    this.updateDrawing(id, { views: newViews });
    return newViews;
  }

  // Get statistics
  getStats() {
    const drawings = this.getAllDrawings();
    
    return {
      total: drawings.length,
      public: drawings.filter(d => d.isPublic).length,
      favorites: drawings.filter(d => d.isFavorite).length,
      totalLikes: drawings.reduce((sum, d) => sum + d.likes, 0),
      totalViews: drawings.reduce((sum, d) => sum + d.views, 0),
    };
  }

  // Sort drawings
  sortDrawings(sortBy: 'newest' | 'oldest' | 'likes' | 'views' | 'title'): LocalDrawing[] {
    const drawings = this.getAllDrawings();
    
    switch (sortBy) {
      case 'newest':
        return drawings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      case 'oldest':
        return drawings.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'likes':
        return drawings.sort((a, b) => b.likes - a.likes);
      case 'views':
        return drawings.sort((a, b) => b.views - a.views);
      case 'title':
        return drawings.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return drawings;
    }
  }

  // Recent colors
  saveRecentColor(color: string) {
    const colors = this.getRecentColors();
    const filtered = colors.filter(c => c !== color);
    filtered.unshift(color);
    
    const recent = filtered.slice(0, 10);
    localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(recent));
  }

  getRecentColors(): string[] {
    try {
      const data = localStorage.getItem(RECENT_COLORS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  // Draft auto-save
  saveDraft(canvasData: string) {
    localStorage.setItem(DRAFTS_KEY, JSON.stringify({
      canvasData,
      timestamp: new Date().toISOString(),
    }));
  }

  getDraft() {
    try {
      const data = localStorage.getItem(DRAFTS_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  clearDraft() {
    localStorage.removeItem(DRAFTS_KEY);
  }

  // Settings
  saveSettings(settings: any) {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }

  getSettings() {
    try {
      const data = localStorage.getItem(SETTINGS_KEY);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  // Export all data
  exportData(): string {
    return JSON.stringify({
      drawings: this.getAllDrawings(),
      recentColors: this.getRecentColors(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString(),
    }, null, 2);
  }

  // Import data
  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.drawings) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.drawings));
      }
      if (data.recentColors) {
        localStorage.setItem(RECENT_COLORS_KEY, JSON.stringify(data.recentColors));
      }
      if (data.settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(data.settings));
      }
      
      console.log('✅ Data imported successfully');
      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  // Clear all data
  clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(RECENT_COLORS_KEY);
    localStorage.removeItem(DRAFTS_KEY);
    localStorage.removeItem(FAVORITES_KEY);
    console.log('🗑️ All data cleared');
  }
}

export const localDB = new LocalStorageDB();

// No tokens, no backend, pure client-side magic! ✨
if (typeof window !== 'undefined') {
  console.log('🎨 Local Storage DB initialized - No tokens required!');
}
