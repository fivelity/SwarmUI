import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface BackendState {
  isConnected: boolean;
  backendUrl: string;
  
  setConnected: (isConnected: boolean) => void;
  setBackendUrl: (url: string) => void;
}

export const useBackendStore = create<BackendState>()(
  devtools(
    (set) => ({
      isConnected: false,
      backendUrl: "http://localhost:7801", // Default SwarmUI port
      
      setConnected: (isConnected) => set({ isConnected }),
      setBackendUrl: (backendUrl) => set({ backendUrl }),
    }),
    { name: 'BackendStore' }
  )
);
