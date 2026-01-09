import { useEffect, useRef } from "react";
import {
  Panel,
  Group,
  type PanelImperativeHandle,
} from "react-resizable-panels";
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
import { cn } from "@/lib/utils";
import { socketService } from "@/services/websocketService";
import { Toaster } from "@/components/ui/sonner";
import { ImageEditor } from "@/components/editor/ImageEditor";
import { ExtensionAssetLoader } from "@/components/extensions/ExtensionAssetLoader";

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

  // Initialize WebSocket connection
  useEffect(() => {
    socketService.connect();
    return () => {
        socketService.disconnect();
    };
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
        panel.expand();
      }
    }
  }, [leftSidebarCollapsed]);

  useEffect(() => {
    const panel = rightPanelRef.current;
    if (panel) {
      if (rightSidebarCollapsed) {
        panel.collapse();
      } else {
        panel.expand();
      }
    }
  }, [rightSidebarCollapsed]);

  const handleSaveMask = (maskData: string) => {
      console.log("Saved mask:", maskData);
      // TODO: Handle mask save (e.g. send to API or store in state)
  };

  return (
    <div className="h-screen w-screen bg-background overflow-hidden text-foreground flex flex-col">
      <TopNavigation />
      
      <div className="flex-1 overflow-hidden relative">
          {activeTab === 'generate' && (
            <Group orientation="horizontal" className="h-full w-full">
              
              {/* Left Sidebar Panel */}
              <Panel 
                  panelRef={leftPanelRef}
                  defaultSize={leftSidebarSize < 5 ? 20 : leftSidebarSize} 
                  minSize={15} 
                  maxSize={30}
                  collapsible={true}
                  collapsedSize={0}
                  className={cn(leftSidebarCollapsed && "min-w-0 w-0 border-none")}
                  onResize={(size) => {
                    const pct = size.asPercentage;
                    if (pct < 5) {
                        if (!leftSidebarCollapsed) setLeftSidebarCollapsed(true);
                    } else {
                        setLeftSidebarSize(pct);
                        if (leftSidebarCollapsed) setLeftSidebarCollapsed(false);
                    }
                  }}
              >
                  <LeftSidebar />
              </Panel>

              <DragHandle 
                  collapsed={leftSidebarCollapsed} 
                  onToggle={toggleLeftSidebar} 
                  direction="left" 
              />

              {/* Main Content */}
              <Panel defaultSize={100 - (leftSidebarSize < 5 ? 20 : leftSidebarSize) - (rightSidebarSize < 5 ? 20 : rightSidebarSize)} minSize={30}>
                <MainCanvas />
              </Panel>

              <DragHandle 
                  collapsed={rightSidebarCollapsed} 
                  onToggle={toggleRightSidebar} 
                  direction="right" 
              />

              {/* Right Sidebar Panel */}
              <Panel 
                  panelRef={rightPanelRef}
                  defaultSize={rightSidebarSize < 5 ? 20 : rightSidebarSize} 
                  minSize={15} 
                  maxSize={30}
                  collapsible={true}
                  collapsedSize={0}
                  className={cn(rightSidebarCollapsed && "min-w-0 w-0 border-none")}
                  onResize={(size) => {
                    const pct = size.asPercentage;
                    if (pct < 5) {
                        if (!rightSidebarCollapsed) setRightSidebarCollapsed(true);
                    } else {
                        setRightSidebarSize(pct);
                        if (rightSidebarCollapsed) setRightSidebarCollapsed(false);
                    }
                  }}
              >
                <RightSidebar />
              </Panel>

            </Group>
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
