import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Upload, Cpu } from "lucide-react";
import { useMemo } from "react";
import { useServerStore } from "@/stores/useServerStore";

export function ComfyOverlay() {
  const resources = useServerStore((s) => s.resources);
  const gpuOptions = useMemo(() => {
    const gpus = resources?.gpus;
    if (!gpus) return [];
    return Object.entries(gpus)
      .map(([id, gpu]) => ({ id, name: typeof gpu.name === "string" ? gpu.name : `GPU ${id}` }))
      .sort((a, b) => a.id.localeCompare(b.id));
  }, [resources]);

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-background/80 backdrop-blur-md p-2 rounded-lg border border-border shadow-lg">
      <div className="flex items-center gap-2 me-2 border-e border-border pe-2">
        <Cpu className="w-4 h-4 text-muted-foreground" />
        <Select defaultValue={gpuOptions[0]?.id ?? "0"}>
            <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Select GPU" />
            </SelectTrigger>
            <SelectContent>
                {gpuOptions.length === 0 ? (
                  <SelectItem value="0">No GPUs</SelectItem>
                ) : (
                  gpuOptions.map((g) => (
                    <SelectItem key={g.id} value={g.id}>
                      {g.name} ({g.id})
                    </SelectItem>
                  ))
                )}
            </SelectContent>
        </Select>
      </div>
      
      <Button variant="outline" size="sm" className="h-8 text-xs">
        <Upload className="w-3 h-3 me-1" />
        Import
      </Button>
      <Button variant="outline" size="sm" className="h-8 text-xs">
        <Download className="w-3 h-3 me-1" />
        Export
      </Button>
    </div>
  );
}
