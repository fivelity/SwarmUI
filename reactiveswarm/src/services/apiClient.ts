import { swarmHttp } from "@/api/SwarmHttpClient";

export type APIError = { code: string; message: string; details?: unknown };

/**
 * Legacy compatibility layer.
 * Prefer `swarmHttp` directly (auto session injection + invalid_session_id recovery).
 */
export const swarmApi = {
  post: <T>(endpoint: string, body: Record<string, unknown>): Promise<T> => {
    const trimmed = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
    return swarmHttp.post<T>(trimmed, body);
  },
};
