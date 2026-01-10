import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { useBackendStore } from "@/stores/backendStore";
import { resolveApiUrl } from "@/lib/config/swarmEndpoints";
import type { GetNewSessionResponse } from "@/types/session";

export interface SessionState {
  sessionId: string | null;
  userId: string | null;
  outputAppendUser: boolean;
  permissions: string[];

  ensureSession: (signal?: AbortSignal) => Promise<string>;
  refreshSession: (signal?: AbortSignal) => Promise<string>;
  clearSession: () => void;
}

let inflight: Promise<string> | null = null;

async function fetchNewSession(signal?: AbortSignal): Promise<GetNewSessionResponse> {
  const baseUrl = useBackendStore.getState().backendUrl;
  const url = resolveApiUrl("GetNewSession", baseUrl);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: "{}",
    signal,
  });

  const jsonUnknown: unknown = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`GetNewSession failed (${res.status})`);
  }

  return jsonUnknown as GetNewSessionResponse;
}

export const useSessionStore = create<SessionState>()(
  devtools(
    persist(
      (set, get) => ({
        sessionId: null,
        userId: null,
        outputAppendUser: false,
        permissions: [],

        ensureSession: async (signal) => {
          const existing = get().sessionId;
          if (existing) {
            return existing;
          }
          if (inflight) {
            return inflight;
          }
          inflight = (async () => {
            const sess = await fetchNewSession(signal);
            set({
              sessionId: sess.session_id,
              userId: typeof sess.user_id === "string" ? sess.user_id : null,
              outputAppendUser: sess.output_append_user === true,
              permissions: Array.isArray(sess.permissions) ? sess.permissions : [],
            });
            return sess.session_id;
          })().finally(() => {
            inflight = null;
          });
          return inflight;
        },

        refreshSession: async (signal) => {
          inflight = (async () => {
            const sess = await fetchNewSession(signal);
            set({
              sessionId: sess.session_id,
              userId: typeof sess.user_id === "string" ? sess.user_id : null,
              outputAppendUser: sess.output_append_user === true,
              permissions: Array.isArray(sess.permissions) ? sess.permissions : [],
            });
            return sess.session_id;
          })().finally(() => {
            inflight = null;
          });
          return inflight;
        },

        clearSession: () => set({ sessionId: null, userId: null, outputAppendUser: false, permissions: [] }),
      }),
      {
        name: "session-storage",
        partialize: (state) => ({
          sessionId: state.sessionId,
          userId: state.userId,
          outputAppendUser: state.outputAppendUser,
          permissions: state.permissions,
        }),
      },
    ),
    { name: "SessionStore" },
  ),
);
