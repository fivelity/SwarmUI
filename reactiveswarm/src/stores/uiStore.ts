import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

type Tab = 'generate' | 'comfy' | 'settings' | 'history' | 'grid';

interface UIState {
  activeTab: Tab;
  activeDialog: string | null;
  layoutModificationMode: boolean;
  isMobile: boolean;
  editingImage: string | null;
  
  setActiveTab: (tab: Tab) => void;
  openDialog: (dialogId: string) => void;
  closeDialog: () => void;
  setLayoutModificationMode: (active: boolean) => void;
  setIsMobile: (isMobile: boolean) => void;
  setEditingImage: (image: string | null) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        activeTab: 'generate',
        activeDialog: null,
        layoutModificationMode: false,
        isMobile: false,
        editingImage: null,

        setActiveTab: (activeTab) => set({ activeTab }),
        openDialog: (activeDialog) => set({ activeDialog }),
        closeDialog: () => set({ activeDialog: null }),
        setLayoutModificationMode: (layoutModificationMode) => set({ layoutModificationMode }),
        setIsMobile: (isMobile) => set({ isMobile }),
        setEditingImage: (editingImage) => set({ editingImage }),
      }),
      {
        name: 'ui-storage',
        partialize: (state) => ({ activeTab: state.activeTab }), // Only persist active tab
      }
    ),
    { name: 'UIStore' }
  )
);
