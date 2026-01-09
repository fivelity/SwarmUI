import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { GripVertical } from "lucide-react";

interface SortableSectionProps {
  id: string;
  children: React.ReactNode;
}

export function SortableSection({ id, children }: SortableSectionProps) {
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
    zIndex: isDragging ? 50 : "auto",
    position: isDragging ? "relative" as const : "relative" as const,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn("group relative", isDragging && "opacity-50")}>
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-2 z-10 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity active:cursor-grabbing p-1 rounded hover:bg-muted"
        title="Drag to reorder"
      >
        <GripVertical className="w-3 h-3 text-muted-foreground" />
      </div>
      <div className="ps-2">
        {children}
      </div>
    </div>
  );
}
