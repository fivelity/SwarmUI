import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type JobStatus = "idle" | "queued" | "running" | "completed" | "error";

export interface JobState {
  requestId: string;
  status: JobStatus;
  createdAt: number;
  lastUpdatedAt: number;

  overallPercent: number;
  currentPercent: number;

  preview?: string;
  images: string[];
  metadataByBatchIndex: Record<string, string | null | undefined>;

  error?: string;
}

export interface JobStoreState {
  jobs: Map<string, JobState>;
  activeRequestId: string | null;

  ensureJob: (requestId: string) => void;
  setActiveRequestId: (requestId: string | null) => void;

  updateProgress: (requestId: string, batchIndex: string, overallPercent?: number, currentPercent?: number, preview?: string, metadata?: string) => void;
  addImage: (requestId: string, batchIndex: string, image: string, metadata?: string | null) => void;
  markError: (requestId: string, message: string) => void;
  markComplete: (requestId: string) => void;
  clear: () => void;
}

function now(): number {
  return Date.now();
}

function cloneMap<K, V>(m: Map<K, V>): Map<K, V> {
  return new Map(m);
}

export const useJobStore = create<JobStoreState>()(
  devtools(
    (set, get) => ({
      jobs: new Map<string, JobState>(),
      activeRequestId: null,

      ensureJob: (requestId) => {
        const cur = get().jobs.get(requestId);
        if (cur) return;

        set((state) => {
          const next = cloneMap(state.jobs);
          next.set(requestId, {
            requestId,
            status: "running",
            createdAt: now(),
            lastUpdatedAt: now(),
            overallPercent: 0,
            currentPercent: 0,
            images: [],
            metadataByBatchIndex: {},
          });
          return { jobs: next, activeRequestId: state.activeRequestId ?? requestId };
        });
      },

      setActiveRequestId: (activeRequestId) => set({ activeRequestId }),

      updateProgress: (requestId, batchIndex, overallPercent, currentPercent, preview, metadata) => {
        set((state) => {
          const existing = state.jobs.get(requestId);
          if (!existing) return state;

          const next = cloneMap(state.jobs);
          const merged: JobState = {
            ...existing,
            status: existing.status === "idle" ? "running" : existing.status,
            lastUpdatedAt: now(),
            overallPercent: overallPercent ?? existing.overallPercent,
            currentPercent: currentPercent ?? existing.currentPercent,
            preview: preview ?? existing.preview,
            metadataByBatchIndex:
              metadata !== undefined
                ? { ...existing.metadataByBatchIndex, [batchIndex]: metadata }
                : existing.metadataByBatchIndex,
          };
          next.set(requestId, merged);
          return { jobs: next };
        });
      },

      addImage: (requestId, batchIndex, image, metadata) => {
        set((state) => {
          const existing = state.jobs.get(requestId);
          if (!existing) return state;

          const next = cloneMap(state.jobs);
          const nextMeta = { ...existing.metadataByBatchIndex };
          if (metadata !== undefined) {
            nextMeta[batchIndex] = metadata;
          }

          next.set(requestId, {
            ...existing,
            status: "running",
            lastUpdatedAt: now(),
            images: [...existing.images, image],
            metadataByBatchIndex: nextMeta,
          });
          return { jobs: next };
        });
      },

      markError: (requestId, message) => {
        set((state) => {
          const existing = state.jobs.get(requestId);
          if (!existing) return state;
          const next = cloneMap(state.jobs);
          next.set(requestId, { ...existing, status: "error", lastUpdatedAt: now(), error: message });
          return { jobs: next };
        });
      },

      markComplete: (requestId) => {
        set((state) => {
          const existing = state.jobs.get(requestId);
          if (!existing) return state;
          const next = cloneMap(state.jobs);
          next.set(requestId, { ...existing, status: "completed", lastUpdatedAt: now(), overallPercent: 1, currentPercent: 1 });
          return { jobs: next };
        });
      },

      clear: () => set({ jobs: new Map(), activeRequestId: null }),
    }),
    { name: "JobStore" },
  ),
);
