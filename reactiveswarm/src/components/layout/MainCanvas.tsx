import { useGenerationStore } from "@/stores/generationStore";
import { Progress } from "@/components/ui/progress";
import { Loader2, Image as ImageIcon } from "lucide-react";

export function MainCanvas() {
  const { currentImage, isGenerating, progress, currentStep, totalSteps } = useGenerationStore();

  return (
    <div className="h-full w-full bg-background relative flex flex-col overflow-hidden">
      {/* Canvas Area */}
      <div className="flex-1 flex items-center justify-center relative p-6 bg-secondary/10">
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] bg-size-[16px_16px] mask-[radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>
        
        {currentImage ? (
          <div className="relative max-w-full max-h-full shadow-2xl rounded-lg overflow-hidden border border-border">
            <img 
              src={currentImage} 
              alt="Generated Content" 
              className="max-w-full max-h-full object-contain"
            />
          </div>
        ) : (
          <div className="relative z-10 text-center space-y-4 text-muted-foreground/50">
            <div className="flex justify-center">
                <ImageIcon className="w-24 h-24 opacity-20" />
            </div>
            <div>
                <h1 className="text-4xl font-bold tracking-tight text-foreground/20">ReactiveSwarm</h1>
                <p>Ready to generate.</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Overlay / Footer */}
      {(isGenerating || progress > 0) && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md bg-popover/80 backdrop-blur-md border border-border p-4 rounded-xl shadow-lg z-50 transition-all duration-300">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {isGenerating && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
                    <span className="text-sm font-medium">
                        {isGenerating ? "Generating..." : "Ready"}
                    </span>
                </div>
                <span className="text-xs text-muted-foreground">
                    {currentStep} / {totalSteps} steps ({Math.round(progress * 100)}%)
                </span>
            </div>
            <Progress value={progress * 100} className="h-2" />
        </div>
      )}
    </div>
  );
}
