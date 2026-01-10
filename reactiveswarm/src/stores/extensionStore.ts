import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { adminService, type CheckForUpdatesResponse } from "@/api/AdminService";

export interface ExtensionState {
  isLoading: boolean;
  installLog: string[];

  serverUpdatesCount: number;
  serverUpdatesPreview: string[];
  extensionUpdates: string[];
  backendUpdates: string[];

  checkForUpdates: () => Promise<void>;
  installExtension: (extensionName: string) => Promise<void>;
  uninstallExtension: (extensionName: string) => Promise<void>;
  updateExtension: (extensionName: string) => Promise<void>;
  updateAndRestart: (opts?: { updateExtensions?: boolean; updateBackends?: boolean; force?: boolean }) => Promise<void>;
}

export const useExtensionStore = create<ExtensionState>()(
  devtools(
    (set) => ({
      isLoading: false,
      installLog: [],

      serverUpdatesCount: 0,
      serverUpdatesPreview: [],
      extensionUpdates: [],
      backendUpdates: [],

      checkForUpdates: async () => {
        set({ isLoading: true });
        try {
          const res: CheckForUpdatesResponse = await adminService.checkForUpdates();
          set({
            isLoading: false,
            serverUpdatesCount: res.server_updates_count,
            serverUpdatesPreview: Array.isArray(res.server_updates_preview) ? res.server_updates_preview : [],
            extensionUpdates: Array.isArray(res.extension_updates) ? res.extension_updates : [],
            backendUpdates: Array.isArray(res.backend_updates) ? res.backend_updates : [],
          });
        } catch (e) {
          const msg = e instanceof Error ? e.message : "CheckForUpdates failed";
          set((state) => ({ isLoading: false, installLog: [...state.installLog, msg] }));
        }
      },

      installExtension: async (extensionName) => {
        set((state) => ({ installLog: [...state.installLog, `Installing ${extensionName}...`] }));
        const res = await adminService.installExtension(extensionName);
        if ("error" in res) {
          set((state) => ({ installLog: [...state.installLog, `Install failed: ${res.error}`] }));
          return;
        }
        set((state) => ({ installLog: [...state.installLog, `Installed ${extensionName}. Restart to load.`] }));
      },

      uninstallExtension: async (extensionName) => {
        set((state) => ({ installLog: [...state.installLog, `Uninstalling ${extensionName}...`] }));
        const res = await adminService.uninstallExtension(extensionName);
        if ("error" in res) {
          set((state) => ({ installLog: [...state.installLog, `Uninstall failed: ${res.error}`] }));
          return;
        }
        set((state) => ({ installLog: [...state.installLog, `Uninstalled ${extensionName}. Restart to apply.`] }));
      },

      updateExtension: async (extensionName) => {
        set((state) => ({ installLog: [...state.installLog, `Updating ${extensionName}...`] }));
        const res = await adminService.updateExtension(extensionName);
        if ("error" in res) {
          set((state) => ({ installLog: [...state.installLog, `Update failed: ${res.error}`] }));
          return;
        }
        set((state) => ({
          installLog: [...state.installLog, res.success ? `Updated ${extensionName}. Restart to load.` : `No update available for ${extensionName}.`],
        }));
      },

      updateAndRestart: async (opts) => {
        set((state) => ({ installLog: [...state.installLog, `Restarting server...`] }));
        const res = await adminService.updateAndRestart({
          updateExtensions: opts?.updateExtensions,
          updateBackends: opts?.updateBackends,
          force: opts?.force,
        });
        if ("error" in res) {
          set((state) => ({ installLog: [...state.installLog, `UpdateAndRestart failed: ${res.error}`] }));
          return;
        }
        set((state) => ({ installLog: [...state.installLog, res.result ?? (res.success ? "Restart requested." : "No changes found.") ] }));
      },
    }),
    { name: "ExtensionStore" }
  )
);
