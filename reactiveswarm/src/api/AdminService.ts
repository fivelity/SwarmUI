import { swarmHttp } from "@/api/SwarmHttpClient";

export interface UpdateExtensionResponse {
  success: boolean;
  [key: string]: unknown;
}

export class AdminService {
  installExtension(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("InstallExtension", { extensionName });
  }

  uninstallExtension(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return swarmHttp.post("UninstallExtension", { extensionName });
  }

  updateExtension(extensionName: string): Promise<UpdateExtensionResponse | { error: string }> {
    return swarmHttp.post("UpdateExtension", { extensionName });
  }

  getServerResourceInfo(): Promise<unknown> {
    return swarmHttp.post("GetServerResourceInfo", {});
  }

  getCurrentStatus(): Promise<unknown> {
    return swarmHttp.post("GetCurrentStatus", {});
  }
}

export const adminService = new AdminService();
