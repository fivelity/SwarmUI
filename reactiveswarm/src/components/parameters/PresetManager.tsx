import { useState } from "react";
import { usePresetStore } from "@/stores/usePresetStore";
import { useParameterStore } from "@/stores/useParameterStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Save, Trash2, RotateCcw } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function PresetManager() {
  const { presets, addPreset, removePreset, getPreset } = usePresetStore();
  const params = useParameterStore();
  const setAllParameters = useParameterStore((state) => state.setAllParameters);
  
  const [newPresetName, setNewPresetName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    if (!newPresetName.trim()) return;
    
    // Explicitly select parameters to save
    const currentParams = {
        prompt: params.prompt,
        negativePrompt: params.negativePrompt,
        seed: params.seed,
        steps: params.steps,
        cfgScale: params.cfgScale,
        width: params.width,
        height: params.height,
        model: params.model,
        scheduler: params.scheduler,
        aspectRatio: params.aspectRatio,
        denoisingStrength: params.denoisingStrength,
        batchSize: params.batchSize,
    };

    addPreset(newPresetName, currentParams);
    setNewPresetName("");
  };

  const handleLoad = (id: string) => {
    const preset = getPreset(id);
    if (preset) {
        setAllParameters(preset.parameters);
        setIsOpen(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="w-full">
                <Save className="w-4 h-4 me-2" />
                Presets
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Manage Presets</DialogTitle>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
                <div className="flex gap-2">
                    <Input 
                        placeholder="New preset name..." 
                        value={newPresetName}
                        onChange={(e) => setNewPresetName(e.target.value)}
                    />
                    <Button onClick={handleSave} disabled={!newPresetName.trim()}>Save</Button>
                </div>

                <div className="border rounded-md">
                    <ScrollArea className="h-[200px] p-2">
                        {presets.length === 0 ? (
                            <div className="text-center text-muted-foreground py-8 text-sm">
                                No presets saved.
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {presets.map((preset) => (
                                    <div key={preset.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-md group">
                                        <button 
                                            className="text-sm font-medium text-start flex-1 truncate"
                                            onClick={() => handleLoad(preset.id)}
                                        >
                                            {preset.name}
                                        </button>
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => removePreset(preset.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>
        </DialogContent>
      </Dialog>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8"
        onClick={params.resetParameters}
        title="Reset All Parameters"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>
    </div>
  );
}
