import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

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
    
    // Actions
    fetchWildcards: () => Promise<void>;
    saveWildcard: (name: string, content: string) => Promise<void>;
    deleteWildcard: (name: string) => Promise<void>;
    
    startDownload: (url: string, name: string, type: string) => void;
    cancelDownload: (id: string) => void;
    // Mock progress update
    updateDownloadProgress: (id: string, progress: number) => void;
}

const MOCK_WILDCARDS: WildcardFile[] = [
    { name: "colors.txt", content: "red\nblue\ngreen\nyellow\npurple" },
    { name: "animals.txt", content: "cat\ndog\nbird\nlion\ntiger" },
    { name: "styles.txt", content: "cyberpunk\nrealistic\noil painting\nwatercolor" }
];

export const useResourceStore = create<ResourceState>()(
    devtools(
        (set, get) => ({
            wildcards: [],
            downloads: [],

            fetchWildcards: async () => {
                // Simulate API fetch
                await new Promise(resolve => setTimeout(resolve, 500));
                set({ wildcards: MOCK_WILDCARDS });
            },

            saveWildcard: async (name, content) => {
                await new Promise(resolve => setTimeout(resolve, 500));
                set(state => {
                    const existing = state.wildcards.find(w => w.name === name);
                    if (existing) {
                        return {
                            wildcards: state.wildcards.map(w => w.name === name ? { ...w, content } : w)
                        };
                    } else {
                        return {
                            wildcards: [...state.wildcards, { name, content }]
                        };
                    }
                });
            },

            deleteWildcard: async (name) => {
                set(state => ({
                    wildcards: state.wildcards.filter(w => w.name !== name)
                }));
            },

            startDownload: (url, name, type) => {
                const id = crypto.randomUUID();
                set(state => ({
                    downloads: [...state.downloads, {
                        id, url, name, type, progress: 0, status: 'pending'
                    }]
                }));

                // Mock download process
                setTimeout(() => {
                    set(state => ({
                        downloads: state.downloads.map(d => d.id === id ? { ...d, status: 'downloading' } : d)
                    }));

                    let progress = 0;
                    const interval = setInterval(() => {
                        progress += 10;
                        get().updateDownloadProgress(id, progress);
                        if (progress >= 100) {
                            clearInterval(interval);
                            set(state => ({
                                downloads: state.downloads.map(d => d.id === id ? { ...d, status: 'completed' } : d)
                            }));
                        }
                    }, 500);
                }, 1000);
            },

            cancelDownload: (id) => {
                set(state => ({
                    downloads: state.downloads.filter(d => d.id !== id)
                }));
            },

            updateDownloadProgress: (id, progress) => {
                set(state => ({
                    downloads: state.downloads.map(d => d.id === id ? { ...d, progress } : d)
                }));
            }
        }),
        { name: 'ResourceStore' }
    )
);
