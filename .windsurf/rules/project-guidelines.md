---
trigger: always_on
---

# ReactiveSwarm Project Guidelines

Authoritative guidelines for the ReactiveSwarm Vite + React frontend using Zustand with full SwarmUI API parity.

## Architectural Overview

**Stack**: React 19, Vite, TypeScript, TailwindCSS, shadcn/ui.

**State Management**: **Zustand**.

- Keep feature logic in dedicated stores (`/stores`).
- Use Context Providers only for third-party libraries (e.g., Theme, Tooltip) or high-level lifecycle boundaries.

**Layering**:

1. **Domain Layer** (`/services`, `/types`): Pure TypeScript. Encapsulates API contracts (prefixed with `/API/`).
2. **State Layer** (`/stores`): Zustand stores. Manage global application state, async orchestration, and reactive updates.
3. **UI Layer** (`/components`, `/pages`): View logic. Consumes stores via hooks.

---

## Project Structure (FOR ORGANIZATION INSPIRATION ONLY - NOT TO BE FOLLOWED EXACTLY)

```text
/src
  App.tsx                   # Main entry, router, and top-level providers
  main.tsx                  # Vite bootstrap
  /assets                   # Static assets (logos, icons, fonts)
  /components               # Presentation components (shadcn/ui + custom)
    /auth                   # Login/session UI pieces
    /extensions             # Extension management UI
    /gallery                # Image grid and detail viewers (grid, cards, list, detail)
      ModelManager.tsx      # Model management UI
      HistoryManager.tsx    # History management UI
      ImageDetail.tsx       # Image detail viewer
      ImageGrid.tsx         # Image grid viewer
      ImageList.tsx         # Image list viewer
      ImageCards.tsx        # Image cards viewer
      ImageLightbox.tsx     # Image lightbox viewer
    /generation             # Prompt form, parameter controls, previews
      PresetManager.tsx     # Preset management UI
      ModelSelector.tsx     # Model selection dropdown
      PromptForm.tsx        # Main prompt input (positive/negative) and generation controls
      ImageEditor.tsx       # Modal for inpainting/editor flow for init images
      ParameterGroups.tsx   # Collapsible sets (Refiner, Upscaling, Advanced)
    /gridgenerator          # Grid-building UI
      GridAxis.tsx          # Axis configuration for Steps/CFG/etc.
      GridDisplay.tsx       # Rendered grid output viewer
      GridEditor.tsx        # Infinite-dimensional grid builder
      GridPreview.tsx       # High-resolution grid viewer
    /imageeditor            # Inpainting editor + tools (integrated with generation flow)
      EditorCanvas.tsx      # Mask layer and brush tools
      EditorControls.tsx    # Brush size, zoom, undo/redo
      LayerMask.tsx         # Inpainting mask logic
    /layout                 # Shell, navigation, sidebars, headers/footers
    /tools                  # Utilities and monitoring
      BatchProcessor.tsx    # Image batch tab interactions
      LogViewer             # Real-time, color-coded backend logs
      ResourceMonitor       # GPU/VRAM/RAM graphs
    /ui                     # Reusable UI primitives (buttons, inputs, modals)
  /hooks                    # Local UI logic (e.g., useDebounce, useInterval)
  /pages                    # Route-level views (Generate, Models, Server, etc.)
    Extensions.tsx          # Extensions management UI
    Generate.tsx            # Text-to-Image page wiring to stores/services
    GridGenerator.tsx       # Grid generation flows
    History.tsx             # Gallery/history view
    Models.tsx              # Model management page
    Server.tsx              # Server status/metrics view
    Settings.tsx            # User/server settings surface
    VideoGeneration.tsx     # Video workflows using T2I endpoints
    Workflow.tsx            # Comfy workflows browser/editor
  /services                 # Domain services (direct API interaction)
    HttpClient.ts           # Fetch/axios wrapper with session_id + cookies
    WsConnection.ts         # WebSocket manager for /API/GenerateText2ImageWS
    T2IService.ts           # Text-to-Image REST/WS calls (include GetImageMetadata)
    ModelsService.ts        # Model discovery/load/select APIs
    ComfyService.ts         # Comfy workflows CRUD and generated flows
    ExtensionsService.ts    # Extensions list/install/remove
    AdminService.ts         # Admin/system operations
    BackendService.ts       # Backend lifecycle/status APIs
    VideoService.ts         # Video generation helpers (T2I-compatible)
    UtilService.ts          # Misc utilities (token counts, etc.)
    SessionService.ts       # Session lifecycle, heartbeat/recovery, invalid_session_id retry
    PreserveService.ts      # Persist prompt/settings locally or server-side
    index.ts                # Barrel for services
  /stores                   # Zustand stores for shared state
    useAuthStore.ts         # Session lifecycle, user identity
    useJobStore.ts          # Global queue, progress, previews
    useModelStore.ts        # Model lists, selection, loading state
    useServerStore.ts       # Backend status, hardware metrics, lifecycle flags
    useLogStore.ts          # System logs, notifications
    storeTypes.ts           # Shared store types/selectors
  /types                    # TypeScript interfaces matching SwarmUI DTOs
    admin.ts                # Admin/system DTOs
    common.ts               # Shared enums/util types
    extensions.ts           # Extension DTOs
    job.ts                  # Job/generation history types
    models.ts               # Model metadata and operations
    t2i.ts                  # Text-to-Image request/response types
    user.ts                 # User/session types
    video.ts                # Video generation types
    wildcards.ts            # Wildcard-related DTOs
    index.ts                # Barrel for types
  /utils                    # Pure helpers (formatters, guards, parsing)
  /styles                   # Tailwind/global styles
    globals.css             # Global styles entry
```

---

## Service and Route Mapping

All service calls must point to the `/API/` prefix to match the SwarmUI backend.
Handle `session_id` injection centrally and recover automatically on session expiration (see Critical Implementation Notes).

### T2IService (Generation & History)

- **Primary Generation**: `/API/GenerateText2ImageWS` (Must use `WsConnection` for progress/previews).
- **Metadata**: `/API/GetImageMetadata` (Crucial for "Read Generation Parameters").
- **Gallery**: `/API/ListImages`, `/API/DeleteImage`, `/API/ToggleImageStarred`.

### ModelsService

- **Discovery**: `/API/ListModels` (Filter by `subtype`: LoRA, VAE, etc.).
- **Operations**: `/API/DescribeModel`, `/API/SelectModelWS`.
- **Wildcards**: `/API/EditWildcard`, `/API/DeleteWildcard`.

### Backend & Admin Service

- **Status**: `/API/GetCurrentStatus`, `/API/GetBackendStatus`.
- **Hardware**: `/API/GetServerResourceInfo` (GPU/RAM metrics).
- **Management**: `/API/RestartBackends`, `/API/FreeBackendMemory`.
- **Lifecycle**: `/API/UpdateAndRestart`, `/API/ShutdownServer`.

---

## Critical Implementation Notes

1. **Robust WebSocket Management**  
   - `/API/GenerateText2ImageWS` is a long-lived stream; build a Subscriber-Dispatcher pattern where `WsConnection` owns the raw socket and exposes subscription hooks keyed by `req_id` or message type.  
   - `useJobStore` keeps a `Map<string, JobState>` keyed by request ID so each generation card renders its own progress, preview frames, and status.  
   - Auto-cleanup: `WsConnection` must unregister listeners and close sockets when a job completes or the consumer unmounts to prevent memory leaks.  
   - Mirror the SwarmUI **Global Queue** so active jobs remain visible even when the local user is idle.

2. **Form State & Performance**  
   - T2I parameters are large; avoid direct two-way binding to global stores. Use local component state (or `react-hook-form`) as a draft buffer.  
   - Sync the draft to `usePreserveStore` on blur or when the user clicks **Generate** so persisted settings remain accurate without causing lag.  
   - When live previews depend on parameter tweaks, throttle selector updates to avoid overwhelming the UI.

3. **Authentication & Session Recovery**  
   - `HttpClient` middleware injects the current `session_id` (from `useAuthStore`) into every POST body/header automatically.  
   - On `error_id: "invalid_session_id"`, pause outbound requests, call `/API/GetNewSession`, update the store, retry the failed request once, then resume the queue.

4. **Grid Orchestration Logic**  
   - Treat grid generations as meta-jobs: `useJobStore` should register the grid as a parent entity and fan out child jobs per axis combination.  
   - Aggregate progress by averaging child job progress into a single “Grid Progress” bar, while `GridDisplay` still shows each cell’s completion state.

5. **Model & Folder Parity**  
   - `useModelStore` caches subtype-segmented model lists (Stable Diffusion, LoRA, ControlNet, VAE).  

6. **Image Editor vs. Inpainting Workflow**  
   - “Image Editor” denotes the canvas environment entered via Init Image → Edit Image (paintbrush, masking, zoom, layer clearing).  
   - “Inpainting” is the generative pass performed inside that editor by applying mask layers and prompts to regenerate selected areas while preserving the rest.

7. **Asset Resolution & Cache Busting**  
   - Image assets require session validation. All `<img>` or CSS `url()` usages go through `UtilService.resolveImageUrl(path)` which appends `?session_id=...`.  
   - This helper keeps history/output folders accessible when the backend enforces session-aware file serving.

---

## Target T2I Parameter Schema

Core parameters that `/types/t2i.ts` and `Generate.tsx` must support to ensure backend compatibility:

| Parameter | Type | Description |
| --- | --- | --- |
| `prompt` | `string` | The main visual description. |
| `negativeprompt` | `string` | What to exclude from the image. |
| `model` | `string` | The filename/path of the model to use. |
| `steps` | `number` | Sampling steps (default ~20). |
| `cfgscale` | `number` | Classifier Free Guidance scale. |
| `seed` | `number` | -1 for random, or a specific integer. |
| `width` / `height` | `number` | Output dimensions. |
| `images` | `number` | Batch count/number of images to generate. |
| `donotsave` | `boolean` | Skip saving to disk for quick previews. |
| `imageformat` | `string` | Output format (e.g., `jpg`, `png`, `webp`). |
| `videoframes` | `number` | Frame count for video workflows. |
| `automaticvae` | `boolean` | Auto-select VAE for compatible models/workflows. |
