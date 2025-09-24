export interface GenerationParams {
    prompt: string;
    negativeprompt: string;
    model?: string;
    loras?: string[];
    vae?: string;
    embeddings?: string[];
    [key: string]: any; // Allow other parameters
}

export interface User {
    id: string;
    username: string;
    roles: string[];
}

export interface Role {
    id: string;
    name: string;
    permissions: string[];
}
