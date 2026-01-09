import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';

interface LayoutState {
  leftSidebarSize: number;
  rightSidebarSize: number;
  leftSidebarCollapsed: boolean;
  rightSidebarCollapsed: boolean;
  
  // UI Slots configuration (future proofing for "Slot" system)
  // For now, simpler boolean flags or layout mode
  layoutMode: 'default' | 'focus' | 'gallery';
  parameterGroupOrder: string[];

  setLeftSidebarSize: (size: number) => void;
  setRightSidebarSize: (size: number) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLayoutMode: (mode: 'default' | 'focus' | 'gallery') => void;
  setParameterGroupOrder: (order: string[]) => void;
}

export const useLayoutStore = create<LayoutState>()(
  devtools(
    persist(
      (set) => ({
        leftSidebarSize: 20, // Percentage
        rightSidebarSize: 20, // Percentage
        leftSidebarCollapsed: false,
        rightSidebarCollapsed: false,
        layoutMode: 'default',
        parameterGroupOrder: ['model', 'prompt', 'params', 'resolution', 'advanced'],

        setLeftSidebarSize: (size) => set({ leftSidebarSize: size }),
        setRightSidebarSize: (size) => set({ rightSidebarSize: size }),
        toggleLeftSidebar: () => set((state) => ({ leftSidebarCollapsed: !state.leftSidebarCollapsed })),
        toggleRightSidebar: () => set((state) => ({ rightSidebarCollapsed: !state.rightSidebarCollapsed })),
        setLayoutMode: (mode) => set({ layoutMode: mode }),
        setParameterGroupOrder: (order) => set({ parameterGroupOrder: order }),
      }),
      {
        name: 'layout-storage',
      }
    ),
    { name: 'LayoutStore' }
  )
);
