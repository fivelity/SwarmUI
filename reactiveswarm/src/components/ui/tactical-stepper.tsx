"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { cn } from "@/lib/utils"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface JourneyStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
}

interface TacticalStepperProps {
  steps: JourneyStep[]
  currentStep: number
  onTransitionChange?: (isTransitioning: boolean) => void
  onNavigateNext?: () => void
  onNavigatePrevious?: () => void
  onStepClick?: (stepNumber: number) => void
  canProceed: boolean
  showNavigationButtons: boolean
  allowClickableSteps: boolean
  showProgressMeter: boolean
  showBracketAnimation: boolean
  showProgressBar: boolean
  stepAnimationSpeed: number
  bracketAnimationSpeed: number
  bracketWidth: number
  maxWidth: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full"
  stepSize: "sm" | "md" | "lg"
  showStepLabels: boolean
}

export function TacticalStepper({
  steps,
  currentStep,
  onTransitionChange,
  onNavigateNext,
  onNavigatePrevious,
  onStepClick,
  canProceed = false,
  showNavigationButtons = true,
  allowClickableSteps = false,
  showProgressMeter = true,
  showBracketAnimation = true,
  showProgressBar = true,
  stepAnimationSpeed = 600,
  bracketAnimationSpeed = 300,
  bracketWidth = 34,
  maxWidth = "3xl",
  stepSize = "md",
  showStepLabels = true,
}: TacticalStepperProps) {
  const [indicatorPosition, setIndicatorPosition] = useState(0)
  const [verticalLineHeight, setVerticalLineHeight] = useState(0)
  const [horizontalLineWidth, setHorizontalLineWidth] = useState(0)
  const [cornerLineHeight, setCornerLineHeight] = useState(0)
  const [activeStep, setActiveStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [hasInitialized, setHasInitialized] = useState(false)

  const animationTimeoutsRef = useRef<Array<ReturnType<typeof window.setTimeout>>>([])
  const progressBarRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const distanceToStepRef = useRef(0)
  const activeStepRef = useRef<number>(0)

  useEffect(() => {
    activeStepRef.current = activeStep
  }, [activeStep])

  const stepSizeClasses = {
    sm: "w-10 h-10",
    md: "w-12 h-12",
    lg: "w-14 h-14",
  }

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-full",
  }

  const calculateStepPosition = (stepNumber: number): number => {
    const stepEl = stepRefs.current[stepNumber - 1]
    if (!progressBarRef.current || !stepEl) {
      return 0
    }

    const progressBarRect = progressBarRef.current.getBoundingClientRect()
    const stepRect = stepEl.getBoundingClientRect()

    const stepCenter = stepRect.left + stepRect.width / 2
    const progressBarLeft = progressBarRect.left
    const relativePosition = stepCenter - progressBarLeft
    const percentage = (relativePosition / progressBarRect.width) * 100

    const progressBarBottom = progressBarRect.bottom
    const stepTop = stepRect.top
    distanceToStepRef.current = stepTop - progressBarBottom - 10

    return percentage
  }

  const clearAnimations = () => {
    animationTimeoutsRef.current.forEach(clearTimeout)
    animationTimeoutsRef.current = []
  }

  useEffect(() => {
    if (hasInitialized || !showBracketAnimation) return

    const initTimer = setTimeout(() => {
      const targetPosition = calculateStepPosition(1)
      if (targetPosition === 0) {
        return
      }

      setHasInitialized(true)
      setIsAnimating(true)

      const t1 = setTimeout(() => {
        setIndicatorPosition(targetPosition)
      }, 30)

      const t2 = setTimeout(() => {
        setVerticalLineHeight(distanceToStepRef.current)
      }, stepAnimationSpeed - 70)

      const t3 = setTimeout(() => {
        setHorizontalLineWidth(bracketWidth)
      }, stepAnimationSpeed + 200)

      const t4 = setTimeout(() => {
        setCornerLineHeight(12)
      }, stepAnimationSpeed + 350)

      const t5 = setTimeout(() => {
        setActiveStep(1)
      }, stepAnimationSpeed + 450)

      const t6 = setTimeout(() => {
        setIsAnimating(false)
      }, stepAnimationSpeed + 600)

      animationTimeoutsRef.current = [t1, t2, t3, t4, t5, t6]
    }, 100)

    return () => {
      clearTimeout(initTimer)
      clearAnimations()
    }
  }, [hasInitialized, showBracketAnimation, stepAnimationSpeed, bracketAnimationSpeed, bracketWidth])

  useEffect(() => {
    if (!hasInitialized || currentStep === activeStep) return

    clearAnimations()
    setIsAnimating(true)

    if (showBracketAnimation) {
      setCornerLineHeight(0)

      const t1 = setTimeout(() => {
        setHorizontalLineWidth(0)
      }, bracketAnimationSpeed * 0.4)

      const t2 = setTimeout(() => {
        setVerticalLineHeight(0)
      }, bracketAnimationSpeed * 0.9)

      const t3 = setTimeout(() => {
        setActiveStep(0)
      }, bracketAnimationSpeed * 1.67)

      animationTimeoutsRef.current.push(t1, t2, t3)
    }

    const t4 = setTimeout(
      () => {
        const targetPosition = calculateStepPosition(currentStep)
        setIndicatorPosition(targetPosition)
      },
      showBracketAnimation ? bracketAnimationSpeed * 2.1 : 0,
    )

    const t5 = setTimeout(
      () => {
        if (showBracketAnimation) {
          setVerticalLineHeight(distanceToStepRef.current)
        }
      },
      showBracketAnimation ? stepAnimationSpeed * 1.93 : stepAnimationSpeed * 0.5,
    )

    const t6 = setTimeout(
      () => {
        if (showBracketAnimation) {
          setHorizontalLineWidth(bracketWidth)
        }
      },
      showBracketAnimation ? stepAnimationSpeed * 2.3 : stepAnimationSpeed * 0.7,
    )

    const t7 = setTimeout(
      () => {
        if (showBracketAnimation) {
          setCornerLineHeight(12)
        }
      },
      showBracketAnimation ? stepAnimationSpeed * 2.55 : stepAnimationSpeed * 0.85,
    )

    const t8 = setTimeout(
      () => {
        setActiveStep(currentStep)
      },
      showBracketAnimation ? stepAnimationSpeed * 2.75 : stepAnimationSpeed,
    )

    const t9 = setTimeout(
      () => {
        setIsAnimating(false)
      },
      showBracketAnimation ? stepAnimationSpeed * 3 : stepAnimationSpeed * 1.2,
    )

    animationTimeoutsRef.current.push(t4, t5, t6, t7, t8, t9)

    return () => clearAnimations()
  }, [currentStep, activeStep, hasInitialized, showBracketAnimation, stepAnimationSpeed, bracketAnimationSpeed, bracketWidth])

  useEffect(() => {
    onTransitionChange?.(isAnimating)
  }, [isAnimating, onTransitionChange])

  useEffect(() => {
    const handleResize = () => {
      const step = activeStepRef.current
      if (step > 0) {
        const targetPosition = calculateStepPosition(step)
        setIndicatorPosition(targetPosition)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const isStepClickable = allowClickableSteps && typeof onStepClick === "function"


  return (
    <div className={cn("relative w-full mx-auto", maxWidthClasses[maxWidth])}>
      {showProgressMeter && (
        <div
          ref={progressBarRef}
          className="relative h-2 mb-8 rounded-full overflow-hidden bg-muted/40 border border-border/40"
        >
          {showProgressBar && (
            <>
              <div
                className="absolute top-0 left-0 h-full bg-linear-to-r from-primary/50 via-primary to-primary/70 transition-all ease-out"
                style={{ 
                  width: `${indicatorPosition}%`, 
                  transitionDuration: `${stepAnimationSpeed}ms`,
                  boxShadow:
                    "0 0 10px color-mix(in srgb, var(--color-primary) 35%, transparent), inset 0 1px 0 color-mix(in srgb, var(--color-background) 22%, transparent)",
                }}
              />
            </>
          )}

          <div
            className="absolute -top-1 h-4 w-1 -translate-x-1/2 bg-primary transition-all ease-out shadow-[0_0_12px_color-mix(in_srgb,var(--color-primary)_35%,transparent)]"
            style={{ left: `${indicatorPosition}%`, transitionDuration: `${stepAnimationSpeed}ms` }}
          />

          {showBracketAnimation && (
            <div
              className="absolute top-full -translate-x-1/2 transition-all ease-out"
              style={{ left: `${indicatorPosition}%`, transitionDuration: `${stepAnimationSpeed}ms` }}
            >
              <div
                className="w-[2px] bg-primary/70 origin-top mx-auto shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
                style={{
                  height: `${verticalLineHeight}px`,
                  transition: `height ${bracketAnimationSpeed}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                }}
              />

              <div className="relative flex items-center justify-center">
                <div
                  className="absolute top-0 right-0 h-[2px] bg-primary/70 origin-right shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
                  style={{
                    width: `${horizontalLineWidth}px`,
                    transition: `width ${Math.floor(bracketAnimationSpeed * 0.6)}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-0 w-[2px] bg-primary/70 origin-top"
                    style={{
                      height: `${cornerLineHeight}px`,
                      transition: `height ${Math.floor(bracketAnimationSpeed * 0.4)}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }}
                  />
                </div>

                <div
                  className="absolute top-0 left-0 h-[2px] bg-primary/70 origin-left shadow-[0_0_10px_color-mix(in_srgb,var(--color-primary)_30%,transparent)]"
                  style={{
                    width: `${horizontalLineWidth}px`,
                    transition: `width ${Math.floor(bracketAnimationSpeed * 0.6)}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                >
                  <div
                    className="absolute top-0 right-0 w-[2px] bg-primary/70 origin-top"
                    style={{
                      height: `${cornerLineHeight}px`,
                      transition: `height ${Math.floor(bracketAnimationSpeed * 0.4)}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step squares with navigation arrows */}
      <div className="relative flex items-start justify-between gap-2">
        {showNavigationButtons && (
          <div className="absolute left-0 top-6 -translate-x-full pr-4 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={onNavigatePrevious}
              disabled={currentStep <= 1}
              className={cn(
                "w-10 h-10 bg-card/50 border-border/50 hover:border-primary/40 hover:bg-card",
                "disabled:opacity-20 disabled:cursor-not-allowed",
              )}
            >
              <ChevronLeft className="h-5 w-5 relative z-10" />
            </Button>
          </div>
        )}

        {steps.map((step, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep
          const isActive = stepNumber === activeStep
          const isUpcoming = stepNumber > currentStep

          return (
            <div key={step.id} className="flex flex-col items-center gap-2 flex-1 transition-all duration-300">
              <div
                ref={(el) => {
                  stepRefs.current[index] = el
                }}
                className="relative"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (isStepClickable && !isAnimating) {
                      onStepClick(stepNumber)
                    }
                  }}
                  className={cn(
                    "relative flex items-center justify-center overflow-visible rounded-(--radius)",
                    stepSizeClasses[stepSize],
                    "border transition-all duration-200",
                    isStepClickable &&
                      !isAnimating &&
                      "cursor-pointer hover:-translate-y-0.5 hover:border-primary/50 hover:bg-card/60 hover:shadow-sm",
                    !isStepClickable && "cursor-default",
                    isActive && "opacity-100",
                    !isActive && isCompleted && "opacity-60",
                    !isActive && isCurrent && "opacity-70",
                    !isActive && isUpcoming && "opacity-30",
                    isCompleted && "bg-primary/10 border-primary/40 text-primary",
                    isCurrent && "bg-card border-primary/60 text-primary ring-2 ring-primary/30 shadow-sm scale-105",
                    isUpcoming && "bg-card/20 border-border/30 text-muted-foreground/70 scale-95",
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  <span className="relative z-10">
                    {isCompleted ? <Check className="h-5 w-5" /> : (step.icon ?? stepNumber)}
                  </span>
                </button>
              </div>

              {showStepLabels && (
                <div
                  className={cn(
                    "text-center transition-all duration-250",
                    isActive && "opacity-100",
                    !isActive && isCompleted && "opacity-50",
                    !isActive && isCurrent && "opacity-60",
                    !isActive && isUpcoming && "opacity-25",
                    isCurrent && "scale-105",
                  )}
                >
                  <div
                    className={cn(
                      "text-xs font-semibold tracking-wide",
                      isCompleted && "text-foreground/90",
                      isCurrent && "text-primary",
                      isUpcoming && "text-muted-foreground",
                    )}
                  >
                    {step.title}
                  </div>
                  <div
                    className={cn(
                      "text-[11px] text-muted-foreground mt-0.5",
                      isCompleted && "text-muted-foreground",
                      isCurrent && "text-muted-foreground",
                      isUpcoming && "text-muted-foreground/60",
                    )}
                  >
                    {step.description}
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {showNavigationButtons && (
          <div className="absolute right-0 top-6 translate-x-full pl-4 z-10">
            <Button
              variant="outline"
              size="icon"
              onClick={onNavigateNext}
              disabled={!canProceed || currentStep >= steps.length}
              className={cn(
                "w-10 h-10 bg-card/50 border-border/50 hover:border-primary/40 hover:bg-card",
                "disabled:opacity-20 disabled:cursor-not-allowed",
              )}
            >
              <ChevronRight className="h-5 w-5 relative z-10" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
