import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Tab = 'generate' | 'comfy' | 'settings' | 'history';

interface UIState {
  activeTab: Tab;
  activeDialog: string | null;
  layoutModificationMode: boolean;
  isMobile: boolean;
  
  setActiveTab: (tab: Tab) => void;
  openDialog: (dialogId: string) => void;
  closeDialog: () => void;
  setLayoutModificationMode: (active: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        activeTab: 'generate',
        activeDialog: null,
        layoutModificationMode: false,
        isMobile: false,

        setActiveTab: (activeTab) => set({ activeTab }),
        openDialog: (activeDialog) => set({ activeDialog }),
        closeDialog: () => set({ activeDialog: null }),
        setLayoutModificationMode: (layoutModificationMode) => set({ layoutModificationMode }),
        setIsMobile: (isMobile) => set({ isMobile }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ activeTab: state.activeTab }), // Only persist active tab
      }
    ),
    { name: 'UIStore' }
  )
);
