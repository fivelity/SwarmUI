import { useEffect, useMemo, useState, useTransition } from "react";
import { useT2IParamsStore } from "@/stores/t2iParamsStore";
import { useT2IParamValuesStore } from "@/stores/t2iParamValuesStore";
import type { T2IParamDataType, T2IParamNet, T2IParamValue, T2IParamViewType } from "@/types/t2iParams";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function parseDefaultValue(param: T2IParamNet): T2IParamValue {
  const def = param.default;
  const t = param.type;

  if (t === "boolean") {
    return def === "true";
  }

  if (t === "integer") {
    const n = Number(def);
    return Number.isFinite(n) ? Math.trunc(n) : 0;
  }

  if (t === "decimal") {
    const n = Number(def);
    return Number.isFinite(n) ? n : 0;
  }

  return def;
}

function coerceValue(param: T2IParamNet, raw: string): T2IParamValue {
  const t = param.type;
  if (t === "integer") {
    const n = Number(raw);
    return Number.isFinite(n) ? Math.trunc(n) : 0;
  }
  if (t === "decimal") {
    const n = Number(raw);
    return Number.isFinite(n) ? n : 0;
  }
  if (t === "boolean") {
    return raw === "true";
  }
  return raw;
}

function modelOptions(param: T2IParamNet, models: Record<string, string[]>): string[] {
  if (param.type !== "model") return [];
  const subtype = param.subtype ?? "Stable-Diffusion";
  const list = models[subtype];
  return Array.isArray(list) ? list : [];
}

function shouldUseSlider(type: T2IParamDataType, viewType: T2IParamViewType): boolean {
  if (type !== "integer" && type !== "decimal") return false;
  return viewType === "slider" || viewType === "pot_slider";
}

function formatLabelValue(v: T2IParamValue | undefined): string {
  if (v === undefined) return "";
  if (typeof v === "boolean") return v ? "true" : "false";
  return String(v);
}

function isHiddenByDefault(id: string): boolean {
  return (
    id === "prompt" ||
    id === "negativeprompt" ||
    id === "seed" ||
    id === "steps" ||
    id === "cfgscale" ||
    id === "width" ||
    id === "height" ||
    id === "model" ||
    id === "sampler" ||
    id === "images"
  );
}

function ParamRow({ param }: { param: T2IParamNet }) {
  const models = useT2IParamsStore((s) => s.models);
  const value = useT2IParamValuesStore((s) => s.values[param.id]);
  const enabled = useT2IParamValuesStore((s) => s.enabled[param.id]);
  const setValue = useT2IParamValuesStore((s) => s.setValue);
  const setEnabled = useT2IParamValuesStore((s) => s.setEnabled);
  const [isPending, startTransition] = useTransition();

  const effectiveValue: T2IParamValue = value ?? parseDefaultValue(param);
  const isEnabled = param.toggleable ? (enabled ?? false) : true;

  const onChangeValue = (next: T2IParamValue) => {
    startTransition(() => {
      setValue(param.id, next);
      if (param.toggleable) {
        setEnabled(param.id, true);
      }
    });
  };

  const onToggle = (next: boolean) => {
    startTransition(() => {
      setEnabled(param.id, next);
    });
  };

  const commonDisabled = isPending || !isEnabled;

  const renderControl = () => {
    switch (param.type) {
      case "boolean": {
        return (
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-muted-foreground font-mono">{effectiveValue ? "true" : "false"}</span>
            <Switch
              checked={effectiveValue === true}
              onCheckedChange={(v) => onChangeValue(v)}
              disabled={commonDisabled}
            />
          </div>
        );
      }
      case "dropdown": {
        const opts = param.values ?? [];
        const v = typeof effectiveValue === "string" ? effectiveValue : String(effectiveValue);
        return (
          <Select value={v} onValueChange={(nv) => onChangeValue(coerceValue(param, nv))} disabled={commonDisabled}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={param.default || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {opts.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "model": {
        const opts = modelOptions(param, models);
        const v = typeof effectiveValue === "string" ? effectiveValue : String(effectiveValue);
        return (
          <Select value={v} onValueChange={(nv) => onChangeValue(nv)} disabled={commonDisabled}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={param.default || "Select model..."} />
            </SelectTrigger>
            <SelectContent>
              {opts.map((o) => (
                <SelectItem key={o} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }
      case "integer":
      case "decimal": {
        if (shouldUseSlider(param.type, param.view_type)) {
          const min = Number.isFinite(param.min) ? param.min : 0;
          const max = Number.isFinite(param.view_max) && param.view_max !== 0 ? param.view_max : param.max;
          const step = Number.isFinite(param.step) && param.step !== 0 ? param.step : 1;
          const n = typeof effectiveValue === "number" ? effectiveValue : Number(effectiveValue);
          const safe = Number.isFinite(n) ? n : min;
          return (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">{formatLabelValue(effectiveValue)}</span>
              </div>
              <Slider
                value={[safe]}
                min={min}
                max={max}
                step={step}
                onValueChange={(v) => onChangeValue(param.type === "integer" ? Math.trunc(v[0]) : v[0])}
                disabled={commonDisabled}
              />
            </div>
          );
        }

        const v = typeof effectiveValue === "number" ? effectiveValue : Number(effectiveValue);
        return (
          <Input
            type="number"
            value={Number.isFinite(v) ? v : 0}
            onChange={(e) => onChangeValue(coerceValue(param, e.target.value))}
            disabled={commonDisabled}
            className="h-9 font-mono text-xs"
          />
        );
      }
      case "list":
      case "image":
      case "image_list":
      case "text":
      default: {
        const v = typeof effectiveValue === "string" ? effectiveValue : String(effectiveValue);
        return (
          <Input
            value={v}
            onChange={(e) => onChangeValue(e.target.value)}
            disabled={commonDisabled}
            className="h-9"
          />
        );
      }
    }
  };

  return (
    <div className={cn("space-y-1", !isEnabled && "opacity-60")}>
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs">{param.name}</Label>
        {param.toggleable && (
          <Switch checked={isEnabled} onCheckedChange={onToggle} disabled={isPending} />
        )}
      </div>
      {renderControl()}
      {param.description ? <div className="text-[10px] text-muted-foreground">{param.description}</div> : null}
    </div>
  );
}

export function BackendParamControls() {
  const isLoading = useT2IParamsStore((s) => s.isLoading);
  const error = useT2IParamsStore((s) => s.error);
  const load = useT2IParamsStore((s) => s.load);
  const params = useT2IParamsStore((s) => s.params);
  const groups = useT2IParamsStore((s) => s.groups);

  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    void load();
  }, [load]);

  const groupById = useMemo(() => {
    const map = new Map<string, (typeof groups)[number]>();
    for (const g of groups) {
      map.set(g.id, g);
    }
    return map;
  }, [groups]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return params
      .filter((p) => p.visible && !p.extra_hidden)
      .filter((p) => (showAdvanced ? true : p.advanced === false))
      .filter((p) => (showAll ? true : !isHiddenByDefault(p.id)))
      .filter((p) => {
        if (!q) return true;
        return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
  }, [params, query, showAdvanced, showAll]);

  const grouped = useMemo(() => {
    const map = new Map<string, T2IParamNet[]>();
    for (const p of filtered) {
      const gid = p.group ?? "__ungrouped__";
      const existing = map.get(gid);
      if (existing) existing.push(p);
      else map.set(gid, [p]);
    }
    return Array.from(map.entries()).sort(([a], [b]) => {
      if (a === "__ungrouped__") return 1;
      if (b === "__ungrouped__") return -1;
      const ga = groupById.get(a);
      const gb = groupById.get(b);
      return (ga?.priority ?? 10) - (gb?.priority ?? 10);
    });
  }, [filtered, groupById]);

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-3">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Search Parameters</Label>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter by name/id..." className="h-9" />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Advanced</Label>
          <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Core Params</Label>
          <Switch checked={showAll} onCheckedChange={setShowAll} />
        </div>

        {error ? <div className="text-xs text-destructive">{error}</div> : null}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => void useT2IParamsStore.getState().triggerRefresh(true)}
            disabled={isLoading}
          >
            Refresh
          </Button>
          <div className="text-xs text-muted-foreground">{isLoading ? "Loading..." : `${filtered.length} params`}</div>
        </div>
      </div>

      <div className="flex-1 min-h-0 mt-4">
        <ScrollArea className="h-full">
          <div className="space-y-6 pb-4">
            {grouped.map(([gid, list]) => {
              const group = gid === "__ungrouped__" ? null : groupById.get(gid);
              return (
                <div key={gid} className="space-y-3">
                  <div className="space-y-1">
                    <div className="text-sm font-semibold">{group?.name ?? "Other"}</div>
                    {group?.description ? <div className="text-xs text-muted-foreground">{group.description}</div> : null}
                  </div>
                  <div className="space-y-4">
                    {list.map((p) => (
                      <ParamRow key={p.id} param={p} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
