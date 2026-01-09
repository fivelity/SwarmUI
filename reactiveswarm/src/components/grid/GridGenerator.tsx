import { useState, useMemo } from "react";
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
import { Plus, Trash2, GripVertical, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface GridAxis {
  id: string;
  parameter: string;
  values: string;
}

function parseRange(input: string): string[] {
    const parts = input.split(',').map(s => s.trim()).filter(s => s);
    const result: string[] = [];

    parts.forEach(part => {
        // Match range syntax: start..end or start..end(step)
        // e.g., 1..5 or 0.0..1.0(0.1)
        const rangeMatch = part.match(/^(-?[\d.]+)\.\.(-?[\d.]+)(?:\((-?[\d.]+)\))?$/);
        if (rangeMatch) {
            const start = parseFloat(rangeMatch[1]);
            const end = parseFloat(rangeMatch[2]);
            const step = rangeMatch[3] ? parseFloat(rangeMatch[3]) : 1;
            
            if (!isNaN(start) && !isNaN(end) && !isNaN(step) && step !== 0) {
                // Prevent infinite loops if step is wrong direction
                if ((end > start && step < 0) || (end < start && step > 0)) {
                    return; 
                }

                const count = Math.floor(Math.abs((end - start) / step));
                // Cap at 100 to prevent freezing
                const safeCount = Math.min(count, 100);
                
                for (let i = 0; i <= safeCount; i++) {
                    const val = start + (i * step);
                    // Avoid floating point precision errors
                    result.push(Number(val.toFixed(5)).toString());
                }
            }
        } else {
            result.push(part);
        }
    });
    return result;
}

export function AxisConfig({ axis, index, onChange, onRemove }: { axis: GridAxis, index: number, onChange: (axis: GridAxis) => void, onRemove: () => void }) {
  const parsedCount = useMemo(() => parseRange(axis.values).length, [axis.values]);

  return (
    <Card className="p-4 flex items-start gap-4 transition-all hover:shadow-md">
      <div className="pt-2 flex flex-col items-center gap-2">
        <div className={cn("p-1 rounded bg-muted text-muted-foreground cursor-grab active:cursor-grabbing")}>
            <GripVertical className="w-4 h-4" />
        </div>
        <div className="text-xs font-mono text-muted-foreground w-6 text-center">
            {index === 0 ? "X" : index === 1 ? "Y" : index === 2 ? "Z" : "N"}
        </div>
      </div>
      <div className="flex-1 grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <Label className="flex justify-between">
                    <span>Values</span>
                    <span className="text-xs text-muted-foreground font-normal">Count: {parsedCount}</span>
                </Label>
                <Input 
                    value={axis.values} 
                    onChange={(e) => onChange({ ...axis, values: e.target.value })}
                    placeholder="e.g. 1, 2, 3 or 0.5..1.0(0.1)" 
                    className="font-mono text-sm"
                />
                <p className="text-[10px] text-muted-foreground">
                    Syntax: <code>1, 2, 3</code> or <code>start..end(step)</code>
                </p>
            </div>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10" onClick={onRemove}>
        <Trash2 className="w-4 h-4" />
      </Button>
    </Card>
  );
}

export function GridGenerator() {
  const [axes, setAxes] = useState<GridAxis[]>([
    { id: '1', parameter: 'cfg_scale', values: '7, 8, 9' },
    { id: '2', parameter: 'steps', values: '20..40(10)' }
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

  const totalImages = useMemo(() => {
      return axes.reduce((acc, axis) => {
          const count = parseRange(axis.values).length;
          return acc * (count || 1);
      }, 1);
  }, [axes]);

  return (
    <div className="h-full w-full bg-background p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div>
                <h2 className="text-2xl font-bold mb-2">Grid Generator</h2>
                <p className="text-muted-foreground">Generate calculated grids of images varying multiple parameters.</p>
            </div>

            <div className="space-y-4">
                {axes.map((axis, index) => (
                    <AxisConfig 
                        key={axis.id} 
                        axis={axis} 
                        index={index}
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

                <div className="text-end space-y-1">
                    <p className="text-sm font-medium">Total Images: {totalImages}</p>
                    <p className="text-xs text-muted-foreground">Est. time: ~{(totalImages * 2.5).toFixed(1)}s</p>
                </div>
            </div>

            <div className="fixed bottom-8 right-8 z-50">
                <Button size="lg" className="shadow-xl">
                    <Play className="w-4 h-4 me-2 fill-current" />
                    Generate Grid
                </Button>
            </div>
        </div>
    </div>
  );
}
