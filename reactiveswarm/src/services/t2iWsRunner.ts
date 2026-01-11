import { WsDispatcher } from "@/lib/utils/WsDispatcher";
import type { FlatParamRecord } from "@/lib/utils/ParamSerializer";
import { useBackendStore } from "@/stores/useBackendStore";
import { useJobStore } from "@/stores/useJobStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { resolveWsUrl } from "@/lib/config/swarmEndpoints";
import type { SwarmWsEvent } from "@/types/t2i";

export interface T2IWsRunHandle {
  requestId: string;
  close: () => void;
}

export interface T2IWsRunOptions {
  requestId?: string;
  openTimeoutMs?: number;
  onEvent?: (event: SwarmWsEvent, requestId: string) => void;
}

function createRequestId(): string {
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizePercent(p: number | undefined): number | undefined {
  if (p === undefined) return undefined;
  if (!Number.isFinite(p)) return undefined;
  return p > 1.001 ? p / 100 : p;
}

export async function runText2ImageWS(flatPayload: FlatParamRecord, options?: T2IWsRunOptions): Promise<T2IWsRunHandle> {
  const backendUrl = useBackendStore.getState().backendUrl;
  const ensureSession = useSessionStore.getState().ensureSession;
  const sessionId = await ensureSession();

  const wsUrl = resolveWsUrl("GenerateText2ImageWS", backendUrl);
  const requestId = options?.requestId ?? createRequestId();
  const openTimeoutMs = options?.openTimeoutMs ?? 4000;

  useJobStore.getState().ensureJob(requestId);

  const dispatcher = new WsDispatcher();
  const socket = new WebSocket(wsUrl);
  useJobStore.getState().registerCloseHandler(requestId, () => socket.close());

  const unsub = dispatcher.addListener((evt) => {
    if (evt.type === "progress") {
      const rid = evt.gen_progress.request_id ?? requestId;
      useJobStore.getState().ensureJob(rid);
      const overall = normalizePercent(evt.gen_progress.overall_percent);
      const current = normalizePercent(evt.gen_progress.current_percent);
      useJobStore
        .getState()
        .updateProgress(
          rid,
          evt.gen_progress.batch_index,
          overall,
          current,
          evt.gen_progress.preview,
          evt.gen_progress.metadata,
        );
      options?.onEvent?.(evt, rid);
      return;
    }

    if (evt.type === "image") {
      const rid = evt.image.request_id ?? requestId;
      useJobStore.getState().ensureJob(rid);
      useJobStore.getState().addImage(rid, evt.image.batch_index, evt.image.image, evt.image.metadata ?? undefined);
      options?.onEvent?.(evt, rid);
      return;
    }

    if (evt.type === "error") {
      useJobStore.getState().markError(requestId, evt.message);
      socket.close();
      options?.onEvent?.(evt, requestId);
      return;
    }

    if (evt.type === "close") {
      const existing = useJobStore.getState().jobs.get(requestId);
      if (existing && existing.status !== "error") {
        useJobStore.getState().markComplete(requestId);
      }
      options?.onEvent?.(evt, requestId);
      return;
    }

    options?.onEvent?.(evt, requestId);
  });

  const cleanup = (): void => {
    unsub();
    useJobStore.getState().unregisterCloseHandler(requestId);
  };

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
    options?.onEvent?.({ type: "error", message: "WebSocket error" }, requestId);
  };

  socket.onclose = () => {
    cleanup();
    const existing = useJobStore.getState().jobs.get(requestId);
    if (existing && existing.status !== "error" && existing.status !== "completed") {
      useJobStore.getState().markComplete(requestId);
    }
    options?.onEvent?.({ type: "close" }, requestId);
  };

  const opened: boolean = await new Promise((resolve) => {
    const t = window.setTimeout(() => resolve(false), openTimeoutMs);
    socket.onopen = () => {
      window.clearTimeout(t);
      resolve(true);
    };
  });

  if (!opened) {
    socket.close();
    cleanup();
    throw new Error("WebSocket open timeout");
  }

  const imagesRaw = flatPayload["images"];
  const images = typeof imagesRaw === "number" ? imagesRaw : 1;
  const rawInput: Record<string, unknown> = { ...flatPayload };
  delete rawInput.images;

  socket.send(JSON.stringify({ session_id: sessionId, images, ...rawInput }));

  return {
    requestId,
    close: () => socket.close(),
  };
}
