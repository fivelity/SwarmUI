import { useEffect, useRef } from "react";
import {
  type PanelImperativeHandle,
  type PanelSize,
} from "react-resizable-panels";
import {
  ResizablePanelGroup,
  ResizablePanel,
} from "@/components/ui/resizable";
import { LeftSidebar } from "./LeftSidebar";
import { RightSidebar } from "./RightSidebar";
import { MainCanvas } from "./MainCanvas";
import { DragHandle } from "./DragHandle";
import { TopNavigation } from "./TopNavigation";
import { ComfyUIFrame } from "./ComfyUIFrame";
import { SettingsPage } from "./SettingsPage";
import { GridGenerator } from "@/components/grid/GridGenerator";
import { ExtensionsPage } from "@/components/extensions/ExtensionsPage";
import { ToolsPage } from "@/components/resources/ToolsPage";
import { useLayoutStore } from "@/stores/layoutStore";
import { useUIStore } from "@/stores/uiStore";
import { useServerStore } from "@/stores/serverStore";
import { useT2IParamsStore } from "@/stores/t2iParamsStore";
import { useParameterStore } from "@/stores/parameterStore";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ImageEditor } from "@/components/editor/ImageEditor";
import { ExtensionAssetLoader } from "@/components/extensions/ExtensionAssetLoader";

const COLLAPSE_SNAP_PCT = 4;

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
      setRightSidebarCollapsed
  } = useLayoutStore();

  const { activeTab, setIsMobile, editingImage, setEditingImage } = useUIStore();

  const selectedModel = useParameterStore((s) => s.model);
  const setSelectedModel = useParameterStore((s) => s.setModel);
  const modelsBySubtype = useT2IParamsStore((s) => s.models);
  const modelsLoadedAt = useT2IParamsStore((s) => s.lastLoadedAt);

  const leftPanelRef = useRef<PanelImperativeHandle>(null);
  const rightPanelRef = useRef<PanelImperativeHandle>(null);

  const wasMobileRef = useRef<boolean>(false);
  const preMobileLayoutRef = useRef<{
    leftSidebarCollapsed: boolean;
    rightSidebarCollapsed: boolean;
    leftSidebarSize: number;
    rightSidebarSize: number;
  } | null>(null);

  useEffect(() => {
    useServerStore.getState().start();
    void useT2IParamsStore.getState().load();
    return () => useServerStore.getState().stop();
  }, []);

  useEffect(() => {
    if (selectedModel.trim().length > 0) return;
    const stable = modelsBySubtype["Stable-Diffusion"];
    if (!Array.isArray(stable)) return;
    const first = stable.find((m): m is string => typeof m === "string" && m.trim().length > 0);
    if (!first) return;
    setSelectedModel(first.trim());
  }, [modelsBySubtype, modelsLoadedAt, selectedModel, setSelectedModel]);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);

      const wasMobile = wasMobileRef.current;
      const store = useLayoutStore.getState();

      if (mobile && !wasMobile) {
        preMobileLayoutRef.current = {
          leftSidebarCollapsed: store.leftSidebarCollapsed,
          rightSidebarCollapsed: store.rightSidebarCollapsed,
          leftSidebarSize: store.leftSidebarSize,
          rightSidebarSize: store.rightSidebarSize,
        };

        if (!store.leftSidebarCollapsed) setLeftSidebarCollapsed(true);
        if (!store.rightSidebarCollapsed) setRightSidebarCollapsed(true);
      }

      if (!mobile && wasMobile) {
        const snapshot = preMobileLayoutRef.current;
        if (snapshot) {
          setLeftSidebarSize(snapshot.leftSidebarSize);
          setRightSidebarSize(snapshot.rightSidebarSize);
          setLeftSidebarCollapsed(snapshot.leftSidebarCollapsed);
          setRightSidebarCollapsed(snapshot.rightSidebarCollapsed);
        } else {
          if (store.leftSidebarCollapsed) setLeftSidebarCollapsed(false);
          if (store.rightSidebarCollapsed) setRightSidebarCollapsed(false);
        }
        preMobileLayoutRef.current = null;
      }

      wasMobileRef.current = mobile;
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [setIsMobile, setLeftSidebarCollapsed, setRightSidebarCollapsed, setLeftSidebarSize, setRightSidebarSize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '[') {
        e.preventDefault();
        toggleLeftSidebar();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === ']') {
        e.preventDefault();
        toggleRightSidebar();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleLeftSidebar, toggleRightSidebar]);

  useEffect(() => {
    const panel = leftPanelRef.current;
    if (panel) {
      if (leftSidebarCollapsed) {
        panel.collapse();
      } else {
        const currentSize = panel.getSize().asPercentage;
        const targetSize = leftSidebarSize < 5 ? 20 : leftSidebarSize;
        
        if (Math.abs(currentSize - targetSize) > 0.1 || currentSize < 5) {
          panel.expand(); 
          panel.resize(targetSize);
        }
      }
    }
  }, [leftSidebarCollapsed, leftSidebarSize]);

  useEffect(() => {
    const panel = rightPanelRef.current;
    if (panel) {
      if (rightSidebarCollapsed) {
        panel.collapse();
      } else {
        const currentSize = panel.getSize().asPercentage;
        const targetSize = rightSidebarSize < 5 ? 20 : rightSidebarSize;
        
        if (Math.abs(currentSize - targetSize) > 0.1 || currentSize < 5) {
          panel.expand();
          panel.resize(targetSize);
        }
      }
    }
  }, [rightSidebarCollapsed, rightSidebarSize]);

  const handleSaveMask = (maskData: string) => {
    void maskData;
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden text-foreground flex flex-col">
      <TopNavigation />
      
      <div className="flex-1 overflow-hidden relative">
          {activeTab === 'generate' && (
            <ResizablePanelGroup orientation="horizontal" className="h-full w-full">
              
              {/* Left Sidebar Panel */}
              <ResizablePanel 
                  panelRef={leftPanelRef}
                  defaultSize={leftSidebarSize < 5 ? 20 : leftSidebarSize}
                  minSize={1}
                  maxSize={30}
                  collapsible={true}
                  collapsedSize={0}
                  className={cn("min-w-0 overflow-hidden transition-all duration-300 ease-in-out", leftSidebarCollapsed && "border-none")}
                  onResize={(size: PanelSize) => {
                    const pct = size.asPercentage;
                    if (pct <= COLLAPSE_SNAP_PCT) {
                      if (!leftSidebarCollapsed) setLeftSidebarCollapsed(true);
                      return;
                    }

                    setLeftSidebarSize(pct);
                    if (leftSidebarCollapsed) setLeftSidebarCollapsed(false);
                  }}
              >
                  <LeftSidebar />
              </ResizablePanel>

              <DragHandle 
                  collapsed={leftSidebarCollapsed} 
                  onToggle={toggleLeftSidebar} 
                  direction="left" 
              />

              {/* Main Content */}
              <ResizablePanel
                defaultSize={100 - (leftSidebarSize < 5 ? 20 : leftSidebarSize) - (rightSidebarSize < 5 ? 20 : rightSidebarSize)}
                minSize={30}
                className="min-w-0 overflow-hidden"
              >
                <MainCanvas />
              </ResizablePanel>

              <DragHandle 
                  collapsed={rightSidebarCollapsed} 
                  onToggle={toggleRightSidebar} 
                  direction="right" 
              />

              {/* Right Sidebar Panel */}
              <ResizablePanel 
                  panelRef={rightPanelRef}
                  defaultSize={rightSidebarSize < 5 ? 20 : rightSidebarSize}
                  minSize={1}
                  maxSize={30}
                  collapsible={true}
                  collapsedSize={0}
                  className={cn("min-w-0 overflow-hidden transition-all duration-300 ease-in-out", rightSidebarCollapsed && "border-none")}
                  onResize={(size: PanelSize) => {
                    const pct = size.asPercentage;
                    if (pct <= COLLAPSE_SNAP_PCT) {
                      if (!rightSidebarCollapsed) setRightSidebarCollapsed(true);
                      return;
                    }

                    setRightSidebarSize(pct);
                    if (rightSidebarCollapsed) setRightSidebarCollapsed(false);
                  }}
              >
                <RightSidebar />
              </ResizablePanel>

            </ResizablePanelGroup>
          )}

          {activeTab === 'comfy' && <ComfyUIFrame />}
          {activeTab === 'grid' && <GridGenerator />}
          {activeTab === 'tools' && <ToolsPage />}
          {activeTab === 'extensions' && <ExtensionsPage />}
          {activeTab === 'settings' && <SettingsPage />}
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
  );
}
