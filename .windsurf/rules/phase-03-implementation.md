---
trigger: manual
---

These instructions are grounded in the official [SwarmUI documentation](https://github.com/mcmonkeyprojects/SwarmUI/blob/master/docs/API.md) and focus on the logic required for parity with the "Power-User" features.

---

## **Phase 3: The Power-User Engine**


1. Advanced Prompt Logic & Syntax Parser
Build real-time tokenizer for SwarmUI tags: <alternate:a,b>, <fromto[0.5]:a,b>, <random:a|b>
Implement variable/macro engine: <setvar[name]:val>, <var:name>, and <setmacro[name]:val>
Add Regional Prompting support: <region:x,y,w,h,strength> with fractions and 'background' label
Integrate Automatic Segmentation tags: <segment:face,creativity,threshold> for Yolo/CLIP refinement
Create visual token highlighter for prompt textareas with tooltips for tag documentation

2. Extension Store & Dynamic Infrastructure
Build discovery service to fetch all active/available plugins via /API/ListExtensions
Implement Dynamic Asset Loader: Inject extension .js and .css files into <head>
Create Extension Store UI for marketplace-style browsing and /API/ComfyInstallFeatures
Develop backend telemetry dashboard for status monitoring via /API/GetServerStatusWS

3. The Grid Generator Interface
Build multi-axis parameter selection (X, Y, Z, Y2) with dynamic axis reordering
Implement axis auto-fill syntax for numeric ranges (e.g., 1, 2, .., 10)
Create Grid Preview calculator to estimate batch time and VRAM requirements
Build export service for standalone HTML grid pages with interactive axis sorting

4. Integrated Image Editor & Metadata
Develop pro inpainting canvas with brush, eraser, and SAM2 auto-masking
Implement canvas offset tools for seamless outpainting into extended image borders
Build Metadata Reconstitution listener for sui_image_params JSON to restore UI from file-drop
Create Wildcard & Preset browser for local resource editing and rapid preset injection

5. Advanced Resource & Model Management
Build Model Downloader UI for URL-based fetching from CivitAI/HuggingFace
Implement Folder Tree navigator with card, thumbnail, and list view modes
Create Model Metadata editor for batch-renaming, hashing, and custom trigger phrases

---

## **Implementation Instructions & Basis**

### **1. Advanced Prompt Syntax Parser**

* **Tokenizer Basis**: Use a regex-based parser to identify all strings enclosed in `<` and `>`. Use the official [Prompt Syntax Docs](https://github.com/Stability-AI/StableSwarmUI/blob/master/docs/Features/Prompt%20Syntax.md) as your logic reference.
* **Alternate/Cycles**: Implement a counter that increments per step. For `<alt:cat, dog>`, step 1 uses "cat," step 2 uses "dog".
* **From-To Timesteps**: Calculate the swap point by multiplying total steps by the fractional value in `<fromto[0.5]:cat, dog>`. If steps = 20, the prompt swaps at step 10.
* **Regional Prompting**: Map the fractional coordinates (X, Y, W, H) to the backend's `regional_prompts` parameter. 0.5 represents 50% of the image width/height.

### **2. Extension Store & Dynamic Loading**

* **Discovery**: Fetch the extension list from `/API/ListExtensions`. This returns an array of both active and uninstalled plugins.
* **Asset Injection**: For each active extension, the API provides `script_files` and `style_files`. Programmatically append these to your `document.head` to ensure third-party UI components (like custom tabs) load.
* **Marketplace**: Use `/API/ComfyInstallFeatures` to trigger the backend installation of new features directly from your new UI.

### **3. The Grid Generator Interface**

* **Axis Management**: Build a UI that allows users to pick any parameter ID (e.g., `seed`, `cfgscale`) and assign a comma-separated list of values. Map this to the `GridGeneratorExtension` API.
* **Auto-fill Syntax**: Implement logic to expand `1, 2, .., 10` into a full array `[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]` before sending the request to the server.
* **Interactive Exports**: The backend can produce a [standalone HTML viewer](https://github.com/mcmonkeyprojects/SwarmUI/blob/master/src/BuiltinExtensions/GridGenerator/README.md). Trigger this via a POST to the Grid Generator's specific API route.

### **4. Metadata Reconstitution**

* **File Drop Listener**: Listen for `onDrop` events on the central generation area. Parse the [sui_image_params](https://github.com/mcmonkeyprojects/SwarmUI/blob/master/docs/Image%20Metadata%20Format.md) JSON from the image's metadata chunk.
* **State Sync**: Map the keys in the JSON (e.g., `prompt`, `model`, `seed`) directly back to your Zustand stores to instantly "recall" the settings used for that image.

---

## **ExampleTypeScript Interfaces**

```typescript
/** 1. Extension and Store Interfaces */
export interface SwarmExtension {
  id: string;
  name: string;
  is_installed: boolean;
  script_files: string[]; // Web assets to load
  style_files: string[];
  metadata: { author: string; version: string; description: string; };
}

/** 2. Prompt Parsing & Segmentation */
export type PromptTagType = 'alt' | 'fromto' | 'random' | 'region' | 'segment' | 'var' | 'macro';

export interface ParsedPromptTag {
  type: PromptTagType;
  raw: string;
  values: string[]; // e.g., ["cat", "dog"]
  params?: Record<string, number | string>; // e.g., { strength: 0.8, x: 0.1 }
}

/** 3. Grid Generator Axes */
export interface GridGeneratorAxis {
  param_id: string; // ID from /API/GetT2IParams
  values: string;   // Raw input string, e.g., "1, 2, .., 5"
  title?: string;
}

/** 4. Image Metadata Parity */
export interface SwarmImageMetadata {
  sui_image_params: Record<string, any> & {
    prompt: string;
    model: string;
    seed: number;
    steps: number;
    swarm_version: string;
  };
}

```
