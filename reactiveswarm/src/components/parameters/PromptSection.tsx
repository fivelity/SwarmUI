import { useParameterStore } from "@/stores/useParameterStore";
import { Label } from "@/components/ui/label";
import { PromptEditor } from "@/components/ui/prompt-editor";

export function PromptInput() {
  const prompt = useParameterStore((state) => state.prompt);
  const setPrompt = useParameterStore((state) => state.setPrompt);

  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">Prompt</Label>
      <div className="min-h-[100px] border border-input rounded-md bg-muted/30 focus-within:ring-1 focus-within:ring-ring transition-colors">
        <PromptEditor 
            id="prompt" 
            placeholder="Describe your image..." 
            value={prompt}
            onValueChange={setPrompt}
            className="min-h-[100px] border-0 shadow-none focus-within:ring-0"
        />
      </div>
    </div>
  );
}

export function NegativePromptInput() {
  const negativePrompt = useParameterStore((state) => state.negativePrompt);
  const setNegativePrompt = useParameterStore((state) => state.setNegativePrompt);

  return (
    <div className="space-y-2">
      <Label htmlFor="neg-prompt" className="text-muted-foreground text-xs">Negative Prompt</Label>
      <div className="min-h-[60px] border border-input rounded-md bg-muted/30 focus-within:ring-1 focus-within:ring-ring transition-colors">
        <PromptEditor 
            id="neg-prompt" 
            placeholder="What to exclude..." 
            value={negativePrompt}
            onValueChange={setNegativePrompt}
            className="min-h-[60px] border-0 shadow-none focus-within:ring-0 text-muted-foreground"
        />
      </div>
    </div>
  );
}
