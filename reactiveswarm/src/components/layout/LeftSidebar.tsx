import { useState } from "react";
import { useLayoutStore } from "@/stores/useLayoutStore";
import { useGenerationStore } from "@/stores/useGenerationStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Play, Sparkles, ChevronDown, Square } from "lucide-react";
import { generateImage, interruptGeneration } from "@/services/generationService";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// DnD Imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { SortableSection } from "./SortableSection";

// Parameter Components
import { ModelSelector } from "@/components/parameters/ModelSelector";
import { PromptInput, NegativePromptInput } from "@/components/parameters/PromptSection";
import { GenerationParams } from "@/components/parameters/GenerationParams";
import { ResolutionSelector } from "@/components/parameters/ResolutionSelector";
import { AdvancedParams } from "@/components/parameters/AdvancedParams";
import { PresetManager } from "@/components/parameters/PresetManager";
import { BackendParamControls } from "@/components/parameters/BackendParamControls";

export function LeftSidebar() {
  const { parameterGroupOrder, setParameterGroupOrder } = useLayoutStore();
  const { isGenerating } = useGenerationStore();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // if (leftSidebarCollapsed) return null; // Removed to allow Panel to handle collapsing logic

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = parameterGroupOrder.indexOf(active.id as string);
      const newIndex = parameterGroupOrder.indexOf(over.id as string);
      setParameterGroupOrder(arrayMove(parameterGroupOrder, oldIndex, newIndex));
    }
  };

  const renderSection = (id: string) => {
    switch (id) {
      case "model":
        return (
          <div className="space-y-4">
             <ModelSelector />
             <Separator />
          </div>
        );
      case "prompt":
        return (
          <div className="space-y-4">
            <PromptInput />
            <NegativePromptInput />
            <Separator className="my-4" />
          </div>
        );
      case "params":
        return (
           <div className="space-y-4">
             <GenerationParams />
           </div>
        );
      case "resolution":
        return (
           <div className="space-y-4">
             <ResolutionSelector />
             <Separator className="my-4" />
           </div>
        );
      case "advanced":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
                <Label htmlFor="advanced" className="cursor-pointer">Advanced Parameters</Label>
                <Switch 
                id="advanced" 
                checked={showAdvanced}
                onCheckedChange={setShowAdvanced}
                />
            </div>
            {showAdvanced && <AdvancedParams />}
          </div>
        );
      case "backend":
        return (
          <div className="space-y-4">
            <BackendParamControls />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full min-h-0 bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between bg-card/50 backdrop-blur-sm z-10">
         <h2 className="font-semibold flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Parameters
         </h2>
      </div>

      <ScrollArea className="min-h-0 flex-1">
        <div className="p-4 space-y-4">
          {/* Fixed Preset Manager */}
          <div className="mb-4">
            <PresetManager />
            <Separator className="mt-4" />
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={parameterGroupOrder}
              strategy={verticalListSortingStrategy}
            >
              {parameterGroupOrder.map((id) => (
                <SortableSection key={id} id={id}>
                  {renderSection(id)}
                </SortableSection>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>

      <div className="shrink-0 p-4 border-t border-border bg-card">
        <div className="flex w-full shadow-lg shadow-primary/20 rounded-md">
            <Button 
                size="lg" 
                className={`flex-1 rounded-e-none font-bold text-md ${isGenerating ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
                onClick={isGenerating ? () => interruptGeneration(false) : generateImage}
            >
                {isGenerating ? (
                    <>
                        <Square className="w-4 h-4 me-2 fill-current" />
                        Interrupt
                    </>
                ) : (
                    <>
                        <Play className="w-4 h-4 me-2 fill-current" />
                        Generate
                    </>
                )}
            </Button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        size="lg" 
                        className={`rounded-s-none px-2 border-s border-primary-foreground/20 ${isGenerating ? 'bg-amber-600 hover:bg-amber-700 text-white' : ''}`}
                    >
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => interruptGeneration(false)} disabled={!isGenerating}>
                        <Square className="w-4 h-4 me-2" />
                        Interrupt
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => interruptGeneration(true)} disabled={!isGenerating}>
                        <Square className="w-4 h-4 me-2 text-destructive" />
                        Interrupt All Sessions
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
