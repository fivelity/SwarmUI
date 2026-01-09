import { useState } from "react";
import { useParameterStore } from "@/stores/parameterStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModelBrowser } from "@/components/models/ModelBrowser";
import { ChevronDown, Box } from "lucide-react";

export function ModelSelector() {
  const model = useParameterStore((state) => state.model);
  const setModel = useParameterStore((state) => state.setModel);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (modelName: string) => {
    setModel(modelName);
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            role="combobox" 
            aria-expanded={isOpen}
            className="w-full justify-between font-normal"
          >
            <div className="flex items-center gap-2 truncate">
                <Box className="w-4 h-4 text-muted-foreground" />
                <span className="truncate">{model || "Select a model..."}</span>
            </div>
            <ChevronDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl h-[600px] flex flex-col p-0 gap-0">
            <DialogHeader className="p-4 border-b">
                <DialogTitle>Select Model</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden p-0">
                <ModelBrowser onSelect={handleSelect} />
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
