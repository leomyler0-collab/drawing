// Local storage utilities

export const storage = {
  // Save data to localStorage
  set: (key: string, value: any): void => {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },

  // Get data from localStorage
  get: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return defaultValue;
    }
  },

  // Remove item from localStorage
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },

  // Clear all localStorage
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

// Canvas-specific storage
export const canvasStorage = {
  saveDrawing: (name: string, dataURL: string): void => {
    const drawings = storage.get<Record<string, string>>('spooky_drawings', {});
    drawings![name] = dataURL;
    storage.set('spooky_drawings', drawings);
  },

  getDrawing: (name: string): string | null => {
    const drawings = storage.get<Record<string, string>>('spooky_drawings', {});
    return drawings?.[name] || null;
  },

  getAllDrawings: (): Record<string, string> => {
    return storage.get<Record<string, string>>('spooky_drawings', {}) || {};
  },

  deleteDrawing: (name: string): void => {
    const drawings = storage.get<Record<string, string>>('spooky_drawings', {});
    if (drawings) {
      delete drawings[name];
      storage.set('spooky_drawings', drawings);
    }
  },
};

// User preferences
export const preferences = {
  save: (prefs: any): void => {
    storage.set('spooky_preferences', prefs);
  },

  get: (): any => {
    return storage.get('spooky_preferences', {
      lastColor: '#FF6B00',
      lastBrushSize: 5,
      lastTool: 'brush',
      showTutorial: true,
    });
  },

  update: (key: string, value: any): void => {
    const prefs = preferences.get();
    prefs[key] = value;
    preferences.save(prefs);
  },
};
