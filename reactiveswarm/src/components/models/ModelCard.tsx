import type { Model } from "@/stores/useModelStore";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Box, File } from "lucide-react";

interface ModelCardProps {
  model: Model;
  selected: boolean;
  onSelect: (model: Model) => void;
}

export function ModelCard({ model, selected, onSelect }: ModelCardProps) {
  return (
    <Card 
      className={cn(
        "cursor-pointer overflow-hidden border transition-all hover:ring-2 hover:ring-primary/50",
        selected ? "ring-2 ring-primary border-primary bg-primary/5" : "hover:bg-muted/50"
      )}
      onClick={() => onSelect(model)}
    >
      <div className="aspect-[1.5] bg-muted relative flex items-center justify-center overflow-hidden">
        {model.previewImage ? (
          <img 
            src={model.previewImage} 
            alt={model.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="text-muted-foreground opacity-30 flex flex-col items-center">
             {model.type === 'checkpoint' ? <Box className="w-12 h-12" /> : <File className="w-12 h-12" />}
          </div>
        )}
        <div className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold backdrop-blur-sm">
            {model.type}
        </div>
      </div>
      <div className="p-3">
        <h3 className="font-medium text-sm truncate" title={model.name}>{model.name}</h3>
        {model.description && (
            <p className="text-xs text-muted-foreground truncate mt-1">{model.description}</p>
        )}
      </div>
    </Card>
  );
}
