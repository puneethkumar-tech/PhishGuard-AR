'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { getStoredSettings, setStoredSettings } from '@/lib/storage';

export type Theme = 'dark' | 'light' | 'system';
export type ResolvedTheme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'phishguard_theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('dark');
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark');
  const [mounted, setMounted] = useState(false);

  // Initialize theme from storage or system on mount
  useEffect(() => {
    try {
      const stored = (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || getStoredSettings()?.appearance?.theme || 'dark';
      setThemeState(stored);
      applyTheme(stored);
    } catch {
      applyTheme('dark');
    }
    setMounted(true);
  }, []);

  // Listen to OS system color scheme changes when theme === 'system'
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = () => {
      if (theme === 'system') {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]);

  const applyTheme = (targetTheme: Theme) => {
    if (typeof window === 'undefined') return;

    let active: ResolvedTheme = 'dark';
    if (targetTheme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      active = systemDark ? 'dark' : 'light';
    } else {
      active = targetTheme;
    }

    setResolvedTheme(active);

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(active);
    root.setAttribute('data-theme', active);
    root.style.colorScheme = active;
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
      const currentSettings = getStoredSettings();
      if (currentSettings?.appearance) {
        setStoredSettings({
          ...currentSettings,
          appearance: {
            ...currentSettings.appearance,
            theme: newTheme,
          },
        });
      }
    } catch {
      // ignore storage errors
    }
    applyTheme(newTheme);
  };

  const toggleTheme = () => {
    const nextTheme: Theme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'dark',
      resolvedTheme: 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
  return context;
};
