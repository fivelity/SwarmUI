export interface Suggestion {
  id: string;
  label: string;
  value: string;
  type: 'wildcard' | 'lora' | 'embedding' | 'model';
  description?: string;
}

export const mockWildcards: Suggestion[] = [
  { id: 'w1', label: 'colors', value: '<wildcard:colors>', type: 'wildcard', description: 'Random colors' },
  { id: 'w2', label: 'styles', value: '<wildcard:styles>', type: 'wildcard', description: 'Art styles' },
  { id: 'w3', label: 'locations', value: '<wildcard:locations>', type: 'wildcard', description: 'Places' },
];

export const mockLoras: Suggestion[] = [
  { id: 'l1', label: 'detailed_eye', value: '<lora:detailed_eye:1.0>', type: 'lora', description: 'Detailed Eyes' },
  { id: 'l2', label: 'add_detail', value: '<lora:add_detail:1.0>', type: 'lora', description: 'Detail Adder' },
  { id: 'l3', label: 'pixel_art', value: '<lora:pixel_art:1.0>', type: 'lora', description: 'Pixel Art Style' },
];

export const getSuggestions = (text: string, cursorIndex: number): Suggestion[] => {
  // Simple regex to detect trigger characters before cursor
  const textBeforeCursor = text.slice(0, cursorIndex);
  
  // Check for <wildcard: or <lora: triggers
  // This is a simplified logic. In a real app, we'd parse the token at cursor.
  
  const lastOpenAngle = textBeforeCursor.lastIndexOf('<');
  if (lastOpenAngle === -1) return [];
  
  const triggerText = textBeforeCursor.slice(lastOpenAngle);
  
  if (triggerText.startsWith('<w') || triggerText.startsWith('<wildcard:')) {
    return mockWildcards.filter(s => s.label.toLowerCase().includes(triggerText.replace(/^<(wildcard:)?/, '').toLowerCase()));
  }
  
  if (triggerText.startsWith('<l') || triggerText.startsWith('<lora:')) {
    return mockLoras.filter(s => s.label.toLowerCase().includes(triggerText.replace(/^<(lora:)?/, '').toLowerCase()));
  }

  return [];
};
