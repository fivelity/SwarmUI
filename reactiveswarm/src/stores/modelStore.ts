import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Model {
    name: string;
    path: string;
    type: 'checkpoint' | 'lora' | 'embedding' | 'vae';
    previewImage?: string;
    description?: string;
}

interface ModelState {
  models: Model[];
  folders: string[];
  selectedModel: Model | null;
  searchQuery: string;
  selectedFolder: string;
  selectedType: string | 'all';
  
  setModels: (models: Model[]) => void;
  setFolders: (folders: string[]) => void;
  setSelectedModel: (model: Model | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFolder: (folder: string) => void;
  setSelectedType: (type: string) => void;
  
  // Computed helpers (mocking backend logic for now)
  getFilteredModels: () => Model[];
}

const MOCK_MODELS: Model[] = [
    { name: "stable-diffusion-v1-5", path: "/", type: "checkpoint", description: "Base SD 1.5 Model" },
    { name: "stable-diffusion-xl-base-1.0", path: "/", type: "checkpoint", description: "SDXL Base" },
    { name: "dreamshaper-8", path: "/Styles", type: "checkpoint", previewImage: "https://civitai.com/assets/4333" }, // Mock URL
    { name: "realistic-vision-v5", path: "/Realism", type: "checkpoint" },
    { name: "detailed_eye", path: "/", type: "lora" },
    { name: "pixel_art", path: "/Styles", type: "lora" },
];

const MOCK_FOLDERS = ["/", "/Styles", "/Realism", "/Characters"];

export const useModelStore = create<ModelState>()(
  devtools(
    (set, get) => ({
      models: MOCK_MODELS,
      folders: MOCK_FOLDERS,
      selectedModel: null,
      searchQuery: "",
      selectedFolder: "/",
      selectedType: "all",
      
      setModels: (models) => set({ models }),
      setFolders: (folders) => set({ folders }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setSelectedFolder: (selectedFolder) => set({ selectedFolder }),
      setSelectedType: (selectedType) => set({ selectedType }),

      getFilteredModels: () => {
          const { models, searchQuery, selectedFolder, selectedType } = get();
          return models.filter(model => {
              const matchesSearch = model.name.toLowerCase().includes(searchQuery.toLowerCase());
              const matchesFolder = selectedFolder === "/" || model.path === selectedFolder; // Simplified folder logic
              const matchesType = selectedType === "all" || model.type === selectedType;
              
              return matchesSearch && matchesFolder && matchesType;
          });
      }
    }),
    { name: 'ModelStore' }
  )
);
