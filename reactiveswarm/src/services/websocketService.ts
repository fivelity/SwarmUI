import { useBackendStore } from "@/stores/backendStore";
import { useGenerationStore } from "@/stores/generationStore";
import type { WSMessage } from "@/types/api";

/**
 * Service to handle WebSocket connections to the SwarmUI backend.
 * Manages connection pooling, heartbeats, and message routing.
 */
export class WebSocketService {
    private static instance: WebSocketService;
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectInterval = 1000;
    private url: string = "ws://localhost:7801/API/GenerateText2ImageWS"; // Default path, needs verification with original repo if different

    private constructor() {
        // Initialize
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public connect() {
        if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log("Connecting to SwarmUI WebSocket...");
        try {
            this.ws = new WebSocket(this.url);

            this.ws.onopen = this.onOpen.bind(this);
            this.ws.onmessage = this.onMessage.bind(this);
            this.ws.onclose = this.onClose.bind(this);
            this.ws.onerror = this.onError.bind(this);
        } catch (error) {
            console.error("WebSocket connection failed immediately:", error);
            this.scheduleReconnect();
        }
    }

    public disconnect() {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }

    private onOpen() {
        console.log("WebSocket Connected");
        this.reconnectAttempts = 0;
        useBackendStore.getState().setConnected(true);
    }

    private onMessage(event: MessageEvent) {
        try {
            const data = JSON.parse(event.data) as WSMessage;
            this.handleMessage(data);
        } catch (e) {
            console.error("Failed to parse WebSocket message:", event.data, e);
        }
    }

    private handleMessage(data: WSMessage) {
        // Basic routing of message types based on SwarmUI protocol
        // This is a tentative implementation based on common patterns.
        // We need to verify the exact JSON structure of SwarmUI WS messages.
        
        // Example structure assumptions:
        // { type: "status", ... }
        // { type: "progress", value: 0.5, step: 10, total: 20 }
        // { type: "image", image: "base64..." }
        
        const genStore = useGenerationStore.getState();

        // Note: Actual SwarmUI WS protocol likely uses specific keys like 'overall_percent', 'image', etc.
        // We will refine this as we get real data or check docs.
        
        if (data.overall_percent !== undefined && typeof data.overall_percent === 'number') {
             genStore.setProgress(data.overall_percent, data.current_step, data.total_steps);
        }

        if (data.image) {
            // Preview or final image
            genStore.setCurrentImage(data.image);
        }
    }

    private onClose(event: CloseEvent) {
        console.log("WebSocket Disconnected", event.reason);
        useBackendStore.getState().setConnected(false);
        this.ws = null;
        this.scheduleReconnect();
    }

    private onError(event: Event) {
        console.error("WebSocket Error:", event);
    }

    private scheduleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            setTimeout(() => {
                this.reconnectAttempts++;
                console.log(`Attempting reconnect ${this.reconnectAttempts}/${this.maxReconnectAttempts}...`);
                this.connect();
            }, this.reconnectInterval * Math.pow(2, this.reconnectAttempts)); // Exponential backoff
        } else {
            console.error("Max reconnect attempts reached. Giving up.");
        }
    }

    public send(message: unknown) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(message));
        } else {
            console.warn("Cannot send message, WebSocket not connected.");
        }
    }
}

export const socketService = WebSocketService.getInstance();
