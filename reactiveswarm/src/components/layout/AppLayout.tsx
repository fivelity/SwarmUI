import { useCallback, useEffect, useRef, useState } from "react"

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  type PanelHandle,
} from "@/components/ui/resizable"
import { LeftSidebar } from "./LeftSidebar"
import { RightSidebar } from "./RightSidebar"
import { MainCanvas } from "./MainCanvas"
import { TopNavigation } from "./TopNavigation"
import { ComfyUIFrame } from "./ComfyUIFrame"
import { SettingsPage } from "./SettingsPage"
import { GridGenerator } from "@/components/grid/GridGenerator"
import { ExtensionsPage } from "@/components/extensions/ExtensionsPage"
import { ToolsPage } from "@/components/resources/ToolsPage"
import { useLayoutStore } from "@/stores/useLayoutStore"
import { useUIStore } from "@/stores/useUIStore"
import { useServerStore } from "@/stores/useServerStore"
import { useT2IParamsStore } from "@/stores/useT2IParamsStore"
import { useParameterStore } from "@/stores/useParameterStore"
import { cn } from "@/lib/utils"
import { Toaster } from "@/components/ui/sonner"
import { ImageEditor } from "@/components/editor/ImageEditor"
import { ExtensionAssetLoader } from "@/components/extensions/ExtensionAssetLoader"
import type { Layout } from "react-resizable-panels"

const COLLAPSE_SNAP_PCT = 4

export function AppLayout() {
  const {
    leftSidebarSize,
    rightSidebarSize,
    setLeftSidebarSize,
    setRightSidebarSize,
    leftSidebarCollapsed,
    rightSidebarCollapsed,
    setLeftSidebarCollapsed,
    setRightSidebarCollapsed,
  } = useLayoutStore()

  const {
    activeTab,
    setIsMobile,
    editingImage,
    setEditingImage,
  } = useUIStore()

  const selectedModel = useParameterStore((s) => s.model)
  const setSelectedModel = useParameterStore((s) => s.setModel)
  const modelsBySubtype = useT2IParamsStore((s) => s.models)
  const modelsLoadedAt = useT2IParamsStore((s) => s.lastLoadedAt)

  const leftPanelRef = useRef<PanelHandle | null>(null)
  const rightPanelRef = useRef<PanelHandle | null>(null)

  const wasMobileRef = useRef<boolean>(false)
  const preMobileLayoutRef = useRef<{
    leftSidebarCollapsed: boolean
    rightSidebarCollapsed: boolean
    leftSidebarSize: number
    rightSidebarSize: number
  } | null>(null)

  const toggleLeft = useCallback(() => {
    const store = useLayoutStore.getState()
    const collapsed = store.leftSidebarCollapsed
    const panel = leftPanelRef.current

    if (collapsed) {
      setLeftSidebarCollapsed(false)
      if (panel) {
        panel.expand()
      }
      return
    }

    if (panel) {
      const current = panel.getSize().asPercentage
      if (current > COLLAPSE_SNAP_PCT) setLeftSidebarSize(current)
      panel.collapse()
    }

    setLeftSidebarCollapsed(true)
  }, [setLeftSidebarCollapsed, setLeftSidebarSize])

  const toggleRight = useCallback(() => {
    const store = useLayoutStore.getState()
    const collapsed = store.rightSidebarCollapsed
    const panel = rightPanelRef.current

    if (collapsed) {
      setRightSidebarCollapsed(false)
      if (panel) {
        panel.expand()
      }
      return
    }

    if (panel) {
      const current = panel.getSize().asPercentage
      if (current > COLLAPSE_SNAP_PCT) setRightSidebarSize(current)
      panel.collapse()
    }

    setRightSidebarCollapsed(true)
  }, [setRightSidebarCollapsed, setRightSidebarSize])

  // Server + model bootstrap
  useEffect(() => {
    useServerStore.getState().start()
    void useT2IParamsStore.getState().load()
    return () => useServerStore.getState().stop()
  }, [])

  useEffect(() => {
    if (selectedModel.trim().length > 0) return
    const stable = modelsBySubtype["Stable-Diffusion"]
    if (!Array.isArray(stable)) return
    const first = stable.find(
      (m): m is string => typeof m === "string" && m.trim().length > 0
    )
    if (!first) return
    setSelectedModel(first.trim())
  }, [modelsBySubtype, modelsLoadedAt, selectedModel, setSelectedModel])

  // Mobile layout handling
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768 // md breakpoint
      setIsMobile(mobile)

      const wasMobile = wasMobileRef.current
      const store = useLayoutStore.getState()

      if (mobile && !wasMobile) {
        preMobileLayoutRef.current = {
          leftSidebarCollapsed: store.leftSidebarCollapsed,
          rightSidebarCollapsed: store.rightSidebarCollapsed,
          leftSidebarSize: store.leftSidebarSize,
          rightSidebarSize: store.rightSidebarSize,
        }

        if (!store.leftSidebarCollapsed) setLeftSidebarCollapsed(true)
        if (!store.rightSidebarCollapsed) setRightSidebarCollapsed(true)
      }

      if (!mobile && wasMobile) {
        const snapshot = preMobileLayoutRef.current
        if (snapshot) {
          setLeftSidebarSize(snapshot.leftSidebarSize)
          setRightSidebarSize(snapshot.rightSidebarSize)
          setLeftSidebarCollapsed(snapshot.leftSidebarCollapsed)
          setRightSidebarCollapsed(snapshot.rightSidebarCollapsed)
        } else {
          if (store.leftSidebarCollapsed) setLeftSidebarCollapsed(false)
          if (store.rightSidebarCollapsed) setRightSidebarCollapsed(false)
        }
        preMobileLayoutRef.current = null
      }

      wasMobileRef.current = mobile
    }

    checkMobile()

    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [
    setIsMobile,
    setLeftSidebarCollapsed,
    setRightSidebarCollapsed,
    setLeftSidebarSize,
    setRightSidebarSize,
  ])

  // Keyboard shortcuts for toggling sidebars
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "[") {
        e.preventDefault()
        toggleLeft()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "]") {
        e.preventDefault()
        toggleRight()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleLeft, toggleRight])

  const effectiveLeftSize = leftSidebarCollapsed
    ? 0
    : leftSidebarSize < 5
    ? 20
    : leftSidebarSize

  const effectiveRightSize = rightSidebarCollapsed
    ? 0
    : rightSidebarSize < 5
    ? 20
    : rightSidebarSize

  const mainDefaultSize = Math.max(
    20,
    100 - effectiveLeftSize - effectiveRightSize
  )

  // IMPORTANT: defaultLayout must be stable. If it changes across renders,
  // react-resizable-panels may re-apply it and fight the user's drag.
  const [defaultLayout] = useState<Layout>(() => {
    return {
      "left-sidebar": effectiveLeftSize,
      "main-content": mainDefaultSize,
      "right-sidebar": effectiveRightSize,
    }
  })

  const handleLayoutChange = useCallback(
    (layout: Layout) => {
      const left = layout["left-sidebar"]
      const right = layout["right-sidebar"]

      if (typeof left === "number") {
        if (left <= COLLAPSE_SNAP_PCT) {
          if (!useLayoutStore.getState().leftSidebarCollapsed) {
            setLeftSidebarCollapsed(true)
          }
        } else {
          setLeftSidebarSize(left)
          if (useLayoutStore.getState().leftSidebarCollapsed) {
            setLeftSidebarCollapsed(false)
          }
        }
      }

      if (typeof right === "number") {
        if (right <= COLLAPSE_SNAP_PCT) {
          if (!useLayoutStore.getState().rightSidebarCollapsed) {
            setRightSidebarCollapsed(true)
          }
        } else {
          setRightSidebarSize(right)
          if (useLayoutStore.getState().rightSidebarCollapsed) {
            setRightSidebarCollapsed(false)
          }
        }
      }
    },
    [
      setLeftSidebarCollapsed,
      setLeftSidebarSize,
      setRightSidebarCollapsed,
      setRightSidebarSize,
    ]
  )

  const handleSaveMask = (maskData: string) => {
    void maskData
  }

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <TopNavigation />

      <div className="relative flex-1 min-h-0 overflow-hidden">
        {activeTab === "generate" && (
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full w-full"
            defaultLayout={defaultLayout}
            onLayoutChange={handleLayoutChange}
          >
            {/* Left Sidebar Panel */}
            <ResizablePanel
              id="left-sidebar"
              panelRef={leftPanelRef}
              minSize="1%"
              maxSize="30%"
              collapsible
              collapsedSize="0%"
              className={cn(
                "h-full min-w-0 min-h-0 overflow-hidden transition-[background,border-color] duration-200 ease-in-out",
                leftSidebarCollapsed && "border-none"
              )}
            >
              <LeftSidebar />
            </ResizablePanel>

            <ResizableHandle
              withHandle
              orientation="horizontal"
              onToggle={toggleLeft}
              collapsed={leftSidebarCollapsed}
              direction="left"
              title={
                leftSidebarCollapsed
                  ? "Expand sidebar"
                  : "Drag to resize. Double-click or click to collapse."
              }
            />

            {/* Main Content */}
            <ResizablePanel
              id="main-content"
              minSize="30%"
              className="h-full min-w-0 min-h-0 overflow-hidden"
            >
              <MainCanvas />
            </ResizablePanel>

            <ResizableHandle
              withHandle
              orientation="horizontal"
              onToggle={toggleRight}
              collapsed={rightSidebarCollapsed}
              direction="right"
              title={
                rightSidebarCollapsed
                  ? "Expand gallery"
                  : "Drag to resize. Double-click or click to collapse."
              }
            />

            {/* Right Sidebar Panel */}
            <ResizablePanel
              id="right-sidebar"
              panelRef={rightPanelRef}
              minSize="1%"
              maxSize="30%"
              collapsible
              collapsedSize="0%"
              className={cn(
                "h-full min-w-0 min-h-0 overflow-hidden transition-[background,border-color] duration-200 ease-in-out",
                rightSidebarCollapsed && "border-none"
              )}
            >
              <RightSidebar />
            </ResizablePanel>
          </ResizablePanelGroup>
        )}

        {activeTab === "comfy" && <ComfyUIFrame />}
        {activeTab === "grid" && <GridGenerator />}
        {activeTab === "tools" && <ToolsPage />}
        {activeTab === "extensions" && <ExtensionsPage />}
        {activeTab === "settings" && <SettingsPage />}
      </div>

      <ImageEditor
        imageUrl={editingImage || ""}
        isOpen={!!editingImage}
        onClose={() => setEditingImage(null)}
        onSave={handleSaveMask}
      />

      <ExtensionAssetLoader />
      <Toaster />
    </div>
  )
}