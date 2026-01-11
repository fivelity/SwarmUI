import * as React from "react"
import { GripVerticalIcon, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Group,
  Panel,
  Separator,
  type GroupProps,
  type PanelProps,
  type PanelImperativeHandle,
} from "react-resizable-panels"
import { cn } from "@/lib/utils"

type Orientation = "horizontal" | "vertical"

interface ResizablePanelGroupProps
  extends GroupProps {
  /** Preferred v4 prop */
  orientation?: Orientation
  /** Back-compat alias */
  direction?: Orientation
}

function ResizablePanelGroup({
  className,
  orientation,
  direction,
  ...props
}: ResizablePanelGroupProps) {
  const effectiveOrientation = orientation ?? direction ?? "horizontal"
  const isVertical = effectiveOrientation === "vertical"

  return (
    <Group
      data-slot="resizable-panel-group"
      orientation={effectiveOrientation}
      className={cn(
        "flex h-full w-full min-h-0 min-w-0",
        isVertical ? "flex-col" : "flex-row",
        className
      )}
      {...props}
    />
  )
}

type ResizablePanelProps = PanelProps

const ResizablePanel = React.forwardRef<
  PanelImperativeHandle,
  ResizablePanelProps
>(function ResizablePanelInner({ className, panelRef, ...props }, forwardedRef) {
    return (
      <Panel
        data-slot="resizable-panel"
        className={cn("min-w-0 min-h-0", className)}
        panelRef={
          panelRef ??
          (forwardedRef as React.Ref<PanelImperativeHandle | null> | undefined)
        }
        {...props}
      />
    )
  })

interface ResizableHandleProps
  extends Omit<React.ComponentProps<typeof Separator>, "children"> {
  withHandle?: boolean
  onToggle?: () => void
  collapsed?: boolean
  direction?: "left" | "right"
  orientation?: Orientation
}

function ResizableHandle({
  withHandle,
  className,
  onToggle,
  collapsed,
  direction = "left",
  orientation = "horizontal",
  onDoubleClick,
  ...props
}: ResizableHandleProps) {
  const expandRequestedRef = React.useRef(false)
  const dragStartRef = React.useRef<{ x: number; y: number } | null>(null)

  React.useEffect(() => {
    if (collapsed) {
      expandRequestedRef.current = false
    }
  }, [collapsed])

  const CollapseChevron = direction === "left" ? ChevronLeft : ChevronRight
  const ExpandChevron = direction === "left" ? ChevronRight : ChevronLeft
  const Chevron = collapsed ? ExpandChevron : CollapseChevron

  const requestExpand = React.useCallback(() => {
    if (!collapsed) return
    if (expandRequestedRef.current) return
    expandRequestedRef.current = true
    onToggle?.()
  }, [collapsed, onToggle])

  const handleDoubleClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation()
    onDoubleClick?.(e)
    if (collapsed) {
      requestExpand()
    } else {
      onToggle?.()
    }
  }

  const isHorizontal = orientation === "horizontal"

  if (collapsed) {
    return (
      <Separator
        data-slot="resizable-handle"
        className={cn(
          "relative z-20 flex select-none items-center justify-center bg-transparent",
          isHorizontal ? "h-full w-[6px]" : "h-[6px] w-full",
          "group/expander",
          isHorizontal ? "cursor-col-resize" : "cursor-row-resize",
          className
        )}
        onClick={(e) => {
          const target = e.target as HTMLElement | null
          if (target?.closest("button")) return
          requestExpand()
        }}
        onPointerDownCapture={(e) => {
          if (e.button !== 0) return
          const target = e.target as HTMLElement | null
          if (target?.closest("button")) return
          dragStartRef.current = { x: e.clientX, y: e.clientY }
        }}
        onPointerMoveCapture={(e) => {
          const start = dragStartRef.current
          if (!start) return
          const dx = Math.abs(e.clientX - start.x)
          const dy = Math.abs(e.clientY - start.y)
          if (dx > 2 || dy > 2) {
            dragStartRef.current = null
            requestExpand()
          }
        }}
        onPointerUpCapture={() => {
          dragStartRef.current = null
        }}
        onDoubleClick={handleDoubleClick}
        {...props}
      >
        <button
          type="button"
          aria-label={direction === "left" ? "Expand left sidebar" : "Expand right sidebar"}
          onClick={(e) => {
            e.stopPropagation()
            requestExpand()
          }}
          className={cn(
            "pointer-events-auto flex items-center justify-center rounded-full border border-border/40 bg-background/80 p-1 text-muted-foreground shadow-sm backdrop-blur-sm",
            "opacity-0",
            direction === "left" ? "-translate-x-1" : "translate-x-1",
            "transition-[opacity,transform] duration-0 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
            "group-hover/expander:opacity-100 group-hover/expander:translate-x-0 group-hover/expander:duration-200"
          )}
        >
          <Chevron className="h-3 w-3" />
        </button>
      </Separator>
    )
  }

  return (
    <Separator
      data-slot="resizable-handle"
      className={cn(
        "relative z-20 flex select-none items-center justify-center bg-border/60",
        isHorizontal ? "h-full w-px" : "h-px w-full",
        "focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1",
        isHorizontal
          ? "after:absolute after:inset-y-0 after:left-1/2 after:w-[6px] after:-translate-x-1/2"
          : "after:absolute after:inset-x-0 after:top-1/2 after:h-[6px] after:-translate-y-1/2",
        "after:content-[''] after:bg-transparent",
        "group/handle",
        className
      )}
      onDoubleClick={handleDoubleClick}
      {...props}
    >
      {withHandle && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/70 bg-background/90 px-1.5 py-0.5 text-muted-foreground shadow-sm backdrop-blur-sm opacity-0 group-hover/handle:opacity-100 transition-opacity duration-150">
            <GripVerticalIcon
              className={cn(
                "h-3 w-3",
                !isHorizontal && "rotate-90"
              )}
            />
            <button
              type="button"
              aria-label={direction === "left" ? "Collapse left sidebar" : "Collapse right sidebar"}
              onClick={(e) => {
                e.stopPropagation()
                onToggle?.()
              }}
              className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-muted"
            >
              <Chevron className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </Separator>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
export type { PanelImperativeHandle as PanelHandle }