import { useBackendStore } from "@/stores/backendStore";
import { useSessionStore } from "@/stores/sessionStore";
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
