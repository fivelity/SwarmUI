export interface ServerCpuInfo {
  usage?: number;
  cores?: number;
  [key: string]: unknown;
}

export interface ServerRamInfo {
  total?: number;
  used?: number;
  free?: number;
  [key: string]: unknown;
}

export interface ServerGpuInfo {
  id?: number;
  name?: string;
  temperature?: number;
  utilization_gpu?: number;
  utilization_memory?: number;
  total_memory?: number;
  free_memory?: number;
  used_memory?: number;
  [key: string]: unknown;
}

export interface ServerResourceInfo {
  cpu?: ServerCpuInfo;
  system_ram?: ServerRamInfo;
  gpus?: Record<string, ServerGpuInfo>;
  [key: string]: unknown;
}

export interface CurrentStatusResponse {
  status?: {
    waiting_gens?: number;
    loading_models?: number;
    waiting_backends?: number;
    live_gens?: number;
    [key: string]: unknown;
  };
  backend_status?: Record<string, unknown>;
  supported_features?: string[];
  [key: string]: unknown;
}

export interface TelemetryPoint {
  time: string;
  cpu: number;
  ram: number;
  gpu: number;
  vram: number;
}
