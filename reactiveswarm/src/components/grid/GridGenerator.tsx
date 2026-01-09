import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ArrowDown } from "lucide-react";
import { Card } from "@/components/ui/card";

export interface GridAxis {
  id: string;
  parameter: string;
  values: string;
}

export function AxisConfig({ axis, onChange, onRemove }: { axis: GridAxis, onChange: (axis: GridAxis) => void, onRemove: () => void }) {
  return (
    <Card className="p-4 flex items-start gap-4">
      <div className="pt-2">
        <div className="bg-muted p-1 rounded">
            <ArrowDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 grid gap-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label>Parameter</Label>
                <Select 
                    value={axis.parameter} 
                    onValueChange={(val) => onChange({ ...axis, parameter: val })}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select parameter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="seed">Seed</SelectItem>
                        <SelectItem value="steps">Steps</SelectItem>
                        <SelectItem value="cfg_scale">CFG Scale</SelectItem>
                        <SelectItem value="model">Model</SelectItem>
                        <SelectItem value="sampler">Scheduler</SelectItem>
                        <SelectItem value="prompt">Prompt</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label>Values</Label>
                <Input 
                    value={axis.values} 
                    onChange={(e) => onChange({ ...axis, values: e.target.value })}
                    placeholder="e.g. 1, 2, 3 or 0.5..1.0(0.1)" 
                />
                <p className="text-[10px] text-muted-foreground">Comma separated or range start..end(step)</p>
            </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={onRemove}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  );
}

export function GridGenerator() {
  const [axes, setAxes] = useState<GridAxis[]>([
    { id: '1', parameter: 'cfg_scale', values: '7, 8, 9' },
    { id: '2', parameter: 'steps', values: '20, 30' }
  ]);

  const addAxis = () => {
    setAxes([...axes, { id: crypto.randomUUID(), parameter: 'seed', values: '' }]);
  };

  const updateAxis = (index: number, newAxis: GridAxis) => {
    const newAxes = [...axes];
    newAxes[index] = newAxis;
    setAxes(newAxes);
  };

  const removeAxis = (index: number) => {
    const newAxes = [...axes];
    newAxes.splice(index, 1);
    setAxes(newAxes);
  };

  // Mock calculation
  const calculateTotal = () => {
      return axes.reduce((acc, axis) => {
          const count = axis.values.split(',').length; // Very basic split check
          return acc * (count || 1);
      }, 1);
  };

  return (
    <div className="h-full w-full bg-background p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h2 className="text-2xl font-bold mb-2">Grid Generator</h2>
                <p className="text-muted-foreground">Generate calculated grids of images varying multiple parameters.</p>
            </div>

            <div className="space-y-4">
                {axes.map((axis, index) => (
                    <AxisConfig 
                        key={axis.id} 
                        axis={axis} 
                        onChange={(newAxis) => updateAxis(index, newAxis)}
                        onRemove={() => removeAxis(index)}
                    />
                ))}
            </div>

            <div className="flex justify-between items-center">
                <Button variant="outline" onClick={addAxis}>
                    <Plus className="w-4 h-4 me-2" />
                    Add Axis
                </Button>

                <div className="text-end">
                    <p className="text-sm font-medium">Total Images: ~{calculateTotal()}</p>
                    <p className="text-xs text-muted-foreground">Estimated time: {calculateTotal() * 2}s</p>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-border">
                <Button size="lg">Generate Grid</Button>
            </div>
        </div>
    </div>
  );
}
