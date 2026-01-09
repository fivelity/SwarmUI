import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface User {
  id: string;
  username: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  
  login: (user: User, token: string) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        user: null,
        isAuthenticated: false,
        token: null,

        login: (user, token) => set({ user, isAuthenticated: true, token }),
        logout: () => set({ user: null, isAuthenticated: false, token: null }),
        hasPermission: (permission) => {
            const { user } = get();
            if (!user) return false;
            return user.permissions.includes(permission) || user.permissions.includes('*');
        },
      }),
      {
        name: 'auth-storage',
      }
    ),
    { name: 'AuthStore' }
  )
);
