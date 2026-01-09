import { useState, useRef, useId } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight } from 'prismjs';
import { Prism } from '@/lib/prism-swarm';
import { cn } from '@/lib/utils';
import '@/styles/prism-swarm.css';
import getCaretCoordinates from 'textarea-caret';
import { getSuggestions } from '@/services/autocompleteService';
import type { Suggestion } from '@/services/autocompleteService';
import { SuggestionList } from './suggestion-list';

interface PromptEditorProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
}

export function PromptEditor({ value, onValueChange, placeholder, className, id }: PromptEditorProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isOpen, setIsOpen] = useState(false);
  
  const generatedId = useId();
  // We need a unique ID to find the textarea for caret positioning
  const editorId = id || `prompt-editor-${generatedId}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const handleValueChange = (code: string) => {
    onValueChange(code);
    updateSuggestions(code);
  };

  const updateSuggestions = (text: string) => {
    const textarea = document.getElementById(editorId) as HTMLTextAreaElement;
    if (!textarea) return;

    const cursorIndex = textarea.selectionEnd;
    const newSuggestions = getSuggestions(text, cursorIndex);

    if (newSuggestions.length > 0) {
      const caret = getCaretCoordinates(textarea, cursorIndex);
      // Adjust position relative to the container if needed, but caret gives relative to the textarea usually
      // Since Editor uses a relative container, we might need to adjust.
      // For now, let's use the caret coordinates directly.
      
      setPosition({ top: caret.top, left: caret.left });
      setSuggestions(newSuggestions);
      setSelectedIndex(0);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => { // Use generic div event or cast
    if (!isOpen) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    const textarea = document.getElementById(editorId) as HTMLTextAreaElement;
    if (!textarea) return;

    const cursorIndex = textarea.selectionEnd;
    const textBeforeCursor = value.slice(0, cursorIndex);
    const lastOpenAngle = textBeforeCursor.lastIndexOf('<');
    
    // Replace the partial trigger with the selected value
    if (lastOpenAngle !== -1) {
        const newValue = value.slice(0, lastOpenAngle) + suggestion.value + value.slice(cursorIndex);
        onValueChange(newValue);
        
        // Restore cursor position after update (needs timeout for React render cycle)
        setTimeout(() => {
            const newCursorPos = lastOpenAngle + suggestion.value.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
            textarea.focus();
        }, 0);
    }
    
    setIsOpen(false);
  };

  return (
    <div 
        ref={containerRef}
        className={cn(
        "relative w-full rounded-md border border-input bg-transparent shadow-sm transition-colors focus-within:ring-1 focus-within:ring-ring",
        className
        )}
        onKeyDown={handleKeyDown}
    >
      <Editor
        value={value}
        onValueChange={handleValueChange}
        highlight={(code) => highlight(code, Prism.languages.swarm, 'swarm')}
        padding={10}
        textareaId={editorId}
        placeholder={placeholder}
        className="font-mono text-sm min-h-[100px]"
        textareaClassName="focus:outline-none"
        style={{
          fontFamily: '"Fira Code", "Fira Mono", monospace',
          fontSize: 14,
          backgroundColor: 'transparent',
          minHeight: '100px',
        }}
      />
      {isOpen && (
        <SuggestionList 
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            onSelect={selectSuggestion}
            position={position}
        />
      )}
    </div>
  );
}
