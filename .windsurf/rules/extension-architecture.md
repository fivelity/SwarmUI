---
trigger: manual
---

### **1. Extension Architecture & Behavior Parity**

SwarmUI extensions are C#-based on the backend, but they "inject" themselves into the frontend using specific hooks:

- **Custom Parameter Injection**: Extensions can register new parameters in `OnInit` using `T2IRegisteredParam`. These automatically appear in the UI if the frontend respects the dynamic parameter list returned by the [API](https://github.com/mcmonkeyprojects/SwarmUI/blob/master/docs/API.md).
    
- **Web Assets**: Extensions register custom JS (`ScriptFiles`) and CSS (`StyleSheetFiles`) that the core UI loads automatically. For **ReactiveSwarm**, the frontend should query the backend for these asset paths and dynamically inject `<script>` or `<link>` tags.
    
- **Custom Tabs**: Extensions add entire tabs by placing HTML files in a `Tabs/` folder. The modular "Slot" system should have a dedicated "Extension Tab" slot that can dynamically load these (or via iframe).
    

### **2. Incorporating Extension Types**

|**Extension Type**|**Integration Method for ReactiveSwarm**|
|---|---|
|**Built-in**|Features like the **Grid Generator** or **ComfyUI Backend** are built-in extensions. You should build/use native, high-performance React components for these while using their specific [API routes](https://github.com/mcmonkeyprojects/SwarmUI/blob/master/docs/API.md) (e.g., `/API/GridGeneratorExtension`).|
|**Installable (3rd Party)**|Users find these on the **Server -> Extensions** tab. The "Install" button triggers a backend download process. Your UI simply needs to call the relevant `/API/` route to trigger the install and then prompt for a server restart.|
|**Parameter-only**|Many simple extensions only add a slider (like **Dynamic Thresholding**). These will appear automatically in the sidebar if it is built to properly render the full `GetT2IParams` response dynamically.|

### **3. Sidebar "Install" Buttons & Functionality**

Some extensions, like **MagicPrompt**, add specific buttons or gear icons directly next to generation inputs.

- **Dynamic Buttons**: In the sidebar, implement a "Plugin Hook" area for each parameter group. If the API metadata for a parameter indicates it has an associated extension tool, render an "Install" or "Configure" button next to it.
    
- **Feature Mapping**: Use the backend's "Feature Mapping" logic to connect specific UI buttons (like an "Enhance" button) to an extension's instruction set.
    

## Implementation

- **Dynamic Asset Loading**: Implement a service that calls `/API/ListExtensions` and dynamically injects any extension-provided CSS/JS files into the document head.
- **Parameter-Based Plugins**: Ensure the parameter sidebar components can render optional 'Extension Action' buttons (like a gear icon or install button) based on the metadata provided in the `GetT2IParams` API response.
- **Server Management**: Build a dedicated 'Extension Manager' view within the Settings tab that lists available extensions with their install/uninstall/update status.
