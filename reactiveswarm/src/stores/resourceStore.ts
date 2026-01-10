import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { modelsService } from "@/api/ModelsService";
import { useBackendStore } from "@/store/useBackendStore";
import { useSessionStore } from "@/store/useSessionStore";

const downloadSockets = new Map<string, WebSocket>();

export interface WildcardFile {
    name: string;
    content: string;
}

export interface DownloadTask {
    id: string;
    url: string;
    name: string;
    type: string;
    progress: number;
    status: 'pending' | 'downloading' | 'completed' | 'error';
    error?: string;
}

interface ResourceState {
    wildcards: WildcardFile[];
    downloads: DownloadTask[];
    isLoadingWildcards: boolean;
    wildcardsError?: string;
    
    // Actions
    fetchWildcards: () => Promise<void>;
    saveWildcard: (name: string, content: string) => Promise<void>;
    deleteWildcard: (name: string) => Promise<void>;
    
    startDownload: (url: string, name: string, type: string) => void;
    cancelDownload: (id: string) => void;
}

export const useResourceStore = create<ResourceState>()(
    devtools(
        (set) => ({
            wildcards: [],
            downloads: [],
            isLoadingWildcards: false,
            wildcardsError: undefined,

            fetchWildcards: async () => {
                set({ isLoadingWildcards: true, wildcardsError: undefined });
                try {
                    const resp = await modelsService.listModels({
                        path: "",
                        depth: 20,
                        subtype: "Wildcards",
                        allowRemote: false,
                        sortBy: "Name",
                        sortReverse: false,
                        dataImages: true,
                    });
                    const mapped: WildcardFile[] = (resp.files ?? [])
                        .map((f) => {
                            const name = typeof f.name === "string" ? f.name : "";
                            const raw = typeof f.raw === "string" ? f.raw : "";
                            if (!name) return null;
                            // Existing UI expects ".txt" style names
                            return { name: name.endsWith(".txt") ? name : `${name}.txt`, content: raw };
                        })
                        .filter((x): x is WildcardFile => x !== null);

                    set({ wildcards: mapped, isLoadingWildcards: false });
                } catch (e) {
                    const msg = e instanceof Error ? e.message : "Failed to load wildcards";
                    set({ isLoadingWildcards: false, wildcardsError: msg, wildcards: [] });
                }
            },

            saveWildcard: async (name, content) => {
                const card = name.replace(/\.txt$/i, "").replace(/\\/g, "/").replace(/^\/+/, "");
                await modelsService.editWildcard({ card, options: content.trimEnd() + "\n" });
                set((state) => {
                    const existing = state.wildcards.find((w) => w.name === name);
                    if (existing) {
                        return { wildcards: state.wildcards.map((w) => (w.name === name ? { ...w, content } : w)) };
                    }
                    return { wildcards: [...state.wildcards, { name, content }] };
                });
            },

            deleteWildcard: async (name) => {
                const card = name.replace(/\.txt$/i, "").replace(/\\/g, "/").replace(/^\/+/, "");
                await modelsService.deleteWildcard(card);
                set((state) => ({ wildcards: state.wildcards.filter((w) => w.name !== name) }));
            },

            startDownload: (url, name, type) => {
                const id = crypto.randomUUID();
                set((state) => ({
                    downloads: [...state.downloads, { id, url, name, type, progress: 0, status: "pending" }],
                }));

                const backendUrl = useBackendStore.getState().backendUrl;
                const wsUrl = `${backendUrl.replace(/^http/, "ws")}/API/DoModelDownloadWS`;

                void (async () => {
                    try {
                        const sessionId = await useSessionStore.getState().ensureSession();
                        const ws = new WebSocket(wsUrl);
                        downloadSockets.set(id, ws);

                        const setTask = (patch: Partial<DownloadTask>) => {
                            set((state) => ({
                                downloads: state.downloads.map((d) => (d.id === id ? { ...d, ...patch } : d)),
                            }));
                        };

                        ws.onopen = () => {
                            setTask({ status: "downloading" });
                            ws.send(JSON.stringify({ session_id: sessionId, url, type, name }));
                        };

                        ws.onmessage = (evt) => {
                            try {
                                const msgUnknown: unknown = JSON.parse(typeof evt.data === "string" ? evt.data : "{}");
                                if (typeof msgUnknown !== "object" || msgUnknown === null) return;
                                const msg = msgUnknown as Record<string, unknown>;
                                if (typeof msg.error === "string") {
                                    setTask({ status: "error", error: msg.error });
                                    ws.close();
                                    return;
                                }
                                if (msg.success === true) {
                                    setTask({ status: "completed", progress: 100 });
                                    ws.close();
                                    return;
                                }

                                const overall = typeof msg.overall_percent === "number" ? msg.overall_percent : undefined;
                                const current = typeof msg.current_percent === "number" ? msg.current_percent : undefined;
                                const pct = Math.max(0, Math.min(100, Math.round(((overall ?? current ?? 0) as number) * 100)));
                                setTask({ progress: pct });
                            } catch {
                                // ignore parse failures
                            }
                        };

                        ws.onerror = () => {
                            setTask({ status: "error", error: "WebSocket error" });
                        };
                        ws.onclose = () => {
                            downloadSockets.delete(id);
                            // If user cancelled, task will already be removed.
                        };
                    } catch (e) {
                        const msg = e instanceof Error ? e.message : "Failed to start download";
                        set((state) => ({
                            downloads: state.downloads.map((d) => (d.id === id ? { ...d, status: "error", error: msg } : d)),
                        }));
                    }
                })();
            },

            cancelDownload: (id) => {
                const ws = downloadSockets.get(id);
                if (ws) {
                    try {
                        ws.send(JSON.stringify({ signal: "cancel" }));
                    } catch {
                        // ignore
                    }
                    try {
                        ws.close();
                    } catch {
                        // ignore
                    }
                    downloadSockets.delete(id);
                }
                set((state) => ({ downloads: state.downloads.filter((d) => d.id !== id) }));
            }
        }),
        { name: "ResourceStore" }
    )
);
