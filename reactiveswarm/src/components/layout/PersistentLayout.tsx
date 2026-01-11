import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { PanelImperativeHandle, PanelSize } from 'react-resizable-panels';
import { ResizablePanelGroup, ResizablePanel } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { PanelLeft, PanelRight } from 'lucide-react';
import { DragHandle } from '@/components/layout/DragHandle';
import { useLayoutStore } from '@/stores/layoutStore';

interface PersistentLayoutProps {
  children: ReactNode; // Main content for the center area
  leftSidebar?: ReactNode;
  rightSidebar?: ReactNode;
  fullWidth?: boolean;
}

export function PersistentLayout({ 
  children, 
  leftSidebar, 
  rightSidebar, 
  fullWidth = false 
}: PersistentLayoutProps) {
  const isMobile = useIsMobile();
  const [leftOpen, setLeftOpen] = useState(false);
  const [rightOpen, setRightOpen] = useState(false);

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
  } = useLayoutStore();

  const leftPanelRef = useRef<PanelImperativeHandle>(null);
  const rightPanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    const panel = leftPanelRef.current;
    if (!panel) return;
    if (!leftSidebar) return;

    if (leftSidebarCollapsed) {
      panel.collapse();
      return;
    }

    const targetSize = leftSidebarSize < 5 ? 20 : leftSidebarSize;
    const currentSize = panel.getSize().asPercentage;
    if (Math.abs(currentSize - targetSize) > 0.1 || currentSize < 5) {
      panel.expand();
      panel.resize(targetSize);
    }
  }, [leftSidebar, leftSidebarCollapsed, leftSidebarSize]);

  useEffect(() => {
    const panel = rightPanelRef.current;
    if (!panel) return;
    if (!rightSidebar) return;

    if (rightSidebarCollapsed) {
      panel.collapse();
      return;
    }

    const targetSize = rightSidebarSize < 5 ? 20 : rightSidebarSize;
    const currentSize = panel.getSize().asPercentage;
    if (Math.abs(currentSize - targetSize) > 0.1 || currentSize < 5) {
      panel.expand();
      panel.resize(targetSize);
    }
  }, [rightSidebar, rightSidebarCollapsed, rightSidebarSize]);

  // In full width mode, we hide sidebars and expand main content
  if (fullWidth) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-1 min-h-0 overflow-hidden">
          {children}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="h-full flex flex-col">
        <div className="shrink-0 border-b border-border bg-background/95 backdrop-blur-md">
          <div className="h-11 px-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              {leftSidebar && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setLeftOpen(true)}
                >
                  <PanelLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {rightSidebar && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => setRightOpen(true)}
                >
                  <PanelRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-hidden">{children}</div>

        {leftSidebar && (
          <Sheet open={leftOpen} onOpenChange={setLeftOpen}>
            <SheetContent side="left" className="p-0">
              <div className="h-full flex flex-col min-w-0 bg-background overflow-hidden">
                <ScrollArea className="flex-1 min-w-0">
                  <div className="min-w-0 w-full">{leftSidebar}</div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        )}

        {rightSidebar && (
          <Sheet open={rightOpen} onOpenChange={setRightOpen}>
            <SheetContent side="right" className="p-0">
              <div className="h-full flex flex-col min-w-0 bg-background overflow-hidden">
                <ScrollArea className="flex-1 min-w-0">
                  <div className="min-w-0 w-full">{rightSidebar}</div>
                </ScrollArea>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <ResizablePanelGroup orientation="horizontal" className="flex-1 min-w-0 min-h-0">
        {/* Left Sidebar */}
        <ResizablePanel
          id="left-sidebar"
          panelRef={leftPanelRef}
          defaultSize={leftSidebar ? (leftSidebarSize < 5 ? 20 : leftSidebarSize) : 0}
          minSize={leftSidebar ? 1 : 0}
          maxSize={leftSidebar ? 35 : 0}
          collapsible={true}
          collapsedSize={0}
          className={cn("min-w-0", leftSidebarCollapsed && "border-none")}
          onResize={(size: PanelSize) => {
            if (!leftSidebar) return;
            const pct = size.asPercentage;
            if (pct <= 4) {
              if (!leftSidebarCollapsed) setLeftSidebarCollapsed(true);
              return;
            }

            setLeftSidebarSize(pct);
            if (leftSidebarCollapsed) setLeftSidebarCollapsed(false);
          }}
        >
          <div className="h-full flex flex-col min-w-0 border-r border-border bg-background overflow-hidden">
            <ScrollArea className="flex-1 min-w-0">
              <div className="min-w-0 w-full">
                {leftSidebar}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>

        {leftSidebar && (
          <DragHandle
            collapsed={leftSidebarCollapsed}
            onToggle={toggleLeftSidebar}
            direction="left"
            className="z-40"
          />
        )}

        {/* Main Content Area */}
        <ResizablePanel
          id="main-content"
          defaultSize={100 - (leftSidebar ? (leftSidebarSize < 5 ? 20 : leftSidebarSize) : 0) - (rightSidebar ? (rightSidebarSize < 5 ? 20 : rightSidebarSize) : 0)}
          minSize={30}
          className="min-w-0"
        >
          <div className="h-full flex flex-col overflow-hidden">
            <div className="flex-1 min-h-0 overflow-hidden">
              {children}
            </div>
          </div>
        </ResizablePanel>

        {/* Right Sidebar */}
        {rightSidebar && (
          <DragHandle
            collapsed={rightSidebarCollapsed}
            onToggle={toggleRightSidebar}
            direction="right"
            className="z-40"
          />
        )}
        <ResizablePanel
          id="right-sidebar"
          panelRef={rightPanelRef}
          defaultSize={rightSidebar ? (rightSidebarSize < 5 ? 20 : rightSidebarSize) : 0}
          minSize={rightSidebar ? 1 : 0}
          maxSize={rightSidebar ? 50 : 0}
          collapsible={true}
          collapsedSize={0}
          className={cn("min-w-0", rightSidebarCollapsed && "border-none")}
          onResize={(size: PanelSize) => {
            if (!rightSidebar) return;
            const pct = size.asPercentage;
            if (pct <= 4) {
              if (!rightSidebarCollapsed) setRightSidebarCollapsed(true);
              return;
            }

            setRightSidebarSize(pct);
            if (rightSidebarCollapsed) setRightSidebarCollapsed(false);
          }}
        >
          <div className="h-full flex flex-col min-w-0 border-l border-border bg-background overflow-hidden">
            <ScrollArea className="flex-1 min-w-0">
              <div className="min-w-0 w-full">
                {rightSidebar}
              </div>
            </ScrollArea>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
