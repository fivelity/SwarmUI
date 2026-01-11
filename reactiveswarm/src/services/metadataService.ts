import { useParameterStore, type T2IParameters } from "@/stores/parameterStore";

/**
 * Service to handle reading metadata from SwarmUI generated images (PNG).
 * SwarmUI stores parameters in a 'sui_image_params' text chunk.
 */

export interface ParsedSwarmParams {
    prompt?: string;
    negativeprompt?: string;
    seed?: number;
    steps?: number;
    cfgscale?: number;
    width?: number;
    height?: number;
    model?: string;
    scheduler?: string;
    // Add other known keys
    [key: string]: unknown;
}

export const metadataService = {
    /**
     * Reads a File object (PNG) and attempts to extract SwarmUI metadata.
     */
    async parseImageFile(file: File): Promise<ParsedSwarmParams | null> {
        try {
            const buffer = await file.arrayBuffer();
            const dataView = new DataView(buffer);
            
            // Check PNG signature
            if (dataView.getUint32(0) !== 0x89504e47 || dataView.getUint32(4) !== 0x0d0a1a0a) {
                console.warn("Not a valid PNG file.");
                return null;
            }

            let offset = 8; // Skip signature
            const decoder = new TextDecoder("utf-8");

            while (offset < buffer.byteLength) {
                const length = dataView.getUint32(offset);
                const type = decoder.decode(buffer.slice(offset + 4, offset + 8));
                
                if (type === "tEXt") {
                    const content = new Uint8Array(buffer, offset + 8, length);
                    // tEXt format: Keyword + null separator + Text
                    // We need to find the null separator
                    let separatorIndex = -1;
                    for (let i = 0; i < content.length; i++) {
                        if (content[i] === 0) {
                            separatorIndex = i;
                            break;
                        }
                    }

                    if (separatorIndex !== -1) {
                        const keyword = decoder.decode(content.slice(0, separatorIndex));
                        
                        if (keyword === "sui_image_params") {
                            const text = decoder.decode(content.slice(separatorIndex + 1));
                            try {
                                const json = JSON.parse(text);
                                return json;
                            } catch (e) {
                                console.error("Failed to parse sui_image_params JSON", e);
                            }
                        }
                    }
                }
                
                // Advance to next chunk (Length + Type + Data + CRC)
                offset += 4 + 4 + length + 4;
            }
        } catch (error) {
            console.error("Error reading metadata:", error);
        }
        
        return null;
    },

    /**
     * Applies parsed metadata to the global ParameterStore.
     */
    applyMetadata(params: ParsedSwarmParams) {
        const store = useParameterStore.getState();

        const updates: Partial<T2IParameters> = {};

        if (typeof params.prompt === "string") updates.prompt = params.prompt;
        if (typeof params.negativeprompt === "string") updates.negativePrompt = params.negativeprompt;
        if (typeof params.seed === "number") updates.seed = params.seed;
        if (typeof params.steps === "number") updates.steps = params.steps;
        if (typeof params.cfgscale === "number") updates.cfgScale = params.cfgscale;
        if (typeof params.width === "number") updates.width = params.width;
        if (typeof params.height === "number") updates.height = params.height;
        if (typeof params.model === "string") updates.model = params.model;

        // SwarmUI uses `sampler` for the scheduler dropdown.
        const samplerMaybe: unknown = (params as { sampler?: unknown }).sampler;
        if (typeof samplerMaybe === "string") updates.scheduler = samplerMaybe;
        
        // SwarmUI might store aspect ratio or we calculate it
        // For now, let's just update what we found
        
        if (Object.keys(updates).length > 0) {
            store.setAllParameters(updates);
            return true;
        }
        return false;
    }
};
