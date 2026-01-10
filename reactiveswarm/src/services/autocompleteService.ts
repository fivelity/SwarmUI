export interface Suggestion {
  id: string;
  label: string;
  value: string;
  type: 'wildcard' | 'lora' | 'embedding' | 'model';
  description?: string;
}

import { userService } from "@/api/UserService";

let cached: Suggestion[] | null = null;
let inflight: Promise<Suggestion[]> | null = null;

function parseType(raw: string): Suggestion["type"] {
  const lowered = raw.toLowerCase();
  if (lowered.includes("wildcard")) return "wildcard";
  if (lowered.includes("lora")) return "lora";
  if (lowered.includes("embedding")) return "embedding";
  return "model";
}

function parseAutoCompletionEntry(entry: string, idx: number): Suggestion {
  // SwarmUI sends "autocompletions" as a list of text blobs. Format can vary.
  // Common pattern (from docs): "Word\nword\ntag\n3".
  const parts = entry.split("\n").map((p) => p.trim()).filter((p) => p.length > 0);
  const label = parts[0] ?? entry;
  const value = parts[1] ?? label;
  const tag = parts[2] ?? "model";
  const description = parts.length > 3 ? parts.slice(3).join(" ") : undefined;
  return {
    id: `ac_${idx}_${label}`,
    label,
    value,
    type: parseType(tag),
    description,
  };
}

async function getAllSuggestions(): Promise<Suggestion[]> {
  if (cached) return cached;
  if (inflight) return inflight;
  inflight = (async () => {
    const data = await userService.getMyUserData();
    const list = Array.isArray(data.autocompletions) ? data.autocompletions : [];
    cached = list.map((e, i) => parseAutoCompletionEntry(e, i));
    return cached;
  })().finally(() => {
    inflight = null;
  });
  return inflight;
}

export const getSuggestions = (text: string, cursorIndex: number): Suggestion[] => {
  // Simple regex to detect trigger characters before cursor
  const textBeforeCursor = text.slice(0, cursorIndex);
  
  // Check for <wildcard: or <lora: triggers
  // This is a simplified logic. In a real app, we'd parse the token at cursor.
  
  const lastOpenAngle = textBeforeCursor.lastIndexOf('<');
  if (lastOpenAngle === -1) return [];
  
  const triggerText = textBeforeCursor.slice(lastOpenAngle);

  // Fire-and-forget fetch; results will be available on next keystroke.
  void getAllSuggestions();

  const all = cached ?? [];
  const needle = triggerText.replace(/^<([a-z]+:)?/i, "").toLowerCase();

  if (triggerText.startsWith('<w') || triggerText.startsWith('<wildcard:')) {
    return all.filter((s) => s.type === "wildcard" && s.label.toLowerCase().includes(needle));
  }

  if (triggerText.startsWith('<l') || triggerText.startsWith('<lora:')) {
    return all.filter((s) => s.type === "lora" && s.label.toLowerCase().includes(needle));
  }

  return [];
};
