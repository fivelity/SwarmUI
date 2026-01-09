import { useUIStore } from "@/stores/uiStore";
import { useGenerationStore } from "@/stores/generationStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
    Cpu, 
    Settings, 
    Layers, 
    Activity,
    RefreshCw,
    Menu,
    Grid,
    Box,
    Wrench
} from "lucide-react";

export function TopNavigation() {
  const { activeTab, setActiveTab } = useUIStore();
  const { isGenerating, queuePosition, totalQueue, progress } = useGenerationStore();

  const tabs = [
    { id: 'generate', label: 'Generate', icon: Layers },
    { id: 'grid', label: 'Grid', icon: Grid },
    { id: 'tools', label: 'Tools', icon: Wrench },
    { id: 'comfy', label: 'ComfyUI', icon: Cpu },
    { id: 'extensions', label: 'Extensions', icon: Box },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="h-12 border-b border-border bg-card flex items-center justify-between px-4 select-none">
      {/* Left Section: Branding & Tabs */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
           <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
             <Activity className="w-5 h-5" />
           </div>
           <span className="hidden sm:inline">ReactiveSwarm</span>
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                    <Button
                        key={tab.id}
                        variant={isActive ? "secondary" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "gap-2 transition-all",
                            isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        <span className="hidden md:inline">{tab.label}</span>
                    </Button>
                );
            })}
        </nav>
      </div>

      {/* Right Section: Status & Actions */}
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className="flex items-center gap-3 px-3 py-1.5 bg-muted/50 rounded-md border border-border">
            <div className="flex items-center gap-2 text-xs">
                <span className={cn(
                    "w-2 h-2 rounded-full",
                    isGenerating ? "bg-green-500 animate-pulse" : "bg-muted-foreground"
                )} />
                <span className="text-muted-foreground font-mono">
                    {isGenerating 
                        ? `Generating (${Math.round(progress * 100)}%)` 
                        : "Idle"}
                </span>
            </div>
            {totalQueue > 0 && (
                <>
                    <div className="h-3 w-px bg-border" />
                    <span className="text-xs text-muted-foreground font-mono">
                        Queue: {queuePosition}/{totalQueue}
                    </span>
                </>
            )}
        </div>

        <div className="h-6 w-px bg-border hidden sm:block" />

        {/* Quick Actions */}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <RefreshCw className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground sm:hidden">
            <Menu className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
