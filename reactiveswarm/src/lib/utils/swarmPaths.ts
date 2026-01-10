import { useBackendStore } from "@/store/useBackendStore";
import { useSessionStore } from "@/store/useSessionStore";

export function getImageOutPrefix(): string {
  const { outputAppendUser, userId } = useSessionStore.getState();
  if (outputAppendUser && typeof userId === "string" && userId.length > 0) {
    return `View/${userId}`;
  }
  return "View";
}

export function resolveSwarmPath(path: string): string {
  const backendUrl = useBackendStore.getState().backendUrl;
  const base = backendUrl.endsWith("/") ? backendUrl.slice(0, -1) : backendUrl;
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${base}/${p}`;
}

export function resolveOutputImageUrl(relativeSrc: string): string {
  if (relativeSrc.startsWith("data:")) {
    return relativeSrc;
  }

  const clean = relativeSrc.replace(/^\/+/, "");
  if (clean.startsWith("View/") || clean.startsWith("Output/")) {
    return resolveSwarmPath(clean);
  }

  const prefix = getImageOutPrefix();
  return resolveSwarmPath(`${prefix}/${clean}`);
}
