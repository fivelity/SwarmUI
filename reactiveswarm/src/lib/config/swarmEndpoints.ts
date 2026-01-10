function trimTrailingSlashes(s: string): string {
  return s.replace(/\/+$/, "");
}

function trimLeadingSlashes(s: string): string {
  return s.replace(/^\/+/, "");
}

function joinPath(base: string, path: string): string {
  const b = trimTrailingSlashes(base);
  const p = trimLeadingSlashes(path);
  if (!b) return `/${p}`;
  return `${b}/${p}`;
}

function isRelativeBase(s: string): boolean {
  return s.startsWith("/");
}

function getWsOrigin(): string {
  if (typeof window === "undefined") {
    return "ws://localhost";
  }
  const proto = window.location.protocol === "https:" ? "wss" : "ws";
  return `${proto}://${window.location.host}`;
}

export function resolveApiUrl(apiPath: string, backendUrlFromStore: string): string {
  const envBase = import.meta.env.VITE_API_BASE;
  if (typeof envBase === "string" && envBase.length > 0) {
    return joinPath(envBase, apiPath);
  }
  const base = trimTrailingSlashes(backendUrlFromStore);
  return joinPath(joinPath(base, "API"), apiPath);
}

export function resolveWsUrl(apiPath: string, backendUrlFromStore: string): string {
  const envWsBase = import.meta.env.VITE_WS_BASE;
  const envApiBase = import.meta.env.VITE_API_BASE;

  if (typeof envApiBase === "string" && envApiBase.length > 0 && isRelativeBase(envApiBase)) {
    return joinPath(joinPath(getWsOrigin(), envApiBase), apiPath);
  }

  if (typeof envWsBase === "string" && envWsBase.length > 0) {
    return joinPath(envWsBase, apiPath);
  }

  const httpBase = trimTrailingSlashes(backendUrlFromStore);
  const wsBase = httpBase.startsWith("https://")
    ? `wss://${httpBase.slice("https://".length)}`
    : httpBase.startsWith("http://")
      ? `ws://${httpBase.slice("http://".length)}`
      : httpBase;

  return joinPath(joinPath(wsBase, "API"), apiPath);
}

export function resolveSwarmUiUrl(path: string, backendUrlFromStore: string): string {
  const envApiBase = import.meta.env.VITE_API_BASE;
  if (typeof envApiBase === "string" && envApiBase.length > 0 && isRelativeBase(envApiBase)) {
    return joinPath("", path);
  }

  const base = trimTrailingSlashes(backendUrlFromStore);
  return joinPath(base, path);
}
