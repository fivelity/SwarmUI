import { useBackendStore } from "@/stores/backendStore";
import { useSessionStore } from "@/stores/sessionStore";
import type { SwarmApiError, SwarmErrorEnvelope } from "@/types/api";

export interface SwarmRequestOptions {
  signal?: AbortSignal;
}

export class SwarmHttpClient {
  private async requestJson<TResponse>(
    path: string,
    body: Record<string, unknown>,
    options?: SwarmRequestOptions,
    retryOnInvalidSession: boolean = true,
  ): Promise<TResponse> {
    const baseUrl = useBackendStore.getState().backendUrl;
    const sessionId = await useSessionStore.getState().ensureSession(options?.signal);

    const res = await fetch(`${baseUrl}/API/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ session_id: sessionId, ...body }),
      signal: options?.signal,
    });

    const jsonUnknown: unknown = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw this.normalizeError(jsonUnknown, `${res.status}`);
    }

    const env = jsonUnknown as SwarmErrorEnvelope;
    if (env && (typeof env.error_id === "string" || typeof env.error === "string")) {
      if (env.error_id === "invalid_session_id" && retryOnInvalidSession) {
        await useSessionStore.getState().refreshSession(options?.signal);
        return this.requestJson<TResponse>(path, body, options, false);
      }
      throw this.normalizeError(env);
    }

    return jsonUnknown as TResponse;
  }

  private normalizeError(data: unknown, fallbackCode?: string): SwarmApiError {
    if (typeof data === "object" && data !== null) {
      const rec = data as Record<string, unknown>;
      const errorId = typeof rec.error_id === "string" ? rec.error_id : undefined;
      const errorText = typeof rec.error === "string" ? rec.error : undefined;
      const errorMessage = typeof rec.error_message === "string" ? rec.error_message : undefined;
      const message = errorText ?? errorMessage ?? "Request failed";
      return { code: errorId ?? fallbackCode ?? "request_failed", message, details: data };
    }

    return { code: fallbackCode ?? "request_failed", message: "Request failed", details: data };
  }

  public post<TResponse>(
    path: string,
    body: Record<string, unknown>,
    options?: SwarmRequestOptions,
  ): Promise<TResponse> {
    return this.requestJson<TResponse>(path, body, options);
  }
}

export const swarmHttp = new SwarmHttpClient();
