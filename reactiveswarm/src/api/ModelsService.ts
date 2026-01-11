import { swarmHttp } from "@/api/SwarmHttpClient";

export type ModelSubtype =
  | "Stable-Diffusion"
  | "LoRA"
  | "Embedding"
  | "VAE"
  | "Wildcards"
  | (string & {});

export interface ModelNetEntry {
  name?: string;
  title?: string;
  author?: string;
  description?: string;
  preview_image?: string;
  loaded?: boolean;
  architecture?: string;
  class?: string;
  compat_class?: string;
  standard_width?: number;
  standard_height?: number;
  license?: string;
  date?: string;
  usage_hint?: string;
  trigger_phrase?: string;
  merged_from?: string;
  tags?: string[];
  is_supported_model_format?: boolean;
  is_negative_embedding?: boolean;
  local?: boolean;
  // Wildcards fields
  options?: string[];
  raw?: string;
  image?: string;
  [key: string]: unknown;
}

export interface ListModelsResponse {
  folders: string[];
  files: ModelNetEntry[];
  [key: string]: unknown;
}

export interface DescribeModelResponse {
  model: ModelNetEntry;
  [key: string]: unknown;
}

export class ModelsService {
  listModels(params: {
    path: string;
    depth: number;
    subtype?: ModelSubtype;
    sortBy?: "Name" | "Title" | "DateCreated" | "DateModified";
    allowRemote?: boolean;
    sortReverse?: boolean;
    dataImages?: boolean;
  }): Promise<ListModelsResponse> {
    return swarmHttp.post<ListModelsResponse>("ListModels", {
      path: params.path,
      depth: params.depth,
      subtype: params.subtype ?? "Stable-Diffusion",
      sortBy: params.sortBy ?? "Name",
      allowRemote: params.allowRemote ?? true,
      sortReverse: params.sortReverse ?? false,
      dataImages: params.dataImages ?? false,
    });
  }

  describeModel(params: { modelName: string; subtype?: ModelSubtype }): Promise<DescribeModelResponse> {
    return swarmHttp.post<DescribeModelResponse>("DescribeModel", {
      modelName: params.modelName,
      subtype: params.subtype ?? "Stable-Diffusion",
    });
  }

  selectModel(params: { model: string; backendId?: string | null }): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("SelectModel", {
      model: params.model,
      backendId: params.backendId ?? null,
    });
  }

  editWildcard(params: { card: string; options: string; preview_image?: string | null; preview_image_metadata?: string | null }): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("EditWildcard", {
      card: params.card,
      options: params.options,
      preview_image: params.preview_image ?? null,
      preview_image_metadata: params.preview_image_metadata ?? null,
    });
  }

  deleteWildcard(card: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("DeleteWildcard", { card });
  }
}

export const modelsService = new ModelsService();
