export type T2IParamDataType =
  | "unset"
  | "text"
  | "integer"
  | "decimal"
  | "boolean"
  | "dropdown"
  | "image"
  | "model"
  | "list"
  | "image_list";

export type T2IParamViewType = "normal" | "prompt" | "small" | "big" | "slider" | "pot_slider" | "seed";

export interface T2IParamNet {
  name: string;
  id: string;
  description: string;
  type: T2IParamDataType;
  subtype: string | null;
  default: string;
  min: number;
  max: number;
  view_min: number;
  view_max: number;
  step: number;
  values: string[] | null;
  value_names: string[] | null;
  examples: string[] | null;
  visible: boolean;
  advanced: boolean;
  feature_flag: string | null;
  toggleable: boolean;
  priority: number;
  group: string | null;
  always_retain: boolean;
  do_not_save: boolean;
  do_not_preview: boolean;
  view_type: T2IParamViewType;
  extra_hidden: boolean;
  can_sectionalize: boolean;
  nonreusable: boolean;
  depend_non_default: string | null;

  [key: string]: unknown;
}

export interface T2IParamGroupNet {
  name: string;
  id: string;
  toggles: boolean;
  open: boolean;
  priority: number;
  description: string;
  advanced: boolean;
  can_shrink: boolean;
  parent: string | null;

  [key: string]: unknown;
}

export type T2IModelListsNet = Record<string, string[]>;

export type T2IParamEditsNet = Record<string, unknown>;

export interface ListT2IParamsResponse {
  list: T2IParamNet[];
  groups: T2IParamGroupNet[];
  models: T2IModelListsNet;
  wildcards: string[];
  param_edits: T2IParamEditsNet | null;

  [key: string]: unknown;
}

export type T2IParamValue = string | number | boolean;
