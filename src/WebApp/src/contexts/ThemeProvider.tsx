import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { themes as availableThemes, getThemeById, getDefaultTheme, type Theme } from '../themes';

interface ThemeContextType {
  theme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [themes] = useState<Theme[]>(availableThemes);
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    // Load theme from localStorage or use default
    const savedThemeId = localStorage.getItem('user-theme');
    const savedTheme = savedThemeId ? getThemeById(savedThemeId) : null;
    setThemeState(savedTheme || getDefaultTheme());
  }, []);

  useEffect(() => {
    if (theme && theme.colors) {
      const root = document.documentElement;
      // Apply theme colors as CSS variables
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value);
      });
    }
  }, [theme]);

  const setTheme = (themeId: string) => {
    const newTheme = getThemeById(themeId);
    if (newTheme) {
      setThemeState(newTheme);
      localStorage.setItem('user-theme', themeId);
    }
  };

  if (!theme) {
    return null; // Or a loading spinner
  }

  return (
    <ThemeContext.Provider value={{ theme, themes, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
