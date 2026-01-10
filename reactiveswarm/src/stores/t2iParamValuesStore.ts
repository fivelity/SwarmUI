import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { T2IParamValue } from "@/types/t2iParams";

export interface T2IParamValuesState {
  values: Record<string, T2IParamValue>;
  enabled: Record<string, boolean>;

  setValue: (id: string, value: T2IParamValue) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  clear: () => void;
}

function normalizeId(id: string): string {
  return id.trim();
}

export const useT2IParamValuesStore = create<T2IParamValuesState>()(
  devtools(
    persist(
      (set) => ({
        values: {},
        enabled: {},

        setValue: (id, value) =>
          set((state) => ({
            values: { ...state.values, [normalizeId(id)]: value },
          })),

        setEnabled: (id, enabled) =>
          set((state) => ({
            enabled: { ...state.enabled, [normalizeId(id)]: enabled },
          })),

        clear: () => set({ values: {}, enabled: {} }),
      }),
      {
        name: "t2i-param-values",
        partialize: (state) => ({ values: state.values, enabled: state.enabled }),
      },
    ),
    { name: "T2IParamValuesStore" },
  ),
);
