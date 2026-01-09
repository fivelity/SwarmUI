import { useParameterStore } from "@/stores/parameterStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AdvancedParams() {
  const scheduler = useParameterStore((state) => state.scheduler);
  const setScheduler = useParameterStore((state) => state.setScheduler);
  const setDimensions = useParameterStore((state) => state.setDimensions);

  return (
    <div className="space-y-4 pt-2 animate-in slide-in-from-top-2 fade-in duration-200">
      {/* Scheduler */}
      <div className="space-y-2">
        <Label htmlFor="scheduler">Scheduler</Label>
        <Select value={scheduler} onValueChange={setScheduler}>
          <SelectTrigger id="scheduler">
            <SelectValue placeholder="Select scheduler" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Euler a">Euler a</SelectItem>
            <SelectItem value="Euler">Euler</SelectItem>
            <SelectItem value="DDIM">DDIM</SelectItem>
            <SelectItem value="DPM++ 2M Karras">DPM++ 2M Karras</SelectItem>
            <SelectItem value="DPM++ SDE Karras">DPM++ SDE Karras</SelectItem>
            <SelectItem value="UniPC">UniPC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Aspect Ratio Presets */}
      <div className="space-y-2">
        <Label>Aspect Ratio</Label>
        <div className="grid grid-cols-3 gap-2">
          <Button variant="outline" size="sm" onClick={() => setDimensions(1024, 1024)} className="text-xs">1:1</Button>
          <Button variant="outline" size="sm" onClick={() => setDimensions(1152, 896)} className="text-xs">4:3</Button>
          <Button variant="outline" size="sm" onClick={() => setDimensions(896, 1152)} className="text-xs">3:4</Button>
          <Button variant="outline" size="sm" onClick={() => setDimensions(1216, 832)} className="text-xs">16:9</Button>
          <Button variant="outline" size="sm" onClick={() => setDimensions(832, 1216)} className="text-xs">9:16</Button>
          <Button variant="outline" size="sm" onClick={() => setDimensions(1344, 768)} className="text-xs">21:9</Button>
        </div>
      </div>
    </div>
  );
}
