import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { t2iParamsService } from "@/api/T2IParamsService";
import type {
  ListT2IParamsResponse,
  T2IParamEditsNet,
  T2IParamGroupNet,
  T2IParamNet,
  T2IModelListsNet,
} from "@/types/t2iParams";

export interface T2IParamsState {
  isLoading: boolean;
  error: string | null;
  lastLoadedAt: number | null;

  params: T2IParamNet[];
  groups: T2IParamGroupNet[];
  models: T2IModelListsNet;
  wildcards: string[];
  paramEdits: T2IParamEditsNet | null;

  load: () => Promise<void>;
  triggerRefresh: (strong: boolean) => Promise<void>;
  clearError: () => void;
}

function normalizeResponse(resp: ListT2IParamsResponse): {
  params: T2IParamNet[];
  groups: T2IParamGroupNet[];
  models: T2IModelListsNet;
  wildcards: string[];
  paramEdits: T2IParamEditsNet | null;
} {
  return {
    params: Array.isArray(resp.list) ? resp.list : [],
    groups: Array.isArray(resp.groups) ? resp.groups : [],
    models: typeof resp.models === "object" && resp.models !== null ? (resp.models as T2IModelListsNet) : {},
    wildcards: Array.isArray(resp.wildcards) ? resp.wildcards.filter((w): w is string => typeof w === "string") : [],
    paramEdits:
      typeof resp.param_edits === "object" && resp.param_edits !== null ? (resp.param_edits as T2IParamEditsNet) : null,
  };
}

export const useT2IParamsStore = create<T2IParamsState>()(
  devtools(
    (set, get) => ({
      isLoading: false,
      error: null,
      lastLoadedAt: null,

      params: [],
      groups: [],
      models: {},
      wildcards: [],
      paramEdits: null,

      clearError: () => set({ error: null }),

      load: async () => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const resp = await t2iParamsService.listT2IParams();
          const norm = normalizeResponse(resp);
          set({
            isLoading: false,
            lastLoadedAt: Date.now(),
            params: norm.params,
            groups: norm.groups,
            models: norm.models,
            wildcards: norm.wildcards,
            paramEdits: norm.paramEdits,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to load parameters";
          set({ isLoading: false, error: msg });
        }
      },

      triggerRefresh: async (strong) => {
        if (get().isLoading) return;
        set({ isLoading: true, error: null });
        try {
          const resp = await t2iParamsService.triggerRefresh(strong);
          const norm = normalizeResponse(resp);
          set({
            isLoading: false,
            lastLoadedAt: Date.now(),
            params: norm.params,
            groups: norm.groups,
            models: norm.models,
            wildcards: norm.wildcards,
            paramEdits: norm.paramEdits,
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to refresh parameters";
          set({ isLoading: false, error: msg });
        }
      },
    }),
    { name: "T2IParamsStore" },
  ),
);
