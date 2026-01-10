import { t2iService } from "@/api/T2IService";
import { swarmHttp } from "@/api/SwarmHttpClient";
import { ParamSerializer } from "@/lib/utils/ParamSerializer";
import { useParameterStore } from "@/stores/parameterStore";
import { useGenerationStore } from "@/stores/generationStore";
import { useJobStore } from "@/store/useJobStore";

export const generateImage = async () => {
  const params = useParameterStore.getState();
  const genStore = useGenerationStore.getState();

  if (genStore.isGenerating) return;

  genStore.setGenerating(true);
  genStore.setProgress(0, 0, params.steps);
  genStore.setCurrentImage(null);

  // This is a REST fallback. Primary live generation should use /API/GenerateText2ImageWS.
  // We keep REST here for parity + non-streaming use-cases.
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

  try {
    const res = await t2iService.generateText2ImageREST(flat);
    if (Array.isArray(res.images) && res.images.length > 0) {
      genStore.setCurrentImage(res.images[0]);
    }
    genStore.setGenerating(false);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Generation failed";
    genStore.setGenerating(false);
    useJobStore.getState().markError(useJobStore.getState().activeRequestId ?? "rest", msg);
  }
};

export const interruptGeneration = async (includeOtherSessions: boolean = false) => {
  try {
    await swarmHttp.post("InterruptAll", { other_sessions: includeOtherSessions });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Failed to interrupt";
    useJobStore.getState().markError(useJobStore.getState().activeRequestId ?? "interrupt", msg);
  }
};
