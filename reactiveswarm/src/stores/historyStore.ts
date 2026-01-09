import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface HistoryImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  prompt: string;
  seed: number;
  model: string;
  createdAt: number;
  width: number;
  height: number;
  isStarred: boolean;
}

interface HistoryState {
  images: HistoryImage[];
  selectedImageId: string | null;
  selectedImageIds: string[];
  selectionMode: boolean;
  
  addImage: (image: HistoryImage) => void;
  removeImage: (id: string) => void;
  removeImages: (ids: string[]) => void;
  clearHistory: () => void;
  toggleStar: (id: string) => void;
  selectImage: (id: string | null) => void;
  toggleSelection: (id: string) => void;
  setSelectionMode: (enabled: boolean) => void;
  clearSelection: () => void;
}

export const useHistoryStore = create<HistoryState>()(
  devtools(
    (set) => ({
      images: [],
      selectedImageId: null,
      selectedImageIds: [],
      selectionMode: false,

      addImage: (image) => set((state) => ({ images: [image, ...state.images] })),
      removeImage: (id) => set((state) => ({ 
        images: state.images.filter((img) => img.id !== id),
        selectedImageIds: state.selectedImageIds.filter((sid) => sid !== id),
        selectedImageId: state.selectedImageId === id ? null : state.selectedImageId
      })),
      removeImages: (ids) => set((state) => ({
        images: state.images.filter((img) => !ids.includes(img.id)),
        selectedImageIds: state.selectedImageIds.filter((sid) => !ids.includes(sid)),
        selectedImageId: ids.includes(state.selectedImageId || '') ? null : state.selectedImageId
      })),
      clearHistory: () => set({ images: [], selectedImageIds: [], selectedImageId: null }),
      toggleStar: (id) => set((state) => ({
        images: state.images.map((img) => 
          img.id === id ? { ...img, isStarred: !img.isStarred } : img
        )
      })),
      selectImage: (selectedImageId) => set({ selectedImageId }),
      toggleSelection: (id) => set((state) => {
        const isSelected = state.selectedImageIds.includes(id);
        return {
            selectedImageIds: isSelected 
                ? state.selectedImageIds.filter(sid => sid !== id)
                : [...state.selectedImageIds, id]
        };
      }),
      setSelectionMode: (selectionMode) => set({ selectionMode, selectedImageIds: [] }),
      clearSelection: () => set({ selectedImageIds: [] }),
    }),
    { name: 'HistoryStore' }
  )
);
