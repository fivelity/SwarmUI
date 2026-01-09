---
trigger: manual
---

To achieve 100% parity with ReactiveSwarm, you need to look beyond the basic "Generate" button. SwarmUI is built for power users, meaning it hides a massive amount of functionality in contextual menus, tabs, and advanced syntax.

1. The "Generate" Dropdown & Interrupt Options
The dropdown menu on the Generate button is more than just a pause button:
Interrupt All Sessions: A right-click on the "Interrupt" (X) button triggers a global stop, which is crucial if you have long queues running across multiple backends.
Interrupt & Clear Queue: Options to stop current work but preserve or wipe the pending queue.
Quick Tools Menu: A separate "Quick Tools" button usually contains "Reset Params to Default," which is vital when you’ve tangled up too many sliders.

2. Advanced Prompting & Syntax (The "Hidden" Engine)
SwarmUI’s prompt engine is its most powerful asset. You’ll need to implement logic for:
Alternating Words: <alt:cat, dog> switches every step to blend concepts.
Timestep Swapping: <fromto[0.5]:cat, dog> swaps the subject halfway through the generation.
Variable Injection: <setvar[color]:red> and then using <var:color> later in the prompt to ensure consistency across multiple segments.
Regional Prompting: <region:0,0,0.5,1> a cat lets you define specific areas of an image for different prompts.

3. The "Tools" Tab Features
Parity requires the specialized sub-tools found in the bottom "Tools" section:
Grid Generator: This is the "God mode" for testing. It needs axis display settings that allow for infinite dimensions and dynamic re-ordering of X/Y/Y2/Webview axes.
Wildcard Manager: A dedicated tab to view and edit your collections of random lists (e.g., animals.txt, colors.txt).
Model Browser Cards: The ability to switch views between List, Thumbnails, and Cards, along with a folder-tree navigator that handles deep hierarchies.

4. Metadata & Interactivity
Metadata Reconstitution: Dragging an image from the history or a local file into the center area must instantly "read" the JSON metadata and populate all sliders to their original positions.
Live Backend Telemetry: A "Server -> Backends" tab where users can monitor each GPU's status, VRAM usage, and individual ComfyUI logs in real-time.
Image Segmentation: Integrated "segment" keywords (e.g., segment:face) that automatically mask and refine specific parts of the image without manual brushing.

5. Multimedia Capabilities
Don't forget that SwarmUI is now a multi-modal hub:
Video Generation: Integrated support for models like Wan, LTX-V, and Cosmos, including specific frame-count and resolution overrides.
Image Upscaling & Refiners: Built-in "Refiner" toggles that use a second model pass to add high-frequency detail at the end of a generation.