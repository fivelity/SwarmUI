import { swarmHttp } from "@/api/SwarmHttpClient";

export interface UserPresetNet {
  author?: string;
  title?: string;
  description?: string;
  param_map?: Record<string, string>;
  preview_image?: string;
  [key: string]: unknown;
}

export interface GetMyUserDataResponse {
  user_name?: string;
  presets?: UserPresetNet[];
  language?: string;
  permissions?: string[];
  starred_models?: Record<string, unknown>;
  autocompletions?: string[] | null;
  [key: string]: unknown;
}

export class UserService {
  getMyUserData(): Promise<GetMyUserDataResponse> {
    return swarmHttp.post<GetMyUserDataResponse>("GetMyUserData", {});
  }
}

export const userService = new UserService();
