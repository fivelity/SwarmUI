import { useParameterStore } from "@/stores/parameterStore";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function GenerationParams() {
  const seed = useParameterStore((state) => state.seed);
  const setSeed = useParameterStore((state) => state.setSeed);
  const steps = useParameterStore((state) => state.steps);
  const setSteps = useParameterStore((state) => state.setSteps);
  const cfgScale = useParameterStore((state) => state.cfgScale);
  const setCfgScale = useParameterStore((state) => state.setCfgScale);

  return (
    <div className="space-y-4">
      {/* Seed */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Label htmlFor="seed">Seed</Label>
          <span className="text-xs text-muted-foreground font-mono">{seed}</span>
        </div>
        <div className="flex gap-2">
          <Input 
            id="seed"
            type="number"
            value={seed}
            onChange={(e) => setSeed(parseInt(e.target.value))}
            className="font-mono text-xs"
          />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setSeed(-1)}
            className="w-12 text-xs"
          >
            Rand
          </Button>
        </div>
      </div>

      {/* Steps & CFG */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="steps">Steps</Label>
            <span className="text-xs text-muted-foreground">{steps}</span>
          </div>
          <Slider 
            value={[steps]}
            min={1}
            max={100}
            step={1}
            onValueChange={(val) => setSteps(val[0])}
            className="py-2"
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label htmlFor="cfg">CFG</Label>
            <span className="text-xs text-muted-foreground">{cfgScale}</span>
          </div>
          <Slider 
            value={[cfgScale]}
            min={1}
            max={30}
            step={0.5}
            onValueChange={(val) => setCfgScale(val[0])}
            className="py-2"
          />
        </div>
      </div>
    </div>
  );
}
