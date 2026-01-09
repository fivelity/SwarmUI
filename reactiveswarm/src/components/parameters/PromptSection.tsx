import { useParameterStore } from "@/stores/parameterStore";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PromptInput() {
  const prompt = useParameterStore((state) => state.prompt);
  const setPrompt = useParameterStore((state) => state.setPrompt);

  return (
    <div className="space-y-2">
      <Label htmlFor="prompt">Prompt</Label>
      <Textarea 
        id="prompt" 
        placeholder="Describe your image..." 
        className="min-h-[100px] resize-y font-mono text-sm bg-muted/30 focus:bg-muted/50 transition-colors"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
    </div>
  );
}

export function NegativePromptInput() {
  const negativePrompt = useParameterStore((state) => state.negativePrompt);
  const setNegativePrompt = useParameterStore((state) => state.setNegativePrompt);

  return (
    <div className="space-y-2">
      <Label htmlFor="neg-prompt" className="text-muted-foreground text-xs">Negative Prompt</Label>
      <Textarea 
        id="neg-prompt" 
        placeholder="What to exclude..." 
        className="min-h-[60px] resize-y font-mono text-xs bg-muted/30 focus:bg-muted/50 transition-colors text-muted-foreground"
        value={negativePrompt}
        onChange={(e) => setNegativePrompt(e.target.value)}
      />
    </div>
  );
}
