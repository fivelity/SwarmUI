import { useEffect } from "react";
import { useModelStore } from "@/stores/modelStore";
import type { Model } from "@/stores/modelStore";
import { ModelTree } from "./ModelTree";
import { ModelCard } from "./ModelCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ModelBrowserProps {
    onSelect?: (modelName: string) => void;
}

export function ModelBrowser({ onSelect }: ModelBrowserProps) {
  const searchQuery = useModelStore((state) => state.searchQuery);
  const setSearchQuery = useModelStore((state) => state.setSearchQuery);
  const selectedType = useModelStore((state) => state.selectedType);
  const setSelectedType = useModelStore((state) => state.setSelectedType);
  const isLoading = useModelStore((state) => state.isLoading);
  const fetchModels = useModelStore((state) => state.fetchModels);
  const getFilteredModels = useModelStore((state) => state.getFilteredModels);
  const selectedModel = useModelStore((state) => state.selectedModel);
  const setSelectedModel = useModelStore((state) => state.setSelectedModel);

  const filteredModels = getFilteredModels();

  useEffect(() => {
    fetchModels({ depth: 4, allowRemote: true });
  }, [fetchModels, selectedType]);

  const handleSelect = (model: Model) => {
      setSelectedModel(model);
      if (onSelect) {
          onSelect(model.name);
      }
  };

  return (
    <div className="flex h-[500px] border rounded-md overflow-hidden bg-background">
      <ModelTree />
      
      <div className="flex-1 flex flex-col">
        {/* Header / Toolbar */}
        <div className="p-3 border-b border-border flex gap-3 items-center bg-muted/10">
            <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search models..." 
                    className="ps-9 bg-background"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
            <div className="w-[140px]">
                <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="checkpoint">Checkpoint</SelectItem>
                        <SelectItem value="lora">LoRA</SelectItem>
                        <SelectItem value="embedding">Embedding</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>

        {/* Grid */}
        <ScrollArea className="flex-1 bg-muted/5">
            <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {isLoading ? (
                    <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground">
                        Loading models...
                    </div>
                ) : filteredModels.length === 0 ? (
                    <div className="col-span-full h-40 flex items-center justify-center text-muted-foreground">
                        No models found.
                    </div>
                ) : (
                    filteredModels.map((model) => (
                        <ModelCard 
                            key={model.name} 
                            model={model} 
                            selected={selectedModel?.name === model.name}
                            onSelect={handleSelect}
                        />
                    ))
                )}
            </div>
        </ScrollArea>
      </div>
    </div>
  );
}
