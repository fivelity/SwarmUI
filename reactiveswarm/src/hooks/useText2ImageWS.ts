import { useEffect, useMemo, useRef } from "react";
import { useBackendStore } from "@/store/useBackendStore";
import { useSessionStore } from "@/store/useSessionStore";
import { WsDispatcher } from "@/lib/utils/WsDispatcher";
import type { FlatParamRecord } from "@/lib/utils/ParamSerializer";
import { useJobStore } from "@/store/useJobStore";

export interface UseText2ImageWsOptions {
  enabled: boolean;
}

export interface WsRunHandle {
  requestId: string;
  close: () => void;
}

function wsBaseFromHttp(httpBase: string): string {
  if (httpBase.startsWith("https://")) return `wss://${httpBase.slice("https://".length)}`;
  if (httpBase.startsWith("http://")) return `ws://${httpBase.slice("http://".length)}`;
  return httpBase;
}

export function useText2ImageWS(options: UseText2ImageWsOptions) {
  const backendUrl = useBackendStore((s) => s.backendUrl);
  const ensureSession = useSessionStore((s) => s.ensureSession);

  const dispatcher = useMemo(() => new WsDispatcher(), []);

  const socketRef = useRef<WebSocket | null>(null);
  const disposersRef = useRef<(() => void)[]>([]);

  useEffect(() => {
    return () => {
      for (const d of disposersRef.current) d();
      disposersRef.current = [];
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);

  const run = async (flatPayload: FlatParamRecord): Promise<WsRunHandle> => {
    const sessionId = await ensureSession();
    const wsUrl = `${wsBaseFromHttp(backendUrl)}/API/GenerateText2ImageWS`;

    const requestId = `${Date.now()}_${Math.random().toString(16).slice(2)}`;
    useJobStore.getState().ensureJob(requestId);

    // Ensure no stale listeners
    for (const d of disposersRef.current) d();
    disposersRef.current = [];

    const socket = new WebSocket(wsUrl);
    socketRef.current = socket;

    const unsub = dispatcher.addListener((evt) => {
      if (evt.type === "progress") {
        const rid = evt.gen_progress.request_id ?? requestId;
        useJobStore.getState().ensureJob(rid);
        useJobStore
          .getState()
          .updateProgress(rid, evt.gen_progress.batch_index, evt.gen_progress.overall_percent, evt.gen_progress.current_percent, evt.gen_progress.preview, evt.gen_progress.metadata);
        return;
      }

      if (evt.type === "image") {
        const rid = evt.image.request_id ?? requestId;
        useJobStore.getState().ensureJob(rid);
        useJobStore.getState().addImage(rid, evt.image.batch_index, evt.image.image, evt.image.metadata ?? undefined);
        return;
      }

      if (evt.type === "error") {
        useJobStore.getState().markError(requestId, evt.message);
        return;
      }

      if (evt.type === "close") {
        useJobStore.getState().markComplete(requestId);
        return;
      }
    });

    disposersRef.current.push(unsub);

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
    };

    socket.onopen = () => {
      // Active WebSocket Pattern: first message is the request payload.
      const imagesRaw = flatPayload["images"];
      const images = typeof imagesRaw === "number" ? imagesRaw : 1;
      const rawInput: Record<string, unknown> = { ...flatPayload };
      delete rawInput.images;
      socket.send(JSON.stringify({ session_id: sessionId, images, ...rawInput }));
    };

    return {
      requestId,
      close: () => socket.close(),
    };
  };

  return { run, enabled: options.enabled };
}
