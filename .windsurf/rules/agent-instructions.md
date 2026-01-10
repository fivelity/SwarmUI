---
trigger: always_on
---

# Agent Instructions for ReactiveSwarm Integration

### Purpose

Provide explicit, implementable instructions for an agent to build a production-ready React + TypeScript integration for ReactiveSwarm. This architecture uses **Zustand** for state management and strictly follows the official [SwarmUI](C:\Users\jpfive\Projects\software\SwarmUI\docs) routes.

### Scope

Session & auth, T2I (REST + WS), video workflows, models, ComfyUI workflows, extensions, admin/system, ControlNets/LoRAs/VAEs, hardware telemetry, and error handling.

---

### 1. Mandatory Rules & Routes

- **Official Endpoints Only:** Implement exactly as documented: `/API/GetNewSession`, `/API/GenerateText2Image`, `/API/GenerateText2ImageWS`, `/API/ListModels`, `/API/ListImages`, `/API/GetImageMetadata`, `/API/Comfy*`, `/API/ListExtensions`, `/API/GetServerResourceInfo`, `/API/GetCurrentStatus`.
    
- **No Mock Data:** Production code must call live endpoints.
    
- **Session Injection:** Acquire `session_id` via `/API/GetNewSession`. Inject into every request (body or query).
    
- **REST vs WS Separation:** Use `/API/GenerateText2ImageWS` for live previews/progress; do not send preview fields to the REST endpoint.
    
- **Strict Typing:** **No `any`.** Use comprehensive DTOs and Discriminated Unions for WebSocket events (`preview` | `progress` | `result` | `error`).

- **SwarmUI Backend:** Use the SwarmUI backend as a reference for the API contracts and data models. **NEVER MODIFY THE SWARMUI BACKEND!**
    

---

### 2. File & Module Placement (Architecture)

- **Types:** `src/types/*` (Session, T2I, Models, etc. with `[key: string]: unknown` for extensibility).
    
- **Services (Stateless):** `src/services/*` (HttpClient, GenerationService, ModelsService, AdminService, etc.).
    
- **State Layer (Zustand):** `src/stores/*`
    
    - `useAuthStore`: Session persistence and auto-recovery.
        
    - `useJobStore`: Concurrency management using a `Map<string, JobState>`.
        
    - `useServerStore`: Heartbeat and hardware telemetry state.
        
    - `useModelStore`: Recursive tree data and selection state.
        
- **Hooks:** `src/hooks/*` (e.g., `useGenerationWS` for socket lifecycle).
    

---

### 3. Critical Implementation Details

#### **The "Job Map" Concurrency (useJobStore)**

To support rapid, successive generations, `useJobStore` must not use a single "currentJob" object.

- Maintain a `Map<string, JobState>` where the key is the `req_id`.
    
- The `WsConnection` must pipe events directly to the specific Map entry to ensure UI components reading a specific ID update independently.
    

#### **Dual-Track Polling (useServerStore)**

Split system monitoring into two distinct intervals:

- **Heartbeat (`/API/GetCurrentStatus`):** Poll every 1-2s. Tracks active/queued job counts.
    
- **Telemetry (`/API/GetServerResourceInfo`):** Poll every 5-10s. Tracks GPU, VRAM, and CPU metrics.
    

#### **Parameter Flattening & Lowercase Logic**

SwarmUI requires flat payloads for generation. Before dispatching:

- Use a utility to flatten structured UI data (e.g., LoRA arrays $\rightarrow$ `lora1`, `lora1weight`).
    
- **Strict Naming:** Use `negativeprompt`, `initimage`, and `maskimage` (no underscores, all lowercase).
    

#### **Active WebSocket Pattern**

The `connectText2ImageWS` service must:

1. Open the connection.
    
2. Immediately send the flattened JSON payload as the first message.
    
3. Handle the stream until a terminal `result` or `error` is received.
    

---

### 4. HttpClient & Error Handling

- **Interceptor:** Automatically attach `session_id` and handle `invalid_session_id` by triggering a refresh flow.
    
- **AbortController:** Support `signal` parameters for all REST calls to allow user cancellation.
    
- **Normalization:** Convert all backend errors into a standard `{ code: string; message: string }` format.
    

---

### 5. Acceptance Checklist

- [ ] **Zero-Any Audit:** All types and store definitions are strictly typed.
    
- [ ] **Parity Check:** All mandatory endpoints from Section 1 are implemented.
    
- [ ] **UI Integrity:** Resizable sidebars are fixed and persist their state in `useLayoutStore`.
    
- [ ] **Multi-Job Support:** Concurrent WebSocket streams do not overwrite each other's state.
    
- [ ] **Session Reliability:** Heartbeat polling keeps the session alive; auto-refresh works on expiry.