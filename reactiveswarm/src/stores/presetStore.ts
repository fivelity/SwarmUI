import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { T2IParameters } from './parameterStore';

export interface Preset {
  id: string;
  name: string;
  parameters: Partial<T2IParameters>;
  createdAt: number;
}

interface PresetState {
  presets: Preset[];
  addPreset: (name: string, parameters: Partial<T2IParameters>) => void;
  removePreset: (id: string) => void;
  updatePreset: (id: string, parameters: Partial<T2IParameters>) => void;
  getPreset: (id: string) => Preset | undefined;
}

export const usePresetStore = create<PresetState>()(
  devtools(
    persist(
      (set, get) => ({
        presets: [],
        
        addPreset: (name, parameters) => set((state) => ({
          presets: [
            ...state.presets,
            {
              id: crypto.randomUUID(),
              name,
              parameters,
              createdAt: Date.now(),
            }
          ]
        })),

        removePreset: (id) => set((state) => ({
          presets: state.presets.filter((p) => p.id !== id)
        })),

        updatePreset: (id, parameters) => set((state) => ({
          presets: state.presets.map((p) => 
            p.id === id ? { ...p, parameters: { ...p.parameters, ...parameters } } : p
          )
        })),

        getPreset: (id) => get().presets.find((p) => p.id === id),
      }),
      {
        name: 'preset-storage',
      }
    ),
    { name: 'PresetStore' }
  )
);
