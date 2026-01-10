import { useParameterStore } from "@/stores/parameterStore";

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
        const updates: Partial<ParsedSwarmParams> = {};

        if (params.prompt) updates.prompt = params.prompt as string;
        if (params.negativeprompt) updates.negativePrompt = params.negativeprompt as string;
        if (params.seed !== undefined) updates.seed = params.seed as number;
        if (params.steps) updates.steps = params.steps as number;
        if (params.cfgscale) updates.cfgScale = params.cfgscale as number;
        if (params.width) updates.width = params.width as number;
        if (params.height) updates.height = params.height as number;
        if (params.model) updates.model = params.model as string;
        if (params.scheduler) updates.scheduler = params.scheduler as string;
        
        // SwarmUI might store aspect ratio or we calculate it
        // For now, let's just update what we found
        
        if (Object.keys(updates).length > 0) {
            store.setAllParameters(updates);
            console.log("Applied metadata:", updates);
            return true;
        }
        return false;
    }
};
