import { adminService } from "@/api/AdminService";

/**
 * NOTE: SwarmUI does not currently expose a first-class "ListExtensions" API route.
 * The React frontend therefore treats extensions as name-addressable actions.
 */
export class ExtensionsService {
  install(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return adminService.installExtension(extensionName);
  }

  update(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return adminService.updateExtension(extensionName);
  }

  uninstall(extensionName: string): Promise<{ success: boolean } | { error: string }> {
    return adminService.uninstallExtension(extensionName);
  }
}

export const extensionsService = new ExtensionsService();
