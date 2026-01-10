declare interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_WS_BASE?: string;
  readonly VITE_SWARMUI_URL?: string;
  readonly VITE_COMFYUI_BASE_URL?: string;
  readonly VITE_HARDWARE_MONITOR_URL?: string;
  readonly VITE_DEBUG?: string;
}

declare interface ImportMeta {
  readonly env: ImportMetaEnv;
}
