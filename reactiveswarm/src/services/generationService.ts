import { t2iService } from "@/api/T2IService";
import { swarmHttp } from "@/api/SwarmHttpClient";
import { ParamSerializer } from "@/lib/utils/ParamSerializer";
import { useParameterStore } from "@/stores/parameterStore";
import { useGenerationStore } from "@/stores/generationStore";
import { useJobStore } from "@/stores/jobStore";
import { runText2ImageWS } from "@/services/t2iWsRunner";
import { resolveSwarmPath } from "@/lib/utils/swarmPaths";
import { useT2IParamValuesStore } from "@/stores/t2iParamValuesStore";

function resolveWsImage(img: string): string {
  if (img.startsWith("data:")) return img;
  return resolveSwarmPath(img);
}

function normalizePercent(p: number | undefined): number | undefined {
  if (p === undefined) return undefined;
  if (!Number.isFinite(p)) return undefined;
  return p > 1.001 ? p / 100 : p;
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
    model: params.model,
    extras: {
      sampler: params.scheduler,
    },
  });

  const backendParamsState = useT2IParamValuesStore.getState();
  for (const [key, value] of Object.entries(backendParamsState.values)) {
    if (value === undefined) continue;
    if (backendParamsState.enabled[key] === false) continue;
    if (flat[key] !== undefined) continue;
    flat[key] = value;
  }

  try {
    const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    useJobStore.getState().ensureJob(requestId);
    useJobStore.getState().setActiveRequestId(requestId);

    await runText2ImageWS(flat, {
      requestId,
      openTimeoutMs: 800,
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
