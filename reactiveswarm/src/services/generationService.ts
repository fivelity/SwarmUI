import { t2iService } from "@/api/T2IService";
import { swarmHttp } from "@/api/SwarmHttpClient";
import { ParamSerializer } from "@/lib/utils/ParamSerializer";
import { useParameterStore } from "@/stores/parameterStore";
import { useGenerationStore } from "@/stores/generationStore";
import { useJobStore } from "@/store/useJobStore";
import { useBackendStore } from "@/store/useBackendStore";
import { useSessionStore } from "@/store/useSessionStore";
import { WsDispatcher } from "@/lib/utils/WsDispatcher";
import { resolveSwarmPath } from "@/lib/utils/swarmPaths";

function resolveWsImage(img: string): string {
  if (img.startsWith("data:")) return img;
  return resolveSwarmPath(img);
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

  try {
    // WS-first: use correct SwarmUI protocol and job-map routing.
    const sessionId = await useSessionStore.getState().ensureSession();
    const backendUrl = useBackendStore.getState().backendUrl;
    const wsUrl = `${backendUrl.replace(/^http/, "ws")}/API/GenerateText2ImageWS`;

    const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    useJobStore.getState().ensureJob(requestId);
    useJobStore.getState().setActiveRequestId(requestId);

    const dispatcher = new WsDispatcher();
    const socket = new WebSocket(wsUrl);

    const unsub = dispatcher.addListener((evt) => {
      if (evt.type === "progress") {
        const rid = evt.gen_progress.request_id ?? requestId;
        useJobStore.getState().ensureJob(rid);
        useJobStore
          .getState()
          .updateProgress(rid, evt.gen_progress.batch_index, evt.gen_progress.overall_percent, evt.gen_progress.current_percent, evt.gen_progress.preview, evt.gen_progress.metadata);
        const overall = typeof evt.gen_progress.overall_percent === "number" ? evt.gen_progress.overall_percent : genStore.progress;
        genStore.setProgress(overall, undefined, undefined);
        if (evt.gen_progress.preview) {
          genStore.setCurrentImage(resolveWsImage(evt.gen_progress.preview));
        }
        return;
      }

      if (evt.type === "image") {
        const rid = evt.image.request_id ?? requestId;
        useJobStore.getState().ensureJob(rid);
        useJobStore.getState().addImage(rid, evt.image.batch_index, evt.image.image, evt.image.metadata ?? undefined);
        genStore.setCurrentImage(resolveWsImage(evt.image.image));
        return;
      }

      if (evt.type === "error") {
        useJobStore.getState().markError(requestId, evt.message);
        genStore.setGenerating(false);
        return;
      }

      if (evt.type === "close") {
        useJobStore.getState().markComplete(requestId);
        genStore.setGenerating(false);
      }
    });

    socket.onmessage = (e) => {
      try {
        const parsed: unknown = JSON.parse(typeof e.data === "string" ? e.data : "{}");
        dispatcher.dispatchRaw(parsed);
      } catch {
        dispatcher.dispatchRaw({ error: "Failed to parse websocket message" });
      }
    };
    socket.onerror = () => {
      useJobStore.getState().markError(requestId, "WebSocket error");
      genStore.setGenerating(false);
    };

    // Wait for open briefly, else fallback to REST.
    const opened: boolean = await new Promise((resolve) => {
      const t = window.setTimeout(() => resolve(false), 800);
      socket.onopen = () => {
        window.clearTimeout(t);
        resolve(true);
      };
    });

    if (!opened) {
      unsub();
      socket.close();
      const res = await t2iService.generateText2ImageREST(flat);
      if (Array.isArray(res.images) && res.images.length > 0) {
        genStore.setCurrentImage(res.images[0]);
      }
      genStore.setGenerating(false);
      return;
    }

    const imagesRaw = flat["images"];
    const images = typeof imagesRaw === "number" ? imagesRaw : 1;
    const rawInput: Record<string, unknown> = { ...flat };
    delete rawInput.images;
    socket.send(JSON.stringify({ session_id: sessionId, images, ...rawInput }));
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
