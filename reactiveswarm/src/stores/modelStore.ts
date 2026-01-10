import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { modelsService, type ModelSubtype, type ModelNetEntry } from "@/api/ModelsService";

export interface Model {
    id: string;
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

  isLoading: boolean;
  error?: string;
  fetchModels: (opts?: { depth?: number; allowRemote?: boolean }) => Promise<void>;
  
  setModels: (models: Model[]) => void;
  setFolders: (folders: string[]) => void;
  setSelectedModel: (model: Model | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedFolder: (folder: string) => void;
  setSelectedType: (type: string) => void;
  
  // Computed helpers
  getFilteredModels: () => Model[];
}

function modelSubtypeForUiType(type: string | "all"): ModelSubtype {
  if (type === "lora") return "LoRA";
  if (type === "embedding") return "Embedding";
  if (type === "vae") return "VAE";
  return "Stable-Diffusion";
}

function parsePathAndName(fullName: string): { path: string; name: string } {
  const normalized = fullName.replace(/\\/g, "/").replace(/^\/+/, "");
  const idx = normalized.lastIndexOf("/");
  if (idx === -1) return { path: "/", name: normalized };
  const path = `/${normalized.slice(0, idx)}`;
  const name = normalized.slice(idx + 1);
  return { path: path === "" ? "/" : path, name };
}

function toUiModel(entry: ModelNetEntry, uiType: Model["type"]): Model | null {
  if (typeof entry.name !== "string" || entry.name.length === 0) return null;
  const id = entry.name.replace(/\\/g, "/").replace(/^\/+/, "");
  const { path, name } = parsePathAndName(entry.name);
  return {
    id,
    name,
    path,
    type: uiType,
    previewImage: typeof entry.preview_image === "string" ? entry.preview_image : undefined,
    description: typeof entry.description === "string" ? entry.description : undefined,
  };
}

export const useModelStore = create<ModelState>()(
  devtools(
    (set, get) => ({
      models: [],
      folders: ["/"],
      selectedModel: null,
      searchQuery: "",
      selectedFolder: "/",
      selectedType: "all",

      isLoading: false,
      error: undefined,

      fetchModels: async (opts) => {
        set({ isLoading: true, error: undefined });
        try {
          const depth = opts?.depth ?? 4;
          const allowRemote = opts?.allowRemote ?? true;

          const type = get().selectedType;
          const subtype = modelSubtypeForUiType(type);
          const resp = await modelsService.listModels({
            path: "",
            depth,
            subtype,
            allowRemote,
            sortBy: "Name",
            sortReverse: false,
            dataImages: false,
          });

          const uiType: Model["type"] =
            type === "lora" ? "lora" : type === "embedding" ? "embedding" : type === "vae" ? "vae" : "checkpoint";

          const mapped = (resp.files ?? [])
            .map((f) => toUiModel(f, uiType))
            .filter((m): m is Model => m !== null);

          const folderSet = new Set<string>();
          folderSet.add("/");
          for (const f of resp.folders ?? []) {
            const normalized = f.replace(/\\/g, "/").replace(/^\/+/, "");
            folderSet.add(normalized === "" ? "/" : `/${normalized}`);
          }

          // Derive folders also from model paths (covers cases when folders list isn't exhaustive)
          for (const m of mapped) {
            folderSet.add(m.path);
          }

          const folders = Array.from(folderSet).sort((a, b) => a.localeCompare(b));
          set({ models: mapped, folders, isLoading: false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to load models";
          set({ isLoading: false, error: msg, models: [], folders: ["/"] });
        }
      },
      
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
    { name: "ModelStore" }
  )
);
