export interface SwarmError {
    error_id: string;
    error_name: string;
    error_message: string;
    data?: unknown;
}

export interface SwarmApiError {
    code: string;
    message: string;
    details?: unknown;
}

export interface SwarmErrorEnvelope {
    error?: string;
    error_id?: string;
    error_message?: string;
    [key: string]: unknown;
}

export interface SwarmResponse<T = unknown> {
    data?: T;
    error_id?: string;
    error_message?: string;
}

export interface WSMessage {
    type?: string;
    overall_percent?: number;
    current_step?: number;
    total_steps?: number;
    image?: string;
    [key: string]: unknown;
}
