import { memo, useCallback, useEffect, useMemo, useState, useTransition } from "react";
import { useT2IParamsStore } from "@/stores/t2iParamsStore";
import { useT2IParamValuesStore } from "@/stores/t2iParamValuesStore";
import type { T2IParamDataType, T2IParamGroupNet, T2IParamNet, T2IParamValue, T2IParamViewType } from "@/types/t2iParams";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PromptEditor } from "@/components/ui/prompt-editor";
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

  if (t === "list" || t === "image_list") {
    return [];
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

function shouldUseSlider(type: T2IParamDataType, viewType: T2IParamViewType): boolean {
  if (type !== "integer" && type !== "decimal") return false;
  return viewType === "slider" || viewType === "pot_slider";
}

function clamp(n: number, min: number, max: number): number {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function potValues(param: T2IParamNet): number[] {
  const min = Math.max(1, Math.floor(param.view_min ?? param.min ?? 1));
  const max = Math.max(min, Math.floor(param.view_max ?? param.max ?? min));
  const out: number[] = [];

  // Start at nearest power-of-two >= min
  let v = 1;
  while (v < min) v *= 2;
  while (v <= max) {
    out.push(v);
    v *= 2;
  }
  if (out.length === 0) out.push(clamp(min, 1, max));
  return out;
}

function asNumber(v: T2IParamValue): number {
  if (typeof v === "number") return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }
  if (typeof v === "boolean") return v ? 1 : 0;
  return 0;
}

function formatListValue(v: T2IParamValue | undefined): string {
  if (!v) return "";
  if (Array.isArray(v)) return v.join("\n");
  if (typeof v === "string") return v;
  return "";
}

function parseListText(text: string): string[] {
  // Accept newline or comma separated.
  const parts = text
    .split(/\r?\n|,/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  return parts;
}

function isPromptView(param: T2IParamNet): boolean {
  return param.view_type === "prompt";
}

function numOr(v: unknown, fallback: number): number {
  if (typeof v !== "number") return fallback;
  if (!Number.isFinite(v)) return fallback;
  return v;
}

function paramInfoText(param: T2IParamNet): string {
  const lines: string[] = [];
  if (param.description) lines.push(param.description);
  const id = typeof param.id === "string" && param.id.length > 0 ? param.id : "";
  if (id) lines.push(`id: ${id}`);
  if (typeof param.default === "string" && param.default.length > 0) lines.push(`default: ${param.default}`);
  if (param.type === "integer" || param.type === "decimal") {
    const min = numOr(param.min, 0);
    const max = numOr(param.max, min);
    const step = numOr(param.step, 1);
    lines.push(`range: ${min} - ${max} (step ${step})`);
  }
  return lines.join("\n");
}

const InfoTip = memo(function InfoTip({ text }: { text: string }) {
  if (!text) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="text-[10px] text-muted-foreground hover:text-foreground rounded px-1 py-0.5 border border-border/60"
          aria-label="Parameter info"
        >
          (i)
        </button>
      </TooltipTrigger>
      <TooltipContent className="max-w-[320px] whitespace-pre-wrap text-xs" side="right">
        {text}
      </TooltipContent>
    </Tooltip>
  );
});

function modelOptions(param: T2IParamNet, models: Record<string, string[]>): string[] {
  if (param.type !== "model") return [];
  const subtype = param.subtype ?? "Stable-Diffusion";
  const list = models[subtype];
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const v of list) {
    if (typeof v !== "string") continue;
    if (seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

type ParamRowProps = {
  param: T2IParamNet;
  models: Record<string, string[]>;
  paramsById: Map<string, T2IParamNet>;
};

const ParamRow = memo(function ParamRow({ param, models, paramsById }: ParamRowProps) {
  const storedValue = useT2IParamValuesStore((s) => s.values[param.id]);
  const enabled = useT2IParamValuesStore((s) => s.enabled[param.id]);
  const setValue = useT2IParamValuesStore((s) => s.setValue);
  const setEnabled = useT2IParamValuesStore((s) => s.setEnabled);
  const [isPending, startTransition] = useTransition();

  const effectiveValue: T2IParamValue = storedValue ?? parseDefaultValue(param);

  // All params can be disabled via store (group toggles). For toggleable params, default to "off" unless user set a value.
  const selfEnabled = param.toggleable ? (enabled ?? storedValue !== undefined) : enabled ?? true;

  const depId = param.depend_non_default;
  const depValue = useT2IParamValuesStore((s) => (depId ? s.values[depId] : undefined));
  const depEnabled = useT2IParamValuesStore((s) => (depId ? s.enabled[depId] : undefined));

  const dependencySatisfied = useMemo(() => {
    if (!depId) return true;
    const dep = paramsById.get(depId);
    if (!dep) return true;
    if ((depEnabled ?? true) === false) return false;
    if (depValue === undefined) return false;
    const depDefault = parseDefaultValue(dep);
    return depValue !== depDefault;
  }, [depEnabled, depId, depValue, paramsById]);

  const onChangeValue = useCallback(
    (next: T2IParamValue) => {
      startTransition(() => {
        setValue(param.id, next);
        if (param.toggleable) {
          setEnabled(param.id, true);
        }
      });
    },
    [param.id, param.toggleable, setEnabled, setValue, startTransition],
  );

  const onToggle = useCallback(
    (next: boolean) => {
      startTransition(() => {
        setEnabled(param.id, next);
      });
    },
    [param.id, setEnabled, startTransition],
  );

  const commonDisabled = isPending || !selfEnabled;

  if (!dependencySatisfied) {
    return null;
  }

  const renderControl = () => {
    switch (param.type) {
      case "boolean": {
        return (
          <div className="flex items-center justify-between rounded-md border border-border px-3 py-2">
            <div className="text-xs text-muted-foreground">{String(effectiveValue === true)}</div>
            <Switch
              checked={effectiveValue === true}
              onCheckedChange={(v) => onChangeValue(v)}
              disabled={commonDisabled}
            />
          </div>
        );
      }

      case "dropdown": {
        const rawValues = Array.isArray(param.values) ? param.values : [];
        const rawNames = Array.isArray(param.value_names) ? param.value_names : null;
        const seen = new Set<string>();
        const opts: Array<{ value: string; label: string }> = [];
        for (let i = 0; i < rawValues.length; i++) {
          const value = rawValues[i];
          if (typeof value !== "string") continue;
          if (seen.has(value)) continue;
          seen.add(value);
          const label = rawNames?.[i];
          opts.push({ value, label: typeof label === "string" && label.length > 0 ? label : value });
        }
        const v = typeof effectiveValue === "string" ? effectiveValue : String(effectiveValue);
        return (
          <Select value={v} onValueChange={(nv) => onChangeValue(coerceValue(param, nv))} disabled={commonDisabled}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={param.default || "Select..."} />
            </SelectTrigger>
            <SelectContent>
              {opts.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case "model": {
        const raw = modelOptions(param, models);
        const seen = new Set<string>();
        const opts = raw.filter((x) => {
          if (seen.has(x)) return false;
          seen.add(x);
          return true;
        });
        const v = typeof effectiveValue === "string" ? effectiveValue : String(effectiveValue);
        return (
          <Select value={v} onValueChange={(nv) => onChangeValue(nv)} disabled={commonDisabled}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder={param.default || "Select model..."} />
            </SelectTrigger>
            <SelectContent>
              {v && !opts.includes(v) ? <SelectItem value={v}>{v}</SelectItem> : null}
              {opts.map((o, idx) => (
                <SelectItem key={`${o}__${idx}`} value={o}>
                  {o}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      }

      case "integer":
      case "decimal": {
        const n = asNumber(effectiveValue);

        if (param.view_type === "pot_slider") {
          const pots = potValues(param);
          const cur = clamp(n, pots[0], pots[pots.length - 1]);
          const idx = Math.max(0, pots.findIndex((x) => x === cur));
          return (
            <div className="space-y-2">
              <Slider
                value={[idx]}
                onValueChange={(vals) => {
                  const i = vals[0] ?? 0;
                  const picked = pots[clamp(i, 0, pots.length - 1)];
                  onChangeValue(picked);
                }}
                min={0}
                max={pots.length - 1}
                step={1}
                disabled={commonDisabled}
              />
              <div className="flex items-center gap-2">
                <Input
                  value={String(cur)}
                  onChange={(e) => {
                    const nextN = Math.floor(Number(e.target.value));
                    if (Number.isFinite(nextN)) {
                      // snap to nearest pot
                      let best = pots[0];
                      let bestDist = Math.abs(best - nextN);
                      for (const p of pots) {
                        const d = Math.abs(p - nextN);
                        if (d < bestDist) {
                          best = p;
                          bestDist = d;
                        }
                      }
                      onChangeValue(best);
                    }
                  }}
                  disabled={commonDisabled}
                  className="h-9 font-mono text-xs"
                />
                <div className="text-[10px] text-muted-foreground">{pots.join(" · ")}</div>
              </div>
            </div>
          );
        }

        if (shouldUseSlider(param.type, param.view_type)) {
          const minRaw = typeof param.view_min === "number" ? param.view_min : numOr(param.min, 0);
          const maxRaw = typeof param.view_max === "number" ? param.view_max : numOr(param.max, minRaw);
          const min = Number.isFinite(minRaw) ? minRaw : 0;
          const max = Number.isFinite(maxRaw) ? Math.max(maxRaw, min) : min;
          const step = typeof param.step === "number" && param.step > 0 ? param.step : param.type === "decimal" ? 0.1 : 1;
          const clamped = clamp(n, min, max);

          return (
            <div className="space-y-2">
              <Slider
                value={[clamped]}
                onValueChange={(vals) => {
                  const v = vals[0] ?? clamped;
                  const next = param.type === "integer" ? Math.trunc(v) : v;
                  onChangeValue(next);
                }}
                min={min}
                max={max}
                step={step}
                disabled={commonDisabled}
              />
              <Input
                value={String(clamped)}
                onChange={(e) => onChangeValue(coerceValue(param, e.target.value))}
                disabled={commonDisabled}
                className="h-9 font-mono text-xs"
              />
            </div>
          );
        }

        return (
          <Input
            value={String(n)}
            onChange={(e) => onChangeValue(coerceValue(param, e.target.value))}
            disabled={commonDisabled}
            className="h-9 font-mono text-xs"
          />
        );
      }

      case "list": {
        const text = formatListValue(effectiveValue);
        return (
          <Textarea
            value={text}
            onChange={(e) => onChangeValue(parseListText(e.target.value))}
            disabled={commonDisabled}
            className="min-h-[84px] font-mono text-xs"
            placeholder="One per line or comma-separated"
          />
        );
      }

      case "image": {
        const v = typeof effectiveValue === "string" ? effectiveValue : "";
        return (
          <Textarea
            value={v}
            onChange={(e) => onChangeValue(e.target.value)}
            disabled={commonDisabled}
            className="min-h-[84px] font-mono text-xs"
            placeholder="Paste data:image/...;base64,... or a server path"
          />
        );
      }

      case "image_list": {
        const text = formatListValue(effectiveValue);
        return (
          <Textarea
            value={text}
            onChange={(e) => onChangeValue(parseListText(e.target.value))}
            disabled={commonDisabled}
            className="min-h-[84px] font-mono text-xs"
            placeholder="One per line (data:image/... or server paths)"
          />
        );
      }

      case "text":
      default: {
        const v = typeof effectiveValue === "string" ? effectiveValue : String(effectiveValue);
        if (isPromptView(param)) {
          return (
            <PromptEditor
              value={v}
              onValueChange={(nv) => onChangeValue(nv)}
              placeholder={param.default || undefined}
              className={cn(commonDisabled && "pointer-events-none opacity-70")}
            />
          );
        }

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
    <div className={cn("space-y-1", !selfEnabled && "opacity-60")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <InfoTip text={paramInfoText(param)} />
          <Label className="text-xs truncate">{param.name}</Label>
        </div>
        {param.toggleable && <Switch checked={selfEnabled} onCheckedChange={onToggle} disabled={isPending} />}
      </div>
      {renderControl()}
      {param.description ? <div className="text-[10px] text-muted-foreground">{param.description}</div> : null}
    </div>
  );
});

type GroupSectionProps = {
  groupId: string;
  depth: number;
  groupsById: Map<string, T2IParamGroupNet>;
  groupChildren: Map<string, string[]>;
  paramsByGroup: Map<string, T2IParamNet[]>;
  descendantGroupIdsByGroup: Map<string, string[]>;
  open: boolean;
  getOpen: (groupId: string) => boolean;
  toggleOpen: (groupId: string) => void;
  models: Record<string, string[]>;
  paramsById: Map<string, T2IParamNet>;
};

const GroupSection = memo(function GroupSection({
  groupId,
  depth,
  groupsById,
  groupChildren,
  paramsByGroup,
  descendantGroupIdsByGroup,
  open,
  getOpen,
  toggleOpen,
  models,
  paramsById,
}: GroupSectionProps) {
  const setEnabledMany = useT2IParamValuesStore((s) => s.setEnabledMany);
  const clearParams = useT2IParamValuesStore((s) => s.clearParams);
  const groupEnabled = useT2IParamValuesStore((s) => s.enabled[groupId]);

  const group = groupsById.get(groupId);
  const childIds = groupChildren.get(groupId) ?? [];
  const groupParams = paramsByGroup.get(groupId) ?? [];
  const hasAnyContent = groupParams.length > 0 || childIds.length > 0;
  if (!hasAnyContent) return null;

  const effectiveGroupEnabled = groupEnabled ?? true;

  return (
    <div key={groupId} className={cn("space-y-3", depth > 0 && "pl-3 border-l border-border/60")}>
      <div className="flex items-center justify-between gap-2">
        <button type="button" className="text-left flex-1" onClick={() => toggleOpen(groupId)}>
          <div className="text-xs font-semibold">{groupLabel(group)}</div>
          {group?.description ? <div className="text-[10px] text-muted-foreground">{group.description}</div> : null}
        </button>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-xs"
            onClick={() => {
              const descendantGroupIds = descendantGroupIdsByGroup.get(groupId) ?? [];
              const idsToClear: string[] = [groupId, ...groupParams.map((p) => p.id), ...descendantGroupIds];
              for (const dg of descendantGroupIds) {
                const dgParams = paramsByGroup.get(dg) ?? [];
                idsToClear.push(...dgParams.map((p) => p.id));
              }
              clearParams(idsToClear);
            }}
            title="Reset this group"
          >
            Reset
          </Button>
          {group?.toggles ? (
            <Switch
              checked={effectiveGroupEnabled !== false}
              onCheckedChange={(v) => {
                const updates: Record<string, boolean> = {};
                updates[groupId] = v;
                for (const p of groupParams) updates[p.id] = v;

                const descendants = descendantGroupIdsByGroup.get(groupId) ?? [];
                for (const dg of descendants) {
                  updates[dg] = v;
                  const dgParams = paramsByGroup.get(dg) ?? [];
                  for (const p of dgParams) updates[p.id] = v;
                }

                setEnabledMany(updates);
              }}
            />
          ) : null}
        </div>
      </div>

      {open ? (
        <div className="space-y-3">
          {groupParams.map((p) => (
            <ParamRow key={p.id} param={p} models={models} paramsById={paramsById} />
          ))}
          {childIds.map((cid) => (
            <GroupSection
              key={cid}
              groupId={cid}
              depth={depth + 1}
              groupsById={groupsById}
              groupChildren={groupChildren}
              paramsByGroup={paramsByGroup}
              descendantGroupIdsByGroup={descendantGroupIdsByGroup}
              open={getOpen(cid)}
              getOpen={getOpen}
              toggleOpen={toggleOpen}
              models={models}
              paramsById={paramsById}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
});

function groupLabel(group: T2IParamGroupNet | null | undefined): string {
  if (!group) return "Ungrouped";
  return group.name || group.id;
}

function sortByPriority<T extends { priority: number }>(a: T, b: T): number {
  return (a.priority ?? 10) - (b.priority ?? 10);
}

export function BackendParamControls() {
  const isLoading = useT2IParamsStore((s) => s.isLoading);
  const error = useT2IParamsStore((s) => s.error);
  const load = useT2IParamsStore((s) => s.load);
  const params = useT2IParamsStore((s) => s.params);
  const groups = useT2IParamsStore((s) => s.groups);
  const models = useT2IParamsStore((s) => s.models);

  const clearParams = useT2IParamValuesStore((s) => s.clearParams);

  const [query, setQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [includeHidden, setIncludeHidden] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    void load();
  }, [load]);

  const groupsById = useMemo(() => {
    const map = new Map<string, T2IParamGroupNet>();
    for (const g of groups) {
      map.set(g.id, g);
    }
    return map;
  }, [groups]);

  const paramsById = useMemo(() => {
    const map = new Map<string, T2IParamNet>();
    for (const p of params) {
      map.set(p.id, p);
    }
    return map;
  }, [params]);

  const filteredParams = useMemo(() => {
    const q = query.trim().toLowerCase();
    return params
      .filter((p) => (includeHidden ? !p.extra_hidden : p.visible && !p.extra_hidden))
      .filter((p) => (showAdvanced ? true : p.advanced === false))
      .filter((p) => {
        if (!q) return true;
        return p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      })
      .sort((a, b) => (a.priority ?? 10) - (b.priority ?? 10));
  }, [includeHidden, params, query, showAdvanced]);

  const paramsByGroup = useMemo(() => {
    const map = new Map<string, T2IParamNet[]>();
    for (const p of filteredParams) {
      const groupId = p.group ?? "__ungrouped__";
      const arr = map.get(groupId);
      if (arr) {
        arr.push(p);
      } else {
        map.set(groupId, [p]);
      }
    }
    return map;
  }, [filteredParams]);

  const groupChildren = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const g of groups) {
      if (!g.parent) continue;
      const arr = map.get(g.parent) ?? [];
      arr.push(g.id);
      map.set(g.parent, arr);
    }
    for (const [k, v] of map) {
      v.sort((a, b) => (groupsById.get(a)?.priority ?? 10) - (groupsById.get(b)?.priority ?? 10));
      map.set(k, v);
    }
    return map;
  }, [groups, groupsById]);

  const descendantGroupIdsByGroup = useMemo(() => {
    const cache = new Map<string, string[]>();
    const visit = (root: string): string[] => {
      const existing = cache.get(root);
      if (existing) return existing;
      const direct = groupChildren.get(root) ?? [];
      const all: string[] = [...direct];
      for (const c of direct) {
        all.push(...visit(c));
      }
      cache.set(root, all);
      return all;
    };
    for (const g of groups) {
      visit(g.id);
    }
    return cache;
  }, [groupChildren, groups]);

  const rootGroupIds = useMemo(() => {
    const roots = groups.filter((g) => !g.parent).sort(sortByPriority).map((g) => g.id);
    return roots;
  }, [groups]);

  const getOpen = useCallback(
    (groupId: string) => {
      const group = groupsById.get(groupId);
      return openGroups[groupId] ?? (group?.open !== false);
    },
    [groupsById, openGroups],
  );

  const toggleOpen = useCallback((groupId: string) => {
    setOpenGroups((s) => ({
      ...s,
      [groupId]: !(s[groupId] ?? true),
    }));
  }, []);

  const renderGroup = (groupId: string, depth: number) => {
    return (
      <GroupSection
        key={groupId}
        groupId={groupId}
        depth={depth}
        groupsById={groupsById}
        groupChildren={groupChildren}
        paramsByGroup={paramsByGroup}
        descendantGroupIdsByGroup={descendantGroupIdsByGroup}
        open={getOpen(groupId)}
        getOpen={getOpen}
        toggleOpen={toggleOpen}
        models={models}
        paramsById={paramsById}
      />
    );
  };

  const ungrouped = paramsByGroup.get("__ungrouped__") ?? [];

  return (
    <div className="space-y-3">
      <div className="space-y-3">
        <div className="space-y-1">
          <Label className="text-xs text-muted-foreground">Search Parameters</Label>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name/id..."
            className="h-9"
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Show Advanced</Label>
          <Switch checked={showAdvanced} onCheckedChange={setShowAdvanced} />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-xs">Include Hidden Params</Label>
          <Switch checked={includeHidden} onCheckedChange={setIncludeHidden} />
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => useT2IParamValuesStore.getState().clear()}
            disabled={isLoading}
            title="Clear all backend parameter overrides"
          >
            Reset All
          </Button>
          <div className="text-[10px] text-muted-foreground">{isLoading ? "Loading…" : null}</div>
        </div>
      </div>

      <ScrollArea className="h-[50vh]">
        <div className="space-y-5 pr-3">
          {ungrouped.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-semibold">Ungrouped</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-xs"
                  onClick={() => clearParams(ungrouped.map((p) => p.id))}
                  title="Reset ungrouped params"
                >
                  Reset
                </Button>
              </div>
              {ungrouped.map((p) => (
                <ParamRow key={p.id} param={p} models={models} paramsById={paramsById} />
              ))}
            </div>
          ) : null}

          {rootGroupIds.map((gid) => renderGroup(gid, 0))}
        </div>
      </ScrollArea>
    </div>
  );
}
