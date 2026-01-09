import { ChevronLeft, ChevronRight } from "lucide-react";
import { Separator } from "react-resizable-panels";
import { cn } from "@/lib/utils";

interface DragHandleProps {
  collapsed: boolean;
  onToggle: () => void;
  direction: 'left' | 'right';
  className?: string;
}

export function DragHandle({ collapsed, onToggle, direction, className }: DragHandleProps) {
  const isLeft = direction === 'left';
  
  return (
    <Separator className={cn("w-px bg-border transition-colors hover:bg-primary/50 relative flex items-center justify-center z-50", className)}>
      <button 
        onClick={onToggle}
        className={cn(
          "absolute z-50 h-6 w-4 bg-border flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer",
          isLeft ? "left-0 rounded-e-sm" : "right-0 rounded-s-sm"
        )}
        title={collapsed ? `Expand ${isLeft ? 'Sidebar' : 'Gallery'}` : `Collapse ${isLeft ? 'Sidebar' : 'Gallery'}`}
      >
        {collapsed ? (
            // If collapsed
            isLeft ? <ChevronRight size={12} /> : <ChevronLeft size={12} />
        ) : (
            // If expanded
            isLeft ? <ChevronLeft size={12} /> : <ChevronRight size={12} />
        )}
      </button>
    </Separator>
  );
}
