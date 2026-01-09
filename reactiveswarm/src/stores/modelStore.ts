import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Model {
    name: string;
    path: string;
    type: string;
    previewImage?: string;
}

interface ModelState {
  models: Model[];
  folders: string[];
  selectedModel: Model | null;
  
  setModels: (models: Model[]) => void;
  setFolders: (folders: string[]) => void;
  setSelectedModel: (model: Model | null) => void;
}

export const useModelStore = create<ModelState>()(
  devtools(
    (set) => ({
      models: [],
      folders: [],
      selectedModel: null,
      
      setModels: (models) => set({ models }),
      setFolders: (folders) => set({ folders }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
    }),
    { name: 'ModelStore' }
  )
);
