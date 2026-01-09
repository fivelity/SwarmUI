/**
 * Base client for the SwarmUI API.
 * Uses fetch for REST endpoints.
 */

import type { SwarmError } from "@/types/api";

const API_BASE = "http://localhost:7801/API"; // Default SwarmUI API base

export type APIError = SwarmError;

export class SwarmClient {
    private static instance: SwarmClient;
    private session_id: string | null = null;

    private constructor() {
        // Initialize
    }

    public static getInstance(): SwarmClient {
        if (!SwarmClient.instance) {
            SwarmClient.instance = new SwarmClient();
        }
        return SwarmClient.instance;
    }

    public setSessionId(id: string) {
        this.session_id = id;
    }

    public getSessionId(): string | null {
        return this.session_id;
    }

    /**
     * Generic wrapper for GET requests
     */
    public async get<T>(endpoint: string): Promise<T> {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.session_id ? { 'Session-ID': this.session_id } : {})
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json() as T;
        } catch (error) {
            console.error(`SwarmAPI GET ${endpoint} failed:`, error);
            throw error;
        }
    }

    /**
     * Generic wrapper for POST requests
     */
    public async post<T>(endpoint: string, body: unknown): Promise<T> {
        try {
            const response = await fetch(`${API_BASE}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(this.session_id ? { 'Session-ID': this.session_id } : {})
                },
                body: JSON.stringify(body)
            });

             if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json() as T & { error_id?: string, error_message?: string };
            
            // Check for SwarmUI specific error structure in 200 OK responses
            if (data.error_id) {
                 throw new Error(data.error_message || "Unknown SwarmUI Error");
            }

            return data;
        } catch (error) {
             console.error(`SwarmAPI POST ${endpoint} failed:`, error);
            throw error;
        }
    }
}

export const swarmApi = SwarmClient.getInstance();
