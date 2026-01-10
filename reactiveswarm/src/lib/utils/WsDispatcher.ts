import type { SwarmWsEvent, SwarmWsImagePayload, SwarmWsProgressPayload } from "@/types/t2i";

export type WsDispatchListener = (event: SwarmWsEvent) => void;

export interface RawSwarmWsMessage {
  socket_intention?: unknown;
  status?: unknown;
  backend_status?: unknown;
  supported_features?: unknown;

  gen_progress?: unknown;

  image?: unknown;
  batch_index?: unknown;
  request_id?: unknown;
  metadata?: unknown;

  discard_indices?: unknown;
  keep_alive?: unknown;

  error?: unknown;
  error_id?: unknown;
  error_message?: unknown;

  [key: string]: unknown;
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function toStringOrUndefined(v: unknown): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function toNumberOrUndefined(v: unknown): number | undefined {
  return typeof v === "number" && Number.isFinite(v) ? v : undefined;
}

function toBooleanOrUndefined(v: unknown): boolean | undefined {
  return typeof v === "boolean" ? v : undefined;
}

function toStringOrNullOrUndefined(v: unknown): string | null | undefined {
  if (typeof v === "string") return v;
  if (v === null) return null;
  return undefined;
}

function parseProgressPayload(raw: unknown): SwarmWsProgressPayload | null {
  if (!isRecord(raw)) return null;
  const batchIndex = toStringOrUndefined(raw.batch_index);
  if (!batchIndex) return null;

  const payload: SwarmWsProgressPayload = {
    batch_index: batchIndex,
    overall_percent: toNumberOrUndefined(raw.overall_percent),
    current_percent: toNumberOrUndefined(raw.current_percent),
    preview: toStringOrUndefined(raw.preview),
    request_id: toStringOrUndefined(raw.request_id),
    metadata: toStringOrUndefined(raw.metadata),
  };

  return payload;
}

function parseNestedImagePayload(raw: unknown): SwarmWsImagePayload | null {
  if (!isRecord(raw)) return null;
  const image = toStringOrUndefined(raw.image);
  const batchIndex = toStringOrUndefined(raw.batch_index);
  if (!image || !batchIndex) return null;

  return {
    image,
    batch_index: batchIndex,
    request_id: toStringOrUndefined(raw.request_id),
    metadata: toStringOrNullOrUndefined(raw.metadata),
  };
}

export class WsDispatcher {
  private listeners = new Set<WsDispatchListener>();

  addListener(listener: WsDispatchListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  dispatchRaw(raw: unknown): void {
    if (!isRecord(raw)) {
      this.emit({ type: "error", message: "Invalid WS message" });
      return;
    }

    const msg = raw as RawSwarmWsMessage;

    if (msg.socket_intention === "close") {
      this.emit({ type: "close" });
      return;
    }

    if (typeof msg.error === "string") {
      this.emit({ type: "error", message: msg.error, code: toStringOrUndefined(msg.error_id) });
      return;
    }

    if (typeof msg.error_id === "string" && typeof msg.error_message === "string") {
      this.emit({ type: "error", message: msg.error_message, code: msg.error_id });
      return;
    }

    if (isRecord(msg.status)) {
      const s = msg.status as Record<string, unknown>;
      this.emit({
        type: "status",
        status: {
          waiting_gens: toNumberOrUndefined(s.waiting_gens) ?? 0,
          loading_models: toNumberOrUndefined(s.loading_models) ?? 0,
          waiting_backends: toNumberOrUndefined(s.waiting_backends) ?? 0,
          live_gens: toNumberOrUndefined(s.live_gens) ?? 0,
        },
        backend_status: isRecord(msg.backend_status)
          ? {
              status: toStringOrUndefined((msg.backend_status as Record<string, unknown>).status) ?? "unknown",
              class: toStringOrUndefined((msg.backend_status as Record<string, unknown>).class) ?? "",
              message: toStringOrUndefined((msg.backend_status as Record<string, unknown>).message) ?? "",
              any_loading: toBooleanOrUndefined((msg.backend_status as Record<string, unknown>).any_loading) ?? false,
            }
          : undefined,
        supported_features: Array.isArray(msg.supported_features)
          ? msg.supported_features.filter((x): x is string => typeof x === "string")
          : undefined,
      });
      return;
    }

    if (msg.gen_progress !== undefined) {
      const payload = parseProgressPayload(msg.gen_progress);
      if (!payload) {
        this.emit({ type: "error", message: "Invalid gen_progress payload" });
        return;
      }
      this.emit({ type: "progress", gen_progress: payload });
      return;
    }

    if (typeof msg.image === "string" && typeof msg.batch_index === "string") {
      this.emit({
        type: "image",
        image: {
          image: msg.image,
          batch_index: msg.batch_index,
          request_id: toStringOrUndefined(msg.request_id),
          metadata: toStringOrUndefined(msg.metadata) ?? null,
        },
      });
      return;
    }

    if (msg.image !== undefined) {
      const nested = parseNestedImagePayload(msg.image);
      if (nested) {
        this.emit({ type: "image", image: nested });
        return;
      }
    }

    if (Array.isArray(msg.discard_indices)) {
      const discards = msg.discard_indices.filter((x): x is number => typeof x === "number" && Number.isFinite(x));
      this.emit({ type: "discard", discard_indices: discards });
      return;
    }

    if (msg.keep_alive === true) {
      this.emit({ type: "keep_alive", keep_alive: true });
      return;
    }

    // Unknown message type: ignore
  }

  private emit(event: SwarmWsEvent): void {
    for (const l of this.listeners) {
      l(event);
    }
  }
}
