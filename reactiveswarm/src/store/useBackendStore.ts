import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface BackendState {
  isConnected: boolean;
  backendUrl: string;

  setConnected: (isConnected: boolean) => void;
  setBackendUrl: (url: string) => void;
}

export const useBackendStore = create<BackendState>()(
  devtools(
    persist(
      (set) => ({
        isConnected: false,
        backendUrl: import.meta.env.VITE_SWARMUI_URL ?? "http://localhost:7801",

        setConnected: (isConnected) => set({ isConnected }),
        setBackendUrl: (backendUrl) => set({ backendUrl }),
      }),
      {
        name: "backend-storage",
      },
    ),
    { name: "BackendStore" },
  ),
);
