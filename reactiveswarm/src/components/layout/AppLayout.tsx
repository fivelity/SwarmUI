import { useEffect, useRef } from "react"
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
import type { PanelSize } from "react-resizable-panels"

const COLLAPSE_SNAP_PCT = 4

export function AppLayout() {
  const {
    leftSidebarSize,
    rightSidebarSize,
    setLeftSidebarSize,
    setRightSidebarSize,
    leftSidebarCollapsed,
    rightSidebarCollapsed,
    toggleLeftSidebar,
    toggleRightSidebar,
    setLeftSidebarCollapsed,
    setRightSidebarCollapsed,
  } = useLayoutStore()

  const { activeTab, setIsMobile, editingImage, setEditingImage } = useUIStore()

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
        toggleLeftSidebar()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "]") {
        e.preventDefault()
        toggleRightSidebar()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleLeftSidebar, toggleRightSidebar])

  // Sync left panel with store (collapse / expand / resize)
  useEffect(() => {
    const panel = leftPanelRef.current
    if (!panel) return

    if (leftSidebarCollapsed) {
      panel.collapse()
      return
    }

    const currentSize = panel.getSize().asPercentage
    const targetSize = leftSidebarSize < 5 ? 20 : leftSidebarSize

    if (Math.abs(currentSize - targetSize) > 0.1 || currentSize < 5) {
      panel.expand()
      panel.resize(targetSize)
    }
  }, [leftSidebarCollapsed, leftSidebarSize])

  // Sync right panel with store (collapse / expand / resize)
  useEffect(() => {
    const panel = rightPanelRef.current
    if (!panel) return

    if (rightSidebarCollapsed) {
      panel.collapse()
      return
    }

    const currentSize = panel.getSize().asPercentage
    const targetSize = rightSidebarSize < 5 ? 20 : rightSidebarSize

    if (Math.abs(currentSize - targetSize) > 0.1 || currentSize < 5) {
      panel.expand()
      panel.resize(targetSize)
    }
  }, [rightSidebarCollapsed, rightSidebarSize])

  const handleSaveMask = (maskData: string) => {
    void maskData
  }

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

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <TopNavigation />

      <div className="relative flex-1 overflow-hidden">
        {activeTab === "generate" && (
          <ResizablePanelGroup
            orientation="horizontal"
            className="h-full w-full"
          >
            {/* Left Sidebar Panel */}
            <ResizablePanel
              ref={leftPanelRef}
              defaultSize={effectiveLeftSize}
              minSize={1}
              maxSize={30}
              collapsible
              collapsedSize={0}
              className={cn(
                "min-w-0 overflow-hidden transition-[background,border-color] duration-200 ease-in-out",
                leftSidebarCollapsed && "border-none"
              )}
              onResize={(size: PanelSize) => {
                const pct = size.asPercentage
                if (pct <= COLLAPSE_SNAP_PCT) {
                  if (!leftSidebarCollapsed) setLeftSidebarCollapsed(true)
                  return
                }

                setLeftSidebarSize(pct)
                if (leftSidebarCollapsed) setLeftSidebarCollapsed(false)
              }}
            >
              <LeftSidebar />
            </ResizablePanel>

            <ResizableHandle
              withHandle
              onToggle={() => {
                const collapsed = useLayoutStore.getState().leftSidebarCollapsed
                if (collapsed) {
                  setLeftSidebarCollapsed(false)
                  const panel = leftPanelRef.current
                  if (panel) {
                    const target = leftSidebarSize < 5 ? 20 : leftSidebarSize
                    panel.expand()
                    panel.resize(target)
                  }
                } else {
                  setLeftSidebarCollapsed(true)
                  leftPanelRef.current?.collapse()
                }
              }}
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
              defaultSize={mainDefaultSize}
              minSize={30}
              className="min-w-0 overflow-hidden"
            >
              <MainCanvas />
            </ResizablePanel>

            <ResizableHandle
              withHandle
              onToggle={() => {
                const collapsed = useLayoutStore.getState().rightSidebarCollapsed
                if (collapsed) {
                  setRightSidebarCollapsed(false)
                  const panel = rightPanelRef.current
                  if (panel) {
                    const target = rightSidebarSize < 5 ? 20 : rightSidebarSize
                    panel.expand()
                    panel.resize(target)
                  }
                } else {
                  setRightSidebarCollapsed(true)
                  rightPanelRef.current?.collapse()
                }
              }}
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
              ref={rightPanelRef}
              defaultSize={effectiveRightSize}
              minSize={1}
              maxSize={30}
              collapsible
              collapsedSize={0}
              className={cn(
                "min-w-0 overflow-hidden transition-[background,border-color] duration-200 ease-in-out",
                rightSidebarCollapsed && "border-none"
              )}
              onResize={(size: PanelSize) => {
                const pct = size.asPercentage
                if (pct <= COLLAPSE_SNAP_PCT) {
                  if (!rightSidebarCollapsed) setRightSidebarCollapsed(true)
                  return
                }

                setRightSidebarSize(pct)
                if (rightSidebarCollapsed) setRightSidebarCollapsed(false)
              }}
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