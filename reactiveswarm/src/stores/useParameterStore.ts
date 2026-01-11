import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';

export interface T2IParameters {
  prompt: string;
  negativePrompt: string;
  seed: number;
  steps: number;
  cfgScale: number;
  width: number;
  height: number;
  model: string;
  scheduler: string;
  aspectRatio: string;
  denoisingStrength: number;
  batchSize: number;
  maskBlur: number;
  maskGrow: number;
}

interface ParameterState extends T2IParameters {
  setPrompt: (prompt: string) => void;
  setNegativePrompt: (negativePrompt: string) => void;
  setSeed: (seed: number) => void;
  setSteps: (steps: number) => void;
  setCfgScale: (cfg: number) => void;
  setDimensions: (width: number, height: number) => void;
  setModel: (model: string) => void;
  setScheduler: (scheduler: string) => void;
  setAspectRatio: (ratio: string) => void;
  setDenoisingStrength: (strength: number) => void;
  setBatchSize: (size: number) => void;
  setMaskBlur: (blur: number) => void;
  setMaskGrow: (grow: number) => void;
  setAllParameters: (params: Partial<T2IParameters>) => void;
  resetParameters: () => void;
}

const defaultParameters: T2IParameters = {
  prompt: "",
  negativePrompt: "",
  seed: -1,
  steps: 20,
  cfgScale: 7.0,
  width: 1024,
  height: 1024,
  model: "",
  scheduler: "Euler a",
  aspectRatio: "1:1",
  denoisingStrength: 0.75,
  batchSize: 1,
  maskBlur: 0,
  maskGrow: 0,
};

export const useParameterStore = create<ParameterState>()(
  devtools(
    subscribeWithSelector((set) => ({
      ...defaultParameters,

      setPrompt: (prompt) => set({ prompt }),
      setNegativePrompt: (negativePrompt) => set({ negativePrompt }),
      setSeed: (seed) => set({ seed }),
      setSteps: (steps) => set({ steps }),
      setCfgScale: (cfgScale) => set({ cfgScale }),
      setDimensions: (width, height) => set({ width, height }),
      setModel: (model) => set({ model }),
      setScheduler: (scheduler) => set({ scheduler }),
      setAspectRatio: (aspectRatio) => set({ aspectRatio }),
      setDenoisingStrength: (denoisingStrength) => set({ denoisingStrength }),
      setBatchSize: (batchSize) => set({ batchSize }),
      setMaskBlur: (maskBlur) => set({ maskBlur }),
      setMaskGrow: (maskGrow) => set({ maskGrow }),
      
      setAllParameters: (params) => set((state) => ({ ...state, ...params })),
      resetParameters: () => set(defaultParameters),
    })),
    { name: 'ParameterStore' }
  )
);
