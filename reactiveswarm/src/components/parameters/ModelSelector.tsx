import { useParameterStore } from "@/stores/parameterStore";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ModelSelector() {
  const model = useParameterStore((state) => state.model);
  const setModel = useParameterStore((state) => state.setModel);

  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>
      <Select value={model || "stable-diffusion-v1-5"} onValueChange={setModel}>
        <SelectTrigger id="model">
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="stable-diffusion-v1-5">Stable Diffusion v1.5</SelectItem>
          <SelectItem value="stable-diffusion-xl">SDXL 1.0</SelectItem>
          <SelectItem value="dreamshaper-8">Dreamshaper 8</SelectItem>
          <SelectItem value="realistic-vision-v5">Realistic Vision v5</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
