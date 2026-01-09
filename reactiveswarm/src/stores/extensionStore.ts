import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Extension {
  id: string;
  name: string;
  author: string;
  description: string;
  version: string;
  isInstalled: boolean;
  canUpdate: boolean;
  githubUrl?: string;
  scriptFiles?: string[];
  styleFiles?: string[];
}

interface ExtensionState {
  extensions: Extension[];
  isLoading: boolean;
  installLog: string[];
  
  fetchExtensions: () => Promise<void>;
  installExtension: (id: string) => Promise<void>;
  uninstallExtension: (id: string) => Promise<void>;
  updateExtension: (id: string) => Promise<void>;
}

// Mock Data
const MOCK_EXTENSIONS: Extension[] = [
    {
        id: "grid_generator",
        name: "Grid Generator",
        author: "mcmonkey",
        description: "Generate grids of images varying parameters.",
        version: "1.0.0",
        isInstalled: true,
        canUpdate: false,
        scriptFiles: ["/extensions/grid/main.js"]
    },
    {
        id: "controlnet",
        name: "ControlNet Preprocessors",
        author: "lllyasviel",
        description: "Advanced control over image generation structure.",
        version: "0.8.0",
        isInstalled: false,
        canUpdate: false,
    },
    {
        id: "image_editor",
        name: "Pro Image Editor",
        author: "SwarmTeam",
        description: "In-browser canvas for masking and inpainting.",
        version: "1.2.0",
        isInstalled: true,
        canUpdate: true,
    }
];

export const useExtensionStore = create<ExtensionState>()(
  devtools(
    (set) => ({
      extensions: [],
      isLoading: false,
      installLog: [],

      fetchExtensions: async () => {
          set({ isLoading: true });
          // Simulate API call
          setTimeout(() => {
              set({ extensions: MOCK_EXTENSIONS, isLoading: false });
          }, 500);
      },

      installExtension: async (id) => {
          set((state) => ({ 
              installLog: [...state.installLog, `Starting installation of ${id}...`] 
          }));
          
          // Simulate install process
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          set((state) => ({
              extensions: state.extensions.map(ext => 
                  ext.id === id ? { ...ext, isInstalled: true } : ext
              ),
              installLog: [...state.installLog, `Successfully installed ${id}.`]
          }));
      },

      uninstallExtension: async (id) => {
           set((state) => ({
              extensions: state.extensions.map(ext => 
                  ext.id === id ? { ...ext, isInstalled: false } : ext
              )
           }));
      },

      updateExtension: async (id) => {
          set((state) => ({ 
              installLog: [...state.installLog, `Updating ${id}...`] 
          }));
          await new Promise(resolve => setTimeout(resolve, 1000));
          set((state) => ({
              extensions: state.extensions.map(ext => 
                  ext.id === id ? { ...ext, canUpdate: false, version: "Latest" } : ext
              ),
              installLog: [...state.installLog, `Updated ${id}.`]
          }));
      }
    }),
    { name: 'ExtensionStore' }
  )
);
