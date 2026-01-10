import { swarmHttp } from "@/api/SwarmHttpClient";

export interface ListImagesFile {
  src: string;
  metadata?: string;
  [key: string]: unknown;
}

export interface ListImagesResponse {
  folders: string[];
  files: ListImagesFile[];
  [key: string]: unknown;
}

export class HistoryService {
  listImages(params: { path: string; depth: number; sortBy?: "Name" | "Date"; sortReverse?: boolean }): Promise<ListImagesResponse> {
    return swarmHttp.post<ListImagesResponse>("ListImages", {
      path: params.path,
      depth: params.depth,
      sortBy: params.sortBy ?? "Name",
      sortReverse: params.sortReverse ?? false,
    });
  }

  deleteImage(path: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("DeleteImage", { path });
  }

  toggleImageStarred(path: string): Promise<{ new_state: boolean } | { error: string }> {
    return swarmHttp.post("ToggleImageStarred", { path });
  }

  openImageFolder(path: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("OpenImageFolder", { path });
  }
}

export const historyService = new HistoryService();
