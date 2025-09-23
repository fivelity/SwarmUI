import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getThemes } from '../services/api';

interface Theme {
  id: string;
  name: string;
  colors: { [key: string]: string };
}

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
  const [themes, setThemes] = useState<Theme[]>([]);
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    getThemes().then(fetchedThemes => {
      if (fetchedThemes && fetchedThemes.length > 0) {
        setThemes(fetchedThemes);
        // TODO: Load user's preferred theme from cookies/localStorage
        setThemeState(fetchedThemes[0]);
      }
    });
  }, []);

  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      // It seems the theme object from the backend doesn't have a `colors` property.
      // This needs to be investigated. For now, this will fail silently.
      if (theme.colors) {
        Object.entries(theme.colors).forEach(([key, value]) => {
          root.style.setProperty(`--color-${key}`, value);
        });
      }
    }
  }, [theme]);

  const setTheme = (themeId: string) => {
    const newTheme = themes.find(t => t.id === themeId);
    if (newTheme) {
      setThemeState(newTheme);
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
