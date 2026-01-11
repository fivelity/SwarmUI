import { useBackendStore } from "@/stores/useBackendStore";
import { useSessionStore } from "@/stores/useSessionStore";
import { resolveSwarmUiUrl } from "@/lib/config/swarmEndpoints";

export function getImageOutPrefix(): string {
  const { outputAppendUser, userId } = useSessionStore.getState();
  if (outputAppendUser && typeof userId === "string" && userId.length > 0) {
    return `View/${userId}`;
  }
  return "View";
}

export function resolveSwarmPath(path: string): string {
  const backendUrl = useBackendStore.getState().backendUrl;
  return resolveSwarmUiUrl(path, backendUrl);
}

function appendSessionIdIfAvailable(url: string): string {
  if (url.startsWith("data:")) return url;

  const sessionId = useSessionStore.getState().sessionId;
  if (!sessionId) return url;

  try {
    const u = new URL(url, typeof window === "undefined" ? "http://localhost" : window.location.origin);
    if (!u.searchParams.has("session_id")) {
      u.searchParams.set("session_id", sessionId);
    }
    return u.toString();
  } catch {
    const joiner = url.includes("?") ? "&" : "?";
    return `${url}${joiner}session_id=${encodeURIComponent(sessionId)}`;
  }
}

export function resolveOutputImageUrl(relativeSrc: string): string {
  if (relativeSrc.startsWith("data:")) {
    return relativeSrc;
  }

  const clean = relativeSrc.replace(/^\/+/, "");
  if (clean.startsWith("View/") || clean.startsWith("Output/")) {
    return appendSessionIdIfAvailable(resolveSwarmPath(clean));
  }

  const prefix = getImageOutPrefix();
  return appendSessionIdIfAvailable(resolveSwarmPath(`${prefix}/${clean}`));
}
