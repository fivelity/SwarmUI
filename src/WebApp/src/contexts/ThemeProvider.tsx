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
      applyThemeVars(theme);
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

// Helper: choose black or white depending on background luminance
function getContrastColor(hex: string): string {
  const c = hex.replace('#', '');
  const bigint = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  // Perceived luminance
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance > 186 ? '#000000' : '#FFFFFF';
}

// Exported so other places (like installer step) can apply a live preview
export function applyThemeVars(theme: Theme) {
  const root = document.documentElement;
  const c = theme.colors || {} as Record<string, string>;

  const background = c.background || '#FFFFFF';
  const text = c.text || getContrastColor(background);

  const primary = c.primary || '#3B82F6';
  const primaryForeground = c['primary-foreground'] || getContrastColor(primary);

  const secondary = c.secondary || '#F3F4F6';
  const secondaryForeground = c['secondary-foreground'] || getContrastColor(secondary);

  const card = c.card || background;
  const cardForeground = c['card-foreground'] || text;

  const popover = c.popover || card;
  const popoverForeground = c['popover-foreground'] || cardForeground;

  const muted = c.muted || secondary;
  const mutedForeground = c['muted-foreground'] || getContrastColor(muted);

  const accent = c.accent || primary;
  const accentForeground = c['accent-foreground'] || getContrastColor(accent);

  const destructive = c.destructive || '#EF4444';
  const ring = c.ring || '#94A3B8';
  const border = c.border || '#E5E7EB';
  const input = c.input || '#E5E7EB';

  // Set base variables expected by index.css (@theme maps these to --color-*)
  root.style.setProperty('--background', background);
  root.style.setProperty('--foreground', text);
  root.style.setProperty('--card', card);
  root.style.setProperty('--card-foreground', cardForeground);
  root.style.setProperty('--popover', popover);
  root.style.setProperty('--popover-foreground', popoverForeground);
  root.style.setProperty('--primary', primary);
  root.style.setProperty('--primary-foreground', primaryForeground);
  root.style.setProperty('--secondary', secondary);
  root.style.setProperty('--secondary-foreground', secondaryForeground);
  root.style.setProperty('--muted', muted);
  root.style.setProperty('--muted-foreground', mutedForeground);
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--accent-foreground', accentForeground);
  root.style.setProperty('--destructive', destructive);
  root.style.setProperty('--border', border);
  root.style.setProperty('--input', input);
  root.style.setProperty('--ring', ring);
}
