import { t2iService } from "@/api/T2IService";
import { swarmHttp } from "@/api/SwarmHttpClient";
import { ParamSerializer } from "@/lib/utils/ParamSerializer";
import { useParameterStore } from "@/stores/useParameterStore";
import { useGenerationStore } from "@/stores/useGenerationStore";
import { useJobStore } from "@/stores/useJobStore";
import { runText2ImageWS } from "@/services/t2iWsRunner";
import { resolveSwarmPath } from "@/lib/utils/swarmPaths";
import { useT2IParamValuesStore } from "@/stores/useT2IParamValuesStore";
import { useT2IParamsStore } from "@/stores/useT2IParamsStore";
import { modelsService } from "@/api/ModelsService";

function resolveWsImage(img: string): string {
  if (img.startsWith("data:")) return img;
  return resolveSwarmPath(img);
}

function normalizePercent(p: number | undefined): number | undefined {
  if (p === undefined) return undefined;
  if (!Number.isFinite(p)) return undefined;
  return p > 1.001 ? p / 100 : p;
}

async function resolveModelFallback(): Promise<string | undefined> {
  const backendParamsState = useT2IParamValuesStore.getState();
  const fromOverride = backendParamsState.enabled.model !== false ? backendParamsState.values.model : undefined;
  if (typeof fromOverride === "string" && fromOverride.trim().length > 0) {
    return fromOverride.trim();
  }

  const modelsBySubtype = useT2IParamsStore.getState().models;
  const list = modelsBySubtype["Stable-Diffusion"];
  if (Array.isArray(list) && list.length > 0) {
    const first = list[0];
    if (typeof first === "string" && first.trim().length > 0) {
      return first.trim();
    }
  }

  const resp = await modelsService.listModels({
    path: "",
    depth: 1,
    subtype: "Stable-Diffusion",
    allowRemote: true,
    sortBy: "Name",
    sortReverse: false,
    dataImages: false,
  });

  const firstFile = Array.isArray(resp.files) ? resp.files[0] : undefined;
  const name = firstFile && typeof firstFile.name === "string" ? firstFile.name : undefined;
  if (typeof name === "string" && name.trim().length > 0) {
    return name.trim();
  }
  return undefined;
}

export const generateImage = async () => {
  const params = useParameterStore.getState();
  const genStore = useGenerationStore.getState();

  if (genStore.isGenerating) return;

  genStore.setGenerating(true);
  genStore.setProgress(0, 0, params.steps);
  genStore.setCurrentImage(null);

  const flat = ParamSerializer.toFlat({
    prompt: params.prompt,
    negativeprompt: params.negativePrompt,
    images: params.batchSize,
    seed: params.seed,
    steps: params.steps,
    cfgscale: params.cfgScale,
    width: params.width,
    height: params.height,
    model: params.model.trim().length > 0 ? params.model.trim() : undefined,
    extras: {
      sampler: params.scheduler,
    },
  });

  if (typeof flat.model === "string" && flat.model.trim().length === 0) {
    delete flat.model;
  }

  const backendParamsState = useT2IParamValuesStore.getState();
  for (const [key, value] of Object.entries(backendParamsState.values)) {
    if (value === undefined) continue;
    if (backendParamsState.enabled[key] === false) continue;
    if (flat[key] !== undefined) continue;
    flat[key] = value;
  }

  const t2iParamsState = useT2IParamsStore.getState();
  const stableList = t2iParamsState.models["Stable-Diffusion"];
  if ((!Array.isArray(stableList) || stableList.length === 0) && !t2iParamsState.isLoading) {
    await t2iParamsState.load().catch(() => undefined);
  }

  if (typeof flat.model !== "string" || flat.model.trim().length === 0) {
    const fallback = await resolveModelFallback().catch(() => undefined);
    if (typeof fallback === "string" && fallback.trim().length > 0) {
      flat.model = fallback;
      useParameterStore.getState().setModel(fallback);
    }
  }

  if (typeof flat.model !== "string" || flat.model.trim().length === 0) {
    const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    useJobStore.getState().ensureJob(requestId);
    useJobStore.getState().setActiveRequestId(requestId);
    useJobStore.getState().markError(requestId, "No model selected. Select a model or ensure models are available.");
    genStore.setGenerating(false);
    return;
  }

  try {
    const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    useJobStore.getState().ensureJob(requestId);
    useJobStore.getState().setActiveRequestId(requestId);

    await runText2ImageWS(flat, {
      requestId,
      openTimeoutMs: 4000,
      onEvent: (evt) => {
        if (evt.type === "progress") {
          const overallRaw = typeof evt.gen_progress.overall_percent === "number" ? evt.gen_progress.overall_percent : genStore.progress;
          const overall = normalizePercent(overallRaw) ?? genStore.progress;
          genStore.setProgress(overall, undefined, undefined);
          if (evt.gen_progress.preview) {
            genStore.setCurrentImage(resolveWsImage(evt.gen_progress.preview));
          }
          return;
        }

        if (evt.type === "image") {
          genStore.setCurrentImage(resolveWsImage(evt.image.image));
          return;
        }

        if (evt.type === "error") {
          genStore.setGenerating(false);
          return;
        }

        if (evt.type === "close") {
          genStore.setGenerating(false);
        }
      },
    });
  } catch (e) {
    try {
      const res = await t2iService.generateText2ImageREST(flat);
      if (Array.isArray(res.images) && res.images.length > 0) {
        genStore.setCurrentImage(resolveWsImage(res.images[0]));
      }
    } catch (inner) {
      const msg = inner instanceof Error ? inner.message : e instanceof Error ? e.message : "Generation failed";
      useJobStore.getState().markError(useJobStore.getState().activeRequestId ?? "rest", msg);
    } finally {
      genStore.setGenerating(false);
    }
  }
};

export const interruptGeneration = async (includeOtherSessions: boolean = false) => {
  // Always stop the local WS stream immediately.
  useJobStore.getState().closeActiveJob();
  try {
    await swarmHttp.post("InterruptAll", { other_sessions: includeOtherSessions });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to interrupt";
    useJobStore.getState().markError(useJobStore.getState().activeRequestId ?? "interrupt", msg);
  }
};
