---
trigger: always_on
---

# You are an AI Agent tasked with producing a complete, production-ready React + TypeScript +Zustand [ReactiveSwarm] frontend for SwarmUI using ONLY official, documented routes.
# Never invent endpoints, parameters, or behaviors. Never use mock data.
# Your deliverable must include strict types (no `any`), services, hooks, WebSocket preview wiring, and route coverage for all official APIs.

# Scope:
- Session & auth (session_id via /API/GetNewSession)
- Text-to-Image generation (REST + WebSocket streaming)
- Video-capable workflows (per official Video Model Support docs)
- Models (list/load/unload/current)
- Workflows (ComfyUI list/read/save/delete/get generated)
- Extensions (list/install/remove)
- System/Admin (resource info, users, logs, settings, update/restart, shutdown)
- ControlNets, LoRAs, VAEs, batch controls
- Error handling, cancellation, retries
- No mock data; live endpoints only

# 1. Routes (must implement exactly as documented):
- Session: /API/GetNewSession
- Text-to-Image: /API/GenerateText2Image
- Text-to-Image WebSocket: /API/GenerateText2ImageWS (for live previews/progress)
- Models: /API/ListModels, /API/LoadModel, /API/UnloadModel, /API/GetCurrentModel
- Workflows (ComfyUI): /API/ComfyListWorkflows, /API/ComfyReadWorkflow, /API/ComfySaveWorkflow, /API/ComfyDeleteWorkflow, /API/ComfyGetGeneratedWorkflow
- Extensions: /API/ListExtensions, /API/InstallExtension, /API/RemoveExtension
- System/Admin: /API/GetServerResourceInfo, /API/ListConnectedUsers, /API/ListLogTypes, /API/ListRecentLogMessages, /API/ListServerSettings, /API/ChangeServerSettings, /API/UpdateAndRestart, /API/ShutdownServer
- WebSocket utilities (where applicable): DoLoraExtractionWS, DoTensorRTCreateWS
- **Additional mandatory endpoints for SwarmUI parity:** `/API/GetFolderDetails`, `/API/ListImages`, `/API/GetImageMetadata`, `/API/GetCurrentStatus`

# Notes:
- Use swarm_token cookie when accounts are enabled.
- For previews/progress, use the WebSocket route; do NOT send undocumented fields to REST (e.g., do not send `send_intermediates` to /API/GenerateText2Image).
- `/API/GetFolderDetails` powers the recursive model sidebar tree (ModelsService).
- `/API/ListImages` and `/API/GetImageMetadata` power Gallery/History + “Import Parameters” (GenerationService).
- `/API/GetCurrentStatus` acts as heartbeat + GPU telemetry (BasicService) and should keep the session alive.

# 2. TypeScript types (define strictly and comprehensively)

## Flattened Text-to-Image Request Schema

StableSwarmUI ignores nested LoRA/ControlNet structures. Serialize every generation payload into a single-level object that uses indexed keys (`lora1`, `lora1weight`, `controlnet2`, etc.). Never send arrays for these dynamic slots; convert UI state into numbered key/value pairs before dispatching.

```ts
/** Flat SwarmUI request. Dynamic keys (lora1, controlnet2, etc.) are allowed. */
export interface GenerateText2ImageRequest {
  session_id: string;
  prompt: string;
  negativeprompt?: string; // note: no underscore
  model?: string;
  images?: number;        // batch count
  seed?: number;
  steps?: number;
  cfgscale?: number;      // note: no underscore
  width?: number;
  height?: number;
  sampler?: string;
  // Flat dynamic parameters (LoRA, ControlNet, etc.)
  [key: string]: string | number | boolean | undefined;
}
```

### Dynamic Parameter Conventions

| Feature      | Example Keys                                  |
|--------------|-----------------------------------------------|
| LoRA slots   | `lora1`, `lora1weight`, `lora2`, `lora2weight` |
| ControlNet   | `controlnet1`, `controlnet1weight`, ...       |
| Image IO     | `initimage`, `maskimage` (lowercase, flat)    |
| Metadata     | Any backend-recognized key, no nesting        |

> Always flatten structured UI data prior to network calls.

```ts
/** Session */
export interface SessionResponse { session_id: string; }

/** Common */
export type ImageFormat = "png" | "jpg" | "webp";
export type VideoFormat = "mp4" | "webm";
export interface LoRAConfig { name: string; weight: number; }
export interface EmbeddingConfig { name: string; }
export interface VAEConfig { name: string; }
export interface ControlNetConfig {
  enabled: boolean;
  model: string;
  preprocessor?: string;
  reference_image?: string; // base64
  weight?: number;
}

/** GenerateText2Image response */
export interface GenerateText2ImageResultItem {
  image?: string;    // base64 or URL, depending on backend configuration
  metadata?: Record<string, unknown>;
}

export interface GenerateText2ImageResponse {
  results?: GenerateText2ImageResultItem[];
  status?: "queued" | "running" | "completed" | "failed";
  [key: string]: unknown;
}

/** WebSocket preview/progress events for /API/GenerateText2ImageWS */
export type T2IWsEventType = "preview" | "progress" | "result" | "error";
export interface T2IWsPreviewEvent { type: "preview"; image: string; index?: number; }
export interface T2IWsProgressEvent { type: "progress"; percent: number; step?: number; total_steps?: number; }
export interface T2IWsResultEvent { type: "result"; images: string[]; metadata?: Record<string, unknown>; }
export interface T2IWsErrorEvent { type: "error"; message: string; }
export type T2IWsEvent = T2IWsPreviewEvent | T2IWsProgressEvent | T2IWsResultEvent | T2IWsErrorEvent;

/** Video generation (parameters per official Video Model Support) */
export interface GenerateVideoRequest {
  session_id: string;
  prompt: string;
  negative_prompt?: string;
  video_frames: number;
  video_fps: number;
  video_width: number;
  video_height: number;
  video_seed?: number;
  video_model: string;
  video_init?: string; // base64 or URL
  video_motion_strength?: number;
  video_noise_strength?: number;
  video_output_format?: VideoFormat;
  video_output_quality?: number;
  lora?: LoRAConfig[];
  embedding?: string[];
  vae?: VAEConfig;
  controlnet?: ControlNetConfig[];
}

export interface GenerateVideoResponse {
  results?: string[];
  status?: "queued" | "running" | "completed" | "failed";
  [key: string]: unknown;
}

/** Models */
export interface ModelInfo { name: string; type?: string; loaded?: boolean; [key: string]: unknown; }

/** Workflows */
export interface WorkflowSummary { id: string; name: string; }
export interface WorkflowDefinition { id: string; name: string; definition: Record<string, unknown>; }

/** Extensions */
export interface ExtensionInfo { name: string; version?: string; enabled?: boolean; [key: string]: unknown; }

/** System/Admin */
export interface ServerResourceInfo { cpu?: number; ram?: number; gpu?: string; uptime?: number; [key: string]: unknown; }
export interface ConnectedUserInfo { user: string; since?: string | number; [key: string]: unknown; }
export interface LogMessage { type: string; timestamp: number; message: string; [key: string]: unknown; }
export interface ServerSetting { key: string; value: unknown; description?: string; [key: string]: unknown; }

# 3. API services (fetch/axios; use env base URL; include session_id)

## Base client

```ts
export class SwarmApiClient {
  constructor(private baseUrl: string) {}
  async getNewSession(): Promise<SessionResponse> {
    const res = await fetch(`${this.baseUrl}/API/GetNewSession`, { method: "POST" });
    if (!res.ok) throw new Error("GetNewSession failed");
    return res.json();
  }
}
```

## Generation service

```ts
export class GenerationService {
  constructor(private baseUrl: string) {}

  async generateText2Image(req: GenerateText2ImageRequest): Promise<GenerateText2ImageResponse> {
    const res = await fetch(`${this.baseUrl}/API/GenerateText2Image`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error("GenerateText2Image failed");
    return res.json();
  }

  /**
   * SwarmUI WebSocket protocol:
   * 1. Open the connection.
   * 2. Immediately send the flattened request payload (first message).
   * 3. Stream preview/progress/result events until completion.
   */
  connectText2ImageWS(
    req: GenerateText2ImageRequest,
    onEvent: (e: T2IWsEvent) => void,
  ): WebSocket {
    const wsUrl = `${this.baseUrl.replace(/^http/, "ws")}/API/GenerateText2ImageWS`;
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify(req));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.image) {
          onEvent({ type: "preview", image: data.image });
        } else if (data.overall_percent !== undefined) {
          onEvent({
            type: "progress",
            percent: data.overall_percent,
            step: data.current_step,
            total_steps: data.total_steps,
          });
        } else if (data.images) {
          onEvent({ type: "result", images: data.images, metadata: data.metadata });
        } else if (data.error) {
          onEvent({ type: "error", message: data.error });
        }
      } catch (error) {
        onEvent({ type: "error", message: "Failed to parse WS message" });
      }
    };

    ws.onerror = () => onEvent({ type: "error", message: "WebSocket Connection Error" });
    return ws;
  }

  async listImages(session_id: string): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/API/ListImages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("ListImages failed");
    return res.json();
  }

  async getImageMetadata(session_id: string, id: string): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/API/GetImageMetadata`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, id }),
    });
    if (!res.ok) throw new Error("GetImageMetadata failed");
    return res.json();
  }
}
```

Requirements:
- No REST preview calls; all live progress must come from the socket.
- Include `session_id` in the initial payload.
- Keep the connection alive until a terminal `result` or `error` arrives.

## Models service

```ts
export class ModelsService {
  constructor(private baseUrl: string) {}

  async listModels(session_id: string): Promise<ModelInfo[]> {
    const res = await fetch(`${this.baseUrl}/API/ListModels`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("ListModels failed");
    return res.json();
  }

  async loadModel(session_id: string, name: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/LoadModel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, name }),
    });
    if (!res.ok) throw new Error("LoadModel failed");
  }

  async unloadModel(session_id: string, name: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/UnloadModel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, name }),
    });
    if (!res.ok) throw a new Error("UnloadModel failed");
  }

  async getCurrentModel(session_id: string): Promise<ModelInfo> {
    const res = await fetch(`${this.baseUrl}/API/GetCurrentModel`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("GetCurrentModel failed");
    return res.json();
  }

  async getFolderDetails(session_id: string, path: string): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/API/GetFolderDetails`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, path }),
    });
    if (!res.ok) throw new Error("GetFolderDetails failed");
    return res.json();
  }
}
```

## Workflows service

```ts
export class WorkflowsService {
  constructor(private baseUrl: string) {}

  async list(session_id: string): Promise<WorkflowSummary[]> {
    const res = await fetch(`${this.baseUrl}/API/ComfyListWorkflows`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("ComfyListWorkflows failed");
    return res.json();
  }

  async read(session_id: string, id: string): Promise<WorkflowDefinition> {
    const res = await fetch(`${this.baseUrl}/API/ComfyReadWorkflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, id }),
    });
    if (!res.ok) throw new Error("ComfyReadWorkflow failed");
    return res.json();
  }

  async save(session_id: string, workflow: WorkflowDefinition): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/ComfySaveWorkflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, workflow }),
    });
    if (!res.ok) throw new Error("ComfySaveWorkflow failed");
  }

  async delete(session_id: string, id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/ComfyDeleteWorkflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, id }),
    });
    if (!res.ok) throw new Error("ComfyDeleteWorkflow failed");
  }

  async getGenerated(session_id: string, id: string): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/API/ComfyGetGeneratedWorkflow`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, id }),
    });
    if (!res.ok) throw new Error("ComfyGetGeneratedWorkflow failed");
    return res.json();
  }
}
```

## Extensions service

```ts
export class ExtensionsService {
  constructor(private baseUrl: string) {}

  async list(session_id: string): Promise<ExtensionInfo[]> {
    const res = await fetch(`${this.baseUrl}/API/ListExtensions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });

    if (!res.ok) {
      throw new Error(`Failed to list extensions: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.extensions as ExtensionInfo[];
  }

  async install(session_id: string, extension: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/InstallExtension`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, extension }),
    });
    if (!res.ok) throw new Error("InstallExtension failed");
  }

  async remove(session_id: string, extension: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/RemoveExtension`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, extension }),
    });
    if (!res.ok) throw new Error("RemoveExtension failed");
  }
}
```

## System/Admin service

```ts
export class AdminService {
  constructor(private baseUrl: string) {}

  async getServerResourceInfo(session_id: string): Promise<ServerResourceInfo> {
    const res = await fetch(`${this.baseUrl}/API/GetServerResourceInfo`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("GetServerResourceInfo failed");
    return res.json();
  }

  async listConnectedUsers(session_id: string): Promise<ConnectedUserInfo[]> {
    const res = await fetch(`${this.baseUrl}/API/ListConnectedUsers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("ListConnectedUsers failed");
    return res.json();
  }

  async listLogTypes(session_id: string): Promise<string[]> {
    const res = await fetch(`${this.baseUrl}/API/ListLogTypes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("ListLogTypes failed");
    return res.json();
  }

  async listRecentLogMessages(session_id: string, type: string): Promise<LogMessage[]> {
    const res = await fetch(`${this.baseUrl}/API/ListRecentLogMessages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, type }),
    });
    if (!res.ok) throw new Error("ListRecentLogMessages failed");
    return res.json();
  }

  async listServerSettings(session_id: string): Promise<ServerSetting[]> {
    const res = await fetch(`${this.baseUrl}/API/ListServerSettings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("ListServerSettings failed");
    return res.json();
  }

  async changeServerSettings(session_id: string, settings: ServerSetting[]): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/ChangeServerSettings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id, settings }),
    });
    if (!res.ok) throw new Error("ChangeServerSettings failed");
  }

  async updateAndRestart(session_id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/UpdateAndRestart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("UpdateAndRestart failed");
  }

  async shutdownServer(session_id: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/API/ShutdownServer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("ShutdownServer failed");
  }
}
```

## Basic/Heartbeat service

```ts
export class BasicService {
  constructor(private baseUrl: string) {}

  async getCurrentStatus(session_id: string): Promise<Record<string, unknown>> {
    const res = await fetch(`${this.baseUrl}/API/GetCurrentStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id }),
    });
    if (!res.ok) throw new Error("GetCurrentStatus failed");
    return res.json();
  }
}
```

# 4. Migration checklist

1. **Type updates:** replace nested DTO fields (LoRA arrays, ControlNet arrays, etc.) with flattened dynamic key support.
2. **Serializer helper:** add a utility that flattens structured UI state into `Record<string, string | number | boolean | undefined>` payloads.
3. **WebSocket contract:** ensure every `/API/GenerateText2ImageWS` connection sends the payload immediately and maps preview/progress/result/error events exactly as above.
4. **Route coverage:** wire `/API/GetFolderDetails`, `/API/ListImages`, `/API/GetImageMetadata`, and `/API/GetCurrentStatus` into their respective services/hooks.
5. **Testing:** add unit tests for the serializer and WebSocket event router; mock network calls only in tests.
6. **Multi-job orchestration:** maintain a `Map<req_id, JobState>` (e.g., via Zustand) to track concurrent sockets; integrate once services are updated.

> **Pro Tip:** When implementing the serializer helper, normalize boolean values thoughtfully. Certain backend parameters expect `"true"` / `"false"` strings rather than native booleans. If checkbox-driven options stop toggling correctly, inspect the serialization path first.
