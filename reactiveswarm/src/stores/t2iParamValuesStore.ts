import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { T2IParamValue } from "@/types/t2iParams";

export interface T2IParamValuesState {
  values: Record<string, T2IParamValue>;
  enabled: Record<string, boolean>;

  setValue: (id: string, value: T2IParamValue) => void;
  setEnabled: (id: string, enabled: boolean) => void;
  clearParam: (id: string) => void;
  clearParams: (ids: string[]) => void;
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

        clearParam: (id) =>
          set((state) => {
            const key = normalizeId(id);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [key]: _v, ...restValues } = state.values;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [key]: _e, ...restEnabled } = state.enabled;
            return { values: restValues, enabled: restEnabled };
          }),

        clearParams: (ids) =>
          set((state) => {
            const toClear = new Set(ids.map((x) => normalizeId(x)));
            const nextValues: Record<string, T2IParamValue> = {};
            for (const [k, v] of Object.entries(state.values)) {
              if (!toClear.has(k)) nextValues[k] = v;
            }
            const nextEnabled: Record<string, boolean> = {};
            for (const [k, v] of Object.entries(state.enabled)) {
              if (!toClear.has(k)) nextEnabled[k] = v;
            }
            return { values: nextValues, enabled: nextEnabled };
          }),

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
