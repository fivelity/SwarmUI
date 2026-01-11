import { create } from "zustand"
import { persist, devtools } from "zustand/middleware"

type LayoutMode = "default" | "focus" | "gallery"

interface LayoutState {
  leftSidebarSize: number
  rightSidebarSize: number
  leftSidebarCollapsed: boolean
  rightSidebarCollapsed: boolean

  layoutMode: LayoutMode
  parameterGroupOrder: string[]

  setLeftSidebarSize: (size: number) => void
  setRightSidebarSize: (size: number) => void
  toggleLeftSidebar: () => void
  toggleRightSidebar: () => void
  setLeftSidebarCollapsed: (collapsed: boolean) => void
  setRightSidebarCollapsed: (collapsed: boolean) => void
  setLayoutMode: (mode: LayoutMode) => void
  setParameterGroupOrder: (order: string[]) => void
}

export const useLayoutStore = create<LayoutState>()(
  devtools(
    persist(
      (set) => ({
        leftSidebarSize: 20, // percentage
        rightSidebarSize: 20, // percentage
        leftSidebarCollapsed: false,
        rightSidebarCollapsed: false,
        layoutMode: "default",
        parameterGroupOrder: [
          "model",
          "prompt",
          "params",
          "resolution",
          "advanced",
          "backend",
        ],

        setLeftSidebarSize: (size) =>
          set({ leftSidebarSize: Math.max(0, Math.min(100, size)) }),
        setRightSidebarSize: (size) =>
          set({ rightSidebarSize: Math.max(0, Math.min(100, size)) }),
        toggleLeftSidebar: () =>
          set((state) => ({
            leftSidebarCollapsed: !state.leftSidebarCollapsed,
          })),
        toggleRightSidebar: () =>
          set((state) => ({
            rightSidebarCollapsed: !state.rightSidebarCollapsed,
          })),
        setLeftSidebarCollapsed: (collapsed) =>
          set({ leftSidebarCollapsed: collapsed }),
        setRightSidebarCollapsed: (collapsed) =>
          set({ rightSidebarCollapsed: collapsed }),
        setLayoutMode: (mode) => set({ layoutMode: mode }),
        setParameterGroupOrder: (order) =>
          set({ parameterGroupOrder: order }),
      }),
      {
        name: "layout-storage",
      }
    ),
    { name: "LayoutStore" }
  )
)