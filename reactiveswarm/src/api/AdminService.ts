import { swarmHttp } from "@/api/SwarmHttpClient";
import type { CurrentStatusResponse, ServerResourceInfo } from "@/types/server";

export interface CheckForUpdatesResponse {
  server_updates_count: number;
  server_updates_preview: string[];
  extension_updates: string[];
  backend_updates: string[];
  [key: string]: unknown;
}

export interface UpdateAndRestartResponse {
  success: boolean;
  result?: string;
  [key: string]: unknown;
}

export class AdminService {
  installExtension(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("InstallExtension", { extensionName });
  }

  uninstallExtension(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("UninstallExtension", { extensionName });
  }

  updateExtension(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("UpdateExtension", { extensionName });
  }

  checkForUpdates(): Promise<CheckForUpdatesResponse> {
    return swarmHttp.post<CheckForUpdatesResponse>("CheckForUpdates", {});
  }

  updateAndRestart(params: { updateExtensions?: boolean; updateBackends?: boolean; force?: boolean }): Promise<UpdateAndRestartResponse | { error: string }> {
    return swarmHttp.post("UpdateAndRestart", {
      updateExtensions: params.updateExtensions ?? false,
      updateBackends: params.updateBackends ?? false,
      force: params.force ?? false,
    });
  }

  getServerResourceInfo(): Promise<ServerResourceInfo> {
    return swarmHttp.post<ServerResourceInfo>("GetServerResourceInfo", {});
  }

  getCurrentStatus(): Promise<CurrentStatusResponse> {
    return swarmHttp.post<CurrentStatusResponse>("GetCurrentStatus", {});
  }
}

export const adminService = new AdminService();
