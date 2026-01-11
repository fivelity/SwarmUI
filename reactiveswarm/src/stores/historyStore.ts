import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { historyService } from "@/api/HistoryService";
import { resolveOutputImageUrl } from "@/lib/utils/swarmPaths";

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
  folders: string[];
  selectedImageId: string | null;
  selectedImageIds: string[];
  selectionMode: boolean;
  isLoading: boolean;
  error?: string;

  fetchImages: (opts?: { path?: string; depth?: number; sortBy?: "Name" | "Date"; sortReverse?: boolean }) => Promise<void>;
  
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

function safeJsonParse(text: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(text);
    if (typeof parsed === "object" && parsed !== null) return parsed as Record<string, unknown>;
    return null;
  } catch {
    return null;
  }
}

function parseFromMetadata(metadata: string | undefined): {
  prompt?: string;
  seed?: number;
  model?: string;
  width?: number;
  height?: number;
  isStarred?: boolean;
  createdAt?: number;
} {
  if (!metadata) return {};
  const obj = safeJsonParse(metadata);
  if (!obj) return {};

  const out: {
    prompt?: string;
    seed?: number;
    model?: string;
    width?: number;
    height?: number;
    isStarred?: boolean;
    createdAt?: number;
  } = {};

  if (typeof obj.is_starred === "boolean") out.isStarred = obj.is_starred;
  if (typeof obj.file_time === "number") out.createdAt = obj.file_time;

  const sui = typeof obj.sui_image_params === "object" && obj.sui_image_params !== null ? (obj.sui_image_params as Record<string, unknown>) : null;
  if (sui) {
    if (typeof sui.prompt === "string") out.prompt = sui.prompt;
    if (typeof sui.seed === "number") out.seed = sui.seed;
    if (typeof sui.model === "string") out.model = sui.model;
    if (typeof sui.width === "number") out.width = sui.width;
    if (typeof sui.height === "number") out.height = sui.height;
  }
  return out;
}

function withQueryParam(url: string, key: string, value: string): string {
  try {
    const u = new URL(url, typeof window === "undefined" ? "http://localhost" : window.location.origin);
    u.searchParams.set(key, value);
    return u.toString();
  } catch {
    const joiner = url.includes("?") ? "&" : "?";
    return `${url}${joiner}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
  }
}

export const useHistoryStore = create<HistoryState>()(
  devtools(
    (set) => ({
      images: [],
      folders: [],
      selectedImageId: null,
      selectedImageIds: [],
      selectionMode: false,
      isLoading: false,
      error: undefined,

      fetchImages: async (opts) => {
        set({ isLoading: true, error: undefined });
        try {
          const path = opts?.path ?? "";
          const depth = opts?.depth ?? 4;
          const resp = await historyService.listImages({
            path,
            depth,
            sortBy: opts?.sortBy,
            sortReverse: opts?.sortReverse,
          });

          const mapped: HistoryImage[] = (resp.files ?? []).map((f) => {
            const src = f.src;
            const meta = parseFromMetadata(typeof f.metadata === "string" ? f.metadata : undefined);
            const url = resolveOutputImageUrl(src);
            const isHtml = src.toLowerCase().endsWith(".html");
            const thumb = isHtml ? undefined : withQueryParam(url, "preview", "true");
            return {
              id: src,
              url,
              thumbnailUrl: thumb,
              prompt: meta.prompt ?? "",
              seed: meta.seed ?? -1,
              model: meta.model ?? "",
              createdAt: meta.createdAt ?? Date.now(),
              width: meta.width ?? 0,
              height: meta.height ?? 0,
              isStarred: meta.isStarred ?? false,
            };
          });

          set({ images: mapped, folders: Array.isArray(resp.folders) ? resp.folders : [], isLoading: false });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to load images";
          set({ isLoading: false, error: msg, images: [], folders: [] });
        }
      },

      addImage: (image) => set((state) => ({ images: [image, ...state.images] })),

      removeImage: (id) => {
        // Fire-and-forget delete; keep UI responsive.
        void historyService.deleteImage(id);
        set((state) => ({
          images: state.images.filter((img) => img.id !== id),
          selectedImageIds: state.selectedImageIds.filter((sid) => sid !== id),
          selectedImageId: state.selectedImageId === id ? null : state.selectedImageId,
        }));
      },

      removeImages: (ids) => {
        void Promise.all(ids.map((id) => historyService.deleteImage(id)));
        set((state) => ({
          images: state.images.filter((img) => !ids.includes(img.id)),
          selectedImageIds: state.selectedImageIds.filter((sid) => !ids.includes(sid)),
          selectedImageId: ids.includes(state.selectedImageId || "") ? null : state.selectedImageId,
        }));
      },

      clearHistory: () => set({ images: [], selectedImageIds: [], selectedImageId: null }),

      toggleStar: (id) => {
        void (async () => {
          const res = await historyService.toggleImageStarred(id);
          if (res && typeof (res as { new_state?: unknown }).new_state === "boolean") {
            const newState = (res as { new_state: boolean }).new_state;
            set((state) => ({
              images: state.images.map((img) => (img.id === id ? { ...img, isStarred: newState } : img)),
            }));
            return;
          }
          // fallback toggle
          set((state) => ({
            images: state.images.map((img) => (img.id === id ? { ...img, isStarred: !img.isStarred } : img)),
          }));
        })();
      },

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
    { name: "HistoryStore" }
  )
);
