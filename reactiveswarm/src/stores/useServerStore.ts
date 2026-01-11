import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { adminService } from "@/api/AdminService";
import type { CurrentStatusResponse, ServerGpuInfo, ServerResourceInfo, TelemetryPoint } from "@/types/server";
import { useBackendStore } from "@/stores/useBackendStore";

let heartbeatTimer: number | null = null;
let telemetryTimer: number | null = null;

function toNumber(v: unknown, fallback: number): number {
  return typeof v === "number" && Number.isFinite(v) ? v : fallback;
}

function formatTime(now: Date): string {
  return (
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0") +
    ":" +
    now.getSeconds().toString().padStart(2, "0")
  );
}

function firstGpu(resources: ServerResourceInfo | null): ServerGpuInfo | undefined {
  const gpus = resources?.gpus;
  if (!gpus) return undefined;
  const vals = Object.values(gpus);
  return vals.length > 0 ? vals[0] : undefined;
}

export interface ServerState {
  heartbeatIntervalMs: number;
  telemetryIntervalMs: number;

  lastHeartbeatAt: number | null;
  lastTelemetryAt: number | null;

  status: CurrentStatusResponse | null;
  resources: ServerResourceInfo | null;
  telemetryHistory: TelemetryPoint[];

  heartbeatError: string | null;
  telemetryError: string | null;

  start: () => void;
  stop: () => void;
  pollHeartbeatOnce: () => Promise<void>;
  pollTelemetryOnce: () => Promise<void>;
}

export const useServerStore = create<ServerState>()(
  devtools(
    (set, get) => ({
      heartbeatIntervalMs: 1500,
      telemetryIntervalMs: 7000,

      lastHeartbeatAt: null,
      lastTelemetryAt: null,

      status: null,
      resources: null,
      telemetryHistory: [],

      heartbeatError: null,
      telemetryError: null,

      start: () => {
        if (heartbeatTimer === null) {
          void get().pollHeartbeatOnce();
          heartbeatTimer = window.setInterval(() => {
            void get().pollHeartbeatOnce();
          }, get().heartbeatIntervalMs);
        }

        if (telemetryTimer === null) {
          void get().pollTelemetryOnce();
          telemetryTimer = window.setInterval(() => {
            void get().pollTelemetryOnce();
          }, get().telemetryIntervalMs);
        }
      },

      stop: () => {
        if (heartbeatTimer !== null) {
          window.clearInterval(heartbeatTimer);
          heartbeatTimer = null;
        }
        if (telemetryTimer !== null) {
          window.clearInterval(telemetryTimer);
          telemetryTimer = null;
        }
      },

      pollHeartbeatOnce: async () => {
        try {
          const res: CurrentStatusResponse = await adminService.getCurrentStatus();
          set({ status: res, lastHeartbeatAt: Date.now(), heartbeatError: null });
          useBackendStore.getState().setConnected(true);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "GetCurrentStatus failed";
          set({ lastHeartbeatAt: Date.now(), heartbeatError: msg });
          useBackendStore.getState().setConnected(false);
        }
      },

      pollTelemetryOnce: async () => {
        try {
          const data: ServerResourceInfo = await adminService.getServerResourceInfo();
          const now = new Date();

          const cpuUsage = toNumber((data.cpu ?? {}).usage, 0);
          const ramTotal = toNumber((data.system_ram ?? {}).total, 0);
          const ramUsed = toNumber((data.system_ram ?? {}).used, 0);
          const ramPct = ramTotal > 0 ? (ramUsed / ramTotal) * 100 : 0;

          const gpu = firstGpu(data);
          const gpuUsage = toNumber(gpu?.utilization_gpu, 0);
          const vramTotal = toNumber(gpu?.total_memory, 0);
          const vramUsed = toNumber(gpu?.used_memory, 0);
          const vramPct = vramTotal > 0 ? (vramUsed / vramTotal) * 100 : 0;

          const newPoint: TelemetryPoint = {
            time: formatTime(now),
            cpu: cpuUsage,
            ram: ramPct,
            gpu: gpuUsage,
            vram: vramPct,
          };

          set((state) => {
            const next = [...state.telemetryHistory, newPoint];
            if (next.length > 60) next.shift();
            return {
              resources: data,
              lastTelemetryAt: Date.now(),
              telemetryError: null,
              telemetryHistory: next,
            };
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "GetServerResourceInfo failed";
          set({ lastTelemetryAt: Date.now(), telemetryError: msg });
        }
      },
    }),
    { name: "ServerStore" }
  )
);
