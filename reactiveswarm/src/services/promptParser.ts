export type PromptTagType = 'alt' | 'fromto' | 'random' | 'region' | 'segment' | 'var' | 'macro' | 'lora' | 'wildcard';

export interface ParsedPromptTag {
    type: PromptTagType;
    raw: string;
    values: string[];
    params?: Record<string, number | string>;
    startIndex: number;
    endIndex: number;
}

/**
 * Parses a SwarmUI prompt string and identifies special tags.
 * This is a frontend-side parser for highlighting and preview purposes.
 * The actual generation logic usually resides on the backend.
 */
export function parsePromptTags(prompt: string): ParsedPromptTag[] {
    const tags: ParsedPromptTag[] = [];
    
    // Regex for generic tags <type:value> or <type[params]:value>
    // Matches <type or type[params]:content>
    const tagRegex = /<([a-zA-Z0-9_]+)(?:\[([^\]]+)\])?:([^>]+)>/g;
    
    let match;
    while ((match = tagRegex.exec(prompt)) !== null) {
        const [raw, type, paramsStr, content] = match;
        const values = content.split(',').map(v => v.trim());
        const params: Record<string, string | number> = {};

        if (paramsStr) {
            // Parse params like "0.5" or "name" or "x=0.1,y=0.2"
            if (paramsStr.includes('=')) {
                paramsStr.split(',').forEach(p => {
                    const [k, v] = p.split('=');
                    params[k.trim()] = isNaN(Number(v)) ? v.trim() : Number(v);
                });
            } else {
                // Single value param (common in fromto[0.5])
                params['value'] = isNaN(Number(paramsStr)) ? paramsStr.trim() : Number(paramsStr);
            }
        }

        tags.push({
            type: type as PromptTagType,
            raw,
            values,
            params,
            startIndex: match.index,
            endIndex: match.index + raw.length
        });
    }

    return tags;
}

/**
 * Simulates the prompt processing for a specific step (e.g. for preview).
 */
export function processPromptAtStep(prompt: string, step: number, totalSteps: number): string {
    let processed = prompt;

    // 1. Alternate: <alt:a,b>
    // Logic: index = step % count
    processed = processed.replace(/<alt:([^>]+)>/g, (_, content) => {
        const options = content.split(',').map((s: string) => s.trim());
        return options[step % options.length] || "";
    });

    // 2. FromTo: <fromto[0.5]:a,b>
    // Logic: if step / totalSteps < 0.5 then a else b
    processed = processed.replace(/<fromto\[([0-9.]+)\]:([^>]+)>/g, (_, threshold, content) => {
        const options = content.split(',').map((s: string) => s.trim());
        if (options.length < 2) return content;
        const th = parseFloat(threshold);
        return (step / totalSteps) < th ? options[0] : options[1];
    });

    // 3. Random: <random:a,b>
    // Logic: deterministic random based on string hash or seed (mocked here as simple random for now, but ideally seeded)
    // For preview we might just show "a|b" or pick one.
    // Let's pick the first one for stability in simple preview
    processed = processed.replace(/<random:([^>]+)>/g, (_, content) => {
         const options = content.split(',').map((s: string) => s.trim());
         return options[0]; // static preview
    });

    return processed;
}
