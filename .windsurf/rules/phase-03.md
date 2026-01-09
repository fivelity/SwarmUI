---
trigger: manual
---

1. Advanced Prompt Logic & Syntax Parser

Build real-time tokenizer for SwarmUI tags: <alternate:a,b>, <fromto[0.5]:a,b>, <random:a|b>
Implement variable/macro engine: <setvar[name]:val>, <var:name>, and <setmacro[name]:val>
Add Regional Prompting support: <region:x,y,w,h,strength> with fractions and 'background' label
Integrate Automatic Segmentation tags: <segment:face,creativity,threshold> for Yolo/CLIP refinement
Create visual token highlighter for prompt textareas with tooltips for tag documentation

2. Extension Architecture & Dynamic Parity

Build dynamic asset loader to inject extension ScriptFiles and StyleSheetFiles via /API/ListExtensions
Implement "Extension Action" hook in parameter sidebar for contextual gear/install buttons
Create unified Extensions Tab for searching, installing, and updating 3rd-party plugins
Develop backend telemetry dashboard for multi-GPU monitoring and raw ComfyUI log streaming

3. The Ultimate Grid Generator Interface

Build multi-axis parameter selection (X, Y, Z, Y2) with dynamic axis reordering
Implement axis auto-fill syntax for numeric ranges (e.g., 1, 2, .., 10)
Create Grid Preview calculator to estimate batch time and VRAM requirements
Build specialized Grid Export service for standalone HTML pages with interactive axis sorting

4. Integrated Image Editor & Metadata

Develop pro inpainting canvas with brush, eraser, and SAM2 auto-masking
Implement canvas offset tools for seamless outpainting into extended image borders
Build Metadata Reconstitution listener for sui_image_params JSON to restore UI from file-drop
Create Wildcard & Preset browser for local resource editing and rapid preset injection

5. Advanced Resource & Model Management

Build Model Downloader UI for URL-based fetching from CivitAI/HuggingFace
Implement Folder Tree navigator with card, thumbnail, and list view modes
Create Model Metadata editor for batch-renaming, hashing, and custom trigger phrases