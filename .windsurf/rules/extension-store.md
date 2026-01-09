---
trigger: manual
---

## **Implementation Instructions: Extension Store**

### **1. Extension Lifecycle Management**

- **Discovery**: Your `useExtensionStore` should initialize by fetching the list of installed and available extensions.
    
- **Asset Injection**: For each installed extension, the API provides `script_files` and `style_files`. You must programmatically inject these into the DOM so that extension-specific logic (like custom UI tabs) can function within your React environment.
    
- **The Store UI**: Build a grid of "cards" representing available extensions. Each card should pull metadata (author, version, description) from the [backend registry](https://github.com/mcmonkeyprojects/SwarmUI/blob/master/docs/Making%20Extensions.md).
    

### **2. Dynamic "Install" Triggers**

- **Parameter Dependencies**: Some advanced parameters (like **TensorRT** or **Lora Extraction**) require specific extensions to be installed.
    
- **The Workflow**: If a user attempts to use a feature that lacks its backend extension, your UI should display a "Missing Extension" overlay with a direct **Install** button that calls `/API/ComfyInstallFeatures` or a related admin route.
    

### **3. Backend Telemetry Integration**

- **Websocket Logs**: Provide a real-time console view within the Extension Store to show the progress of installations.
    
- **Restart Service**: After installation, provide a "Restart Server" prompt that triggers the backend's reboot sequence to finalize the plugin activation.
    

---

## **Example TypeScript Interfaces**

```typescript
/** Unified Extension & Store Interfaces */
export interface ExtensionStoreItem {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  isInstalled: boolean;
  canUpdate: boolean;
  githubUrl?: string;
  featureFlags: string[]; // e.g. ["grid_gen", "comfy_api"]
}

export interface SwarmExtensionConfig {
  script_files: string[]; // Internal paths like "/ExtensionFile/MyExt/tool.js"
  style_files: string[];  // Internal paths like "/ExtensionFile/MyExt/tool.css"
  tabs: {
    name: string;
    path: string; // The .html file to be rendered in an iframe or slot
  }[];
}

/** Interface for the Extension Store Zustand Slice */
export interface ExtensionState {
  installed: ExtensionStoreItem[];
  available: ExtensionStoreItem[];
  isInstalling: boolean;
  installLogs: string[];
  fetchExtensions: () => Promise<void>;
  installExtension: (id: string) => Promise<boolean>;
  updateExtension: (id: string) => Promise<void>;
}
```