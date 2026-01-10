export class WebSocketService {
  private static instance: WebSocketService;

  private constructor() {
    // SwarmUI generation is handled via per-request WebSockets (active WS pattern).
    // This legacy global service is intentionally a no-op.
  }

  public static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService();
    }
    return WebSocketService.instance;
  }

  public connect(): void {
    // no-op
  }

  public disconnect(): void {
    // no-op
  }

  public send(messageUnused: unknown): void {
    // no-op
    void messageUnused;
  }
}

export const socketService = WebSocketService.getInstance();
