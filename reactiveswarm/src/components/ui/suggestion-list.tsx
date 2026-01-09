import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Suggestion } from '@/services/autocompleteService';

interface SuggestionListProps {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSelect: (suggestion: Suggestion) => void;
  position: { top: number; left: number };
}

export function SuggestionList({ suggestions, selectedIndex, onSelect, position }: SuggestionListProps) {
  if (suggestions.length === 0) return null;

  return (
    <div 
      className="absolute z-50 w-64 bg-popover text-popover-foreground border border-border rounded-md shadow-md overflow-hidden"
      style={{ top: position.top + 20, left: position.left }}
    >
      <ScrollArea className="max-h-[200px]">
        <div className="p-1">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={cn(
                "flex flex-col px-2 py-1.5 text-sm cursor-pointer rounded-sm",
                index === selectedIndex ? "bg-accent text-accent-foreground" : "hover:bg-muted"
              )}
              onClick={() => onSelect(suggestion)}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{suggestion.label}</span>
                <span className="text-xs text-muted-foreground opacity-70 uppercase tracking-tighter">{suggestion.type}</span>
              </div>
              {suggestion.description && (
                <span className="text-xs text-muted-foreground truncate">{suggestion.description}</span>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
