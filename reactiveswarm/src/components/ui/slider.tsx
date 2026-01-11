import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

export interface SliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  showValue?: boolean
  showMinMax?: boolean
  stripeDirection?: "forward" | "backward"
  thumbVariant?: "default" | "bar" | "tactical" | "dot"
}

type ThumbInteractionState = {
  hover: boolean
  focus: boolean
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  showValue = false,
  showMinMax = false,
  stripeDirection = "forward",
  thumbVariant = "default",
  ...props
}: SliderProps) {
  const [thumbStates, setThumbStates] = React.useState<Partial<Record<number, ThumbInteractionState>>>({})

  const normalizedValue = React.useMemo(() => {
    if (Array.isArray(value)) return value
    return undefined
  }, [value])

  const normalizedDefaultValue = React.useMemo(() => {
    if (Array.isArray(defaultValue)) return defaultValue
    return undefined
  }, [defaultValue])

  const _values = React.useMemo(() => {
    if (normalizedValue) return normalizedValue
    if (normalizedDefaultValue) return normalizedDefaultValue
    return [min]
  }, [normalizedValue, normalizedDefaultValue, min])

  const displayValue = React.useMemo(() => {
    if (normalizedValue && normalizedValue.length > 0) return normalizedValue[0]
    if (normalizedDefaultValue && normalizedDefaultValue.length > 0) return normalizedDefaultValue[0]
    return min
  }, [normalizedValue, normalizedDefaultValue, min])

  const stripeAngle = stripeDirection === "forward" ? "35deg" : "-35deg"

  const getThumbBaseStyles = (variant: string) => {
    switch (variant) {
      case "bar":
        return {
          width: "3px",
          height: "20px",
          background: "var(--color-primary)",
          borderColor: "transparent",
          boxShadow:
            "0 0 6px color-mix(in srgb, var(--color-primary) 50%, transparent), 0 0 12px color-mix(in srgb, var(--color-primary) 28%, transparent)",
        }
      case "tactical":
        return {
          width: "16px",
          height: "20px",
          background: `
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--color-muted) 58%, var(--color-foreground) 42%),
            color-mix(in srgb, var(--color-muted) 92%, var(--color-background) 8%)
          ),
          repeating-linear-gradient(
            45deg,
            color-mix(in srgb, var(--color-foreground) 28%, transparent),
            color-mix(in srgb, var(--color-foreground) 28%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 26%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 26%, transparent) 2px,
            transparent 2px,
            transparent 6px
          ),
          repeating-linear-gradient(
            -45deg,
            color-mix(in srgb, var(--color-foreground) 22%, transparent),
            color-mix(in srgb, var(--color-foreground) 22%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 20%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 20%, transparent) 2px,
            transparent 2px,
            transparent 7px
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--color-background) 55%, transparent),
            transparent 55%,
            color-mix(in srgb, var(--color-background) 70%, transparent)
          )
          `,
          borderColor: "color-mix(in srgb, var(--color-primary) 60%, transparent)",
          boxShadow:
            "inset 0 1px 0 color-mix(in srgb, var(--color-background) 55%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--color-foreground) 18%, transparent), inset 0 0 10px color-mix(in srgb, var(--color-background) 55%, transparent), 0 0 6px color-mix(in srgb, var(--color-primary) 35%, transparent)",
        }
      case "dot":
        return {
          width: "10px",
          height: "10px",
          background: "var(--color-primary)",
          borderColor: "color-mix(in srgb, var(--color-primary) 80%, transparent)",
          boxShadow:
            "0 0 6px color-mix(in srgb, var(--color-primary) 45%, transparent), inset 0 0 4px color-mix(in srgb, var(--color-primary) 30%, transparent)",
          borderRadius: "1px",
        }
      default:
        return {
          width: "12px",
          height: "20px",
          background: `
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--color-muted) 60%, var(--color-foreground) 40%),
            color-mix(in srgb, var(--color-muted) 92%, var(--color-background) 8%)
          ),
          repeating-linear-gradient(
            45deg,
            color-mix(in srgb, var(--color-foreground) 26%, transparent),
            color-mix(in srgb, var(--color-foreground) 26%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 24%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 24%, transparent) 2px,
            transparent 2px,
            transparent 6px
          ),
          repeating-linear-gradient(
            -45deg,
            color-mix(in srgb, var(--color-foreground) 20%, transparent),
            color-mix(in srgb, var(--color-foreground) 20%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 18%, transparent) 1px,
            color-mix(in srgb, var(--color-background) 18%, transparent) 2px,
            transparent 2px,
            transparent 7px
          ),
          linear-gradient(
            180deg,
            color-mix(in srgb, var(--color-background) 55%, transparent),
            transparent 60%,
            color-mix(in srgb, var(--color-background) 70%, transparent)
          )
          `,
          borderColor: "var(--color-border)",
          boxShadow:
            "inset 0 1px 0 color-mix(in srgb, var(--color-background) 55%, transparent), inset 0 -1px 0 color-mix(in srgb, var(--color-foreground) 18%, transparent), inset 0 0 10px color-mix(in srgb, var(--color-background) 55%, transparent), 0 0 4px color-mix(in srgb, var(--color-primary) 20%, transparent)",
        }
    }
  }

  const getThumbInteractiveStyles = (variant: string, index: number) => {
    const baseStyles = getThumbBaseStyles(variant)
    const state = thumbStates[index]
    const isHovered = state?.hover ?? false
    const isFocused = state?.focus ?? false

    if (!isHovered && !isFocused) return baseStyles

    switch (variant) {
      case "bar":
        return {
          ...baseStyles,
          boxShadow: isFocused
            ? "0 0 10px color-mix(in srgb, var(--color-primary) 55%, transparent), 0 0 18px color-mix(in srgb, var(--color-primary) 25%, transparent)"
            : "0 0 8px color-mix(in srgb, var(--color-primary) 45%, transparent), 0 0 14px color-mix(in srgb, var(--color-primary) 20%, transparent)",
        }
      case "tactical":
        return {
          ...baseStyles,
          borderColor: isFocused ? "var(--color-primary)" : "color-mix(in srgb, var(--color-primary) 80%, transparent)",
          boxShadow: isFocused
            ? "inset 0 0 10px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 0 10px color-mix(in srgb, var(--color-primary) 55%, transparent), 0 0 16px color-mix(in srgb, var(--color-primary) 22%, transparent)"
            : "inset 0 0 8px color-mix(in srgb, var(--color-primary) 30%, transparent), 0 0 8px color-mix(in srgb, var(--color-primary) 40%, transparent), 0 0 14px color-mix(in srgb, var(--color-primary) 18%, transparent)",
        }
      case "dot":
        return {
          ...baseStyles,
          boxShadow: isFocused
            ? "0 0 10px color-mix(in srgb, var(--color-primary) 55%, transparent), inset 0 0 7px color-mix(in srgb, var(--color-primary) 45%, transparent)"
            : "0 0 8px color-mix(in srgb, var(--color-primary) 40%, transparent), inset 0 0 6px color-mix(in srgb, var(--color-primary) 34%, transparent)",
        }
      default:
        return {
          ...baseStyles,
          borderColor: isFocused
            ? "color-mix(in srgb, var(--color-primary) 60%, transparent)"
            : isHovered
              ? "color-mix(in srgb, var(--color-primary) 50%, transparent)"
              : baseStyles.borderColor,
          boxShadow: isFocused
            ? "inset 0 0 10px color-mix(in srgb, var(--color-primary) 32%, transparent), 0 0 9px color-mix(in srgb, var(--color-primary) 45%, transparent), 0 0 16px color-mix(in srgb, var(--color-primary) 18%, transparent)"
            : "inset 0 0 8px color-mix(in srgb, var(--color-primary) 24%, transparent), 0 0 7px color-mix(in srgb, var(--color-primary) 32%, transparent), 0 0 12px color-mix(in srgb, var(--color-primary) 14%, transparent)",
        }
    }
  }

  return (
    <div className="relative w-full">
      {showValue && (
        <div className="flex justify-center mb-2">
          <div className="bg-card/50 border border-primary/30 px-3 py-1 rounded font-mono text-xs text-primary">
            {displayValue}
          </div>
        </div>
      )}

      <SliderPrimitive.Root
        data-slot="slider"
        defaultValue={normalizedDefaultValue}
        value={normalizedValue}
        min={min}
        max={max}
        className={cn(
          "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col",
          className,
        )}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="bg-muted/30 border border-border/40 relative grow overflow-hidden data-[orientation=horizontal]:h-2 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-2"
          style={{
            boxShadow: "0 0 4px color-mix(in srgb, var(--color-primary) 20%, transparent)",
          }}
        >
          <SliderPrimitive.Range
            data-slot="slider-range"
            className="absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
            style={{
              background: `repeating-linear-gradient(
              ${stripeAngle},
              color-mix(in srgb, var(--color-primary) 60%, transparent),
              color-mix(in srgb, var(--color-primary) 60%, transparent) 8px,
              color-mix(in srgb, var(--color-card) 85%, transparent) 8px,
              color-mix(in srgb, var(--color-card) 85%, transparent) 16px
            )`,
              borderLeft: "1px solid color-mix(in srgb, var(--color-primary) 60%, transparent)",
              boxShadow:
                "inset 0 0 8px color-mix(in srgb, var(--color-primary) 20%, transparent), 0 0 6px color-mix(in srgb, var(--color-primary) 28%, transparent)",
            }}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => {
          const thumbStyles = getThumbInteractiveStyles(thumbVariant, index)
          return (
            <SliderPrimitive.Thumb
              data-slot="slider-thumb"
              key={index}
              className={cn(
                "block shrink-0 border-2 transition-all duration-200 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing relative",
                "bg-card",
                thumbVariant === "tactical" && "overflow-visible",
              )}
              style={{
                ...thumbStyles,
                borderRadius: thumbVariant === "dot" ? "1px" : "0",
              }}
              onMouseEnter={() => {
                setThumbStates((prev) => {
                  const current: ThumbInteractionState = prev[index] ?? { hover: false, focus: false }
                  return { ...prev, [index]: { ...current, hover: true } }
                })
              }}
              onMouseLeave={() => {
                setThumbStates((prev) => {
                  const current: ThumbInteractionState = prev[index] ?? { hover: false, focus: false }
                  return { ...prev, [index]: { ...current, hover: false } }
                })
              }}
              onFocus={() => {
                setThumbStates((prev) => {
                  const current: ThumbInteractionState = prev[index] ?? { hover: false, focus: false }
                  return { ...prev, [index]: { ...current, focus: true } }
                })
              }}
              onBlur={() => {
                setThumbStates((prev) => {
                  const current: ThumbInteractionState = prev[index] ?? { hover: false, focus: false }
                  return { ...prev, [index]: { ...current, focus: false } }
                })
              }}
            >
              {thumbVariant === "tactical" && (
                <>
                  <span className="absolute inset-0 bg-tactical-dots opacity-20 pointer-events-none" />
                  {/* Corner brackets */}
                  <span
                    className="absolute -top-[2px] -left-[2px] w-[6px] h-[6px] border-l-[1.5px] border-t-[1.5px] border-primary/70 pointer-events-none"
                  />
                  <span
                    className="absolute -top-[2px] -right-[2px] w-[6px] h-[6px] border-r-[1.5px] border-t-[1.5px] border-primary/70 pointer-events-none"
                  />
                  <span
                    className="absolute -bottom-[2px] -left-[2px] w-[6px] h-[6px] border-l-[1.5px] border-b-[1.5px] border-primary/70 pointer-events-none"
                  />
                  <span
                    className="absolute -bottom-[2px] -right-[2px] w-[6px] h-[6px] border-r-[1.5px] border-b-[1.5px] border-primary/70 pointer-events-none"
                  />
                  {/* Center indicator line */}
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-3 bg-primary/60 pointer-events-none"
                  />
                </>
              )}
            </SliderPrimitive.Thumb>
          )
        })}
      </SliderPrimitive.Root>

      {showMinMax && (
        <div className="flex justify-between mt-2">
          <span className="font-mono text-xs text-muted-foreground">{min}</span>
          <span className="font-mono text-xs text-muted-foreground">{max}</span>
        </div>
      )}
    </div>
  )
}

export { Slider }
