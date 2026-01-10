export type SwarmWsEventType = "status" | "progress" | "image" | "discard" | "keep_alive" | "close" | "error";

export interface SwarmWsStatusEvent {
  type: "status";
  status: {
    waiting_gens: number;
    loading_models: number;
    waiting_backends: number;
    live_gens: number;
  };
  backend_status?: {
    status: string;
    class: string;
    message: string;
    any_loading: boolean;
  };
  supported_features?: string[];
}

export interface SwarmWsProgressPayload {
  batch_index: string;
  overall_percent?: number;
  current_percent?: number;
  preview?: string;
  request_id?: string;
  metadata?: string;
  [key: string]: unknown;
}

export interface SwarmWsProgressEvent {
  type: "progress";
  gen_progress: SwarmWsProgressPayload;
}

export interface SwarmWsImagePayload {
  image: string;
  batch_index: string;
  request_id?: string;
  metadata?: string | null;
}

export interface SwarmWsImageEvent {
  type: "image";
  image: SwarmWsImagePayload;
}

export interface SwarmWsDiscardEvent {
  type: "discard";
  discard_indices: number[];
}

export interface SwarmWsKeepAliveEvent {
  type: "keep_alive";
  keep_alive: true;
}

export interface SwarmWsCloseEvent {
  type: "close";
}

export interface SwarmWsErrorEvent {
  type: "error";
  message: string;
  code?: string;
}

export type SwarmWsEvent =
  | SwarmWsStatusEvent
  | SwarmWsProgressEvent
  | SwarmWsImageEvent
  | SwarmWsDiscardEvent
  | SwarmWsKeepAliveEvent
  | SwarmWsCloseEvent
  | SwarmWsErrorEvent;

export interface GenerateText2ImageResponse {
  images: string[];
  [key: string]: unknown;
}
