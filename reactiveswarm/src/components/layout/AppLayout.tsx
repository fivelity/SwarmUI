import { useEffect, useRef } from "react";
import {
  type PanelImperativeHandle,
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
import { useServerStore } from "@/store/useServerStore";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { ImageEditor } from "@/components/editor/ImageEditor";
import { ExtensionAssetLoader } from "@/components/extensions/ExtensionAssetLoader";

type PanelSize = { asPercentage: number; inPixels: number };

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

  const leftPanelRef = useRef<PanelImperativeHandle>(null);
  const rightPanelRef = useRef<PanelImperativeHandle>(null);

  // SwarmUI generation sockets are per-request (active WS pattern). No global socket.

  useEffect(() => {
    useServerStore.getState().start();
    return () => useServerStore.getState().stop();
  }, []);

  // Handle Window Resize (Mobile Detection)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      if (mobile) {
        if (!useLayoutStore.getState().leftSidebarCollapsed) toggleLeftSidebar();
        if (!useLayoutStore.getState().rightSidebarCollapsed) toggleRightSidebar();
      }
    };

    // Check on mount
    checkMobile();

    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile, toggleLeftSidebar, toggleRightSidebar]);

  // Handle Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

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
        const sizeObj = panel.getSize();
        const currentSize = sizeObj.asPercentage;
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
        const sizeObj = panel.getSize();
        const currentSize = sizeObj.asPercentage;
        const targetSize = rightSidebarSize < 5 ? 20 : rightSidebarSize;
        
        if (Math.abs(currentSize - targetSize) > 0.1 || currentSize < 5) {
            panel.expand();
            panel.resize(targetSize);
        }
      }
    }
  }, [rightSidebarCollapsed, rightSidebarSize]);

  const handleSaveMask = (maskData: string) => {
      console.log("Saved mask:", maskData);
      // TODO: Handle mask save (e.g. send to API or store in state)
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
                  minSize={15} 
                  maxSize={30}
                  collapsible={true}
                  collapsedSize={0}
                  className={cn("transition-all duration-300 ease-in-out", leftSidebarCollapsed && "min-w-0 w-0 border-none")}
                  onResize={(size: PanelSize) => {
                    // size is { asPercentage: number, inPixels: number }
                    const pct = size.asPercentage;
                    
                    if (pct >= 5) {
                         setLeftSidebarSize(pct);
                         if (leftSidebarCollapsed) setLeftSidebarCollapsed(false);
                    } else if (pct < 1) {
                         if (!leftSidebarCollapsed) setLeftSidebarCollapsed(true);
                    }
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
              <ResizablePanel defaultSize={100 - (leftSidebarSize < 5 ? 20 : leftSidebarSize) - (rightSidebarSize < 5 ? 20 : rightSidebarSize)} minSize={30}>
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
                  minSize={15} 
                  maxSize={30}
                  collapsible={true}
                  collapsedSize={0}
                  className={cn("transition-all duration-300 ease-in-out", rightSidebarCollapsed && "min-w-0 w-0 border-none")}
                  onResize={(size: PanelSize) => {
                    const pct = size.asPercentage;
                    if (pct >= 5) {
                        setRightSidebarSize(pct);
                        if (rightSidebarCollapsed) setRightSidebarCollapsed(false);
                    } else if (pct < 1) {
                        if (!rightSidebarCollapsed) setRightSidebarCollapsed(true);
                    }
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
