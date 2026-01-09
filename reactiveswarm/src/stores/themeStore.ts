import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'dark' | 'light' | 'system';
  accentColor: string;
  radius: number;
  
  setTheme: (theme: 'dark' | 'light' | 'system') => void;
  setAccentColor: (color: string) => void;
  setRadius: (radius: number) => void;
}

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        theme: 'dark',
        accentColor: 'zinc',
        radius: 0.5,

        setTheme: (theme) => set({ theme }),
        setAccentColor: (accentColor) => set({ accentColor }),
        setRadius: (radius) => set({ radius }),
      }),
      {
        name: 'theme-storage',
      }
    ),
    { name: 'ThemeStore' }
  )
);
