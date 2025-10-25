'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'halloween' | 'christmas' | 'newyear';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isTestMode: boolean;
  setIsTestMode: (value: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('halloween');
  const [isTestMode, setIsTestMode] = useState(false);

  useEffect(() => {
    // Check if test mode is enabled in localStorage
    const testMode = localStorage.getItem('theme_test_mode') === 'true';
    setIsTestMode(testMode);

    if (testMode) {
      // In test mode, use saved theme preference
      const savedTheme = localStorage.getItem('theme_preference') as Theme;
      if (savedTheme) {
        setTheme(savedTheme);
      }
    } else {
      // In production, auto-select theme based on date
      const currentTheme = getThemeByDate();
      setTheme(currentTheme);
    }
  }, []);

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme);
    if (isTestMode) {
      localStorage.setItem('theme_preference', newTheme);
    }
  };

  const handleSetTestMode = (value: boolean) => {
    setIsTestMode(value);
    localStorage.setItem('theme_test_mode', value.toString());
    
    if (!value) {
      // Exiting test mode, switch to date-based theme
      localStorage.removeItem('theme_preference');
      const currentTheme = getThemeByDate();
      setTheme(currentTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: handleSetTheme, isTestMode, setIsTestMode: handleSetTestMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Determine theme based on current date
function getThemeByDate(): Theme {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const day = now.getDate();

  // Halloween: October 1 - October 31
  if (month === 9) {
    return 'halloween';
  }

  // Christmas: November 1 - December 31
  if (month === 10 || month === 11) {
    return 'christmas';
  }

  // New Year: January 1 - January 31
  if (month === 0) {
    return 'newyear';
  }

  // Default to Halloween for rest of the year
  return 'halloween';
}
