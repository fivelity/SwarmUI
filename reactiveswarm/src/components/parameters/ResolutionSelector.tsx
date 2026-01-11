import { useParameterStore } from "@/stores/useParameterStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ResolutionSelector() {
  const width = useParameterStore((state) => state.width);
  const height = useParameterStore((state) => state.height);
  const setDimensions = useParameterStore((state) => state.setDimensions);

  return (
    <div className="space-y-3 pt-2">
      <Label>Resolution</Label>
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label htmlFor="width" className="text-xs text-muted-foreground">Width</Label>
          <Input 
            id="width"
            type="number"
            value={width}
            onChange={(e) => setDimensions(parseInt(e.target.value), height)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="height" className="text-xs text-muted-foreground">Height</Label>
          <Input 
            id="height"
            type="number"
            value={height}
            onChange={(e) => setDimensions(width, parseInt(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
