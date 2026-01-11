import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

interface DraggableCollapsibleSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  headerActions?: React.ReactNode;
  // Optional toggle control
  toggleEnabled?: boolean;
  onToggleChange?: (enabled: boolean) => void;
  // Styling
  className?: string;
}

export function DraggableCollapsibleSection({
  id,
  title,
  children,
  defaultOpen = false,
  headerActions,
  toggleEnabled,
  onToggleChange,
  className,
}: DraggableCollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'border-b border-border/30 last:border-0 bg-background',
        isDragging && 'opacity-50 z-50',
        className
      )}
    >
      <div className="w-full flex items-center gap-2 px-3 py-2 hover:bg-muted/20 transition-colors min-w-0">
        {/* Drag Handle */}
        <button
          type="button"
          className="cursor-grab active:cursor-grabbing touch-none"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
        </button>

        {/* Collapse/Expand Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 flex-1 text-left min-w-0 self-stretch -my-2 py-2"
        >
          {isOpen ? (
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-3 w-3 text-muted-foreground" />
          )}
          <span className="text-xs font-medium uppercase tracking-wide text-foreground/80 truncate">
            {title}
          </span>
        </button>

        {headerActions && (
          <div
            className="shrink-0 flex items-center"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            {headerActions}
          </div>
        )}

        {/* Optional Toggle Switch */}
        {onToggleChange !== undefined && (
          <Switch
            checked={toggleEnabled}
            onCheckedChange={onToggleChange}
            onClick={(e) => e.stopPropagation()}
            className="scale-75 origin-right"
          />
        )}
      </div>

      {/* Content */}
      {isOpen && toggleEnabled !== false && (
        <div className="px-3 pb-4 pt-1 space-y-4 animate-in slide-in-from-top-1 fade-in duration-200 w-full max-w-full min-w-0 overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}
