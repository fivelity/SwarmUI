import { useEffect, useMemo, useState } from "react";
import { useParameterStore } from "@/stores/parameterStore";
import { useModelStore } from "@/stores/modelStore";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ModelBrowser } from "@/components/models/ModelBrowser";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { modelsService, type ModelSubtype, type ModelNetEntry } from "@/api/ModelsService";
import { toast } from "sonner";
import { Box, Check, ExternalLink, Loader2, Search } from "lucide-react";

function toModelSubtype(type: "checkpoint" | "lora" | "embedding" | "vae"): ModelSubtype {
  if (type === "lora") return "LoRA";
  if (type === "embedding") return "Embedding";
  if (type === "vae") return "VAE";
  return "Stable-Diffusion";
}

function isErrorResponse(v: unknown): v is { error: string } {
  return typeof v === "object" && v !== null && typeof (v as { error?: unknown }).error === "string";
}

function detailRow(label: string, value: string | undefined) {
  if (!value) return null;
  return (
    <div className="flex flex-col gap-1">
      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="text-sm wrap-break-word">{value}</div>
    </div>
  );
}

export function ModelSelector() {
  const model = useParameterStore((state) => state.model);
  const setModel = useParameterStore((state) => state.setModel);
  const [isOpen, setIsOpen] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const models = useModelStore((s) => s.models);
  const fetchModels = useModelStore((s) => s.fetchModels);
  const selectedModel = useModelStore((s) => s.selectedModel);

  const [isDescribeLoading, setIsDescribeLoading] = useState(false);
  const [describe, setDescribe] = useState<ModelNetEntry | null>(null);
  const [describeError, setDescribeError] = useState<string | null>(null);

  const allModels = useMemo(() => {
    return [...models].sort((a, b) => a.name.localeCompare(b.name));
  }, [models]);

  useEffect(() => {
    void fetchModels({ depth: 4, allowRemote: true });
  }, [fetchModels]);

  useEffect(() => {
    const m = selectedModel;
    if (!m) {
      setDescribe(null);
      setDescribeError(null);
      return;
    }

    let canceled = false;
    setIsDescribeLoading(true);
    setDescribe(null);
    setDescribeError(null);

    void (async () => {
      try {
        const resp = await modelsService.describeModel({ modelName: m.id, subtype: toModelSubtype(m.type) });
        if (canceled) return;
        setDescribe(resp.model);
      } catch (e) {
        if (canceled) return;
        setDescribeError(e instanceof Error ? e.message : "Failed to load model details");
      } finally {
        if (!canceled) setIsDescribeLoading(false);
      }
    })();

    return () => {
      canceled = true;
    };
  }, [selectedModel]);

  const handleQuickPick = (modelId: string) => {
    setModel(modelId);
    setDropdownOpen(false);
  };

  const handleLoadSelected = async () => {
    const m = selectedModel;
    if (!m) return;

    const toastId = toast.loading("Loading model...");
    try {
      const resp = await modelsService.selectModel({ model: m.id, backendId: null });
      if (isErrorResponse(resp)) {
        toast.error(resp.error, { id: toastId });
        return;
      }
      setModel(m.id);
      toast.success("Model loaded", { id: toastId });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to load model", { id: toastId });
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="model">Model</Label>

      <div className="flex items-center gap-2">
        <Popover open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={dropdownOpen}
              className="flex-1 justify-between font-normal"
            >
              <div className="flex items-center gap-2 min-w-0">
                <Box className="w-4 h-4 text-muted-foreground shrink-0" />
                <span className="truncate">{model || "Select a model..."}</span>
              </div>
              <Search className="ms-2 h-4 w-4 shrink-0 opacity-60" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[420px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Search models..." />
              <CommandList className="max-h-[320px]">
                <CommandEmpty>No models found.</CommandEmpty>
                {allModels.map((m) => (
                  <CommandItem
                    key={m.id}
                    value={m.id}
                    onSelect={(v: string) => handleQuickPick(v)}
                    className="gap-2"
                  >
                    <Check className={model === m.id ? "opacity-100" : "opacity-0"} />
                    <span className="truncate">{m.name}</span>
                    <span className="ms-auto text-[11px] text-muted-foreground uppercase">{m.type}</span>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0" title="Browse models">
              <Box className="h-4 w-4" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-6xl h-[700px] flex flex-col p-0 gap-0">
            <DialogHeader className="p-4 border-b">
              <DialogTitle>Select Model</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-hidden grid grid-cols-[1.35fr_0.65fr]">
              <div className="overflow-hidden">
                <ModelBrowser />
              </div>

              <div className="border-s border-border bg-muted/10 flex flex-col min-w-0">
                <div className="p-4 border-b border-border flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">
                      {selectedModel?.name ?? "No model selected"}
                    </div>
                    {selectedModel?.id && (
                      <div className="text-xs text-muted-foreground truncate" title={selectedModel.id}>
                        {selectedModel.id}
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    onClick={handleLoadSelected}
                    disabled={!selectedModel || isDescribeLoading}
                  >
                    {isDescribeLoading ? <Loader2 className="w-4 h-4 me-2 animate-spin" /> : null}
                    Load / Use
                  </Button>
                </div>

                <div className="flex-1 overflow-auto p-4 space-y-4">
                  {describeError ? (
                    <div className="text-sm text-destructive">{describeError}</div>
                  ) : null}

                  {describe?.preview_image ? (
                    <div className="rounded-md overflow-hidden border border-border bg-background">
                      <img src={describe.preview_image} alt="Model preview" className="w-full h-auto" />
                    </div>
                  ) : null}

                  {detailRow("Usage hint", typeof describe?.usage_hint === "string" ? describe.usage_hint : undefined)}
                  {detailRow("Trigger words", typeof describe?.trigger_phrase === "string" ? describe.trigger_phrase : undefined)}
                  {detailRow("Base / Class", typeof describe?.class === "string" ? describe.class : undefined)}
                  {detailRow("Architecture", typeof describe?.architecture === "string" ? describe.architecture : undefined)}
                  {detailRow("Version / Date", typeof describe?.date === "string" ? describe.date : undefined)}
                  {detailRow("Author", typeof describe?.author === "string" ? describe.author : undefined)}
                  {detailRow("License", typeof describe?.license === "string" ? describe.license : undefined)}
                  {detailRow("Notes", typeof describe?.description === "string" ? describe.description : undefined)}

                  {typeof describe?.merged_from === "string" && describe.merged_from.length > 0 ? (
                    <div className="flex flex-col gap-1">
                      <div className="text-[11px] uppercase tracking-wide text-muted-foreground">Link</div>
                      <a
                        className="text-sm inline-flex items-center gap-2 text-primary hover:underline break-all"
                        href={describe.merged_from}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" />
                        {describe.merged_from}
                      </a>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
