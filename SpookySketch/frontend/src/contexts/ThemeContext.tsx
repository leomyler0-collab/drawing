'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'halloween' | 'christmas' | 'newyear';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('halloween');

  useEffect(() => {
    // Auto-select theme based on current date
    const currentTheme = getThemeByDate();
    setTheme(currentTheme);

    // Update theme daily
    const interval = setInterval(() => {
      const newTheme = getThemeByDate();
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    }, 1000 * 60 * 60 * 24); // Check once per day

    return () => clearInterval(interval);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
